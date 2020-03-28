var express = require('express');
var router = express.Router();
const WSJUrl = "http://allv22.all.cs.stonybrook.edu/~stoller/cse416/WSJ_THE/united_states_rankings_2020_limit0_25839923f8b1714cf54659d4e4af6c3b.json";
const CollegeScoreCardUrl = '../../../../desktop/CollegScoreCard.csv';
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
    csv().fromFile(CollegeScoreCardUrl).then(async function(CSjson){ 
        let count = 0;
        CSjson.forEach(async function(college) {
            let cname =await college.INSTNM.replace("-",", ");
            if(cname=="The University of Alabama"){
                updateCollege_from_Scorecard("University of Alabama", college);
            }
            else if(cname=="The College of Saint Scholastica"){
                updateCollege_from_Scorecard("The College of St Scholastica", college);
            }
            else if(cname=="University of Massachusetts, Amherst"){
                updateCollege_from_Scorecard("University of Massachusetts Amherst", college);
            }
            else if(cname=="The University of Montana"){
                updateCollege_from_Scorecard("University of Montana", college);
            }
            else if(cname=="Indiana University-Bloomington"){
                updateCollege_from_Scorecard("Indiana University Bloomington", college);
            }
            else{
                let c = await College.findOne({name:cname }).lean();
                if(c){
                    await count++;
                    await College.updateOne({name: cname}, 
                        {   
                            avg_SAT: college.SAT_AVG!="NULL"?college.SAT_AVG:-1,
                            avg_ACT: college.ACTCMMID!="NULL"?college.ACTCMMID:-1,
                            admission_rate: college.ADM_RATE!="NULL"?college.ADM_RATE:-1,
                            cost: (college.NPT4_PRIV!="NULL"?college.NPT4_PRIV:(college.NPT4_PUB!="NULL"?college.NPT4_PUB:-1)),
                            size: (college.NUM4_PRIV!="NULL"?college.NUM4_PRIV:(college.NUM4_PUB!="NULL"?college.NUM4_PUB:-1)),
                            hidden_score: 0,
                            city: college.CITY,
                            state: college.STABBR
                    });
                }
            }
        });
   })
});

async function updateCollege_from_Scorecard(cname, college) {
    await College.updateOne({name: cname}, 
        {   
            avg_SAT: college.SAT_AVG!="NULL"?college.SAT_AVG:-1,
            avg_ACT: college.ACTCMMID!="NULL"?college.ACTCMMID:-1,
            admission_rate: college.ADM_RATE!="NULL"?college.ADM_RATE:-1,
            cost: (college.NPT4_PRIV!="NULL"?college.NPT4_PRIV:(college.NPT4_PUB!="NULL"?college.NPT4_PUB:-1)),
            size: (college.NUM4_PRIV!="NULL"?college.NUM4_PRIV:(college.NUM4_PUB!="NULL"?college.NUM4_PUB:-1)),
            hidden_score: 0,
            city: college.CITY,
            state: college.STABBR
    });
}


module.exports = router;
