var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var choicesSchema = new Schema({
    title: { type: String },
    price: { type: Number },
},
    { versionKey: false }
);

var optionsSchema = new Schema({
    title: { type: String },
    singleChoice: { type: Boolean },
    required: { type: Boolean },
    choices: [choicesSchema],
},
    { versionKey: false }
);

// main schema
var foodMenusSchema = new Schema({
    _id: { type: String },
    merchantId: { type: String },
    foodName: { type: String },    // old version is name
    price: { type: Number },
    description: { type: String },
    imgUrl: { type: String },
    options: [optionsSchema],
},
    { versionKey: false }
);

module.exports = mongoose.model('foodMenus', foodMenusSchema);
