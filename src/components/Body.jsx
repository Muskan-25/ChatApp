import * as React from "react";
import Chat from "./Chat";
import Contacts from "./Contacts";
import { Box, CircularProgress } from "@mui/material";
import AddFriends from "./AddFriends";
import db from '../firebase'
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import FriendContext from "../FriendContext";

function Body() {
  const uID = localStorage.getItem('uID');
  const hasVisitedBefore = localStorage.getItem('visitedBefore');
  const [isLoading, setIsLoading] =React.useState(true);
  const [selectedFriend, setSelectedFriend] = React.useState(null);
  const navigate = useNavigate();

  async function load(){
    const usersDocRef= await getDoc(doc(db, 'users', uID));
    const friendsList = usersDocRef.data().friends;
    if(friendsList){
      setIsLoading(false);
    }else{
      if(!hasVisitedBefore){
        setIsLoading(false);
        navigate('../add-friends');
        localStorage.setItem('visitedBefore',true);
      }else{
        setIsLoading(false);
      }
      
    }
  }
  load();

  return (
    isLoading ? (
      <Box sx={{display:'flex',flexDirection:'column', height:{md:'100vh', xs:'100vh'}, justifyContent:'center'}}>
        <CircularProgress sx={{color:'#fff'}}/>
      </Box>
    ):(
    <Box
      sx={{
        display: "flex",
        height: {
          md: "500px",
          xs: "100vh"
        },
        width:{md:'50%', xs:'100%'},
        backgroundColor:'#ffffff',
        boxShadow: "0px 0px 18px 0px #698b8db3",
        borderRadius: {md:"8px", xs:'0'},
      }}
    >
      <FriendContext.Provider value={selectedFriend}>
        <Contacts onFriendSelect = {setSelectedFriend}/><Chat selectedFriend={selectedFriend}/>
      </FriendContext.Provider>
    </Box>)
  );
}

export default Body;
