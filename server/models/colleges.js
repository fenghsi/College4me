const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collegesSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    ranking:Number,
    avg_SAT: Number,
    avg_ACT: Number,
    admission_rate:Number,
    cost: Number,
    size: Number,
    hidden_score: Number,
    city: String,
    state: String
});

let model = mongoose.model('Colleges', collegesSchema);
module.exports = model;