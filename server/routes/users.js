var express = require('express');
var router = express.Router();
const passport = require('passport');
const Student = require('../models/student');
const Applications = require('../models/applications');
const Colleges= require('../models/colleges');
const HighSchool = require('../models/highshools');

router.get('/user', async function(req, res, next) {
    const user = req.session.passport? await Student.findOne({userid: req.session.passport.user.userid}).lean() : null;
    return res.json({
        user: user
    });
});


router.post('/adduser', async function(req, res, next) {
  let student = await Student.findOne({userid: req.body.username}).lean();
  if(!student){
      //create account
      const newStudent = new Student({
            userid :req.body.username,
            username: req.body.username,
            password: req.body.password,
            accountType: "student"
      });
      newStudent.save();

      return res.json({
          status: "ok"
      });
  }
  return res.json({
      status: "err",
      msg:"Username was already taken"
  });
});

//login
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      if (err || !user){ 
          return res.json({
              status: "err",
              error: info.message
          });
      }
      req.logIn(user, function(err) {
          if(err)
              return res.status(500).json({
                  status: "err",
                  error: err
            });
          return res.json({
              status: "ok",
              username: req.user.username
          });
      });
  })(req, res, next);
});
//logout
router.post('/logout', function(req, res, next) {
    if(!req.session.passport.user) {
        return res.status(500).json({
            status: "error"
        });
    }
    req.session.destroy();
    return res.json({
        status: "ok"
    });
});

router.post('/getStudent',async function(req, res, next) {
    let student = await Student.findOne({userid: req.body.username}).lean();
    if(!student){
        return res.json({
            status: "err"
        });
    }
    else{
        return res.json({
            status: "ok",
            student: student
        });
    }
});

router.post('/editscoresubject',async function(req, res, next) {
    //update sat subject scores
    await Student.updateOne({userid:req.body.userid}, 
        {   
            SAT_literature : req.body.SAT_literature,
            SAT_US_hist : req.body.SAT_US_hist,
            SAT_world_hist : req.body.SAT_world_hist,
            SAT_math_I : req.body.SAT_math_I,
            SAT_math_II :req.body. SAT_math_II,
            SAT_eco_bio : req.body.SAT_eco_bio,
            SAT_mol_bio : req.body.SAT_mol_bio,
            SAT_chemistry : req.body.SAT_chemistry,
            SAT_physics : req.body.SAT_physics,
        });
    let student = await Student.findOne({userid: req.body.userid}).lean();
    return res.json({
        status: "ok",
        student: student
    });
    
});

router.post('/editscoreact',async function(req, res, next) {
    
    //update act scores
    await Student.updateOne({userid:req.body.userid}, 
        {   
            ACT_English : req.body.ACT_English,
            ACT_reading : req.body.ACT_reading,
            ACT_math : req.body.ACT_math,
            ACT_science : req.body.ACT_science,
            ACT_composite : req.body.ACT_composite,
        });
    let student = await Student.findOne({userid: req.body.userid}).lean();
    return res.json({
        status: "ok",
        student: student
    });
    
});

router.post('/editscoreschool',async function(req, res, next) {
    
    //update school scores
    await Student.updateOne({userid:req.body.userid}, 
        {   
            GPA : req.body.GPA,
            num_AP_passed : req.body.num_AP_passed,
        });
    let student = await Student.findOne({userid: req.body.userid}).lean();
    return res.json({
        status: "ok",
        student: student
    });
    
})

router.post('/editscoresat',async function(req, res, next) {
   
    await Student.updateOne({userid:req.body.userid}, 
        {   
            SAT_EBRW : req.body.SAT_EBRW,
            SAT_math : req.body.SAT_math,
        });
    let student = await Student.findOne({userid: req.body.userid}).lean();
    let applications = await Applications.find({userid: req.body.userid}).lean();
    //update application questionable since edit the score
    const mapping =applications.map(async (app, index)=>{
        await Applications.updateOne({userid: app.userid, college: app.college}, 
        {   
            questionable: null
        });
    });
    await Promise.all(mapping);

    return res.json({
        status: "ok",
        student: student
    });
    
    
});

router.post('/editbasicInfo',async function(req, res, next) {
    //update school info
    await Student.updateOne({userid:req.body.userid}, 
        {   username : req.body.username,
            residence_state: req.body.residence_state,
            high_school_name : req.body.high_school_name,
            high_school_city : req.body.high_school_city,
            high_school_state : req.body.high_school_state,
            high_school_state : req.body.high_school_state,
            college_class : req.body.college_class,
            major_1: req.body.major_1,
            major_2: req.body.major_2,
        });
    let student = await Student.findOne({userid: req.body.userid}).lean();
    return res.json({
        status: "ok",
        student: student
    });
    
});


router.post('/getApplications',async function(req, res, next) {
    let applications = await Applications.find({userid: req.body.username}).lean();
    const originData = [];
    const mapping =applications.map(async (app, index)=>{
        let college = await Colleges.findOne({name:app.college}).lean();
        let student = await Student.findOne({userid:req.body.username}).lean();
        let question = app.status=="accepted"?compute_Questionable(college,student):null;
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable:app.questionable? app.questionable:question
        })
    });
    await Promise.all(mapping);

    return res.json({
        status: "ok",
        applications: originData
    });
    
    
});

