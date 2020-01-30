var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var merchantAccountsSchema = new Schema({
    _id: { type: String },
    email: { type: String },
    password: { type: String },
    restaurantName: { type: String },
    ownerName: { type: String },
    phoneNumber: { type: String },
    description: { type: String },
    imageUrl: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('merchantAccounts', merchantAccountsSchema);
