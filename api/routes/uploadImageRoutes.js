const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');

const dotenv = require('dotenv');
dotenv.config();

const customerCollection = require("../models/customerAccountsModel");
const merchantCollection = require("../models/merchantAccountsModel");
const foodMenusCollection = require("../models/foodMenusModel");

router.post("/merchant/:_id", (req, res, next) => {

    var imagePath = "";

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null,'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, req.params._id);
        }
    });

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('imgRaw');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        imagePath = `${process.env.SERVER_URL}${req.file.filename}`

        merchantCollection.updateOne({ _id: req.params._id }, {
            $set: {
                imageUrl: imagePath,
            }
        }, function (err, docs) {
            if (err) {
                res.status(401).json({
                    message: err
                })
            }
            else {
                res.status(200).json({
                    message: 'image url upadated to ' + imagePath,
                    imageUrl: imagePath
                })
            }
        });
    });
    
});

router.post("/customer/:_id", (req, res, next) => {

    var imagePath = "";

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null,'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, req.params._id);
        }
    });

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('imgRaw');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        imagePath = `${process.env.SERVER_URL}${req.file.filename}`

        customerCollection.updateOne({ _id: req.params._id }, {
            $set: {
                imageUrl: imagePath,
            }
        }, function (err, docs) {
            if (err) {
                res.status(401).json({
                    message: err
                })
            }
            else {
                res.status(200).json({
                    message: 'image url upadated to ' + imagePath,
                    imageUrl: imagePath
                })
            }
        });
    });

});

router.post("/food/:foodMenuId", (req, res, next) => {

    var imagePath = "";

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null,'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, req.params.foodMenuId);
        }
    });

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('imgRaw');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        imagePath = `${process.env.SERVER_URL}${req.file.filename}`

        foodMenusCollection.updateOne({ _id: req.params.foodMenuId }, {
            $set: {
                imageUrl: imagePath,
            }
        }, function (err, docs) {
            if (err) {
                res.status(401).json({
                    message: err
                })
            }
            else {
                res.status(200).json({
                    message: 'image url upadated to ' + imagePath,
                    imageUrl: imagePath
                })
            }
        });
    });

});

module.exports = router;