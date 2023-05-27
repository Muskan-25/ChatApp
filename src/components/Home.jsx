import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Body from './Body';
import AddFriends from './AddFriends';

function Home() {
  return (
    <div className='App'>
        <Routes>
            <Route path="/" element={<Body/>}/>
            <Route path="/add-friends" element={<AddFriends/>}/>
        </Routes>
    </div>
    )
}

export default Home