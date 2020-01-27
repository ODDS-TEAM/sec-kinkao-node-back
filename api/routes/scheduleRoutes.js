const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

// const foodMenusCollection = require("../models/foodMenusModel");
const dayMenusCollection = require("../models/dayMenusModel");

router.post("/random", (req, res, next) => {
    dayMenusCollection.insertMany(req.body)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(401).json({
                message: err
            })
        });
});

module.exports = router;