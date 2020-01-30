const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const merchantAccountsCollection = require("../models/merchantAccountsModel");
const dayMenusCollection = require("../models/dayMenusModel")

router.get("/", (req, res, next) => {

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    }

    dayMenusCollection.aggregate([
        {
            $match: {
                week: getWeekNumber(new Date()),
                year: (new Date()).getFullYear(),
            }
        },
        {
            $lookup: {
                from: "merchantaccounts",
                localField: "merchantId",
                foreignField: "_id",
                as: "fromItems"
            },
        },
        {
            $addFields: {
                merchantName: {
                    $let: {
                        vars: {
                            merchant: {
                                $arrayElemAt: ["$fromItems", 0]
                            },
                        },
                        in: "$$merchant.restaurantName"
                    }
                },
            }
        },
        {
            $project: {
                fromItems: 0,
                ownerName: 0,
                phoneNumber: 0,
                description: 0,
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
                    message: 'there isn\'t menu in this week'
                })
            }
        }
    })
});

router.get("/:week/:year", (req, res, next) => {

    dayMenusCollection.aggregate([
        {
            $match: {
                week: req.params.week,
                year: req.params.year,
            }
        },
        {
            $lookup: {
                from: "merchantaccounts",
                localField: "merchantId",
                foreignField: "_id",
                as: "fromItems"
            },
        },
        {
            $addFields: {
                merchantName: {
                    $let: {
                        vars: {
                            merchant: {
                                $arrayElemAt: ["$fromItems", 0]
                            },
                        },
                        in: "$$merchant.restaurantName"
                    }
                },
            }
        },
        {
            $project: {
                fromItems: 0,
                ownerName: 0,
                phoneNumber: 0,
                description: 0,
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
                    message: 'there isn\'t menu in this week'
                })
            }
        }
    })
});

module.exports = router;