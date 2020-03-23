var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    dayMenuId: { type: String },
    foodName: { type: String },
    numberOfItem: { type: Number },
    price: { type: Number },
    imageUrl: { type: String },
    options: [String],
    specialInstruction: { type: String },
},
    { versionKey: false }
);

var basketSchema = new Schema({
    customerId: { type: String },
    items: [itemSchema]
},
    { versionKey: false }
);

var coEatingTableSchema = new Schema({
    _id: { type: String },
    tableName: { type: String },
    restaurantName: { type: String },
    merchantId: { type: String },
    inviteCode: { type: String },
    // ordered: { type: Boolean },
    state: { type: String },   // ordering, ordered, complete
    baskets: [basketSchema],
},
    { versionKey: false }
);

module.exports = mongoose.model('coeatingtable', coEatingTableSchema);
