var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dayMenusSchema = new Schema({
    _id: { type: String },
    day: { type: String },
    week: { type: Number },
    year: { type: Number },
    date: { type: Date },
    foodMenuId: { type: String },
    merchantId: { type: String },
    menuName: { type: String },
    price: { type: Number },
    foodLeft: { type: Number },
    imageUrl: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('dayMenus', dayMenusSchema);

