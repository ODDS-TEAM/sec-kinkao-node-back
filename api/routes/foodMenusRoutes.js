const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenusCollection = require("../models/foodMenusModel");

router.post("/v2", (req, res, next) => {
  console.log(req.body);
  foodMenusCollection.find({ foodName: req.body.foodName })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(401).json({
          message: "This food exists"
        });
      }
      else {
        var foodMenu = new foodMenusCollection(_.extend({ _id: new mongoose.Types.ObjectId() }, req.body));
        

        foodMenu.save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "food menu created",
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });
});


router.get("/:uid", (req, res, next) => {

  foodMenusCollection.aggregate([
    {
      $match: { merchantId: req.params.uid }
    },
    {
      $project: { 
        foodMerchantId: "$_id", 
        imageUrl: 1, 
        foodName: 1,
        price: 1,
      }
    }
  ]).exec((err, result) => {
    if (err) {
      res.status(401).json({
        message: err
      })
    }
    else {
      res.status(200).send(result)
    }
  })
});


module.exports = router;