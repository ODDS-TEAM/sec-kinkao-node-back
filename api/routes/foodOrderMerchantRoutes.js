const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

//show all order for merchant
router.get("/:merchantId", (req, res, next) => {
    orderActivitiesCollection.aggregate([
        {
            $match: { merchantId: req.params.merchantId, state: 'wc' }
        },
        {
            $project: {
                _id: 0,
                orderId: "$_id",
                orderType: 1,
                dateTime: 1,
                state: 1,
                queue: 1,
                customerId: 1,
                customerName: 1,
                customerImageUrl: 1,
                merchantId: 1,
                merchantName: 1,
                paymentMethod: 1,
                'items.foodName': 1,
                'items.numberOfItem': 1,
            }
        }
    ]).exec((err, result) => {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            if (result != '') {
                res.status(200).json(result)
            }
            else {
                res.status(401).json({
                    message: 'you don\'t have order now'
                })
            }
        }
    })
});


//show order detail for merchant
router.get("/detail/:orderId", (req, res, next) => {

  orderActivitiesCollection.find({ _id: req.params.orderId }).sort({ _id: -1 })
    .exec()
    .then(docs => {
      if (docs != '') {
        res.status(200).json(docs)
      }
      else {
        res.status(401).json({
            message: "empty"
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
          message: err
      })
    });

});


module.exports = router;