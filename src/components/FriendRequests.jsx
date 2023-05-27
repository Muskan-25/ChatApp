import * as React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import db from "../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import SnackBar from "./SnackBar";
import { useNavigate } from "react-router-dom";

function FriendRequests() {
  const [friendRequests, setFriendRequests] = React.useState([]);
  const uID = localStorage.getItem("uID");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  React.useEffect(() => {
    async function getRequests() {
      const userDocRef = await getDoc(doc(db, "users", uID));
      const userFriendRequests = userDocRef.data().friendRequests;
      if (userFriendRequests) {
        const requestsData = [];
        for (let i = 0; i < userFriendRequests.length; i++) {
          const friendRequestUserIdDocRef = await getDocs(
            query(
              collection(db, "users"),
              where("userId", "==", userFriendRequests[i])
            )
          );
          const requests = friendRequestUserIdDocRef.docs.map((doc) => {
            return { ...doc.data() };
          });
          requestsData.push(...requests);
        }
        setFriendRequests(requestsData);
      } else {
        setFriendRequests([]);
      }
    }
    getRequests();
  }, []);

  const handleAddFriend = async (requestId) => {
    //update friends array in user doc
    const userDocRef = await getDoc(doc(db, "users", uID));
    await updateDoc(userDocRef.ref, {
      friends: arrayUnion(requestId),
    });

    //update friends array in friend's doc
    const friendDocRef = await getDoc(doc(db, "users", requestId));
    await updateDoc(friendDocRef.ref, {
      friends: arrayUnion(uID),
    });

    //update requestSent array in friend's doc
    const requestSentArray = friendDocRef.data().requestSent;
    const updateRequestSentArray = requestSentArray.filter(
      (request) => request !== uID
    );
    await updateDoc(friendDocRef.ref, {
      requestSent: updateRequestSentArray,
    });

    //Remove friendRequests array in user's doc after accepting the request
    const friendRequestsArray = userDocRef.data().friendRequests;
    const updateFriendRequests = friendRequestsArray.filter(
      (friendRequests) => friendRequests !== requestId
    );
    await updateDoc(userDocRef.ref, {
      friendRequests: updateFriendRequests,
    });
    setSnackbar({
        open: true,
        message: "Friend added successfully!"
    });
    setTimeout(()=>{navigate('../ChatApp/')},2000)
  };

  const handleRemoveFriend = async (requestId) => {
    try {
      const userDocRef = doc(db, "users", uID);

      // Get the user document
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const friendsArray = userDoc.data().friendRequests;
        console.log(friendsArray);
        // Remove the friend from the array
        const updatedFriendsArray = friendsArray.filter(
          (friendId) => friendId !== requestId
        );

        // Update the document with the modified array
        await updateDoc(userDocRef, {
          friendRequests: updatedFriendsArray,
        });

        console.log("Friend removed successfully!");
        setSnackbar({
            open: true,
            message: "Friend removed successfully!"
        });
        setTimeout(()=>{navigate('../ChatApp/')},2000)
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setSnackbar({
        open: true,
        message: "Error removing friend. Please try again later."
    });
    }
  };

  return (
    <>
      {friendRequests.length > 0 && (
        <Box sx={{ background: "#ffd5d640", padding: "10px 20px" }}>
          Friend Requests
        </Box>
      )}

      {friendRequests.map((request) => (
        <Box key={request.userId}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              padding: "10px 20px",
            }}
          >
            <Box sx={{ marginRight: "10px" }}>
              <img
                src={request.dp}
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", placeItems: "center" }}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {request.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", placeItems: "center" }}>
              <Button
                sx={{ color: "#698B8D", fontWeight: "500" }}
                onClick={() => handleRemoveFriend(request.userId)}
              >
                Remove
              </Button>
              <Button
                sx={{ color: "#698B8D", fontWeight: "500" }}
                onClick={() => handleAddFriend(request.userId)}
              >
                Add a friend
              </Button>
            </Box>
          </Box>
          <Divider />
        </Box>
      ))}
      <SnackBar
        open={snackbar.open}
        message={snackbar.message}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
}

export default FriendRequests;
