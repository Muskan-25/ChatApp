import * as React from 'react'
import Home from './components/Home'
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  var uId = localStorage.getItem('uID');

  return (
  <div className='App'>
    <Routes>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<SignUp/>}/>
      <Route path="/*" element={uId != null ? <Home/> : <Navigate replace to={"login"}/> }/>
    </Routes>
  </div>
    
  );
}

export default App;
