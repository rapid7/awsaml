/*global process:true*/
import React, {Component} from 'react';
import {
  Route,
  Switch
} from 'react-router';

import Configure from './configure/Configure';
import Refresh from './refresh/Refresh';
import SelectRole from './select-role/SelectRole';
import ErrorBoundary from './ErrorBoundary';
import DebugRoute from './components/DebugRoute';

import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const debug = process.env.NODE_ENV === 'development';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Switch>
          <Route
            component={Configure}
            exact
            path="/"
          />
          <Route
            component={Refresh}
            path="/refresh"
          />
          <Route
            component={SelectRole}
            path="/select-role"
          />
          {debug ? <Route component={DebugRoute} /> : ''}
        </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
