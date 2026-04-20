import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import sequelize from "./utils/database.js";
import messagesRouter from "./routes/messages.js";

// Initialize environment variables
config();

const app = express();

// Middleware
app.use(bodyParser.json());

app.use('/api/messages', messagesRouter);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Interview task" });
});

// Global Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ success: false, message: message, data: data });
});

// DB Connection
sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
