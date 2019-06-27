var mongoose = require('mongoose')

var subapi = mongoose.Schema({
    email : String,
    apis : Array,
    bank : String 
},{
    timestamp : true
});

module.exports = mongoose.model('subapi',subapi);