---
name: backend-agent
description: Agent wyspecjalizowany w implementacji backendu Express.js + Sequelize + MySQL. Implementuje migracje, seedery, modele i REST API dla wiadomości.
---

# Backend Agent – Zakres działania

## Technologie
- Node.js 18+ z ESM (`"type": "module"`)
- Express.js 4.x
- Sequelize 6.x + sequelize-cli
- MySQL 8.0
- express-validator do walidacji

## Zasady bezwzględne
- **NIE używaj `sequelize.sync()`** – tylko migracje przez sequelize-cli
- Wszystkie modele muszą być zgodne z migracjami
- Konfiguracja przez zmienne ENV (`.env` + docker-compose)

## Co implementujesz

### 1. Struktura plików
```
backend/
  config/
    config.js         ← dynamiczny config czytający z process.env
  models/
    index.js          ← inicjalizacja sequelize i modeli
    message.js        ← model Message
  migrations/
    TIMESTAMP-create-messages.js
  seeders/
    TIMESTAMP-demo-messages.js
  routes/
    messages.js       ← Router Express z CRUD
  utils/
    database.js       ← poprawiony: export sequelize instance
  .sequelizerc        ← wskazuje ścieżki do config/models/migrations/seeders
  app.js              ← poprawiony: używa sequelize.authenticate()
```

### 2. Model Message
```js
// models/message.js
export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    }
  });
  return Message;
};
```

### 3. Migracja
```js
// migrations/TIMESTAMP-create-messages.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Messages', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    message: { type: Sequelize.STRING, allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  });
}
export async function down(queryInterface) {
  await queryInterface.dropTable('Messages');
}
```

### 4. Seeder (min. 3 wiadomości)
```js
export async function up(queryInterface) {
  await queryInterface.bulkInsert('Messages', [
    { message: 'Pierwsza wiadomość', createdAt: new Date(), updatedAt: new Date() },
    { message: 'Druga wiadomość', createdAt: new Date(), updatedAt: new Date() },
    { message: 'Trzecia wiadomość', createdAt: new Date(), updatedAt: new Date() }
  ]);
}
```

### 5. API Routes
```
GET    /api/messages       → wszystkie wiadomości
POST   /api/messages       → { message: string } – walidacja required
PUT    /api/messages/:id   → { message: string } – walidacja required
DELETE /api/messages/:id   → usuń po id
```

### 6. .sequelizerc
```js
const path = require('path'); // lub import – zależy od konfiguracji
module.exports = {
  'config': path.resolve('config', 'config.js'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders')
};
```

**Uwaga**: sequelize-cli nie obsługuje ESM natywnie – `.sequelizerc` i `config/config.js` muszą używać CommonJS (`require`/`module.exports`) lub wskazywać na plik `.cjs`.

### 7. Config dla sequelize-cli
```js
// config/config.js (CommonJS)
require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
};
```

## Naprawienie database.js i app.js

`database.js` – eksportuj instancję Sequelize (nie Promise):
```js
// utils/database.js – ESM
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { dialect: 'mysql', host: process.env.DB_HOST, port: 3306 }
);

export default sequelize;
```

`app.js` – używaj `sequelize.authenticate()`:
```js
sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err));
```
