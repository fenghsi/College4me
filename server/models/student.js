const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    userid :{
        type: String,
        required: true,
        unique: true
    },
    password: String,
    residence_state: String,
    high_school_name: String,
    high_school_city : String,
    high_school_state : String,
    GPA: Number,
    college_class: String,
    major_1: String,
    major_2: String,
    SAT_math: Number,
    SAT_EBRW: Number,
    ACT_English: Number,
    ACT_math: Number,
    ACT_reading: Number,
    ACT_science: Number,
    ACT_composite: Number,
    SAT_literature: Number,
    SAT_US_hist: Number,
    SAT_world_hist: Number,
    SAT_math_I: Number,
    SAT_math_II: Number,
    SAT_eco_bio: Number,
    SAT_mol_bio: Number,
    SAT_chemistry: Number,
    SAT_physics: Number,
    num_AP_passed: Number,
    hidden_score: Number
});

let model = mongoose.model('Student', studentSchema);
module.exports = model;