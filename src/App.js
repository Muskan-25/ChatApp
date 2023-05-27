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
      <Route path="ChatApp/login" element={<Login/>}/>
      <Route path="ChatApp/signup" element={<SignUp/>}/>
      <Route path="/*" element={uId != null ? <Home/> : <Navigate replace to={"../ChatApp/login"}/> }/>
    </Routes>
  </div>
    
  );
}

export default App;
