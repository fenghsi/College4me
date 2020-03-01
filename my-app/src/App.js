import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import Home from './components/Home';

function App() {
  return (
    <div>
          <div className="container">
              <Switch>
                  <Route exact path="" render={() => (<Home/>)} />
              </Switch>
          </div>
    </div>
  );
}

export default App;