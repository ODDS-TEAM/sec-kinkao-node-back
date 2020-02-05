const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const customerAccountsCollection = require("../models/customerAccountsModel");

router.get("/:uid", (req, res, next) => {
    customerAccountsCollection.findOne({ _id: req.params.uid })
        .exec()
        .then(docs => {
            if (docs == '' || docs == null) {
                res.status(401).json({
                    message: "This uid cannot be found"
                })
            }
            else {
                res.status(200).json({
                    email: res.docs.email,
                    displayName: res.docs.displayName,
                    imageUrl: res.docs.imageUrl
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