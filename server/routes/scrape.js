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
const StudentsUrl = 'c4me-10-student.csv';
const ApplicationsUrl = 'application-test.csv';
const actCollegeDataUrl = 'https://www.collegedata.com/';
const nicheURL = 'http://allv22.all.cs.stonybrook.edu/~stoller/cse416/niche/';
const HighSchool = require('../models/highshools');


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
//Yuxin
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
//Mengdong
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
        const colDataUrl = actCollegeDataUrl + 'college/' + extension;
        const majUrl = colDataUrl + '/?tab=profile-academics-tab';
        console.log(majUrl)
        try {
            await Promise.all([scrapeEachCollegeData(colDataUrl, col), scrapeMajors(majUrl, col)]);
        }
        catch (err) {
            return res.json({
                status: "err",
            });
        }
    }
});

//helper functions for 7.3
async function scrapeMajors(majUrl, cname) {
    const majorsData = await axios.get(majUrl);
    const majHtml = majorsData.data
    const contents2 = cheerio.load(majHtml);
    await contents2('#profile-tabContent').find('.row').first().each(async function(){ //.find('.hr--tight.hr--narrow.hr--dark').find('.row')
        let html = '';
        try {
            let tryhtml = await contents2(this).html(); //whole html
            html = tryhtml;
        }
        catch(err) {
            next(err);
        }
        //console.log(cname + ': ' + html);
        // let html = await contents2(this).html(); //whole html
        let lines = html.split('\n');
        for(let e of lines){
            let noSpaceElem = e.trim();
            var trimmed = noSpaceElem.replace(/<li>*/, '').replace(/<\/li>/, '');
            if (trimmed.substring(0, 1) !== '<') {
                console.log(trimmed);
                if (!(trimmed.localeCompare('') == 0)) {
                    await College.updateOne(
                        {name:cname},
                        { $push: {majors: trimmed}}
                    )
                }
            }
        }
    });
}

async function scrapeEachCollegeData(url, cname) {
    // This function scrape one college info from CollegeData.com
    const collegeData = await axios.get(url);
    const html = collegeData.data;
    const contents = cheerio.load(html);
    //console.log("contents:\n" + contents)

    await contents('#profile-overview').find('.dl-split-sm').each(async function(){
        let lis = await contents(this).html(); //whole html
        let items = lis.split('\n');
        let caseIdent = -1;
        for(let e of items){
            let noSpaceElem = e.trim();
            //console.log(noSpaceElem)
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
                        //console.log("cost: " + cost[0]);
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
                    //console.log('complRate: ' + comRate[0]);
                    await College.updateOne(
                        {name:cname},
                        { $set: {completion_rate: comRate[0]}}
                    )
                } else {
                    var trimmed = noSpaceElem.replace(/<dd>*/, '').replace(/<\/dd>/, '');
                    //console.log('complRate: ' + trimmed)
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
                        //console.log('SAT_Math: ' + range[0]);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_math: range[0]}}
                        )
                    } else {
                        //console.log('SAT_Math: ' + noSpaceElem);
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
                        //console.log('SAT_EBRW: ' + rangeEBRW[0]);
                        await College.updateOne(
                            {name:cname},
                            { $set: {range_avg_SAT_EBRW: rangeEBRW[0]}}
                        )
                    } else {
                        //console.log('SAT_EBRW: ' + noSpaceElem);
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
                    //console.log('ACT_Comp: ' + rangeACT[0]);
                    await College.updateOne(
                        {name:cname},
                        { $set: {range_avg_ACT: rangeACT[0]}}
                    )
                }
                caseIdent = -1;
            }
        };
    });
}


//7.4 Delete all student profiles
router.post('/delete_all_student_profiles', async function(req, res, next) {
    await Student.deleteMany({accountType:"student"}).lean();
});

// Mengdong
//7.5 Import student profile dataset. Application
router.post('/import_student_profile_dataset_Application', async function(req, res, next) {
    csv().fromFile(ApplicationsUrl).then(async function(CSjson){ 
        CSjson.forEach(async function(application) {
            let applicationUserid = await application.userid;
            let applicationCollege = await application.college;
            let FileApplication = await Applications.findOne({userid:applicationUserid, college:applicationCollege}).lean();
            if (FileApplication == null){
                let student = await Student.findOne({userid:applicationUserid}).lean();
                let college = await College.findOne({name:applicationCollege }).lean();
                console.log(college);
                console.log(student);
                
                if(student && college){
                    const newApplication = new Applications({
                        userid: application.userid,
                        college: application.college,
                        status: application.status,
                    });
                    await newApplication.save();
                }
            }else{
                await Applications.update({userid:applicationUserid, college:applicationCollege},{status: application.status})
            }
            
        });
    });
});  

