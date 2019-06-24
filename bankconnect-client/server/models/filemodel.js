var mongoose = require('mongoose');

var file = mongoose.Schema({
    email : String,
    file : String
},{
    timestamp : true
});

module.exports = mongoose.model('file',file);