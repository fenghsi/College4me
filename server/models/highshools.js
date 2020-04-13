const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const highschoolSchema = new Schema({
    name: String,
    city: String,
    state: String,
    niche_grade: Number,
    niche_test: Number,
    hs_score: Number,
    detail_addr: String,
    web_url: String,
    tel: String,
    avg_sat: Number,
    avg_act: Number,
    description:{
        type: String,
        default: "Unavailable"
    },
    stats:{
        type:{},
        default: undefined
    },
    ratings: {
        type: {},
        default: undefined
    },
    popular_colleges: {
        type:[String],
        default: undefined
    }
});

let model = mongoose.model('Highschool', highschoolSchema);
module.exports = model;