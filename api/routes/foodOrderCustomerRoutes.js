const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

// customer insert new order
router.post("/", (req, res, next) => {
  var order = new orderActivitiesCollection(_.extend(
    {
      _id: new mongoose.Types.ObjectId(),
      orderType: "food",
      dateTime: new Date(),
      state: "wc",
      queue: -1
    }, req.body));

  order.save()
    .then(result => {
      res.status(201).json({
        message: "order created"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;