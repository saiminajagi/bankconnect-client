
var mongoose = require('mongoose');


var cbs = mongoose.Schema({
    name : String,
    versions : Array
},{
    timestamp : true
});

module.exports = mongoose.model('cbservice',cbs);