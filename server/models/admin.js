const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminid: {
        type: String,
        required: true,
        unique: true
    },
    password: String
    
});

let model = mongoose.model('Admin', adminSchema);
module.exports = model;