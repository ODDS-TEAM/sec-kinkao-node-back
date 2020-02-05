const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

router.get("/:uid", (req, res, next) => {
    orderActivitiesCollection.aggregate([
        {
            $match: { customerId: req.params.uid, state: {$in: ['wc', 'ck', 'cd', 'sc']} }
        },
        {
            $project: {
                _id: 1,
                orderType: 1,
                dateTime: 1,
                state: 1,
                merchantName: 1,
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

router.get("/detail/:_id", (req, res, next) => {
    orderActivitiesCollection.findOne({ _id: req.params._id })
        .exec()
        .then(docs => {
            console.log(docs)
            if (docs == '' || docs == null) {
                res.status(401).json({
                    message: "This activity cannot be found"
                })
            }
            else {
                res.status(200).json(docs)
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