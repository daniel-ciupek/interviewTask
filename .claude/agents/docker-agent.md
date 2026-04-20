---
name: docker-agent
description: Agent wyspecjalizowany w konfiguracji Docker i docker-compose. Zapewnia automatyczne uruchomienie migracji, healthchecki i poprawne zależności między serwisami.
---

# Docker Agent – Zakres działania

## Cel
Zapewnić, że `docker compose up` automatycznie:
1. Uruchamia MySQL i czeka aż będzie gotowy (healthcheck)
2. Uruchamia migracje Sequelize na backendzie
3. Uruchamia backend po zakończeniu migracji
4. Uruchamia frontend po starcie backendu

## Zmiany w docker-compose.yml

```yaml
services:
  phpmyadmin:
    container_name: phpmyadmin
    image: phpmyadmin/phpmyadmin:latest
    restart: always
    ports:
      - 8081:80
    networks:
      - backend
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306

  db:
    container_name: mysql
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: interview123
      MYSQL_DATABASE: interview
    ports:
      - "3306:3306"
    networks:
      - backend
    volumes:
      - db-vol:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-pinterview123"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  backend:
    container_name: backend_api
    restart: always
    build:
      context: backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    networks:
      - backend
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - backend/.env

  frontend:
    container_name: next_frontend
    restart: unless-stopped
    build:
      context: frontend
      dockerfile: Dockerfile
    networks:
      - backend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080

networks:
  backend:

volumes:
  db-vol:
```

**Ważna zmiana**: Usunięto `init.sql` z volumes – baza `interview` jest tworzona przez `MYSQL_DATABASE: interview` w env. Migracje tworzą tabele.

## Zmiany w backend/Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

# Uruchom migracje a następnie serwer
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]
```

**Zmiany względem oryginału**:
- `node:16` → `node:18-alpine` (wymóg README: Node.js v18.17.0+)
- CMD uruchamia migracje przed startem serwera

## Alternatywny skrypt startowy

Jeśli CMD w Dockerfile jest zbyt ograniczony, stwórz `backend/start.sh`:
```bash
#!/bin/sh
set -e
echo "Uruchamianie migracji..."
npx sequelize-cli db:migrate
echo "Migracje zakończone. Uruchamianie serwera..."
exec node app.js
```

I w Dockerfile:
```dockerfile
COPY start.sh ./start.sh
RUN chmod +x start.sh
CMD ["./start.sh"]
```

## Weryfikacja

Po `docker compose up` sprawdź:
```bash
docker logs backend_api
# Powinno zawierać:
# "Executing (default): CREATE TABLE IF NOT EXISTS `Messages`..." (lub "No migrations were executed")
# "Connection has been established successfully."
# "Server is running on port 8080"
```

```bash
# Test API
curl http://localhost:8080/api/messages
# Powinno zwrócić tablicę wiadomości z seedera
```
