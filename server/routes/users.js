var express = require('express');
var router = express.Router();
const passport = require('passport');
const Student = require('../models/student');
const Applications = require('../models/applications');
const Colleges= require('../models/colleges');


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


router.post('/searchColleges',async function(req, res, next) {
   // const properties = await Property.find({ price: { $gte:req.query.priceMin, $lte: req.query.priceMax } });

});



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
