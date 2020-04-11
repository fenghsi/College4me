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
const actCollegeDataUrl = 'https://www.collegedata.com/';


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
                $set: {ranking:college.rank_order }
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
            else if (cname == "Franklin and Marshall College"){
                updateCollege_from_Scorecard("Franklin & Marshall College", college);
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
            else if(cname=="Indiana University, Bloomington"){
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
                            state: college.STABBR,
                            avg_SAT: college.SAT_AVG!="NULL"?college.SAT_AVG:-1,
                            avg_ACT: college.ACTCMMID!="NULL"?college.ACTCMMID:-1,
                            control: college.CONTROL!="NULL"?college.CONTROL:"NULL",
                            debt: college.GRAD_DEBT_MDN!="NULL"?college.GRAD_DEBT_MDN:"NULL",
                    });
                }
            }
        });
   })
});
//7.3 Scrape collegedata.com

router.post('/scrape_college_data', async function(req, res, next) {
    const fileStr = fs.createReadStream(collegeTxtUrl);
    const rl = readline.createInterface({
        input: fileStr,
        crlfDelay: Infinity
    });
    for await (const col of rl) {
        let extension = col.replace(/[\,\&\s]+/g, '-').replace(/The-/,'').replace(/SUNY/, 'State-University-of-New-York');
        
        console.log(extension);
        if (col == 'The College of St Scholastica') {
            extension = extension.replace(/The-/, '');
            console.log(extension);
        }
        const colDataUrl = actCollegeDataUrl + 'College/' + extension;
        await scrapeEachCollegeData(colDataUrl, col);
    }
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
router.post('/getQuestionable', async function(req, res, next) {
    let students = await Student.find({}).lean();
    let result = [];
    const mapping =students.map(async (student, index)=>{
        let applications = await Applications.find({userid:student.userid, status: "accepted"}).lean();
        const originData = [];
        const mapping2 =applications.map(async (app, index)=>{
            let college = await College.findOne({name:app.college}).lean();
            if(compute_Questionable(college,student)==="Yes" && app.questionable!="No"){
                originData.push({
                    key:  index,
                    college: app.college,
                    status: app.status,
                    questionable: "Yes"
                })
            }
        });
        await Promise.all(mapping2);
        if(originData.length!=0){
            result.push({
                key: result.length,
                name: student.username,
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
                application : originData
            });
        }
    });
    await Promise.all(mapping);
    //console.log(result);
    return res.json({
        result :result
    });
});


router.get('/questionable/:id', async function(req, res, next) {
    let applications = await Applications.find({userid:req.params.id, status: "accepted"}).lean();
    let student = await Student.findOne({userid:req.params.id }).lean();
    const originData = [];
    const mapping =applications.map(async (app, index)=>{
        let college = await College.findOne({name:app.college}).lean();
        if(compute_Questionable(college,student)==="Yes" && app.questionable!="No"){
            originData.push({
                key:  index,
                college: app.college,
                status: app.status,
                questionable: "Yes"
            })
        }
    });
    await Promise.all(mapping);

    return res.json({
        applications: originData,
        student:student
    });
});

router.post('/unmarkQuestionable',async function(req, res, next) {
    await Applications.updateOne({userid:req.body.userid,college:req.body.college }, 
        {   
            questionable : "No"
        });
    let applications = await Applications.find({userid: req.body.userid}).lean();
    let student = await Student.findOne({userid:req.body.userid }).lean();
    const originData = [];
    const mapping =applications.map(async (app, index)=>{
        let college = await College.findOne({name:app.college}).lean();
        if(compute_Questionable(college,student)==="Yes" && app.questionable!="No"){
            originData.push({
                key:  index,
                college: app.college,
                status: app.status,
                questionable: "Yes"
            })
        }
    });
    await Promise.all(mapping);
    return res.json({
        applications: originData
    });
});

//helpers

async function updateCollege_from_Scorecard(cname, college) {
    await College.updateOne({name: cname}, 
        {   
            admission_rate: college.ADM_RATE!="NULL"?college.ADM_RATE:"NULL",
            size: (college.UG!="NULL"?college.UG:(college.UGDS!="NULL"?college.UGDS:"NULL")),
            city: college.CITY,
            state: college.STABBR,
            avg_SAT: college.SAT_AVG!="NULL"?college.SAT_AVG:-1,
            avg_ACT: college.ACTCMMID!="NULL"?college.ACTCMMID:-1,
    });
}

async function scrapeEachCollegeData(url, cname) {
    // This function scrape one college info from CollegeData.com
    const collegeData = await axios.get(url);
    const html = collegeData.data;
    const contents = cheerio.load(html);

    await contents('#profile-overview').find('.dl-split-sm').each(async function(){
        let lis = await contents(this).html(); //whole html
        let items = lis.split('\n');
        let caseIdent = -1;
        for(let e of items){
            let noSpaceElem = e.trim();
            if (caseIdent == -1) {
                if (noSpaceElem == '<dt>Cost of Attendance</dt>') {    
                    caseIdent = 0;
                } else if (noSpaceElem == '<dt>Students Graduating Within 4 Years</dt>') {
                    caseIdent = 1;
                } else if (noSpaceElem == '<dt>SAT Math</dt>') {
                    caseIdent = 2;
                } else if (noSpaceElem == '<dt>SAT EBRW</dt>') {
                    caseIdent = 3;
                } else if (noSpaceElem == '<dt>ACT Composite</dt>') {
                    caseIdent = 4;
                }
            }
            else if (caseIdent == 0) { //cost of attendance
                var list = noSpaceElem.split('<br>');
                for (var i = 0; i < list.length; i ++) {
                    var cost = list[i].match(/(\d+\,)?\d+/);
                    if (!(cost === null)) {
                        console.log("cost: " + cost[0]);
                        await College.updateOne(
                            {name:cname},
                            { $push: {cost_of_attendance: cost[0]}}
                        )
                    }
                }
                caseIdent = -1;
            }
            else if (caseIdent == 1) { //completion rate
                var comRate = noSpaceElem.match(/\d+(\.\d+)?%/g);
                if (!(comRate === null)) {
                    console.log('complRate: ' + comRate[0]);
                    await College.updateOne(
                        {name:cname},
                        { $set: {completion_rate: comRate[0]}}
                    )
                } else {
                    var trimmed = noSpaceElem.replace(/<dd>*/, '').replace(/<\/dd>/, '');
                    console.log('complRate: ' + trimmed)
                    await College.updateOne(
                        {name:cname},
                        { $set: {completion_rate: trimmed}}
                    )
                }
                caseIdent = -1;
            }
            else if (caseIdent == 2) { //SAT Math
                if (noSpaceElem != '<dd>' && noSpaceElem != '</dd>') {
                    var range = noSpaceElem.match(/\d+-\d+/);
                    if (!(range === null)) {
                        console.log('SAT_Math: ' + range[0]);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_math: range[0]}}
                        )
                    } else {
                        console.log('SAT_Math: ' + noSpaceElem);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_math: noSpaceElem}}
                        )
                    }
                }
                else if (noSpaceElem == '</dd>') {
                    caseIdent = -1;
                }
            }
            else if (caseIdent == 3) { //SAT EBRW
                if (noSpaceElem != '<dd>' && noSpaceElem != '</dd>') {
                    var rangeEBRW = noSpaceElem.match(/\d+-\d+/);
                    if (!(rangeEBRW === null)) {
                        console.log('SAT_EBRW: ' + rangeEBRW[0]);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_EBRW: rangeEBRW[0]}}
                        )
                    } else {
                        console.log('SAT_EBRW: ' + noSpaceElem);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_EBRW: noSpaceElem}}
                        )
                    }
                }
                else if (noSpaceElem == '</dd>') {
                    caseIdent = -1;
                }
            }
            else if (caseIdent == 4) { //ACT Comp
                var listACT = noSpaceElem.split('<br>');
                var rangeACT = ''
                if (listACT.length == 1) {
                    rangeACT = listACT[0].match(/\d+-\d+/);
                } else { //two elem
                    rangeACT = listACT[1].match(/\d+-\d+/);
                }
                if (!(rangeACT === null)) {
                    console.log('ACT_Comp: ' + rangeACT[0]);
                    await College.updateOne(
                        {name:cname},
                        { $set: {range_avg_ACT: rangeACT[0]}}
                    )
                }
                caseIdent = -1;
            }
        };
    });
    const majs = await contents('#profile-academics').find('.col-sm-6').each(async function(){
        let majors = await contents(this).find('.list--nice').text().split('\n');
        for(let e of majors){
            let major = e.trim();
            if (!(major.localeCompare('') == 0)) {
                await College.updateOne(
                    {name:cname},
                    { $push: {majors: major}}
                )
            }
        };
    });
}



