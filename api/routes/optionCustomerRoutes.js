const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenusCollection = require("../models/foodMenusModel");

router.get("/:foodMenuId", (req, res, next) => {
    foodMenusCollection.findOne({ _id: req.params.foodMenuId })
        .exec()
        .then(docs => {
            if (docs == '' || docs == null) {
                res.status(401).json({
                    message: "This menu cannot be found"
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