router.post('/updateApplication',async function(req, res, next) {
    await Applications.updateOne({userid:req.body.userid,college:req.body.college }, 
        {   
            college : req.body.newcollege, 
            status : req.body.newstatus,
            questionable : null
        });
    let applications = await Applications.find({userid: req.body.userid}).lean();
    const originData = [];
    const mapping =applications.map(async (app, index)=>{
        let college = await Colleges.findOne({name:app.college}).lean();
        let student = await Student.findOne({userid:req.body.userid}).lean();
        let question = app.status=="accepted"?compute_Questionable(college,student):null;
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable: app.questionable? app.questionable:question
        })
    });
    await Promise.all(mapping);
    return res.json({
        status: "ok",
        applications: originData
    });
});

router.post('/addApplication',async function(req, res, next) {
    let application = await Applications.findOne({userid:req.body.userid, college:req.body.college}).lean();
    if(!application){
        const newApplication = new Applications({
            userid: req.body.userid,
            college: req.body.college,
            status: req.body.status,
        });
        await newApplication.save();
        application = await Applications.find({userid:req.body.userid}).lean();
        let originData =[];
        const mapping =application.map(async (app, index)=>{
            let college = await Colleges.findOne({name:app.college}).lean();
            let student = await Student.findOne({userid:req.body.userid}).lean();
            let question = app.status=="accepted"?compute_Questionable(college,student):null;
            originData.push({
                key:  index,
                college: app.college,
                status: app.status,
                questionable:app.questionable? app.questionable:question
            })
        });
        await Promise.all(mapping);
        return res.json({
            status: "ok",
            applications: originData,
        });
    }
    else{
        return res.json({
            status: "err"
        });

    }
});

router.post('/deleteApplication',async function(req, res, next) {

    await Applications.deleteOne({userid:req.body.userid, college:req.body.college}, async function (err, result) {
        if(err|| result.deletedCount === 0){
            return res.json({
                status: "err"
            });
        }
    });
    let application = await Applications.find({userid:req.body.userid}).lean();
    const originData = [];
    const mapping =application.map(async (app, index)=>{
        let college = await Colleges.findOne({name:app.college}).lean();
        let student = await Student.findOne({userid:req.body.userid}).lean();
        let question = app.status=="accepted"?compute_Questionable(college,student):null;
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable:app.questionable? app.questionable:question
        })
    });
    await Promise.all(mapping);
    return res.json({
        applications: originData,
        status: "ok"
    });
});
//mark
//6.3 Search College
// router.post('/searchColleges',async function(req, res, next) {
//     // const properties = await Property.find({ price: { $gte:req.query.priceMin, $lte: req.query.priceMax } });
//     //const states_modif = req.body.states[1]==null?req.body.states[0]:req.body.states[0].push(req.body.states[1]);
//     let colleges = await Colleges.find({}).lean();
//     const originData = [];
//     //console.log(req.body.mode?"on":"off");
//     // console.log(states_modif[0]);
//     // console.log(states_modif[1]);
//     // // console.log(states_modif[2]);
//     // const states = req.body.states;
//     const mapping =colleges.map(async (college, index)=>{
//         //check conditions
//         let isMajors = req.body.majors.includes("ALL")?true:false;
//         const mapping2 =req.body.majors.map(async (major, index)=>{
//             if(college.majors!=undefined){
//                 const mapping3 = college.majors.map(async (dbmajor, i)=>{
//                     if(dbmajor.includes(major)){
//                         console.log(dbmajor);
//                         console.log(major);
//                         isMajors = true;
//                     }
//                 });
//                 await Promise.all(mapping3);
//             }
//         });
//         await Promise.all(mapping2);

//         const isStates =req.body.states.includes("ALL")? true :req.body.states.includes(college.state);
//         const mode =!req.body.mode;
//         const ranking =req.body.ranking[0]<=college.ranking & college.ranking<=req.body.ranking[1];
//         const admission_rate = (college.admission_rate==="Not reported"|college.admission_rate===undefined|college.admission_rate===null|college.admission_rate==='NULL')?mode:req.body.admission_rate[0]<=college.admission_rate & college.admission_rate<= req.body.admission_rate[1];
//         const completion_rate = (college.completion_rate.replace("%", "")==="Not reported"|college.completion_rate.replace("%", "")===undefined|college.completion_rate.replace("%", "")===null)?mode:req.body.completion_rate[0]<=college.completion_rate.replace("%", "") & college.completion_rate.replace("%", "")<= req.body.completion_rate[1];
//         const size = (college.size==="Not reported"|college.size===undefined|college.size===null)?mode:(req.body.size[0]<=college.size & college.size<= req.body.size[1]);
//         const sat_math = (college.range_avg_SAT_math==="Not reported"|college.range_avg_SAT_math===undefined|college.range_avg_SAT_math===null)? mode:((parseInt(college.range_avg_SAT_math.split("-")[0])+parseInt(college.range_avg_SAT_math.split("-")[1]))/2>req.body.sat_math[0] & (parseInt(college.range_avg_SAT_math.split("-")[0])+parseInt(college.range_avg_SAT_math.split("-")[1]))/2<req.body.sat_math[1]);
//         const sat_EBRW = (college.range_avg_SAT_EBRW==="Not reported"|college.range_avg_SAT_EBRW===undefined|college.range_avg_SAT_EBRW===null)? mode:((parseInt(college.range_avg_SAT_EBRW.split("-")[0])+parseInt(college.range_avg_SAT_EBRW.split("-")[1]))/2>req.body.sat_EBRW[0] & (parseInt(college.range_avg_SAT_EBRW.split("-")[0])+parseInt(college.range_avg_SAT_EBRW.split("-")[1]))/2<req.body.sat_EBRW[1]);
//         const act_Composite = (college.range_avg_ACT==="Not reported"|college.range_avg_ACT===undefined|college.range_avg_ACT===null)? mode:((parseInt(college.range_avg_ACT.split("-")[0])+parseInt(college.range_avg_ACT.split("-")[1]))/2>req.body.act_Composite[0] & (parseInt(college.range_avg_ACT.split("-")[0])+parseInt(college.range_avg_ACT.split("-")[1]))/2<req.body.act_Composite[1]);
//         const keyword = (req.body.keyword===''|req.body.keyword===null| req.body.keyword===undefined|req.body.keyword==='all')?true:(college.name.toLowerCase()).includes((req.body.keyword).toLowerCase());
//         const inoutstate = college.state===req.body.inoutstate? true:false;
//         const cost_of_attendance = (college.cost_of_attendance===undefined |college.cost_of_attendance===null )?(null):(inoutstate? college.cost_of_attendance[0]:(college.cost_of_attendance.length==2?college.cost_of_attendance[1]:college.cost_of_attendance[0])).replace(",", "");
//         const check_cost_of_attendance = cost_of_attendance==null?mode:(req.body.cost_of_attendance[0]<=cost_of_attendance & cost_of_attendance<= req.body.cost_of_attendance[1]);


