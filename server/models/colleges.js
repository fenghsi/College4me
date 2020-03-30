const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collegesSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    ranking: String,
    avg_SAT: String,
    avg_ACT: String,
    admission_rate:String,
    cost: String,
    size: String,
    hidden_score: Number,
    city: String,
    state: String
});

let model = mongoose.model('Colleges', collegesSchema);
module.exports = model;