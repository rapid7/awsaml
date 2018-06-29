import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import store, {history} from './store';
import CONSTANTS from './constants';
import {createAxiosInstances} from './apis';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import fontawesome from '@fortawesome/fontawesome';
import faCopy from '@fortawesome/fontawesome-free-regular/faCopy';
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

import App from './containers/App';

createAxiosInstances(CONSTANTS.endpoints);

fontawesome.library.add(faCopy, faTrashAlt, faExclamationTriangle);

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  target
);
