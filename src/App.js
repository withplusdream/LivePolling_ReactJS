
import './App.css'
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Reset } from 'styled-reset'
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import AccessCodePage from './pages/user/AccessCodePage';
import LoginPage from './pages/manager/LoginPage';
import InputPage from './pages/user/InputPage';
import PollListPage from './pages/manager/PollListPage';
import EditPage from './pages/manager/EditPage';
import SlidePage from './pages/manager/SlidePage';
import Auth from './utils/auth'

const setScreenSize = () => {
  let vh = window.innerHeight * 0.01;
  
  document.documentElement.style.setProperty("--vh", `${vh}px`); //"--vh"라는 속성으로 정의해준다.
}

const theme = createTheme({
  typography: {
    fontFamily: 'BMJUA',
    button: {
      textTransform: 'none'
    }
  },
})

window.addEventListener('resize', () => setScreenSize());

const App = () => {
  setScreenSize()
  
  return (
    <ThemeProvider theme={theme}>
      <Reset/> {/* Reset CSS */}
      <Router>
        <Routes>
          {/* User Router */}
          <Route exact path="/" element={<AccessCodePage/>} />
          <Route exact path="/:id" element={<InputPage/>} />

          {/* Manager Router */}
          <Route exact path="/login" element={ <Auth Component={LoginPage} isAuthRequired={false}/> } />
          <Route exact path="/manager" element={ <Auth Component={PollListPage} isAuthRequired={true}/>} />
          <Route exact path="/manager/edit/:id" element={ <Auth Component={EditPage} isAuthRequired={true}/>} />
          <Route exact path="/manager/app/:id" element={ <Auth Component={SlidePage} isAuthRequired={true}/>} />
        </Routes>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;
