var express = require('express');
var router = express.Router();
const WSJUrl = "http://allv22.all.cs.stonybrook.edu/~stoller/cse416/WSJ_THE/united_states_rankings_2020_limit0_25839923f8b1714cf54659d4e4af6c3b.json";
const CollegeScoreCardUrl = 'CollegScoreCard.csv';
const collegeTxtUrl = 'colleges.txt';
const axios = require("axios");
const cheerio = require('cheerio')
const fs = require('fs') 
const readline = require('readline');
const College = require('../models/colleges');
const csv=require("csvtojson");
  

//Import all the colloges in colleges.txt(Only name)
router.post('/import_Colleges', async function(req, res, next) {
    const fileStream = fs.createReadStream(collegeTxtUrl);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const col of rl) {
        const college = new College({
            name: col
        });
        await college.save();
    }
});

//7.1 Scrape college rankings.  Scrape WSJ/THE 2020 rankings of all colleges in colleges.txt.
router.post('/scrape_college_ranking', async function(req, res, next) {
    const result = await axios.get(WSJUrl);
    for (const college of result.data.data) {
        console.log(college.name);
        console.log(college.rank);
        await College.updateOne({name:college.name}, 
            {   
                $set: {ranking:college.rank_order }
        });
    }
});

//7.2 Import College Scorecard data file.  Import information about all colleges in colleges.txt.
router.post('/import_college_scorecard', async function(req, res, next) {
    //convert to Json
    // ranking:Number,
    // avg_SAT: Number,
    // avg_ACT: Number,
    // admission_rate:Number,
    // cost: Number,
    // size: Number,
    // hidden_score: Number,
    // city: String,
    // state: String
    csv().fromFile(CollegeScoreCardUrl).then(function(CSjson){ 
        
   })
});



module.exports = router;
