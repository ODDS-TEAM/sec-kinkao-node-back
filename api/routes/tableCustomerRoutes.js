const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenuCollection = require("../models/foodMenusModel");
const dayMenuCollection = require("../models/dayMenusModel");
const merchantAccountCollection = require("../models/merchantAccountsModel");
const coEatingTableCollection = require("../models/coEatingTableModel");

router.post("/create", (req, res, next) => {
    coEatingTableCollection.find({ tableName: req.body.tableName, state: { $in: ['ordering', 'ordered'] } })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(401).json({
                    message: "Table name exists"
                });
            }
            else {
                const table = new coEatingTableCollection({
                    _id: new mongoose.Types.ObjectId(),
                    userId: req.body.userId,
                    tableName: req.body.tableName,
                    restaurantName: req.body.restaurantName,
                    merchantId: req.body.merchantId,
                    state: 'ordering'
                });
                table
                    .save()
                    .then(result => {
                        res.status(201).json(result);
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        });
});

router.get("/restaurant", (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1)
    var yyyy = today.getFullYear();
    todayString = dd + '/' + mm + '/' + yyyy;

    dayMenuCollection.aggregate([
        {
            $match: { "date": todayString }
        },
        {
            $project: {
                _id: '$merchantId',
            }
        },
    ]).exec((err, result) => {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            if (result != '') {
                merchantAccountCollection.aggregate([
                    {
                        $match: {$or: result}
                    },
                    {
                        $project: {
                            _id: 0,
                            merchantId: '$_id',
                            restaurantName: 1,
                            imageUrl: 1,
                        }
                    },
                ]).exec((err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: err
                        })
                    }
                    else {
                        res.status(200).json(result)
                    }
                });
            }
            else {
                res.status(401).json({
                    message: 'there is not restaurant today'
                })
            }
        }
    })
});

router.get("/menu/:merchantId", (req, res, next) => {

    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1)
    var yyyy = today.getFullYear();
    todayString = dd + '/' + mm + '/' + yyyy;

    dayMenuCollection.aggregate([
        {
            $match: { "date": todayString, merchantId: req.params.merchantId }
        },
        {
            $project: {
                _id: 0,
                menuName: 1,
                price: 1,
                imageUrl: 1,
            }
        },
    ]).exec((err, result) => {
        if (err) {
            res.status(401).json({
                message: err
            })
        }
        else {
            res.status(200).json(result)
        }
    })
});

module.exports = router;