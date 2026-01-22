require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();
connectDB();

require("./models/User");
require("./models/Seller");
require("./models/Product");
require("./models/Cart");
require("./models/Order");
require("./models/Review");

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

