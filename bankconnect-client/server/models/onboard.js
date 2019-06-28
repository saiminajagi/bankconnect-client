var mongoose = require('mongoose');

var onboard = mongoose.Schema({
    email: String,
    bank: Array,
    state: String

}, {
        timestamp: true
    })

module.exports = mongoose.model('onboard', onboard);