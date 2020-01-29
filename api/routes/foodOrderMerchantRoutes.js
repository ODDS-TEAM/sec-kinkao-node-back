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

router.post("/confirm/:orderId", (req, res, next) => {
    var dayMenuIdArray;
    var queueNow;
    var merchantIdResult;

    orderActivitiesCollection.aggregate([
        {
            $match: { _id: req.params.orderId }
        },
        {
            $project: {
                _id: 0,
                dayMenuId: '$items.dayMenuId',
                merchantId: 1,
            }
        }
    ]).exec((err, result) => {
        if (err) {
            res.status(500).json({
                message: err
            })
        }
        else {
            if (result != '') {
                dayMenuIdArray = result[0].dayMenuId;
                merchantIdResult = result[0].merchantId

                queryLastQueue(merchantIdResult);
                decreasingFoodLeft(dayMenuIdArray);
            }
            else {
                res.status(401).json({
                    message: 'empyty'
                })
            }
        }
    })

    function queryLastQueue(merchantIdResult) {
        orderActivitiesCollection.findOne({ merchantId: merchantIdResult }).sort({ _id: -1 }).limit(1)
            .exec()
            .then(docs => {
                console.log(docs);
                if (docs != '') {
                    queueNow = Number(docs.queue);
                    console.log('queryLastQueue ', queueNow)
                    updateQueueAndState();
                }
                else {
                    queueNow = 0;
                    updateQueueAndState();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    function updateQueueAndState() {
        console.log('updateQueueAndState', queueNow)
        orderActivitiesCollection.updateOne({ _id: req.params.orderId }, {
            $set: {
                state: 'cf',
                queue: queueNow + 1
            }
        }, function (err, docs) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            }
            else {
                res.status(200).json({
                    message: 'state updated to confirmed and your queue is ' + (queueNow + 1)
                })
            }
        });
    }

    function decreasingFoodLeft(dayMenuIdArray) {
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
                console.log('foodLeft decreased');
            }
        });
    }

});

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

router.post("/done/:orderId", (req, res, next) => {
    orderActivitiesCollection.updateOne({ _id: req.params.orderId }, {
        $set: {
            state: 'cd'
        }
    }, function (err, docs) {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            res.status(200).json({
                message: "state updated to cooking done (cd)"
            })
        }
    });
});

router.post("/complete/:orderId", (req, res, next) => {
    orderActivitiesCollection.updateOne({ _id: req.params.orderId }, {
        $set: {
            state: 'cp'
        }
    }, function (err, docs) {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            res.status(200).json({
                message: "state updated to complete (cp)"
            })
        }
    });
});

module.exports = router;