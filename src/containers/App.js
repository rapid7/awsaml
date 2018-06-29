import React, {Component} from 'react';
import {Route, Switch} from 'react-router';

import './App.css';
import Configure from './configure/Configure';
import Refresh from './refresh/Refresh';
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
          <Route exact path="/" component={Configure} />
          <Route path="/refresh" component={Refresh} />
          {debug ? <Route component={DebugRoute} /> : ''}
        </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
