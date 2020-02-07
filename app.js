const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

app.use(express.static('uploads'));

// define path of each routes
const authenticationRoutes = require("./api/routes/authenticationRoutes");
const helloRoutes = require('./api/routes/hellloRoutes');
const foodMenusRoutes = require('./api/routes/foodMenusRoutes');
const scheduleRoutes = require('./api/routes/scheduleRoutes');
const foodOrderCustomerRoutes = require('./api/routes/foodOrderCustomerRoutes');
const foodOrderMerchantRoutes = require('./api/routes/foodOrderMerchantRoutes');
const activityMerchantRoutes = require('./api/routes/activityMerchantRoutes');
const activityCustomerRoutes = require('./api/routes/activityCustomerRoutes');
const foodThisWeekRoutes = require('./api/routes/foodThisWeekRoutes');
const foodTodayRoutes = require('./api/routes/foodTodayRoutes');
const optionCustomerRoutes = require('./api/routes/optionCustomerRoutes');
const profileCustomerRoutes = require('./api/routes/profileCustomerRoutes');
const profileMerchantRoutes = require('./api/routes/profileMerchantRoutes');
const uploadImageRoutes = require('./api/routes/uploadImageRoutes');

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

app.use(express.static(__dirname + '/public'));

// Routes which should handle requests
app.use("/", helloRoutes);
app.use("/auth", authenticationRoutes);
app.use("/upload/img", uploadImageRoutes);
app.use("/merchant/menu", foodMenusRoutes);
app.use("/merchant/schedule", scheduleRoutes);
app.use("/merchant/activity", activityMerchantRoutes);
app.use("/merchant/food/order", foodOrderMerchantRoutes);
app.use("/merchant/profile", profileMerchantRoutes);
app.use("/customer/food/order", foodOrderCustomerRoutes);
app.use("/customer/food/week", foodThisWeekRoutes);
app.use("/customer/food/today", foodTodayRoutes);
app.use("/customer/activity", activityCustomerRoutes);
app.use("/customer/food/option", optionCustomerRoutes);
app.use("/customer/profile", profileCustomerRoutes);

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