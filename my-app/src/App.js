import React, { useState, useEffect } from 'react';
import { Route, Switch,useHistory } from "react-router-dom";
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import SignUpForm from './components/user/SignUpForm';
import SignInForm from './components/user/SignInForm';
import Reviews_Questionable from './components/admin/Review_Questionable';
import FindSimilarHighSchool from './components/FindSimilarHighSchool';
import Scrape from './components/admin/scrape';
import { notification } from 'antd';

function App() {
    const [Admin, setAdmin] = useState(null);
    const [user, setUser] = useState(null);
    const [Student, setStudent] = useState(null);
    const [Applications,setApplications ]= useState();
    let history = useHistory();

    useEffect(() => {
      handleRefresh();
    }, []);


    //switch states of profile textbox enable or disable
    const [DisableBasic, setDisableBasic] = useState(true);
    const [DisableScoreSchool, setDisableScoreSchool] = useState(true);
    const [DisableScoreSAT, setDisableScoreSAT] = useState(true);
    const [DisableScoreACT, setDisableScoreACT] = useState(true);
    const [DisableScoreSATSub, setDisableScoreSATSub] = useState(true);
    //switch states of profile edit button or save buttons
    const [saveOreditBasic, setsaveOreditBasic] = useState('Edit');
    const [saveOreditScoreSchool, setsaveOreditScoreSchool] = useState('Edit');
    const [saveOreditScoreSAT, setsaveOreditScoreSAT] = useState('Edit');
    const [saveOreditScoreACT, setsaveOreditScoreACT] = useState('Edit');
    const [saveOreditScoreSATSub, setsaveOreditScoreSATSub] = useState('Edit');

    async function handleRefresh(){
      const res = await axios.get('/user');
      if(res.data.user==null){
      }        
      else{
        setStudent(res.data.user);
        setAdmin(res.data.user.accountType);
        setUser(res.data.user.username);
        const res2 = await axios.post('/getApplications', { 
          username:res.data.user.username
        });
        setApplications(res2.data.applications);
        
      }  
  }

    async function handleLogin(event) {
        
          const res = await axios.post('/login', { 
              username: event.username,
              password: event.password
          });
          if(res.data.status==='ok'){
              setUser(res.data.username);
              notification.open({
                message: "Login Successfully",
                description:"Welcome to C4me, "+res.data.username,
                duration:2.5 
              });
              const res2 = await axios.post('/getStudent', { 
                username: event.username
              });
              setStudent(res2.data.student);
              setAdmin(res2.data.student.acountType);
              //set applications
              const res3 = await axios.post('/getApplications', { 
                username: event.username
              });
              //need to set applications
              setApplications(res3.data.applications);

              history.push('/');
          }
          else{
              notification.open({
                message: res.data.error,
                description:"Please try again",
                duration:2.5  
              });
          }
        
    }
    async function handleLogout(event) {
        await axios.post('/logout');
        setUser(null);
        setStudent(null);
        setAdmin(null);
        setApplications(null);
        notification.open({
          message: "Logout Successfully",
          description:"bye ", 
          duration:2.5 
        });
        history.push('/');
    }

    async function handleEditBasicInfo(event){
      if(saveOreditBasic==='Edit'){
        setsaveOreditBasic('Save');
        setDisableBasic(false);
        history.push('/profile');
      }
      else{
        setsaveOreditBasic('Edit');
        setDisableBasic(true);
        const res = await axios.post('/editbasicInfo', {
          userid: Student.userid,
          username: event.username,
          residence_state:event.ResidenceState,
          high_school_name:event.HighSchool,
          high_school_city: event.HighSchoolCity,
          high_school_state: event.HighSchoolState,
          college_class:event.CollegeClass,
          major_1: event.FirstMajor,
          major_2: event.SecondMajor,
        });
        setStudent(res.data.student);
        history.push('/profile');
        notification.open({
          message: "Successfully Edit Basic Info" ,
          description: res.data.status,
          duration:2.5 
        });
      }
    }
    async function handleEditScoreSAT(event){
      if(saveOreditScoreSAT==='Edit'){
        setsaveOreditScoreSAT('Save');
        setDisableScoreSAT(false);
        history.push('/profile');
      }
      else{
        setsaveOreditScoreSAT('Edit');
        setDisableScoreSAT(true);
        const res = await axios.post('/editscoresat', {
          userid: Student.userid,
          SAT_EBRW:event.SATEBRW,
          SAT_math:event.SATMath
        });
        setStudent(res.data.student);
        const res2 = await axios.post('/getApplications', { 
          username:Student.userid,
        });
        setApplications(res2.data.applications);
        //history.push('/');
        history.push('/profile');
        notification.open({
          message: "Successfully Edit SAT Score" ,
          description: res.data.status,
          duration:2.5 
        });
      }
    }
    async function handleEditScoreSchool(event){
      if(saveOreditScoreSchool==='Edit'){
        setsaveOreditScoreSchool('Save');
        setDisableScoreSchool(false);
        history.push('/profile');
      }
      else{
        setsaveOreditScoreSchool('Edit');
        setDisableScoreSchool(true);
        const res = await axios.post('/editscoreschool', {
          userid: Student.userid,
          GPA: event.GPA,
          num_AP_passed: event.NumAPPassed
        });
        setStudent(res.data.student);
        history.push('/profile');
        notification.open({
          message: "Successfully Edit School Score" ,
          description: res.data.status,
          duration:2.5 
        });
      }
    }
    
    async function handleEditScoreACT(event){
      if(saveOreditScoreACT==='Edit'){
        setsaveOreditScoreACT('Save');
        setDisableScoreACT(false);
        history.push('/profile');
      }
      else{
        setsaveOreditScoreACT('Edit');
        setDisableScoreACT(true);
        
        const res = await axios.post('/editscoreact', {
          userid: Student.userid,
          ACT_English: event.ACTEnglish,
          ACT_reading: event.ACTReading,
          ACT_math: event.ACTMath,
          ACT_science:event.ACTScience,
          ACT_composite:(event.ACTEnglish!=null&event.ACTReading!=null&event.ACTMath!=null&event.ACTScience!=null)?Math.round((event.ACTEnglish+event.ACTReading+event.ACTMath+event.ACTScience)/4):null,
        });
        setStudent(res.data.student);
        const res2 = await axios.post('/getApplications', { 
          username:Student.userid,
        });
        setApplications(res2.data.applications);
        //history.push('/');
        notification.open({
          message: "Successfully Edit ACT Score" ,
          description: res.data.status,
          duration:2.5 
        });
        //history.push('/');
        history.push('/profile');
      }
    }

    async function handleEditScoreSubject(event){
      if(saveOreditScoreSATSub==='Edit'){
        setsaveOreditScoreSATSub('Save');
        setDisableScoreSATSub(false);
        history.push('/profile');
      }
      else{
        setsaveOreditScoreSATSub('Edit');
        setDisableScoreSATSub(true);
        const res = await axios.post('/editscoresubject', {
          userid: Student.userid,
          SAT_literature:event.SATLiterature,
          SAT_US_hist:event.SATUSHist,
          SAT_world_hist:event.SATWorldHist,
          SAT_math_I:event.SATMathI,
          SAT_math_II:event.SATMathII,
          SAT_eco_bio:event.SATEcoBio,
          SAT_mol_bio:event.SATMolBio,
          SAT_chemistry:event.SATChemistry,
          SAT_physics:event.SATPhysics
      });
      
      setStudent(res.data.student);
      history.push('/profile');
      notification.open({
          message: "Successfully Edit SAT Subject Score" ,
          description: res.data.status,
          duration:2.5 
        });
      }
    }
    async function handleAddNewApp(event) {
      
      const res = await axios.post('/addApplication', {
        userid: Student.userid,
        college: event.college,
        status: event.status
      });
      if(res.data.status ==='err'){//college is already selected 
        notification.open({
          message: "Declined",
          description: "This college is already in the list!" ,
          duration:2.5 
        });
      }
      else{
        notification.open({
          message: "Successfully Added "+event.college,
          duration:2.5 
        });
        setApplications(res.data.applications);
      }
    }

    async function handlereset(){
      setsaveOreditBasic('Edit'); 
      setsaveOreditScoreACT('Edit'); 
      setsaveOreditScoreSAT('Edit'); 
      setsaveOreditScoreSchool('Edit'); 
      setsaveOreditScoreSATSub('Edit');           
      setDisableScoreACT(true); 
      setDisableScoreSAT(true);                            
      setDisableScoreSchool(true); 
      setDisableScoreSATSub(true); 
      setDisableBasic(true);
    }


  return (
    <div>
       <Navbar user = {user} handleLogout={handleLogout} handlereset={handlereset}/>
          <div className="container">
              <Switch>
                  <Route exact path="/" render={() => (<Home/>)} />
            
                  {(Admin=="admin") &&
                      <React.Fragment>
                          <Route exact path="/admin" render={() => (<Reviews_Questionable/>)} />
                          <Route exact path="/scrape" render={() => (<Scrape/>)} />
                      </React.Fragment>
                  }
                  {user &&
                      <React.Fragment>
                          <Route exact path="/profile" render={() => (
                          <Profile Applications={Applications} 
                                   setApplications={setApplications} 
                                   handleAddNewApp={handleAddNewApp} 
                                   Student={Student} 
                                   saveOreditBasic={saveOreditBasic} 
                                   saveOreditScoreACT={saveOreditScoreACT} 
                                   saveOreditScoreSAT={saveOreditScoreSAT} 
                                   saveOreditScoreSchool={saveOreditScoreSchool} 
                                   saveOreditScoreSATSub={saveOreditScoreSATSub}  
                                   DisableScoreACT={DisableScoreACT} 
                                   DisableScoreSAT={DisableScoreSAT} 
                                   DisableScoreSchool={DisableScoreSchool} 
                                   DisableScoreSATSub={DisableScoreSATSub} 
                                   DisableBasic={DisableBasic}  
                                   handleEditBasicInfo={handleEditBasicInfo} 
                                   handleEditScoreACT={handleEditScoreACT} 
                                   handleEditScoreSubject={handleEditScoreSubject} 
                                   handleEditScoreSAT={handleEditScoreSAT} 
                                   handleEditScoreSchool={handleEditScoreSchool}
                              />)} 
                           />
                        <Route exact path="/searchhighschool" render={() => (<FindSimilarHighSchool/>)} />
                      </React.Fragment>
                  }
                  {!user &&
                      <React.Fragment>
                          <Route exact path="/adduser" render={() => (<SignUpForm/>)} />
                          <Route path="/signin" render={() => (<SignInForm handleLogin={handleLogin}/>)}/> 
                      </React.Fragment>
                  } 
                  
              </Switch>
          </div>
    </div>
  );
}

export default App;