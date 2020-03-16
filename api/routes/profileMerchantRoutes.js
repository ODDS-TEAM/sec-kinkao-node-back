const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore");

const merchantAccountsCollection = require("../models/merchantAccountsModel");

router.get("/:uid", (req, res, next) => {
    merchantAccountsCollection.findOne({ _id: req.params.uid })
        .exec()
        .then(docs => {
            if (docs == '' || docs == null) {
                res.status(401).json({
                    message: "This uid cannot be found"
                });
            }
            else {
                res.status(200).json({
                    uid: docs._id,
                    email: docs.email,
                    restaurantName: docs.restaurantName,
                    ownerName: docs.ownerName,
                    phoneNumber: docs.phoneNumber,
                    description: docs.description,
                    imageUrl: docs.imageUrl,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

router.post("/edit/:uid", (req, res, next) => {
    merchantAccountsCollection.updateOne({ _id: req.params.uid }, {
        $set: {
            email: req.body.email,
            restaurantName: req.body.restaurantName,
            ownerName: req.body.ownerName,
            phoneNumber: req.body.phoneNumber,
            description: req.body.description
        }
    }, function (err, docs) {
        if (err) {
            res.status(500).json({
                message: err
            });
        }
        else {
            res.status(200).json({
                message: 'profile updated'
            });
        }
    });

});

module.exports = router;