//7.5 Import student profile dataset. Student       // Add scrape_ high school and compute hs score
router.post('/import_student_profile_dataset_Student', async function (req, res, next) {
    csv().fromFile(StudentsUrl).then(async function (CSjson) {
        CSjson.forEach(async function (student) {
            let Filestudent = await Student.findOne({ userid: student.userid }).lean();
            if (Filestudent == null) {
                const newStudent = new Student({
                    userid: student.userid,
                    username: student.userid,
                    password: student.password,
                    residence_state: student.residence_state,
                    high_school_name: student.high_school_name,
                    high_school_city: student.high_school_city,
                    high_school_state: student.high_school_state,
                    GPA: student.GPA,
                    college_class: student.college_class,
                    major_1: student.major_1,
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
            } else {
                await Student.updateOne({ userid: student.userid },
                    {
                        username: student.userid,
                        password: student.password,
                        residence_state: student.residence_state,
                        high_school_name: student.high_school_name,
                        high_school_city: student.high_school_city,
                        high_school_state: student.high_school_state,
                        GPA: student.GPA,
                        college_class: student.college_class,
                        major_1: student.major_1,
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
//mark
//7.6 Review Questionable
router.post('/getQuestionable', async function(req, res, next) {
    let students = await Student.find({}).lean();
    let result = [];// for each student with applications
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

//6.5 Scrape High School Info from Niche.com (Find Similar High School) -- yuxin
router.post('/scrape_hs_niche_info', async function(req, res, next) {
    //for each NEW high school (name, city, state) entry, scrape niche.com information
    let hs_name = req.body.high_school_name;
    let hs_city = req.body.high_school_city;
    let hs_state = req.body.high_school_state;

    if(hs_name == undefined || hs_name == "" || hs_name == null || hs_city == undefined || hs_city == "" || hs_city == null|| hs_state == undefined || hs_state == ""|| hs_state == null){
        return res.json({
            status: "not found",
        });
    }
    let school_name = hs_name.replace(/\'/g, "").replace(/\.?\s+/g, '-').replace("\.", "").toLowerCase();
    let school_city = hs_city.replace(/\s+/g, '-').toLowerCase();
    let school_state = hs_state.toLowerCase();

    let url = nicheURL + school_name + "-" + school_city + "-" + school_state + "/";

    let scrape_school = await HighSchool.findOne({"name":hs_name.toLowerCase(), "city":hs_city.toLowerCase(), "state":hs_state.toLowerCase()});
    // If the high school is already known to the system, no need to scrape information again
    if(scrape_school != null){
        return res.json({
            status: "existed",
        });;
    }
    // const niche = await axios.get(url);
    let academic_url = url + "academics/";
    let niche_academic = null;
    let niche = null;
    
    try{
        niche = await axios.get(url);
        niche_academic = await axios.get(academic_url);
        // niche = await axios.get(url,{
        //     headers: {
        //          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'
        //        }
        //     });
        // niche_academic = await axios.get(academic_url,{
        //     headers: {
        //          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'
        //        }
        //     });
    }
    catch(err){
        return res.json({
                    status: "err",
                });
    }

    scrape_each_hs_info(niche, niche_academic, hs_name.toLowerCase(), hs_city.toLowerCase(), hs_state.toLowerCase());
    return res.json({
        status: "ok",
    });


});



//Helper - scraping Niche.com Information for a specific high school with given name, city, and state
async function scrape_each_hs_info(niche, niche_academic, hs_name, hs_city, hs_state) {
    
    const html = niche.data;
    const contents = cheerio.load(html);

    const academic_html = niche_academic.data;
    const acad_contents = cheerio.load(academic_html);

    // if(contents("ordered__list__bucket").text() == "")

    // Scrape the Niche Rating information
    let rating = contents("li.ordered__list__bucket__item");
    let rate_len = rating.length;
    let rate_map = {};

    for (let i = 0; i < rate_len; i++){
        let rating_label = contents("li.ordered__list__bucket__item div.profile-grade__label").eq(i).text();
        let rating_grade = contents("li.ordered__list__bucket__item div.niche__grade").eq(i).text();
        rate_map[rating_label] = rating_grade;
    }

    // Scrape the detail address, website address, and phone number
    let addr = contents("address.profile__address--compact").text() == "" ? "Unavailable" : contents("address.profile__address--compact").text();
    // Adding comma between street and city
    addr = addr.replace(/([^A-Z\s\-])([A-Z])/g, '$1, $2');

    let website = contents("a.profile__website__link").text() == "" ? "Unavailable" : contents("a.profile__website__link").text();
    let phone = contents("div.fact-with-icon__content").eq(1).text();
    
    // Scrape the school overview description
    let overview = contents("div.blank__bucket span.bare-value").text();

//    console.log(acad_contents("ul.popular-entities-list li.popular-entities-list-item").eq(1).text());
    
    // Scrape graduation rate, AP exams
    let grade_map = {}
    let grade_list = acad_contents("div.blank__bucket div.scalar");
    let grade_len = grade_list.length;
    for(let i = 0; i < grade_len; i++){
        grade_label = acad_contents("div.blank__bucket div.scalar div.scalar__label span").eq(i).text();
        grade_score = acad_contents("div.blank__bucket div.scalar div.scalar__value").eq(i).text();
        if(grade_label == "Average SAT" || grade_label == "Average ACT"){
            continue;
        }
        grade_map[grade_label] = grade_score;
        
    }

    // Scrape list of popular colleges students attend
    let popular_schools = acad_contents("h6.popular-entity__name a.popular-entity-link");
    let pl = popular_schools.length;
    let college_list = [];
    for(let i = 0; i < pl; i++){
        college_list.push(popular_schools.eq(i).text());
    }

    // Getting the overall score from Niche.com
    var overall_grade = contents(".niche__grade").first().text();
    overall_grade = convert_overall_grade_percent(overall_grade);
    var standard_test_score = null;

    // Getting Standardized Tests (SAT and ACT) from Niche.com
    var list_of_grades = contents("div.scalar--three");
    var length_of_grades = list_of_grades.length;
    var sat_descrip = null;
    var act_descrip = null;
    for(let i = 0; i < length_of_grades; i++){
        
        if(list_of_grades.eq(i).find("div.scalar__label span").text() == "Average SAT"){
            sat_descrip = list_of_grades.eq(i);
        }
        if(list_of_grades.eq(i).find("div.scalar__label span").text() == "Average ACT"){
            act_descrip = list_of_grades.eq(i);
        }
    }

    var sat_score = parseInt(sat_descrip.find("div.scalar__value").clone().children().remove().end().text(), 10);
    var act_score = parseInt(act_descrip.find("div.scalar__value").clone().children().remove().end().text(), 10);
    let mean_sat = isNaN(sat_score)? -1 : sat_score;
    let mean_act = isNaN(act_score)? -1 : act_score;

    // If both average sat and average act is given, take the one with higher responses
    if(!isNaN(sat_score) && !isNaN(act_score)){
        // Record the number of responses of SAT and ACT
        var num_SAT = parseInt(sat_descrip.find("div.scalar__value div.scalar-response-count").text().replace(/\,?/g, ""), 10);
        var num_ACT = parseInt(act_descrip.find("div.scalar__value div.scalar-response-count").text().replace(/\,?/g, ""), 10);

        // Record the SAT Average and ACT Average in percentile
        sat_score = convert_to_percentile(sat_score, "SAT");
        act_score = convert_to_percentile(act_score, "ACT");

        // Use the score that has more number of responses
        standard_test_score = num_SAT > num_ACT ? sat_score : act_score;
    }
    // If both information are unavailable, use the national sat average (1000/1600 = 62.5%)
    else if(isNaN(sat_score) && isNaN(act_score)){
        standard_test_score = 62.5;//?? put letter
    }
    else if(isNaN(sat_score)){
        act_score = parseInt(act_descrip.find("div.scalar__value").clone().children().remove().end().text(), 10);
        standard_test_score = convert_to_percentile(act_score, "ACT");
        
    }
    else if(isNaN(act_score)){
        sat_score = parseInt(sat_descrip.find("div.scalar__value").clone().children().remove().end().text(), 10);
        standard_test_score = convert_to_percentile(sat_score, "SAT");
        
    }


    await HighSchool.create(
        {
            name: hs_name.toLowerCase(),
            city: hs_city.toLowerCase(),
            state: hs_state.toLowerCase(),
            niche_grade: overall_grade,
            niche_test: standard_test_score,
            detail_addr: addr,
            web_url: website,
            tel: phone,
            avg_sat: mean_sat,
            avg_act: mean_act,
            description: overview,
            stats: grade_map,
            ratings: rate_map,
            popular_colleges: college_list
        }
    );

}

// Find Similar High School - Need Change!!!
router.post('/find_similar_high_school', async function(req, res, next) {

    let hs_info = req.body.keyword;
    hs_info = hs_info.split(", ")
    let hs_name = hs_info[0].toLowerCase().trim();
    let hs_city = req.body.hsCity.toLowerCase().trim();
    let hs_state = req.body.hsState.toLowerCase().trim();
    // let hs_name = hs_info[0]==undefined?'':hs_info[0].toLowerCase();
    // let hs_city = hs_info[1].toLowerCase()==undefined?hs_info[1].toLowerCase():req.body.hsCity.toLowerCase();
    // let hs_state = hs_info[2].toLowerCase()==undefined?hs_info[2].toLowerCase():req.body.hsState.toLowerCase();
    // console.log(hs_name);
    // console.log(hs_city);
    // console.log(hs_state);

// async function find_similar_high_school(hs_name, hs_city, hs_state){
    let searched_school = await HighSchool.findOne({"name":hs_name, "city":hs_city, "state":hs_state});
    if(searched_school == null){
        console.log("????")
        return res.json({
            status: "non-exist",
        });
    }

    let searched_hs_score = searched_school.hs_score;
    
    console.log("Finding Similar High School for ", searched_school.name, "with hs_score =", searched_hs_score, "......");
    let lower_bound = searched_hs_score - 3;
    let upper_bound = searched_hs_score + 3;
    // List of High School with hs_score 3 points away from searched_hs_score, excluding the searched_school.
    let similar_hs_list = await HighSchool.find({hs_score: {$lte:upper_bound, $gte:lower_bound}, name:{$ne:hs_name}});
    
    const originData = [];
    // Need Change - Display the result to the front end
    for(hs of similar_hs_list){
        console.log(hs.name, "-", hs.hs_score);
    }
    

    const mapping =similar_hs_list.map(async (college, index)=>{
        originData.push({
            key:index,
            name:college.name, 
            city: college.city,
            state: college.state,
            hs_score: (100 -Math.abs(college.hs_score-searched_school.hs_score)).toFixed(2),//for similarity score
            niche_grade: college.niche_grade,
            niche_test: college.niche_test,
            detail_addr: college.detail_addr,
            web_url:college.web_url,
            tel: college.tel,
            avg_sat: college.avg_sat,
            avg_act: college.avg_act,
            description: college.description,
            stats: JSON.stringify(college.stats).split('"').join('').replace('{','').replace('}','').split(',').join(",\t\n"),
            ratings: JSON.stringify(college.ratings).split('"').join('').replace('{','').replace('}','').split(',').join(",\t\n"),
            popular_colleges: college.popular_colleges.toString(),
        })
    });

    await Promise.all(mapping);


    return res.json({
        highschools: originData
    });
    //let similar_hs_list = await HighSchool.find({hs_score: {$lte: searched_hs_score+5}, hs_score: {$gte: searched_hs_score-5}})
});


// This function computes the high school score and stores the result into the database
router.post('/compute_hs_score', async function(req, res, next) {
    let hs_name = req.body.high_school_name==undefined?undefined:req.body.high_school_name.toLowerCase();
    let hs_city = req.body.high_school_city==undefined?undefined:req.body.high_school_city.toLowerCase();;
    let hs_state = req.body.high_school_state==undefined?undefined:req.body.high_school_state.toLowerCase();;

    console.log(hs_name);
    console.log(hs_city);
    console.log(hs_state);

    // Get the high school by hs_id and get the niche_grade and niche_test for computation
    let highschool = await HighSchool.findOne({"name":hs_name, "city":hs_city, "state":hs_state});
    if(highschool == null){
        console.log("dcdadd???");
        return res.json({
            status: "err",
        });
    }
    let niche_grade = highschool.niche_grade;
    let niche_test = highschool.niche_test;

    // Get c4me test average for this high school's students
    let c4me_test = 0;
    let c4me_response = 0;
    let hs_students = await Student.find({"high_school_name":hs_name, "high_school_city":hs_city, "high_school_state":hs_state});
    
    for(i of hs_students){
        let studentSAT = convert_to_percentile((i.SAT_math!=null&i.SAT_EBRW!=null)? (i.SAT_EBRW+i.SAT_math):null, "SAT");
        let studentACT = convert_to_percentile(i.ACT_composite!=null?i.ACT_composite:null,"ACT");
        let student_test = 0;
        if(studentSAT!=null & studentACT!=null){
            student_test = studentSAT > studentACT ? studentSAT : studentACT;
            c4me_response += 1;
            c4me_test += student_test;

        }
        else if(studentSAT!=null){
            student_test = studentSAT;
            c4me_response += 1;
            c4me_test += student_test;
        }
        else if(studentACT!=null){
            student_test = studentACT;
            c4me_response += 1;
            c4me_test += student_test;
        }
     }
    // If the number of SAT/ACT responses for this high school is less than 15, use Niche's test data
    if (c4me_response < 15){
        c4me_test = niche_test;
    }
    else{
        c4me_test = c4me_test / c4me_response;
    }

    let avg_college_rank = 0;
    let num_student = 0;
    // Get the average college ranking of the high schools students accepted college.
    // If the student is admitted to multiple college, take the highest ranking.
    // If the student did not get accepted to any college (missing info), default = 1000000 (10 pts for ranking)
    for(s of hs_students){
       let highest_rank = 1000000;
       let application = await Applications.find({"userid":s.username, "status":"accepted"});
       for (a of application) {
            let college = await College.findOne({ "name": a.college });
            if (college != null) {
                ranking = parseInt(college.ranking);
                // Higher ranking = Lower number
                if (ranking < highest_rank) {
                    highest_rank = ranking;
                }
            }
        }
       avg_college_rank += convert_ranking_percent(highest_rank);
       num_student += 1;
   }
   // No student attends this high school - Won't happen since the school won't be scraped (Just for ending gracefully while testing)
   if(num_student == 0){
       //Default point = 10
       avg_college_rank = 10;
   }
   else{
       avg_college_rank = avg_college_rank / num_student;
   }

   // After getting all necessary scores, compute the final score and store into the High School Table
   let final_score = niche_grade * 0.4 + niche_test * 0.25 + c4me_test * 0.25 + avg_college_rank * 0.1;

   await HighSchool.updateOne({"name":hs_name, "city":hs_city, "state":hs_state}, 
    {   
        $set: {hs_score:final_score}
    });

    return res.json({
        status: "ok",
    });


});


// Added
router.post('/compute_imported_hs_score', async function (req, res, next) {
    csv().fromFile(StudentsUrl).then(async function (CSjson) {
        CSjson.forEach(async function (student) {
            let Filestudent = await Student.findOne({ userid: student.userid }).lean();
            if (Filestudent != null) {
                let hs_name = Filestudent.high_school_name;
                let hs_city = Filestudent.high_school_city;
                let hs_state = Filestudent.high_school_state;
                // Get the high school by hs_id and get the niche_grade and niche_test for computation
                let highschool = null;
                if (hs_name != undefined && hs_name != "" && hs_name != null && hs_city != undefined && hs_city != "" && hs_city != null && hs_state != undefined && hs_state != "" && hs_state != null) {
                    highschool = await HighSchool.findOne({ "name": Filestudent.high_school_name.toLowerCase(), "city": Filestudent.high_school_city.toLowerCase(), "state": Filestudent.high_school_state.toLowerCase() });
                }
                if (highschool != null) {
                    let niche_grade = highschool.niche_grade;
                    let niche_test = highschool.niche_test;
                    // Get c4me test average for this high school's students
                    let c4me_test = 0;
                    let c4me_response = 0;
                    let hs_students = await Student.find({ "high_school_name": hs_name, "high_school_city": hs_city, "high_school_state": hs_state });
                    for (i of hs_students) {
                        let studentSAT = convert_to_percentile((i.SAT_math != null & i.SAT_EBRW != null) ? (i.SAT_EBRW + i.SAT_math) : null, "SAT");
                        let studentACT = convert_to_percentile(i.ACT_composite != null ? i.ACT_composite : null, "ACT");
                        let student_test = 0;
                        if (studentSAT != null & studentACT != null) {
                            student_test = studentSAT > studentACT ? studentSAT : studentACT;
                            c4me_response += 1;
                            c4me_test += student_test;
                        }
                        else if (studentSAT != null) {
                            student_test = studentSAT;
                            c4me_response += 1;
                            c4me_test += student_test;
                        }
                        else if (studentACT != null) {
                            student_test = studentACT;
                            c4me_response += 1;
                            c4me_test += student_test;
                        }
                    }
                    // If the number of SAT/ACT responses for this high school is less than 15, use Niche's test data
                    if (c4me_response < 15) { c4me_test = niche_test; }
                    else { c4me_test = c4me_test / c4me_response; }
                    let avg_college_rank = 0;
                    let num_student = 0;
                    // Get the average college ranking of the high schools students accepted college.
                    // If the student is admitted to multiple college, take the highest ranking.
                    // If the student did not get accepted to any college (missing info), default = 1000000 (10 pts for ranking)
                    for (s of hs_students) {
                        let highest_rank = 1000000;
                        let application = await Applications.find({ "userid": s.username, "status": "accepted" });
                        for (a of application) {
                            let college = await College.findOne({ "name": a.college });
                            if (college != null) {
                                ranking = parseInt(college.ranking);
                                // Higher ranking = Lower number
                                if (ranking < highest_rank) {
                                    highest_rank = ranking;
                                }
                            }

                        }
                        avg_college_rank += convert_ranking_percent(highest_rank);
                        num_student += 1;
                    }
                    // No student attends this high school - Won't happen since the school won't be scraped (Just for ending gracefully while testing)
                    if (num_student == 0) {
                        //Default point = 10
                        avg_college_rank = 10;
                    }
                    else {
                        avg_college_rank = avg_college_rank / num_student;
                    }
                    // After getting all necessary scores, compute the final score and store into the High School Table
                    let final_score = niche_grade * 0.4 + niche_test * 0.25 + c4me_test * 0.25 + avg_college_rank * 0.1;
                    await HighSchool.updateOne({ "name": hs_name.toLowerCase(), "city": hs_city.toLowerCase(), "state": hs_state.toLowerCase() },
                        {
                            $set: { hs_score: final_score }
                        });
                }
            }
        });
    });
});


///2
router.post('/compute_imported_student_score', async function (req, res, next) {
    csv().fromFile(StudentsUrl).then(async function (CSjson) {
        CSjson.forEach(async function (student) {
            let Filestudent = await Student.findOne({ userid: student.userid }).lean();
            if (Filestudent != null) {
                let hs_name = Filestudent.high_school_name;
                let hs_city = Filestudent.high_school_city;
                let hs_state = Filestudent.high_school_state;
                // Default hs_score = 65 if the student did not enter a highschool in the profile, or the high school is not found on niche.
                let hs_score = 65;
                // If hs_name, city, or state information is not present, then no high school score is present in database.
                let no_hs_score = hs_name == undefined || hs_name == "" || hs_name == null || hs_city == undefined || hs_city == "" || hs_city == null || hs_state == undefined || hs_state == "" || hs_state == null;
                let highschool = null;
                if (!no_hs_score) {
                    highschool = await HighSchool.findOne({ name: hs_name, city: hs_city, state: hs_state });
                    // If the student's high school is found on niche.com, then hs_score is present.
                    if (highschool != null) {
                        hs_score = highschool.hs_score;
                    }
                }
                // If gpa is not found in profile, then student's GPA is by default (2.8/4,0) 70% (national core course average gpa). 
                // Else, convert student's GPA to a percentile
                let gpa = Filestudent.GPA == undefined ? 70 : convert_to_percentile(Filestudent.GPA, 'GPA');
                // If no standardized test score is available, default = 62.5% (1000/1600)
                let std_test = 62.5;
             
                let sat = (Filestudent.SAT_math != undefined && Filestudent.SAT_EBRW != undefined) ? Filestudent.SAT_math + Filestudent.SAT_EBRW : null;
                let act = Filestudent.ACT_composite != undefined ? Filestudent.ACT_composite : null;
                if (sat != null && act != null) { // If both SAT and ACT info are present, take the higher one
                    std_test = convert_to_percentile(sat, 'SAT') > convert_to_percentile(act, 'ACT') ? convert_to_percentile(sat, 'SAT') : convert_to_percentile(act, 'ACT');
                }
                else if (sat != null) {
                    std_test = convert_to_percentile(sat, 'SAT');
                }
                else if (act != null) {
                    std_test = convert_to_percentile(sat, 'ACT');
                }

                if(hs_score == undefined || hs_score == null || hs_score == ""){
                    hs_score = 65;
                }
                let quality_score = 0.45 * gpa + 0.45 * std_test + 0.10 * hs_score;
                await Student.updateOne({ userid: student.userid },{
                        $set: { hidden_score: quality_score }
                });
            }
        });
    });
});
//3
router.post('/scrape_imported_student_highschool', async function (req, res, next) {
    let all_students = await Student.find({accountType:"student"}).lean();
    
    const hs_list = [];
    const getHSMapping = all_students.map(async (student, index) => {
        let exists = hs_list.findIndex(x => x.name == student.high_school_name && x.city == student.high_school_city && x.state == student.high_school_state)
        if (exists == -1) {
            hs_list.push({
                name: student.high_school_name,
                city: student.high_school_city,
                state: student.high_school_state
            });
        }
    });
    await Promise.all(getHSMapping);
    
    const scrapeMapping = hs_list.map(async(hs, index) => {
        let hs_name = hs.name;
        let hs_city = hs.city;
        let hs_state = hs.state;
        let has_name = (hs_name != undefined && hs_name != "" && hs_name != null);
        let has_city = (hs_city != undefined && hs_city != "" && hs_city != null);
        let has_hs_state = (hs_state != undefined && hs_state != "" && hs_state != null);

        if (has_name && has_city && has_hs_state) {
            let school_name = hs_name.replace(/\'/g, "").replace(/\.?\s+/g, '-').replace("\.", "").toLowerCase();
            let school_city = hs_city.replace(/\s+/g, '-').toLowerCase();
            let school_state = hs_state.toLowerCase();

            let url = nicheURL + school_name + "-" + school_city + "-" + school_state + "/";
            let scrape_school = await HighSchool.findOne({ "name": hs_name.toLowerCase(), "city": hs_city.toLowerCase(), "state": hs_state.toLowerCase() });
            // If the high school is already known to the system, no need to scrape information again
            if (scrape_school == null) {
                // const niche = await axios.get(url);
                let academic_url = url + "academics/";
                let niche_academic = null;
                let niche = null;
                try {
                    niche = await axios.get(url);
                    niche_academic = await axios.get(academic_url);
                    scrape_each_hs_info(niche, niche_academic, hs_name, hs_city, hs_state);
                }
                catch (err) {
                    console.log("Unable to find high school", url);
                }
            }
        }
    });
    await Promise.all(scrapeMapping);
});



// Helper Functions for Converting Scores
function convert_ranking_percent(ranking){
    if(ranking <= 50){ return 100; }
    else if(ranking <= 100){ return 80; }
    else if(ranking <= 150){ return 60; }
    else if(ranking <= 200){ return 40; }
    else if(ranking <= 250){ return 20; }
    // Any ranking lower than 250 (including no ranking (1000000), receives 10 points by default)
    else{ return 10; }

}

function convert_overall_grade_percent(overall_grade){
    if(overall_grade == "A+"){ return 100; }
    else if(overall_grade == "A"){ return 96; }
    else if(overall_grade == "A-"){ return 92; }
    else if(overall_grade == "B+"){ return 89; }
    else if(overall_grade == "B"){ return 86; }
    else if(overall_grade == "B-"){ return 82; }
    else if(overall_grade == "C+"){ return 79; }
    else if(overall_grade == "C"){ return 76; }
    else if(overall_grade == "C-"){ return 72; }
    else if(overall_grade == "D+"){ return 69; }
    else if(overall_grade == "D"){ return 66; }
    else if(overall_grade == "D-"){ return 60; }
    else{ return 50; }
}


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




//6.2 compute questionable --Kyounga
function compute_Questionable(college, student) {
    if(college ==null){
        return null;
    }
    else{
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
