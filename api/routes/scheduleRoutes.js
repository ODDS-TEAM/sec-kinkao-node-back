const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

// const foodMenusCollection = require("../models/foodMenusModel");
const dayMenusCollection = require("../models/dayMenusModel");

router.post("/", (req, res, next) => {
    dayMenusCollection.find({ foodMenuId: req.body.foodMenuId, day: req.body.day, week: req.body.week, year: req.body.year })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(401).json({
                    message: "food exists"
                });
            }
            else {
                var dayMenu = new dayMenusCollection(_.extend({ _id: new mongoose.Types.ObjectId() }, req.body));
                dayMenu
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json(result);
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

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }
    var weekAndYear = getWeekNumber(new Date());
    console.log(weekAndYear[1] + ',' + weekAndYear[0])

    dayMenusCollection.find({ merchantId: req.params.merchantId, week: weekAndYear[1], year: weekAndYear[0] })
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

router.put("/edit/:_id", (req, res, next) => {
    dayMenusCollection.updateOne({ _id: req.params._id }, {
        $set: {
            day: req.body.day,
            week: req.body.week,
            year: req.body.year,
            date: req.body.date,
            dateTime: req.body.dateTime,
            foodMenuId: req.body.foodMenuId,
            merchantId: req.body.merchantId,
            menuName: req.body.menuName,
            price: req.body.price,
            foodLeft: req.body.foodLeft,
            imageUrl: req.body.imageUrl
        }
    }, function (err, docs) {
        if (err) {
            res.status(500).json({
                message: err
            })
        }
        else {
            res.status(200).json({
                message: 'dayMenu updated'
            })
        }
    });
});

router.delete("/:dayMenuId", (req, res, next) => {
    dayMenusCollection.remove({ _id: req.params.dayMenuId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "day menu deleted"
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