function compute_Questionable(college, student) {
    
    let collegeAvgSAT = convert_to_percentile(college.avg_SAT,"SAT");
    let collegeAvgAct = convert_to_percentile(college.avg_ACT,"ACT");
    let studentSAT = convert_to_percentile((student.SAT_math!=null&student.SAT_EBRW!=null)? (student.SAT_EBRW+student.SAT_math):null, "SAT");
    let studentACT = convert_to_percentile(student.ACT_composite!=null?student.ACT_composite:null,"ACT");
    
    if(studentSAT!=null & studentACT!=null){
        return (studentSAT>studentACT?(collegeAvgSAT-10>studentSAT):(collegeAvgAct-10>studentACT))?"Yes":"No";
    }
    else if(studentSAT!=null){
        return (studentSAT<collegeAvgSAT-10)?"Yes":"No";
    }
    else if(studentACT!=null){
        return (studentACT<collegeAvgAct-10)?"Yes":"No";
    }
    else{
        return null;
    }
}

function convert_to_percentile(score, type){
    if(score==null){
        return null;
    }
    if(type =="ACT"){
       return score/36*100;
    }
    else if(type =="SAT"){
       return score/1600*100;
    }
    else if(type =="GPA"){
       return score/4*100;
    }
}  

module.exports = router;
