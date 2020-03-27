const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenuCollection = require("../models/foodMenusModel");
const dayMenuCollection = require("../models/dayMenusModel");
const merchantAccountCollection = require("../models/merchantAccountsModel");
const coEatingTableCollection = require("../models/coEatingTableModel");

router.post("/create", (req, res, next) => {
    let randomInviteCode = Math.random().toString(36).substring(7);
    coEatingTableCollection.find({ tableName: req.body.tableName, state: { $in: ['ordering', 'ordered'] } })
        .exec()
        .then(doc => {
            if (doc.length >= 1) {
                res.status(401).json({
                    message: "Table name exists"
                });
            }
            else {
                createTable();
            }
        });

    function createTable() {
        const table = new coEatingTableCollection({
            _id: new mongoose.Types.ObjectId(),
            leaderId: req.body.leaderId,
            tableName: req.body.tableName,
            restaurantName: req.body.restaurantName,
            merchantId: req.body.merchantId,
            inviteCode: randomInviteCode,
            state: 'ordering',
            baskets: {
                customerId: req.body.leaderId,
            }
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
                        $match: { $or: result }
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

router.post("/join", (req, res, next) => {
    coEatingTableCollection.find({ inviteCode: req.body.inviteCode, state: 'ordering' })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                checkExistMember();
            }
            else {
                res.status(401).json({
                    message: "inviteCode is not match or this table was ordered"
                })
            }
        });

    function checkExistMember() {
        coEatingTableCollection.find({
            baskets: {
                $elemMatch: { customerId: req.body.userId }
            }
        })
            .exec()
            .then(doc => {
                if (doc.length >= 1) {
                    res.status(401).json({
                        message: "you have already joined"
                    });
                }
                else {
                    addMember();
                }
            });
    }

    function addMember() {
        coEatingTableCollection.updateOne({ inviteCode: req.body.inviteCode }, {
            $push: {
                baskets: {
                    $each: [{ customerId: req.body.userId }],
                }
            }
        }, function (err, docs) {
            if (err) {
                res.status(500).json({
                    message: err
                });
            }
            else {
                res.status(200).json({
                    message: 'user added',
                    inviteCode: req.body.inviteCode,
                    userId: req.body.userId
                });
            }
        });
    }
});

router.get("/list/:userId", (req, res, next) => {
    coEatingTableCollection.aggregate([
        {
            $match: { 'baskets.customerId': req.params.userId }
        },
        {
            $project: {
                _id: 0,
                tableId: '$_id',
                tableName: 1,
                restaurantName: 1,
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

router.get("/view/:tableId", (req, res, next) => {
    coEatingTableCollection.find({ _id: req.params.tableId })
        .exec()
        .then(doc => {
            if (doc.length >= 1) {
                res.status(200).json(doc[0])
            }
            else {
                res.status(401).json({
                    message: "empty"
                });
            }
        });
});

router.post("/view/add_menu", (req, res, next) => {
    coEatingTableCollection.find({ 'baskets.customerId': req.body.userId, _id: req.body.tableId })
        .exec()
        .then(doc => {
            if (doc.length >= 1) {
                addMenu();
            }
            else {
                res.status(401).json({
                    message: "you are not member"
                });
            }
        });

    function addMenu() {
        const menuData = {
            _id: new mongoose.Types.ObjectId(),
            dayMenuId: req.body.dayMenuId,
            foodName: req.body.foodName,
            numberOfItem: req.body.numberOfItem,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            options: req.body.options,
            specialInstruction: req.body.specialInstruction,
        };
        coEatingTableCollection.updateOne(
            {
                "_id": req.body.tableId,
                "baskets.customerId": req.body.userId
            },
            {
                $push: {
                    "baskets.$.items": menuData
                }
            })
            .exec()
            .then(result => {
                res.status(200).json({
                    tableId: req.body.tableId,
                    dayMenuId: req.body.dayMenuId,
                    foodName: req.body.foodName,
                    numberOfItem: req.body.numberOfItem,
                    price: req.body.price,
                    imageUrl: req.body.imageUrl,
                    options: req.body.options,
                    specialInstruction: req.body.specialInstruction,
                })
            });
    }

});

module.exports = router;