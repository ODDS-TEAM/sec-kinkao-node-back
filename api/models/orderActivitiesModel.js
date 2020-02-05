var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    dayMenuId: { type: String },
    foodName: { type: String },
    numberOfItem: { type: Number },
    price: { type: Number },    // multiplied
    imageUrl: { type: String },
    options: [String],
    specialInstruction: { type: String }
},
    { versionKey: false }
);

// main schema
var orderActivitiesSchema = new Schema({
    _id: { type: String },          // by back-end
    orderType: { type: String },    // food or punsuk
    dateTime: { type: Date },       // by back-end
    state: { type: String },        // by back-end      // wc, ck, cd, cc, cp
    queue: { type: Number },        // by back-end
    customerId: { type: String },
    customerName: { type: String },
    customerImageUrl: { type: String },
    merchantId: { type: String },
    merchantName: { type: String },
    items: [itemsSchema],
    paymentMethod: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('orderActivities', orderActivitiesSchema);

// wc : waiting confirm,
// cc : canceled,
// cf : confirmed,
// cd : cooking done, ready to deliver
// cp : complete,