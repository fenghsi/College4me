import React, { useState, useEffect } from 'react';
import { Route, Switch,useHistory } from "react-router-dom";
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import SignUpForm from './components/user/SignUpForm';
import SignInForm from './components/user/SignInForm';
import { notification } from 'antd';


function App() {
    const [user, setUser] = useState(null);
    const [Student, setStudent] = useState(null);
    let history = useHistory();

    useEffect(() => {
      async function fetchData() {
          const res = await axios.get('/user');
          setUser(res.data.username);
      };
      fetchData();
    }, []);

  
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
        notification.open({
          message: "Logout Successfully",
          description:"bye ", 
          duration:2.5 
        });
        history.push('/');
    }

  
  
  return (
    <div>
       <Navbar user = {user} handleLogout={handleLogout}/>
          <div className="container">
              <Switch>
                  <Route exact path="/" render={() => (<Home/>)} />
                  {user &&
                      <React.Fragment>
                          <Route exact path="/profile" render={() => (<Profile Student={Student}/>)} />
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