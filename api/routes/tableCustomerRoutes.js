const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const dayMenuCollection = require("../models/dayMenusModel");

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
                _id: 0,
                merchantId: 1,
            }
        },
        {
            $group: { "_id": "$date", "doc" : {"$first": "$$ROOT"}}
        },
        {
            $replaceRoot: { "newRoot": "$doc"}
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

module.exports = router;