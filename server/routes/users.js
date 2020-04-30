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
//mark
//6.3 Search College
router.post('/searchColleges',async function(req, res, next) {
    // const properties = await Property.find({ price: { $gte:req.query.priceMin, $lte: req.query.priceMax } });
    //const states_modif = req.body.states[1]==null?req.body.states[0]:req.body.states[0].push(req.body.states[1]);
    let colleges = await Colleges.find({}).lean();
    const originData = [];
    //console.log(req.body.mode?"on":"off");
    // console.log(states_modif[0]);
    // console.log(states_modif[1]);
    // // console.log(states_modif[2]);
    // const states = req.body.states;
    const mapping =colleges.map(async (college, index)=>{
        //check conditions
        let isMajors = req.body.majors.includes("ALL")?true:false;
        const mapping2 =req.body.majors.map(async (major, index)=>{
            if(college.majors!=undefined){
                const mapping3 = college.majors.map(async (dbmajor, i)=>{
                    if(dbmajor.includes(major)){
                        console.log(dbmajor);
                        console.log(major);
                        isMajors = true;
                    }
                });
                await Promise.all(mapping3);
            }
        });
        await Promise.all(mapping2);

        const isStates =req.body.states.includes("ALL")? true :req.body.states.includes(college.state);
        const mode =!req.body.mode;
        const ranking =req.body.ranking[0]<=college.ranking & college.ranking<=req.body.ranking[1];
        const admission_rate = (college.admission_rate==="Not reported"|college.admission_rate===undefined|college.admission_rate===null|college.admission_rate==='NULL')?mode:req.body.admission_rate[0]<=college.admission_rate & college.admission_rate<= req.body.admission_rate[1];
        const completion_rate = (college.completion_rate.replace("%", "")==="Not reported"|college.completion_rate.replace("%", "")===undefined|college.completion_rate.replace("%", "")===null)?mode:req.body.completion_rate[0]<=college.completion_rate.replace("%", "") & college.completion_rate.replace("%", "")<= req.body.completion_rate[1];
        const size = (college.size==="Not reported"|college.size===undefined|college.size===null)?mode:(req.body.size[0]<=college.size & college.size<= req.body.size[1]);
        const sat_math = (college.range_avg_SAT_math==="Not reported"|college.range_avg_SAT_math===undefined|college.range_avg_SAT_math===null)? mode:((parseInt(college.range_avg_SAT_math.split("-")[0])+parseInt(college.range_avg_SAT_math.split("-")[1]))/2>req.body.sat_math[0] & (parseInt(college.range_avg_SAT_math.split("-")[0])+parseInt(college.range_avg_SAT_math.split("-")[1]))/2<req.body.sat_math[1]);
        const sat_EBRW = (college.range_avg_SAT_EBRW==="Not reported"|college.range_avg_SAT_EBRW===undefined|college.range_avg_SAT_EBRW===null)? mode:((parseInt(college.range_avg_SAT_EBRW.split("-")[0])+parseInt(college.range_avg_SAT_EBRW.split("-")[1]))/2>req.body.sat_EBRW[0] & (parseInt(college.range_avg_SAT_EBRW.split("-")[0])+parseInt(college.range_avg_SAT_EBRW.split("-")[1]))/2<req.body.sat_EBRW[1]);
        const act_Composite = (college.range_avg_ACT==="Not reported"|college.range_avg_ACT===undefined|college.range_avg_ACT===null)? mode:((parseInt(college.range_avg_ACT.split("-")[0])+parseInt(college.range_avg_ACT.split("-")[1]))/2>req.body.act_Composite[0] & (parseInt(college.range_avg_ACT.split("-")[0])+parseInt(college.range_avg_ACT.split("-")[1]))/2<req.body.act_Composite[1]);
        const keyword = (req.body.keyword===''|req.body.keyword===null| req.body.keyword===undefined|req.body.keyword==='all')?true:(college.name.toLowerCase()).includes((req.body.keyword).toLowerCase());
        const inoutstate = college.state===req.body.inoutstate? true:false;
        const cost_of_attendance = (college.cost_of_attendance===undefined |college.cost_of_attendance===null )?(null):(inoutstate? college.cost_of_attendance[0]:(college.cost_of_attendance.length==2?college.cost_of_attendance[1]:college.cost_of_attendance[0])).replace(",", "");
        const check_cost_of_attendance = cost_of_attendance==null?mode:(req.body.cost_of_attendance[0]<=cost_of_attendance & cost_of_attendance<= req.body.cost_of_attendance[1]);


        // console.log(req.body.cost_of_attendance[1]);
        if(ranking  &size &admission_rate&completion_rate&sat_EBRW &sat_math&act_Composite &keyword & check_cost_of_attendance & isStates&isMajors){
            let rscore = null;
            if(req.body.recommander){
                //6.4 Write ur Algorithm here
                console.log("Compute Recom");
                rscore =0;
            }
            else{
                console.log("Not Compute")
            }

            originData.push({
                key:index,
                name:college.name, 
                ranking: college.ranking,
                avg_SAT: college.avg_SAT,
                avg_ACT: college.avg_ACT,
                control: college.control==="1"?"Public":(college.control==="2"?"Private nonprofit":(college.control==="3"?"Private for-profit":"")),
                debt: college.debt,
                admission_rate:college.admission_rate,
                size: college.size,
                city: college.city,
                state: college.state=="Not reported"?'':college.state,
                completion_rate: college.completion_rate=="Not reported"?'':college.completion_rate,
                range_avg_SAT_math: college.range_avg_SAT_math=="Not reported"?'':college.range_avg_SAT_math,
                range_avg_SAT_EBRW: college.range_avg_SAT_EBRW=="Not reported"?'':college.range_avg_SAT_EBRW,
                range_avg_ACT: college.range_avg_ACT=="Not reported"?'':college.range_avg_ACT,
                majors:college.majors.toString(),  
                cost_of_attendance:cost_of_attendance,
                recommander:rscore
            })
        }
    });
    await Promise.all(mapping);
    return res.json({
        colleges: originData
    });

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
    const SATScatterplot = [];
    const ACTScatterplot = [];
    const WeightScatterplot =[];
//    console.log(classes[0]);
//    console.log(classes[1]);
   // console.log(college1);
   // console.log(applications);
    
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
                            SATScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,student.SAT_EBRW +student.SAT_math],
                                ]}
                            );
                        }
                        if(student.GPA && student.ACT_composite){
                            ACTScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,student.ACT_composite],
                                ]}
                            );
                        }
                        if(student.GPA){
                            WeightScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,convert_Weighted(student)],
                                ]}
                            );
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
                        SATScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,student.SAT_EBRW +student.SAT_math],
                            ]}
                        );
                    }
                    if(student.GPA && student.ACT_composite){
                        ACTScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,student.ACT_composite],
                            ]}
                        );
                    }
                    if(student.GPA){
                        WeightScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,convert_Weighted(student)],
                            ]}
                        );
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
                            SATScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,student.SAT_EBRW +student.SAT_math],
                                ]}
                            );
                        }
                        if(student.GPA && student.ACT_composite){
                            ACTScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,student.ACT_composite],
                                ]}
                            );
                        }
                        if(student.GPA){
                            WeightScatterplot.push({
                                name: app.status,
                                data: [
                                    [student.GPA,convert_Weighted(student)],
                                ]}
                            );
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
                        SATScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,student.SAT_EBRW +student.SAT_math],
                            ]}
                        );
                    }
                    if(student.GPA && student.ACT_composite){
                        ACTScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,student.ACT_composite],
                            ]}
                        );
                    }
                    if(student.GPA){
                        WeightScatterplot.push({
                            name: app.status,
                            data: [
                                [student.GPA,convert_Weighted(student)],
                            ]}
                        );
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
        SATScatterplot : SATScatterplot,
        ACTScatterplot : ACTScatterplot,
        WeightScatterplot: WeightScatterplot
    });

});



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
