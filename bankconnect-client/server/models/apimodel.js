
var mongoose = require('mongoose');

var api = mongoose.Schema({
    name :  String,
    cbs : String,
    versions : Array
},{
    timestamp : true
});

module.exports = mongoose.model('api',api);