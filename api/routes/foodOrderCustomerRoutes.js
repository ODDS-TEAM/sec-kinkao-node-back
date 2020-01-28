const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
_ = require("underscore")

const orderActivitiesCollection = require("../models/orderActivitiesModel");

// customer insert new order
router.post("/", (req, res, next) => {
  var order = new orderActivitiesCollection(_.extend(
    {
      _id: new mongoose.Types.ObjectId(),
      orderType: "food",
      dateTime: new Date(),
      state: "wc",
      queue: -1
    }, req.body));

  order.save()
    .then(result => {
      res.status(201).json({
        message: "order created"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


// router.post("/", (req, res, next) => {

//   var queueNow;

//   orderActivitiesCollection.findOne({ merchantId: req.body.merchantId }).sort({ _id: -1 }).limit(1)
//     .exec()
//     .then(docs => {
//       console.log(docs);
//       if (docs != '') {
//         queueNow = docs.queue;
//         insertOrder();
//       }
//       else {
//         queueNow = 0;
//         insertOrder();
//       }
//     })
//     .catch(err => {
//       console.log(err);
//     });

//   function insertOrder() {
//     console.log(queueNow);
//     var order = new orderActivitiesCollection(_.extend(
//       {
//         _id: new mongoose.Types.ObjectId(),
//         orderType: "food",
//         dateTime: new Date(),
//         state: "wc",
//         queue: queueNow + 1
//       }, req.body));

//     order.save()
//       .then(result => {
//         res.status(201).json({
//           message: "order created"
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   }

// });


module.exports = router;