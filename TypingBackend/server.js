// Third-Party libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Router
const api = require("./router");

// Configurations
const PORT = 4000;

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(api);

// Connect database
console.log("Connecting to database...");
mongoose.connect("mongodb://127.0.0.1/typing-competition").then(() => {
  console.log("Database connected!");
  // Listen to port
  app.listen(PORT);
  console.log(`App is listening to port ${PORT}`);
});
