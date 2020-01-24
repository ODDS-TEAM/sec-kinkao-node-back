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
    imgUrl: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('merchantAccounts', merchantAccountsSchema);


//  old version
// restaurantInfo: {
//     name: { type: String },
//     ownerName: { type: String},
//     phoneNumber: { type: String },
//     description: { type: String },
//     imgUrl: { type: String },
// },