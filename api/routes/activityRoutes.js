const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

router.get("/all/:merchantId", (req, res, next) => {
    orderActivitiesCollection.find( {state: {$in: ['cf', 'cd']}, merchantId: req.params.merchantId} )
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

router.get("/:orderId", (req, res, next) => {
    orderActivitiesCollection.findOne({ _id: req.params.orderId})
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