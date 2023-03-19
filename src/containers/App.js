import React from 'react';
import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import Configure from './configure/Configure';
import Refresh from './refresh/Refresh';
import SelectRole from './select-role/SelectRole';
import ErrorBoundary from './ErrorBoundary';
import DebugRoute from './components/DebugRoute';

const debug = process.env.NODE_ENV === 'development';
const GlobalStyle = createGlobalStyle`
  @media (prefers-color-scheme: dark) {
    body {
      background: #333;
      color: rgb(249, 249, 249);
    }
  }

  @media (prefers-color-scheme: light) {
    body {
      background: rgb(249, 249, 249);
      color: #333;
    }
  }

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

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Configure />} path="/" />
            <Route element={<Refresh />} path="/refresh" />
            <Route element={<SelectRole />} path="/select-role" />
            {debug ? <Route element={<DebugRoute />} /> : ''}
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <GlobalStyle />
    </React.StrictMode>
  );
}

export default App;
