const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    userid: String,
    college: String,
    status: String
});

let model = mongoose.model('Applications', applicationSchema);
module.exports = model;