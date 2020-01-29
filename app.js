const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

// define path of each routes
const authenticationRoutes = require("./api/routes/authenticationRoutes");
const helloRoutes = require('./api/routes/hellloRoutes');
const foodMenusRoutes = require('./api/routes/foodMenusRoutes');
const scheduleRoutes = require('./api/routes/scheduleRoutes');
const foodOrderCustomerRoutes = require('./api/routes/foodOrderCustomerRoutes');
const foodOrderMerchantRoutes = require('./api/routes/foodOrderMerchantRoutes');
const activityRoutes = require('./api/routes/activityRoutes');

mongoose.connect(
  process.env.DB_CONNECT,
  function(err) {
        if(err) throw err;
        console.log('Connect to MongoDB success!')
    }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/", helloRoutes);
app.use("/auth", authenticationRoutes);
app.use("/merchant/menu", foodMenusRoutes);
app.use("/merchant/schedule", scheduleRoutes);
app.use("/merchant/activity", activityRoutes);
app.use("/merchant/food/order", foodOrderMerchantRoutes);
app.use("/customer/food/order", foodOrderCustomerRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
  console.log(error);
});


module.exports = app;