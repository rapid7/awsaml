import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCopy,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import {
  faSearch,
  faCaretRight,
  faCaretDown,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import App from './containers/App';

library.add(faCopy, faTrashAlt, faSearch, faCaretRight, faCaretDown, faExclamationTriangle);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
