import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux" 
import store from "./store"
// import {positions,transitions, Provider as AlertProvider} from "react-alert"
// import AlertTemplate from "react-alert-template-basic";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <ToastContainer />
    <App />
  </Provider>
);