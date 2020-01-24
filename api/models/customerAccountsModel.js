var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerAccountsSchema = new Schema({
    _id: { type: String },
    email: { type: String },
    password: { type: String },
    displayName: { type: String },
    imageUrl: { type: String }
},
    { versionKey: false }
);

module.exports = mongoose.model('customerAccounts', customerAccountsSchema);