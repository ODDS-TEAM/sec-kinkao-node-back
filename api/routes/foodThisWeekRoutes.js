const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const merchantAccountsCollection = require("../models/merchantAccountsModel");
const dayMenusCollection = require("../models/dayMenusModel")

router.get("/", (req, res, next) => {
    
});


module.exports = router;