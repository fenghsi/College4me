const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collegesSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    ranking: String,
    avg_SAT: Number,
    avg_ACT: Number,
    control: String,
    debt: String,
    admission_rate:String,
    size: String,
    hidden_score: Number,
    city: String,
    state: String,
    completion_rate: String,
    range_avg_SAT_math: String,
    range_avg_SAT_EBRW: String,
    range_avg_ACT: String,
    majors: {
        type: [String],
        default: undefined
    },
    cost_of_attendance: {
        type: [String],
        default: undefined
    },
});

let model = mongoose.model('Colleges', collegesSchema);
module.exports = model;