//         // console.log(req.body.cost_of_attendance[1]);
//         if(ranking  &size &admission_rate&completion_rate&sat_EBRW &sat_math&act_Composite &keyword & check_cost_of_attendance & isStates&isMajors){
//             let rscore = null;
//             if(req.body.recommander){
//                 //6.4 Write ur Algorithm here
//                 console.log("Compute Recom");
//                 rscore =0;
//             }
//             else{
//                 console.log("Not Compute")
//             }

//             originData.push({
//                 key:index,
//                 name:college.name, 
//                 ranking: college.ranking,
//                 avg_SAT: college.avg_SAT,
//                 avg_ACT: college.avg_ACT,
//                 control: college.control==="1"?"Public":(college.control==="2"?"Private nonprofit":(college.control==="3"?"Private for-profit":"")),
//                 debt: college.debt,
//                 admission_rate:college.admission_rate,
//                 size: college.size,
//                 city: college.city,
//                 state: college.state=="Not reported"?'':college.state,
//                 completion_rate: college.completion_rate=="Not reported"?'':college.completion_rate,
//                 range_avg_SAT_math: college.range_avg_SAT_math=="Not reported"?'':college.range_avg_SAT_math,
//                 range_avg_SAT_EBRW: college.range_avg_SAT_EBRW=="Not reported"?'':college.range_avg_SAT_EBRW,
//                 range_avg_ACT: college.range_avg_ACT=="Not reported"?'':college.range_avg_ACT,
//                 majors:college.majors.toString(),  
//                 cost_of_attendance:cost_of_attendance,
//                 recommander:rscore
//             })
//         }
//     });
//     await Promise.all(mapping);
//     return res.json({
//         colleges: originData
//     });

