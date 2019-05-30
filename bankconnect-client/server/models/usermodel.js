var mongoose = require('mongoose');

var userschema = mongoose.Schema({
    username: String,
    ts : String,
    email : String,
    confirmation : Boolean,
    password: String,
    fname : String,
    lname: String,
    admin : String
},{
    timestamp : true
});

module.exports = mongoose.model('User',userschema);
