const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const customerCollection = require("../models/customerAccountsModel");
const merchantCollection = require("../models/merchantAccountsModel");

// customer
router.post("/customer/signup", (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);
  customerCollection.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(401).json({
          message: "Mail exists"
        });
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new customerCollection({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              displayName: req.body.displayName,
              imageUrl: 'url'
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "account created",
                  uid: result._id,
                  email: result.email,
                  displayName: result.displayName
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
      }
    });
});

router.post("/customer/login", (req, res, next) => {
  customerCollection.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.TOKEN_SECRET,
            // {
            //   expiresIn: "1h"
            // }
          );
          return res.status(200).json({
            message: "Auth successful",
            uid: user[0]._id,
            email: user[0].email,
            displayName: user[0].displayName,
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/customer/:userId", (req, res, next) => {
  customerCollection.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "account deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



// merchant
router.post("/merchant/signup", (req, res, next) => {
  merchantCollection.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(401).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new merchantCollection({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              restaurantName: req.body.restaurantName,
              ownerName: req.body.ownerName,
              phoneNumber: req.body.phoneNumber,
              description: req.body.description,
              imageUrl: 'url'
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "account created"
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
      }
    });
});

router.post("/merchant/login", (req, res, next) => {
  merchantCollection.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.TOKEN_SECRET,
            // {
            //   expiresIn: "1h"
            // }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/merchant/:userId", (req, res, next) => {
  merchantCollection.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "account deleted"
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
