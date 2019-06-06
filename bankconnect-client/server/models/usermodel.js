var mongoose = require('mongoose');

var userschema = mongoose.Schema({
    username: String,
    ts : String,
    email : String,
    confirmation : Boolean,
    bankConnected : Boolean,
    password: String,
    fname : String,
    lname: String,
    admin : String,
    integrated : Boolean,
    apis : Array
},{
    timestamp : true
});

module.exports = mongoose.model('User',userschema);

