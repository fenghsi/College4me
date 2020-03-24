var express = require('express');
var router = express.Router();
const passport = require('passport');
const Student = require('../models/student');
const Applications = require('../models/applications');

/* GET users listing. */

// router.get('/user',  function(req, res, next) {
//   const user = req.user ? req.user.username : null;
//   return res.json({
//       username: user
//   });
// });

router.get('/user',  function(req, res, next) {
    //console.log(req.session.passport);
    const user = req.session.passport? req.session.passport.user : null;
   // console.log(req.session);
   // console.log(user);
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
            password: req.body.password
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
    applications.map((app, index)=>{
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable: "Need to compute",
        })
    });

    return res.json({
        status: "ok",
        applications: originData
    });
    
    
});

router.post('/updateApplication',async function(req, res, next) {
    await Applications.updateOne({userid:req.body.userid,college:req.body.college }, 
        {   
            college : req.body.newcollege, 
            status : req.body.newstatus
        });
    let applications = await Applications.find({userid: req.body.userid}).lean();
    const originData = [];
    applications.map((app, index)=>{
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable: "Need to compute",
        })
    });

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
        const originData = [];
        application.map((app, index)=>{
            originData.push({
                key:  index,
                college: app.college,
                status: app.status,
                questionable: "Need to compute",
            })
        });
        return res.json({
            status: "ok",
            applications: originData
        });
    }
    else{
        return res.json({
            status: "err"
        });

    }


});

router.post('/deleteApplication',async function(req, res, next) {
    //console.log(req);
  //  console.log(req.body.college);
    await Applications.deleteOne({userid:req.body.userid, college:req.body.college}, async function (err, result) {
        if(err|| result.deletedCount === 0){
            return res.json({
                status: "err"
            });
        }
    });
    let application = await Applications.find({userid:req.body.userid}).lean();
    const originData = [];
    application.map((app, index)=>{
        originData.push({
            key:  index,
            college: app.college,
            status: app.status,
            questionable: "Need to compute",
        })
    });
    return res.json({
        applications: originData,
        status: "ok"
    });
});





module.exports = router;
