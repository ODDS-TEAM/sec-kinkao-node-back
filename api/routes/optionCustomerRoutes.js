const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenusCollection = require("../models/foodMenusModel");

router.get("/:foodMenuId", (req, res, next) => {
    foodMenusCollection.aggregate([
        {
            $match: { _id: req.params.foodMenuId }
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
                    message: 'This menu cannot be found'
                })
            }
        }
    })

});
module.exports = router;