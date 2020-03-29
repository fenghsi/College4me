var express = require('express');
var router = express.Router();
const Student = require('../models/student');
const Application = require('../models/applications');

router.post('/test', async function(req, res, next) {
    if(req.body.id==1){
        // const newApplication = new Application({
        //     userid: "feyu",
        //     college: "Massachusetts Institute of Technology",
        //     status: "pending"
        // });
        // await newApplication.save();
        // const newStudent = new Student({
        //     userid :"feyu",
        //     username:"feyu",
        //     password: "1111",
        //     residence_state: "NY",
        //     high_school_name: "Ward Melville High School",
        //     high_school_city : "East Setauket",
        //     high_school_state : "NY",
        //     GPA: 3.7,
        //     college_class: "2024",
        //     major_1: "Physics",
        //     major_2: "Mathematics",
        //     SAT_math: 770,
        //     SAT_EBRW: 660,
        //     ACT_English: 31,
        //     ACT_math: 33,
        //     ACT_reading: 30,
        //     ACT_science: 34,
        //     ACT_composite: 32,
        //     SAT_literature: 660,
        //     SAT_US_hist: 770,
        //     SAT_world_hist: 690,
        //     SAT_math_I: 730,
        //     SAT_math_II: 720,
        //     SAT_eco_bio: 800,
        //     SAT_mol_bio: 700,
        //     SAT_chemistry: 670,
        //     SAT_physics: 740,
        //     num_AP_passed: 4,
        //     hidden_score: 95
        // });
        // await newStudent.save();
        // let student = await Student.findOne({userid: "feyu1"}).lean();
        // console.log(student);

        // let application = await Application.findOne({userid: "feyu1"}).lean();
        // console.log(application);

        // await Item.updateOne({id: req.params.id},
        //     {
        //         $inc: { 'property.likes': 1, interest: 1  },
        //         $addToSet: { likedBy: req.user.username }
        //     }
        // );

        // await Student.updateOne({userid:"feyu"}, 
        //     {   
        //         $set: {admin_status:"admin" }
        // });

        return res.json({
            msg:"Welcome"
        });
    }
    else{
        return res.json({
            msg:"Error"
        });
    }
});

module.exports = router;