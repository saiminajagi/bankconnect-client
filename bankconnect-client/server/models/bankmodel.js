var mongoose = require('mongoose');

var bankschema = mongoose.Schema({
    username: String,
    email : String,
    password: String,
    bankname : String,
    ts : String,
    confirmation : Boolean,
    integrated : Boolean,
    apis : Array,
    sport: String,
    sip : String,
    tlsname : String,
    tlsversion: String,
},{
    timestamp : true
});

module.exports = mongoose.model('bank',bankschema);
