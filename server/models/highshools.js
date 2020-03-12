const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const highschoolSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    ranking:Number,
    city: String,
    state: String,
});

let model = mongoose.model('Highschool', highschoolSchema);
module.exports = model;