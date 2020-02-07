const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const foodMenusCollection = require("../models/foodMenusModel");

router.post("/", (req, res, next) => {
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
        foodMenuId: "$_id", 
        imageUrl: 1, 
        foodName: 1,
        price: 1,
        _id: 0,
      }
    }
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

router.delete("/:foodMenuId", (req, res, next) => {
  foodMenusCollection.remove({ _id: req.params.foodMenuId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "menu deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;