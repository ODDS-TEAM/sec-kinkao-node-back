const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");
const dayMenusCollection = require("../models/dayMenusModel")

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

    orderActivitiesCollection.findOne({ _id: req.params.orderId })
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


//when merchant want to accept an order
router.post("/confirm/:orderId", (req, res, next) => {
    var dayMenuIdArray;
    orderActivitiesCollection.aggregate([
        {
          $match: { _id: req.params.orderId }
        },
        {
          $project: { 
            _id: 0,
            dayMenuId: '$items.dayMenuId'
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
                // res.status(200).json(result[0].dayMenuId)
                dayMenuIdArray = result[0].dayMenuId
                console.log(dayMenuIdArray)
                dayMenusCollection.update({ _id: { $in: dayMenuIdArray } }, {
                    $inc: {
                        foodLeft: -1
                    }
                }, function (err, docs) {
                    if (err) {
                        res.status(401).json({
                            message: err
                        })
                    }
                    else {
                        res.status(200).json({
                            message: "foodLeft decreased"
                        })
                    }
                });
            }
            else {
                res.status(401).json({
                    message: 'empyty'
                })
            }
        }
    })

    orderActivitiesCollection.updateOne({ _id: req.params.orderId }, {
        $set: {
            state: 'cf'
        }
    }, function (err, docs) {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            console.log('state updated to confirm')
        }
    });

});


//when merchant want to reject an order
router.post("/cancel/:orderId", (req, res, next) => {

    orderActivitiesCollection.updateOne({ _id: req.params.orderId }, {
        $set: {
            state: 'cc'
        }
    }, function (err, docs) {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            res.status(200).json({
                message: "state updated to canceled (cc)"
            })
        }
    });

});

module.exports = router;