import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Wrapper from './components/Wrapper';
import Login from './components/Login';
import Main from './components/Main';

const App = () => (
  <Router >
    {/* <div className="body"> */}
    <Wrapper>
      <Switch>
        <Route exact path="/" render={props => <Redirect to={{ pathname: '/login' }} />} />
        <Route path="/login" component={Login} />
        <Route path="/main" component={Main} />
      </Switch>
    </Wrapper>
    {/* </div> */}
  </Router>
);

export default App;

