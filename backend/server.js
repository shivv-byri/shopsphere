require("dotenv").config();
const express = require("express");
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

app.get("/", (req, res) => {
  res.send("API is running");
});

const cartAPIs = require("./APIs/CartAPI");
app.use("/cart", cartAPIs);

const reviewAPIs =require("./APIs/ReviewAPI");
app.use("/review",reviewAPIs); 

const sellerAPIs =require("./APIs/SellerAPI");
app.use("/seller",sellerAPIs);
const passport = require("passport");
require("./Config/Passport");

app.use(passport.initialize());
const authAPI = require("./APIs/AuthAPI");
app.use("/auth", authAPI);


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
