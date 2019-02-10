import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import Signup from '../Components/Signup';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/signup" component={Signup} />
    </Switch>
  </Router>
);

export default App;
