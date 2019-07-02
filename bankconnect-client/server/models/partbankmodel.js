var mongoose = require('mongoose');

//is this model necessary? 
var partnerbank = mongoose.Schema({
    org : String,
    email : String,
    bankname : String,
    onboard : Boolean
},{
    timestamp : true
});

module.exports = mongoose.model('partnerbank',partnerbank);
