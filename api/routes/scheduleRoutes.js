const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

// const foodMenusCollection = require("../models/foodMenusModel");
const dayMenusCollection = require("../models/dayMenusModel");

router.post("/random", (req, res, next) => {
    var dayMenu = new dayMenusCollection(_.extend({ _id: new mongoose.Types.ObjectId() }, req.body));
    dayMenusCollection.insertMany(dayMenu)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(401).json({
                message: err
            })
        });
});

router.get("/:merchantId", (req, res, next) => {
    dayMenusCollection.find({ merchantId: req.params.merchantId })
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