import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Body from './Body';
import AddFriends from './AddFriends';

function Home() {
  return (
    <div className='App'>
        <Routes>
            <Route path="ChatApp/" element={<Body/>}/>
            <Route path="ChatApp/add-friends" element={<AddFriends/>}/>
        </Routes>
    </div>
    )
}

export default Home