// });
//yuixn
router.post('/searchColleges', async function (req, res, next) {
    // const properties = await Property.find({ price: { $gte:req.query.priceMin, $lte: req.query.priceMax } });
    //const states_modif = req.body.states[1]==null?req.body.states[0]:req.body.states[0].push(req.body.states[1]);
    let colleges = await Colleges.find({}).lean();
    const originData = [];
    let similar_students = [];
    //console.log(req.body.mode?"on":"off");
    // console.log(states_modif[0]);
    // console.log(states_modif[1]);
    // // console.log(states_modif[2]);
    // const states = req.body.states;
    let rscore = null;
    const mapping = colleges.map(async (college, index) => {
        //check conditions
        let isMajors = req.body.majors.includes("ALL") ? true : false;
        const mapping2 = req.body.majors.map(async (major, index) => {
            const mapping3 = college.majors.map(async (dbmajor, i) => {
                if (dbmajor.includes(major)) {
                    console.log(dbmajor);
                    console.log(major);
                    isMajors = true;
                }
            });
            await Promise.all(mapping3);
        });
        await Promise.all(mapping2);

        const isStates = req.body.states.includes("ALL") ? true : req.body.states.includes(college.state);
        const mode = !req.body.mode;
        const ranking = req.body.ranking[0] <= college.ranking & college.ranking <= req.body.ranking[1];
        const admission_rate = (college.admission_rate === "Not reported" | college.admission_rate === undefined | college.admission_rate === null | college.admission_rate === 'NULL') ? mode : req.body.admission_rate[0] <= college.admission_rate & college.admission_rate <= req.body.admission_rate[1];
        const completion_rate = (college.completion_rate.replace("%", "") === "Not reported" | college.completion_rate.replace("%", "") === undefined | college.completion_rate.replace("%", "") === null) ? mode : req.body.completion_rate[0] <= college.completion_rate.replace("%", "") & college.completion_rate.replace("%", "") <= req.body.completion_rate[1];
        const size = (college.size === "Not reported" | college.size === undefined | college.size === null) ? mode : (req.body.size[0] <= college.size & college.size <= req.body.size[1]);
        const sat_math = (college.range_avg_SAT_math === "Not reported" | college.range_avg_SAT_math === undefined | college.range_avg_SAT_math === null) ? mode : ((parseInt(college.range_avg_SAT_math.split("-")[0]) + parseInt(college.range_avg_SAT_math.split("-")[1])) / 2 > req.body.sat_math[0] & (parseInt(college.range_avg_SAT_math.split("-")[0]) + parseInt(college.range_avg_SAT_math.split("-")[1])) / 2 < req.body.sat_math[1]);
        const sat_EBRW = (college.range_avg_SAT_EBRW === "Not reported" | college.range_avg_SAT_EBRW === undefined | college.range_avg_SAT_EBRW === null) ? mode : ((parseInt(college.range_avg_SAT_EBRW.split("-")[0]) + parseInt(college.range_avg_SAT_EBRW.split("-")[1])) / 2 > req.body.sat_EBRW[0] & (parseInt(college.range_avg_SAT_EBRW.split("-")[0]) + parseInt(college.range_avg_SAT_EBRW.split("-")[1])) / 2 < req.body.sat_EBRW[1]);
        const act_Composite = (college.range_avg_ACT === "Not reported" | college.range_avg_ACT === undefined | college.range_avg_ACT === null) ? mode : ((parseInt(college.range_avg_ACT.split("-")[0]) + parseInt(college.range_avg_ACT.split("-")[1])) / 2 > req.body.act_Composite[0] & (parseInt(college.range_avg_ACT.split("-")[0]) + parseInt(college.range_avg_ACT.split("-")[1])) / 2 < req.body.act_Composite[1]);
        const keyword = (req.body.keyword === '' | req.body.keyword === null | req.body.keyword === undefined | req.body.keyword === 'all') ? true : (college.name.toLowerCase()).includes((req.body.keyword).toLowerCase());
        const inoutstate = college.state === req.body.inoutstate ? true : false;
        const cost_of_attendance = (college.cost_of_attendance === undefined | college.cost_of_attendance === null) ? (null) : (inoutstate ? college.cost_of_attendance[0] : (college.cost_of_attendance.length == 2 ? college.cost_of_attendance[1] : college.cost_of_attendance[0])).replace(",", "");
        const check_cost_of_attendance = cost_of_attendance == null ? mode : (req.body.cost_of_attendance[0] <= cost_of_attendance & cost_of_attendance <= req.body.cost_of_attendance[1]);
        const user = await Student.findOne({ userid: req.body.student_id });

        // console.log(req.body.cost_of_attendance[1]);
        if (ranking & size & admission_rate & completion_rate & sat_EBRW & sat_math & act_Composite & keyword & check_cost_of_attendance & isStates & isMajors) {

            if (req.body.recommander) {
                //6.4 Write ur Algorithm here
                let no_res_state = user.residence_state == undefined || user.residence_state == null || user.residence_state == "";
                let no_major = user.major_1 == undefined || user.major_1 == null || user.major_1 == "";
                let no_sat = user.SAT_math == undefined || user.SAT_math == null || user.SAT_math == "" || user.SAT_EBRW == undefined || user.SAT_EBRW == null || user.SAT_EBRW == "";
                let no_act = user.ACT_composite == undefined || user.ACT_composite == null || user.ACT_composite == "";

                if (no_res_state || no_major || (no_sat && no_act)) {
                    console.log("Must enter residence state, SAT/ACT, First Major");
                    rscore = null;
                } else {
                    // If the college is in the user's residence state, it has location score of 100, else 0.
                    let location_score = inoutstate ? 100 : 0;
                    let major_score = 0;
                    if (college.majors == undefined || college.majors == null || college.majors == [] || college.majors == "") {
                        major_score = -1;
                    } else {
                        // If the user doesn't have a second major, then if the college contains his/her first major, major_score = 20
                        if (user.major_2 == undefined || user.major_2 == null || user.major == "") {
                            if (college.majors.includes(user.major_1)) {
                                major_score = 100;
                            }
                        }
                        // If the user has both first and second majors, then the college get 50 points if it has the first major
                        // another 50 points for offering the second major
                        else {
                            if (college.majors.includes(user.major_1)) {
                                major_score += 50;
                            }
                            if (college.majors.includes(user.major_2)) {
                                major_score += 50;
                            }
                        }
                    }
                    // Cost of Attendance - the less expensive cost is, the higher the cost_score
                    let cost_score = 0;
                    // If cost_of_attendance is not available, use debt as measurement - less debt, higher cost_score
                    if (cost_of_attendance == null || cost_of_attendance == undefined || cost_of_attendance == "") {
                        if (college.debt == null || college.debt == undefined || college.debt == "") { cost_score = -1; }
                        else if (college.debt <= 3000) { cost_score = 100; }
                        else if (college.debt <= 6000) { cost_score = 90; }
                        else if (college.debt <= 9000) { cost_score = 80; }
                        else if (college.debt <= 12000) { cost_score = 70; }
                        else if (college.debt <= 15000) { cost_score = 60; }
                        else if (college.debt <= 18000) { cost_score = 50; }
                        else if (college.debt <= 21000) { cost_score = 40; }
                        else if (college.debt <= 24000) { cost_score = 30; }
                        else if (college.debt <= 27000) { cost_score = 20; }
                        else if (college.debt <= 30000) { cost_score = 10; }
                        else { cost_score = 0; }
                    }
                    else if (cost_of_attendance <= 10000) { cost_score = 100; }
                    else if (cost_of_attendance <= 20000) { cost_score = 90; }
                    else if (cost_of_attendance <= 30000) { cost_score = 80; }
                    else if (cost_of_attendance <= 40000) { cost_score = 70; }
                    else if (cost_of_attendance <= 50000) { cost_score = 60; }
                    else if (cost_of_attendance <= 60000) { cost_score = 50; }
                    else if (cost_of_attendance <= 70000) { cost_score = 40; }
                    else if (cost_of_attendance <= 80000) { cost_score = 30; }
                    else if (cost_of_attendance <= 90000) { cost_score = 20; }
                    else if (cost_of_attendance <= 100000) { cost_score = 10; }
                    else { cost_score = 0; }

                    let test_score = 0;
                    // If the user has both SAT and ACT score, we take the higher one and compare with the college average sat/act
                    let user_sat = null;
                    let user_act = null;
                    if (!no_sat) { user_sat = convert_to_percentile(user.SAT_math + user.SAT_EBRW, "SAT"); }
                    if (!no_act) { user_act = convert_to_percentile(user.ACT_composite, "ACT"); }
                    let user_test_type = user_sat >= user_act ? "SAT" : "ACT";

                    let has_college_sat_math = college.range_avg_SAT_math != "Not reported" && college.range_avg_SAT_math != undefined
                        && college.range_avg_SAT_math != null && college.range_avg_SAT_math != "";
                    let has_college_sat_EBRW = college.range_avg_SAT_EBRW != "Not reported" && college.range_avg_SAT_EBRW != undefined
                        && college.range_avg_SAT_EBRW != null && college.range_avg_SAT_EBRW != "";
                    let has_college_act = college.range_avg_ACT != "Not reported" && college.range_avg_ACT != undefined
                        && college.range_avg_ACT != null && college.range_avg_ACT != "";

                    if (!has_college_sat_math && !has_college_sat_EBRW && !has_college_act) {
                        test_score = -1;
                    }
                    else {
                        if (user_test_type == "SAT") {
                            let user_math = (user.SAT_math / 800) * 100;
                            let user_ebrw = (user.SAT_EBRW / 800) * 100;
                            if (has_college_sat_math && has_college_sat_EBRW) {
                                // console.log("Matching User SAT with College SAT");
                                let math_lower = (parseInt(college.range_avg_SAT_math.split("-")[0], 10) / 800) * 100;
                                let math_upper = (parseInt(college.range_avg_SAT_math.split("-")[1], 10) / 800) * 100;
                                let ebrw_lower = (parseInt(college.range_avg_SAT_EBRW.split("-")[0], 10) / 800) * 100;
                                let ebrw_upper = (parseInt(college.range_avg_SAT_EBRW.split("-")[1], 10) / 800) * 100;

                                test_score = (compute_userCollege_test(math_lower, math_upper, user_math) + compute_userCollege_test(ebrw_lower, ebrw_upper, user_ebrw)) / 2;
                            }
                            else if (has_college_act) {
                                // console.log("Matching User SAT with College ACT");
                                let act_lower = convert_to_percentile(parseInt(college.range_avg_ACT.split("-")[0], 10), "ACT");
                                let act_upper = convert_to_percentile(parseInt(college.range_avg_ACT.split("-")[1], 10), "ACT");
                                test_score = compute_userCollege_test(act_lower, act_upper, user_sat);

                            }
                        }
                        else if (user_test_type == "ACT") {
                            if (has_college_act) {
                                // console.log("Matching User ACT with College ACT");
                                let act_lower = convert_to_percentile(parseInt(college.range_avg_ACT.split("-")[0], 10), "ACT");
                                let act_upper = convert_to_percentile(parseInt(college.range_avg_ACT.split("-")[1], 10), "ACT");
                                test_score = compute_userCollege_test(act_lower, act_upper, user_act);
                            }
                            else if (has_college_sat_math && has_college_sat_EBRW) {
                                // console.log("Matching User ACT with College SAT");
                                let math_lower = (parseInt(college.range_avg_SAT_math.split("-")[0], 10) / 800) * 100;
                                let math_upper = (parseInt(college.range_avg_SAT_math.split("-")[1], 10) / 800) * 100;
                                let ebrw_lower = (parseInt(college.range_avg_SAT_EBRW.split("-")[0], 10) / 800) * 100;
                                let ebrw_upper = (parseInt(college.range_avg_SAT_EBRW.split("-")[1], 10) / 800) * 100;
                                let sat_lower = (math_lower + ebrw_lower) / 2;
                                let sat_upper = (math_upper + ebrw_upper) / 2;
                                test_score = compute_userCollege_test(sat_lower, sat_upper, user_act);

                            }
                        }

                    }
                    let similarity_score = 0;
                    let college_students_score = 0;
                    let student_size = 0;
                    // Locate all applications for this college
                    let applications = await Applications.find({ college: college.name, status: 'accepted' });
                    if (applications.length != 0) {
                        for (a of applications) {
                            let student = await Student.findOne({ userid: a.userid });
                            // If the student in the college has a score within 10 points of difference with the user_score, then he/she
                            // is similar to the user.
                            if (student.hidden_score >= user.hidden_score - 5 && student.hidden_score <= user.hidden_score + 5 && student.userid != user.userid) {
                                similar_students.push(student);
                            }
                            college_students_score += student.hidden_score;
                            student_size += 1;
                        }
                        let college_avg_student_score = college_students_score / student_size;
                        similarity_score = 100 - Math.abs(college_avg_student_score - user.hidden_score);
                    }
                    else{
                        similarity_score = test_score
                    }

                    if(major_score == -1 || cost_score == -1 || test_score == -1 || similarity_score == -1){
                        rscore = -1;
                    }
                    else{
                        rscore = location_score * 0.10 + major_score * 0.20 + cost_score * 0.20 + test_score * 0.25 + similarity_score * 0.25;
                    }
                }

            }
            // else {
            //     console.log("Not Compute")
            // }

            originData.push({
                key: index,
                name: college.name,
                ranking: college.ranking,
                avg_SAT: college.avg_SAT,
                avg_ACT: college.avg_ACT,
                control: college.control === "1" ? "Public" : (college.control === "2" ? "Private nonprofit" : (college.control === "3" ? "Private for-profit" : "")),
                debt: college.debt,
                admission_rate: college.admission_rate,
                size: college.size,
                city: college.city,
                state: college.state == "Not reported" ? '' : college.state,
                completion_rate: college.completion_rate == "Not reported" ? '' : college.completion_rate,
                range_avg_SAT_math: college.range_avg_SAT_math == "Not reported" ? '' : college.range_avg_SAT_math,
                range_avg_SAT_EBRW: college.range_avg_SAT_EBRW == "Not reported" ? '' : college.range_avg_SAT_EBRW,
                range_avg_ACT: college.range_avg_ACT == "Not reported" ? '' : college.range_avg_ACT,
                majors: college.majors.toString(),
                cost_of_attendance: cost_of_attendance,
                recommander: rscore,
                list_similar_students: similar_students
            })
        }
    });
    await Promise.all(mapping);
    if (req.body.recommander && rscore == null) {
        return res.json({
            status: "info_required",
            colleges: originData
        })
    }
    else {
        return res.json({
            colleges: originData
        });

    }


});


