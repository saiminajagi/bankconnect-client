var mongoose = require('mongoose');

var idbpschema = mongoose.Schema({
    sport: String,
    sip : String,
    tlsname : String,
    tlsversion: String
},{
    timestamp : true
});

module.exports = mongoose.model('IDBP',idbpschema);

