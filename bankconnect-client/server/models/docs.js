var mongoose = require('mongoose');

var docs = mongoose.Schema({
    org : String,
    email : String
},{
  timestamp: true
});

module.exports = mongoose.model('doc',docs);
