require("dotenv").config();
const express = require("express");
const passport = require("passport");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(express.json());

require("./models/User");
require("./models/Seller");
require("./models/Product");
require("./models/Cart");
require("./models/Order");
require("./models/Review");

require("./Config/Passport");
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/auth", require("./APIs/AuthAPI"));
app.use("/cart", require("./APIs/CartAPI"));
app.use("/review", require("./APIs/ReviewAPI"));
app.use("/seller", require("./APIs/SellerAPI"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
