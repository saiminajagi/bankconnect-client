var mongoose = require('mongoose');

var partnerbank = mongoose.Schema({
    org : String,
    email : String,
    bankname : String,
    onboard : Boolean
},{
    timestamp : true
});

module.exports = mongoose.model('partner',partner);
