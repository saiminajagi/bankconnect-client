var mongoose = require('mongoose');

var partner = mongoose.Schema({
    org : String,
    email : String,
    active : Boolean,
    files : Boolean
},{
    timestamp : true
});

module.exports = mongoose.model('partner',partner);
