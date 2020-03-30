var express = require('express');
var router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio')
const fs = require('fs') 
const readline = require('readline');
const College = require('../models/colleges');
const csv=require("csvtojson");
const Student = require('../models/student');
const Applications = require('../models/applications');
const WSJUrl = "http://allv22.all.cs.stonybrook.edu/~stoller/cse416/WSJ_THE/united_states_rankings_2020_limit0_25839923f8b1714cf54659d4e4af6c3b.json";
const CollegeScoreCardUrl = '../../../../desktop/CollegScoreCard.csv';
const collegeTxtUrl = 'colleges.txt';
const StudentsUrl = 'students.csv';
const ApplicationsUrl = 'applications.csv';


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
        await College.updateOne({name:college.name}, 
            {   
                $set: {ranking:college.rank }
        });
    }
});

//7.2 Import College Scorecard data file.  Import information about all colleges in colleges.txt.
router.post('/import_college_scorecard', async function(req, res, next) {
    csv().fromFile(CollegeScoreCardUrl).then(async function(CSjson){ 

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
                    await College.updateOne({name: cname}, 
                        {   
                            admission_rate: college.ADM_RATE!="NULL"?college.ADM_RATE:"NULL",
                            size: (college.UG!="NULL"?college.UG:(college.UGDS!="NULL"?college.UGDS:"NULL")),
                            city: college.CITY,
                            state: college.STABBR
                    });
                }
            }
        });
   })
});

//7.4 Delete all student profiles
router.post('/delete_all_student_profiles', async function(req, res, next) {
    await Student.deleteMany({accountType:"student"}).lean();
});


//7.5 Import student profile dataset. Application
router.post('/import_student_profile_dataset_Application', async function(req, res, next) {
    csv().fromFile(ApplicationsUrl).then(async function(CSjson){ 
        CSjson.forEach(async function(application) {
            let applicationUserid = await application.userid;
            let applicationCollege = await application.college;
            let FileApplication = await Applications.findOne({userid:applicationUserid, college:applicationCollege}).lean();
            if (FileApplication == null){
                const newApplication = new Applications({
                    userid: application.userid,
                    college: application.college,
                    status: application.status,
                });
                await newApplication.save();
            }else{
                await Applications.update({userid:applicationUserid, college:applicationCollege},{status: application.status})
            }
            
        });
    });
});  

//7.5 Import student profile dataset. Student
router.post('/import_student_profile_dataset_Student', async function(req, res, next) {
    csv().fromFile(StudentsUrl).then(async function(CSjson){ 
        CSjson.forEach(async function(student) {
            let Filestudent = await Student.findOne({userid:student.userid}).lean();
            if (Filestudent == null){
                const newStudent = new Student({
                    userid: student.userid,
                    username: student.userid,
                    password: student.password,
                    residence_state: student.residence_state,
                    high_school_name: student.high_school_name,
                    high_school_city : student.high_school_city,
                    high_school_state : student.high_school_state,
                    GPA: student.GPA,
                    college_class: student.college_class,
                    major_1: student.major_1 ,
                    major_2: student.major_2,
                    SAT_math: student.SAT_math,
                    SAT_EBRW: student.SAT_EBRW,
                    ACT_English: student.ACT_English,
                    ACT_math: student.ACT_math,
                    ACT_reading: student.ACT_reading,
                    ACT_science: student.ACT_science,
                    ACT_composite: student.ACT_composite,
                    SAT_literature: student.SAT_literature,
                    SAT_US_hist: student.SAT_US_hist,
                    SAT_world_hist: student.SAT_world_hist,
                    SAT_math_I: student.SAT_math_I,
                    SAT_math_II: student.SAT_math_II,
                    SAT_eco_bio: student.SAT_eco_bio,
                    SAT_mol_bio: student.SAT_mol_bio,
                    SAT_chemistry: student.SAT_chemistry,
                    SAT_physics: student.SAT_physics,
                    num_AP_passed: student.num_AP_passed,
                    accountType: "student"
                });
                await newStudent.save();
            }else{
                await Student.updateOne({userid:student.userid},
                    {   username: student.userid,
                        password: student.password,
                        residence_state: student.residence_state,
                        high_school_name: student.high_school_name,
                        high_school_city : student.high_school_city,
                        high_school_state : student.high_school_state,
                        GPA: student.GPA,
                        college_class: student.college_class,
                        major_1: student.major_1 ,
                        major_2: student.major_2,
                        SAT_math: student.SAT_math,
                        SAT_EBRW: student.SAT_EBRW,
                        ACT_English: student.ACT_English,
                        ACT_math: student.ACT_math,
                        ACT_reading: student.ACT_reading,
                        ACT_science: student.ACT_science,
                        ACT_composite: student.ACT_composite,
                        SAT_literature: student.SAT_literature,
                        SAT_US_hist: student.SAT_US_hist,
                        SAT_world_hist: student.SAT_world_hist,
                        SAT_math_I: student.SAT_math_I,
                        SAT_math_II: student.SAT_math_II,
                        SAT_eco_bio: student.SAT_eco_bio,
                        SAT_mol_bio: student.SAT_mol_bio,
                        SAT_chemistry: student.SAT_chemistry,
                        SAT_physics: student.SAT_physics,
                        num_AP_passed: student.num_AP_passed,
                        accountType: "student"
                })
            }      
        });
    });
});

//7.6 Review Questionable
// router.post('/getQuestionable', async function(req, res, next) {
//     let applications = await Student.find({status: "accepted"}).lean();
//     const originData = [];
//     applications.map((app, index)=>{
//         originData.push({
//             key:  index,
//             college: app.college,
//             status: app.status,
//             questionable: "Need to compute",
//         })
//     });
    
// });

//helpers

async function updateCollege_from_Scorecard(cname, college) {
    await College.updateOne({name: cname}, 
        {   
            admission_rate: college.ADM_RATE!="NULL"?college.ADM_RATE:"NULL",
            size: (college.UG!="NULL"?college.UG:(college.UGDS!="NULL"?college.UGDS:"NULL")),
            city: college.CITY,
            state: college.STABBR
    });
}

module.exports = router;
