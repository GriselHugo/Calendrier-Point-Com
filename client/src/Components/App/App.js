//App.js
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from '../Login/Login';
import Navbar from '../Navbar/Navbar';
import Router from '../Router/Router';

function App() {
  const [isLogged, setIsLogged] = useState(parseInt(localStorage.getItem('isLogged') || 0));

  return (
    isLogged ? (
      <BrowserRouter>
        <Navbar />
        <Router />
      </BrowserRouter>
    ) : (
      <Login setIsLogged={setIsLogged} />
    )
  );
}

export default App;
