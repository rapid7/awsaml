import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import {injectGlobal} from 'styled-components';
import store, {history} from './store';

import 'bootstrap/dist/css/bootstrap.min.css';

import fontawesome from '@fortawesome/fontawesome';
import faCopy from '@fortawesome/fontawesome-free-regular/faCopy';
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

import App from './containers/App';

/* eslint-disable no-unused-expressions */
injectGlobal`
  html {
    height: 100%;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    min-height: 100%;
    display: flex;
    align-items: center;
    background: rgb(249, 249, 249);
  }
  
  body > * {
    flex-grow: 1;
  }
  
  summary {
    padding: 0.25rem;
    display: flex;
    width: 100%;
    align-items: center;
  }
  
  dd {
    margin-bottom: 10px;
  }
  
  input[type="text"], input[type="url"] {
    border: 1px solid #6c757d;
  }
  .has-error .form-control, :invalid input {
    border: 2px solid red;
  }
`;
/* eslint-enable no-unused-expressions */

fontawesome.library.add(faCopy, faTrashAlt, faSearch, faExclamationTriangle);

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  target
);
