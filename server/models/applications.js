const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    userid:{
        type: String,
        required: true
    },
    college:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    questionable : String,
});

let model = mongoose.model('Applications', applicationSchema);
module.exports = model;