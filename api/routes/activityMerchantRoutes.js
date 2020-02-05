const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

router.get("/all/:merchantId", (req, res, next) => {
    orderActivitiesCollection.aggregate([
        {
            $match: { merchantId: req.params.merchantId, state: {$in: ['cf', 'cd']} }
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
                    message: 'you don\'t have activity now'
                })
            }
        }
    })

});

router.get("/:orderId", (req, res, next) => {
    orderActivitiesCollection.aggregate([
        {
            $match: { _id: req.params.orderId }
        },
        {
            $project: {
                _id: 1,
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
                items: 1
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
                    message: 'you don\'t have activity now'
                })
            }
        }
    })

});

module.exports = router;