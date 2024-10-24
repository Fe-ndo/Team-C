import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Home/page';
import ProfilePage from './Profile/page';
import LoginPage from './Login/page';
import { initializeApp } from 'firebase/app';
import {config} from './config/config'
import AuthRoute from './components/AuthRoute';

initializeApp(config.firebaseConfig);

export interface IApplicationProps{}

const Application: React.FunctionComponent<IApplicationProps> = (props) =>{
  return (
  <BrowserRouter>
    <Routes>
      <Route path="home" element ={<AuthRoute><HomePage /></AuthRoute>}/>
      <Route path="profile" element={<AuthRoute><ProfilePage /></AuthRoute>}/>
      <Route path="login" element={<LoginPage />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default Application;