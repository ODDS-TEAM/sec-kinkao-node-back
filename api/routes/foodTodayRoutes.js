const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const dayMenusCollection = require("../models/dayMenusModel")


router.get("/", (req, res, next) => {

    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1)
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    dayMenusCollection.aggregate([
        {
            $match: {
                date: '28/1/2020',
            }
        },
        {
            $group: { "_id": "$merchantId", merchantId: { "$first": "$merchantId" }, menus: { $push: "$$ROOT" } }
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
                restaurantName: {
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
                _id: 0,
                fromItems: 0,
                ownerName: 0,
                phoneNumber: 0,
                description: 0,
                dateTime: 0,
                year: 0,
                // restaurantName: '$menus[0].restaurantName'
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
                res.status(200).json(result)
            }
            else {
                res.status(401).json({
                    message: 'there isn\'t menu on today'
                })
            }
        }
    })
});

module.exports = router;