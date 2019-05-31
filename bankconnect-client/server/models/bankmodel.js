var mongoose = require('mongoose');

var bankschema = mongoose.Schema({
    username: String,
    email : String,
    password: String,
    bankname : String,
    ts : String
},{
    timestamp : true
});

module.exports = mongoose.model('bank',bankschema);