router.get('/users/:id',async function(req, res, next){
    let student = await Student.findOne({userid:req.params.id }).lean();
    return res.json({
        student: student
    });
});
///by id
router.post('/searchColleges/:id',async function(req, res, next){
    // filter: event.TrackerFilter,
    // class: event.TrackerClass.format('YYYY'),
    // highSchool: event.TrackerHighschool,
    // college:location.pathname.replace("/searchcollege/","")
    const filter = req.body.filter;
    const classes = req.body.class;
    const highSchool = req.body.highSchool;// a list
    const college = req.body.college;
    const status = req.body.status;// a list
    //filter out applications that goes to this college
    let applications =  await Applications.find({college:college}).lean();
    let college1  = await Colleges.findOne({name:college}).lean();
    const studentList = [];
    // const SATScatterplot = [];
    // const ACTScatterplot = [];
    // const WeightScatterplot =[];
//    console.log(classes[0]);
//    console.log(classes[1]);
   // console.log(college1);
   // console.log(applications);
   const SATScatterplot_accepted = [];
   const SATScatterplot_denied = [];
   const SATScatterplot_other = [];

   const ACTScatterplot_accepted = [];
   const ACTScatterplot_denied = [];
   const ACTScatterplot_other = [];

   const WeightScatterplot_accepted = [];
   const WeightScatterplot_denied = [];
   const WeightScatterplot_other = [];
    
    const mapping =applications.map(async (app, index)=>{
        let student = await Student.findOne({userid: app.userid}).lean();
        const hs = student.high_school_name+", "+student.high_school_city+", "+student.high_school_state;
        const hs_lax = (student.high_school_name==undefined|student.high_school_city==undefined|student.high_school_state==undefined)? true: false;
        if(filter=="lax" && student){
           // console.log(student.userid);
            //check whether it matches the filter
            // console.log(student.userid);
            // console.log(status.includes(app.status));
            // console.log((highSchool.includes("All High Schools")|highSchool.includes(hs)|hs_lax));
            // console.log((classes==student.college_class|student.college_class==null|student.college_class==undefined));
            // console.log("dada");
            if(status.includes(app.status) && (highSchool.includes("All High Schools")|highSchool.includes(hs)|hs_lax) && ((classes[0]<=student.college_class && student.college_class<=classes[1])|student.college_class==null|student.college_class==undefined)){
               // console.log(student.userid);
                if(app.status=="accepted"){
                    if(compute_Questionable(college1,student)=="No" | app.questionable=="No"){
                      
                        if(student.GPA && student.SAT_EBRW && student.SAT_math){
                            if(app.status == "accepted"){
                                SATScatterplot_accepted.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                            else if (app.status == "rejected"){
                                SATScatterplot_denied.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                            else{
                                SATScatterplot_other.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                        }
                        if(student.GPA && student.ACT_composite){
                            if(app.status == "accepted"){
                                ACTScatterplot_accepted.push([student.GPA,student.ACT_composite]);
                            }
                            else if (app.status == "rejected"){
                                ACTScatterplot_denied.push([student.GPA,student.ACT_composite]);
                            }
                            else{
                                ACTScatterplot_other.push([student.GPA,student.ACT_composite]);
                            }
                        }
                        if(student.GPA){
                            if(app.status == "accepted"){
                                WeightScatterplot_accepted.push([student.GPA,convert_Weighted(student)]);
                            }
                            else if (app.status == "rejected"){
                                WeightScatterplot_denied.push([student.GPA,convert_Weighted(student)]);
                            }
                            else{
                                WeightScatterplot_other.push([student.GPA,convert_Weighted(student)]);
                            }
                        }
                        //console.log("????dadaacp");
                        studentList.push({
                            userid: student.userid,
                            GPA: student.GPA,
                            SAT_math: student.SAT_math,
                            SAT_EBRW: student.SAT_EBRW,
                            ACT_composite: student.ACT_composite,
                            status: app.status
                        });
                    }
                }
                else{
                    if(student.GPA && student.SAT_EBRW && student.SAT_math){
                        if(app.status == "accepted"){
                            SATScatterplot_accepted.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                        else if (app.status == "rejected"){
                            SATScatterplot_denied.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                        else{
                            SATScatterplot_other.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                    }
                    if(student.GPA && student.ACT_composite){
                        if(app.status == "accepted"){
                            ACTScatterplot_accepted.push([student.GPA,student.ACT_composite]);
                        }
                        else if (app.status == "rejected"){
                            ACTScatterplot_denied.push([student.GPA,student.ACT_composite]);
                        }
                        else{
                            ACTScatterplot_other.push([student.GPA,student.ACT_composite]);
                        }
                    }
                    if(student.GPA){
                        if(app.status == "accepted"){
                            WeightScatterplot_accepted.push([student.GPA,convert_Weighted(student)]);
                        }
                        else if (app.status == "rejected"){
                            WeightScatterplot_denied.push([student.GPA,convert_Weighted(student)]);
                        }
                        else{
                            WeightScatterplot_other.push([student.GPA,convert_Weighted(student)]);
                        }
                    }
                    studentList.push({
                        userid: student.userid,
                        GPA: student.GPA,
                        SAT_math: student.SAT_math,
                        SAT_EBRW: student.SAT_EBRW,
                        ACT_composite: student.ACT_composite,
                        status: app.status
                    });
                }
            }
        }
        else{//strict
            if(status.includes(app.status) && (highSchool.includes("All High Schools")|highSchool.includes(hs)) && (classes==student.college_class)){
                if(app.status=="accepted"){
                    if(compute_Questionable(college,student)=="No" | app.questionable=="No"){
                        if(student.GPA && student.SAT_EBRW && student.SAT_math){
                            if(app.status == "accepted"){
                                SATScatterplot_accepted.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                            else if (app.status == "rejected"){
                                SATScatterplot_denied.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                            else{
                                SATScatterplot_other.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                            }
                        }
                        if(student.GPA && student.ACT_composite){
                            if(app.status == "accepted"){
                                ACTScatterplot_accepted.push([student.GPA,student.ACT_composite]);
                            }
                            else if (app.status == "rejected"){
                                ACTScatterplot_denied.push([student.GPA,student.ACT_composite]);
                            }
                            else{
                                ACTScatterplot_other.push([student.GPA,student.ACT_composite]);
                            }
                        }
                        if(student.GPA){
                            if(app.status == "accepted"){
                                WeightScatterplot_accepted.push([student.GPA,convert_Weighted(student)]);
                            }
                            else if (app.status == "rejected"){
                                WeightScatterplot_denied.push([student.GPA,convert_Weighted(student)]);
                            }
                            else{
                                WeightScatterplot_other.push([student.GPA,convert_Weighted(student)]);
                            }
                        }
                        studentList.push({
                            userid: student.userid,
                            GPA: student.GPA,
                            SAT_math: student.SAT_math,
                            SAT_EBRW: student.SAT_EBRW,
                            ACT_composite: student.ACT_composite,
                            status: app.status
                        });
                    }
                }
                else{
                    if(student.GPA && student.SAT_EBRW && student.SAT_math){
                        if(app.status == "accepted"){
                            SATScatterplot_accepted.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                        else if (app.status == "rejected"){
                            SATScatterplot_denied.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                        else{
                            SATScatterplot_other.push([student.GPA,student.SAT_EBRW +student.SAT_math]);
                        }
                    }
                    if(student.GPA && student.ACT_composite){
                        if(app.status == "accepted"){
                            ACTScatterplot_accepted.push([student.GPA,student.ACT_composite]);
                        }
                        else if (app.status == "rejected"){
                            ACTScatterplot_denied.push([student.GPA,student.ACT_composite]);
                        }
                        else{
                            ACTScatterplot_other.push([student.GPA,student.ACT_composite]);
                        }
                    }
                    if(student.GPA){
                        if(app.status == "accepted"){
                            WeightScatterplot_accepted.push([student.GPA,convert_Weighted(student)]);
                        }
                        else if (app.status == "rejected"){
                            WeightScatterplot_denied.push([student.GPA,convert_Weighted(student)]);
                        }
                        else{
                            WeightScatterplot_other.push([student.GPA,convert_Weighted(student)]);
                        }
                    }
                    studentList.push({
                        userid: student.userid,
                        GPA: student.GPA,
                        SAT_math: student.SAT_math,
                        SAT_EBRW: student.SAT_EBRW,
                        ACT_composite: student.ACT_composite,
                        status: app.status
                    });
                }
            }
        }
    });
    
    await Promise.all(mapping);
    
    return res.json({
        studentList: studentList,
        SATScatterplot :[{name:"accepted",data:SATScatterplot_accepted},{name:"denied",data:SATScatterplot_denied},{name:"others",data:SATScatterplot_other} ],
        ACTScatterplot : [{name:"accepted",data:ACTScatterplot_accepted},{name:"denied",data:ACTScatterplot_denied},{name:"others",data:ACTScatterplot_other} ],
        WeightScatterplot: [{name:"accepted",data:WeightScatterplot_accepted},{name:"denied",data:WeightScatterplot_denied},{name:"others",data:WeightScatterplot_other} ]
    });

});

router.post('/recommander/:id', async function (req, res, next) {
    
    let similar_students =[];
    console.log(req.body.user);
    console.log(req.params.id);
    let similarity_score = 0;
    let college_students_score = 0;
    let student_size = 0;
    let user = await Student.findOne({userid: req.body.user });
    // Locate all applications for this college
    let applications = await Applications.find({ college: req.params.id, status: 'accepted' });
    const mapping =applications.map(async (a, index)=>{
            console.log("dada");
            let student = await Student.findOne({ userid: a.userid });
            // If the student in the college has a score within 10 points of difference with the user_score, then he/she
            // is similar to the user.
            if (student.hidden_score >= user.hidden_score - 5 && student.hidden_score <= user.hidden_score + 5 && student.userid != user.userid) {
                //similar_students.push(student);
                similar_students.push({
                    key: index,
                    userid:  student.userid,
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
                    //application : originData
                });
            }
            college_students_score += student.hidden_score;
            student_size += 1;
    });
    let college_avg_student_score = college_students_score / student_size;
    similarity_score = 100 - Math.abs(college_avg_student_score - user.hidden_score);
    await Promise.all(mapping);
    console.log(similar_students.length);
    return res.json({
        similar_students: similar_students,
    });
    

});


//yuxin
router.post('/compute_student_score', async function (req, res, next) {
    // Locate the student in the database using student's userid
    let student = await Student.findOne({ userid: req.body.student_id })
    // In the case of lacking information, we assume the student performs around average (GPA, SAT, HighSchool Quality)
    // Find student's high school score
    let hs_name = student.high_school_name;
    let hs_city = student.high_school_city;
    let hs_state = student.high_school_state;
    // Default hs_score = 65 if the student did not enter a highschool in the profile, or the high school is not found on niche.
    let hs_score = 65;

    // If hs_name, city, or state information is not present, then no high school score is present in database.
    let no_hs_score = hs_name == undefined || hs_name == "" || hs_name == null || hs_city == undefined || hs_city == "" || hs_city == null || hs_state == undefined || hs_state == "" || hs_state == null;
    let highschool = null;
    if (!no_hs_score) {
        highschool = await HighSchool.findOne({ name: hs_name.toLowerCase(), city: hs_city.toLowerCase(), state: hs_state.toLowerCase() });
        // If the student's high school is found on niche.com, then hs_score is present.
        if (highschool != null) {
            hs_score = highschool.hs_score;
        }
    }

    // If gpa is not found in profile, then student's GPA is by default (2.8/4,0) 70% (national core course average gpa). 
    // Else, convert student's GPA to a percentile
    let gpa = student.GPA == undefined ? 70 : convert_to_percentile(student.GPA, 'GPA');

    // If no standardized test score is available, default = 62.5% (1000/1600)
    let std_test = 62.5;
    let sat = (student.SAT_math != undefined && student.SAT_EBRW != undefined) ? student.SAT_math + student.SAT_EBRW : null;
    let act = student.ACT_composite != undefined ? student.ACT_composite : null;
    if (sat != null && act != null) { // If both SAT and ACT info are present, take the higher one
        std_test = convert_to_percentile(sat, 'SAT') > convert_to_percentile(act, 'ACT') ? convert_to_percentile(sat, 'SAT') : convert_to_percentile(act, 'ACT');
    }
    else if (sat != null) {
        std_test = convert_to_percentile(sat, 'SAT');
    }
    else if (act != null) {
        std_test = convert_to_percentile(sat, 'ACT');
    }

    let quality_score = 0.45 * gpa + 0.45 * std_test + 0.10 * hs_score;
    await Student.updateOne({ userid: req.body.student_id },
        {
            $set: { hidden_score: quality_score }
        });

    return res.json({
        status: "ok",
    });


});

//yuxin
// Added
function compute_userCollege_test(lower_bound, upper_bound, user_score) {
    let below_lower = user_score <= lower_bound ? true : false;
    let above_upper = user_score >= upper_bound ? true : false;

    if (user_score >= lower_bound && user_score <= upper_bound) { return 100; }
    // within 2%, 4%, 6%, 8%, 10%, 12%, 14%, 16%, 18% difference away from the range, more difference = lower score
    // more than 18% difference = outliers, no points 
    else if ((below_lower && user_score >= lower_bound - 2) || (above_upper && user_score <= upper_bound + 2)) { return 90; }
    else if ((below_lower && user_score >= lower_bound - 4) || (above_upper && user_score <= upper_bound + 4)) { return 80; }
    else if ((below_lower && user_score >= lower_bound - 6) || (above_upper && user_score <= upper_bound + 6)) { return 70; }
    else if ((below_lower && user_score >= lower_bound - 8) || (above_upper && user_score <= upper_bound + 8)) { return 60; }
    else if ((below_lower && user_score >= lower_bound - 10) || (above_upper && user_score <= upper_bound + 10)) { return 50; }
    else if ((below_lower && user_score >= lower_bound - 12) || (above_upper && user_score <= upper_bound + 12)) { return 40; }
    else if ((below_lower && user_score >= lower_bound - 14) || (above_upper && user_score <= upper_bound + 14)) { return 30; }
    else if ((below_lower && user_score >= lower_bound - 16) || (above_upper && user_score <= upper_bound + 16)) { return 20; }
    else if ((below_lower && user_score >= lower_bound - 18) || (above_upper && user_score <= upper_bound + 18)) { return 10; }
    else { return 0; }

}


function compute_Questionable(college, student) {
     
    if(college ==null){
        return null;
    }

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

function convert_Weighted(student){
    let count = 0;
    let score = 0;
    if(student.SAT_literature){
        score+= (student.SAT_literature/800 *0.05);
        count++;
    }
    if(student.SAT_US_hist){
        score+= (student.SAT_US_hist/800 *0.05);
        count++;
    }
    if(student.SAT_world_hist){
        score+= (student.SAT_world_hist/800 *0.05);
        count++;
    }
    if(student.SAT_math_I){
        score+= (student.SAT_math_I/800 *0.05);
        count++;
    }
    if(student.SAT_math_II){
        score+= (student.SAT_math_II/800 *0.05);
        count++;
    }
    if(student.SAT_eco_bio){
        score+= (student.SAT_eco_bio/800 *0.05);
        count++;
    }
    if(student.SAT_mol_bio){
        score+= (student.SAT_mol_bio/800 *0.05);
        count++;
    }
    if(student.SAT_chemistry){
        score+= (student.SAT_chemistry/800 *0.05);
        count++;
    }
    if(student.SAT_physics){
        score+= (student.SAT_physics/800 *0.05);
        count++;
    }
    console.log(count);
    if(student.SAT_EBRW && student.SAT_math){
        score+=(1-count*0.05)*((student.SAT_EBRW +student.SAT_math)/1600);
    }
    else if(student.ACT_composite  ){
        score+=(1-count*0.05)*(student.ACT_composite/36);
    }
    return score*100;
}  


module.exports = router;
