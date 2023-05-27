import * as React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
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
import LeftHeader from "./LeftContainer/LeftHeader";
import SnackBar from "./SnackBar";
import { useNavigate } from "react-router-dom";
import FriendRequests from "./FriendRequests";

function AddFriends() {
  const [users, setUsers] = React.useState([]);
  const uId = localStorage.getItem("uID");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  //   const navigate = useNavigate();
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
    async function getUsers() {
      // Fetch all users
      const allUsersDocRef = await getDocs(collection(db, "users"));
      const allUsers = allUsersDocRef.docs.map(async (user) => {
        const userID = user.data().userId;

        async function displayUsers() {
          // Active User Doc Ref
          const activeUserDocRef = await getDoc(doc(db, "users", uId));
          const friendsList = activeUserDocRef.data().friends || [];
          const friendRequestsList = activeUserDocRef.data().friendRequests || [];
          const usersCollectionRef = collection(db, "users");
          const querySnapshot = await getDocs(usersCollectionRef);

          const nonFollowedUsers = querySnapshot.docs
            .filter((doc) => !friendsList.includes(doc.id) && doc.id !== uId && !friendRequestsList.includes(doc.id))
            .map((doc) => doc.data());

          setUsers(nonFollowedUsers);
          setIsLoading(false);
          // Perform further actions with the non-followed users data
        }

        displayUsers();
      });
    }

    getUsers();
  }, []);

  const handleAddFriend = async (friendId) => {
    //update requestSent array in firebase
    const userDocRef = await getDoc(doc(db, "users", uId));
    await updateDoc(userDocRef.ref, {
      requestSent: arrayUnion(friendId),
    });

    //update friendRequest array in firebase
    const friendsDocRef = await getDoc(doc(db, "users", friendId));
    await updateDoc(friendsDocRef.ref, {
      friendRequests: arrayUnion(uId),
    });

    setSnackbar({
      open: true,
      message: "Friend request sent successfully.",
    });
    setTimeout(() => {
      navigate("../ChatApp/");
    }, 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: {
          md: "500px",
          xs: "100vh",
        },
        width: { md: "50%", xs: "100%" },
        backgroundColor: "#fff",
        boxShadow: "0px 0px 18px 0px #698b8db3",
        borderRadius: { md: "8px", xs: "0" },
        overflowY: "scroll",
      }}
    >
      <LeftHeader skipButton="Skip" />
      <Box
        sx={{
          background: "#ffd5d640",
          flexGrow: "1",
          borderRadius: "8px",
        }}
      >
        <FriendRequests />
        <Box sx={{ background: "#ffd5d640", padding: "10px 20px" }}>
          Add Friends
        </Box>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              placeItems: "center",
              height: "60vh",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "#698B8D" }} />
          </Box>
        ) : (
            users.length>0 ?(
                users.map((user, index) => {
                    console.log(user.friendRequests);
                    const isRequestSent = user.friendRequests && user.friendRequests.includes(uId);
                    return (
                      <Box key={user.userId}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "80px 1fr auto",
                            padding: "10px 20px",
                          }}
                        >
                          <Box sx={{ marginRight: "10px" }}>
                            <img
                              src={user.dp}
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
                              {user.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", placeItems: "center" }}>
                            {isRequestSent ? (
                              <Typography sx={{ color: "#333", fontWeight: "500", padding:'6px 8px', textTransform:'uppercase' }}>
                                Request Sent
                              </Typography>
                            ) : (
                              <Button
                                sx={{ color: "#698B8D", fontWeight: "500" }}
                                onClick={() => handleAddFriend(user.userId)}
                              >
                                Add a friend
                              </Button>
                            )}
                          </Box>
                        </Box>
                        <Divider />
                      </Box>
                    );
                  })
            ):(<Box sx={{ placeItems:'center', justifyContent:'center', display:'flex', height:'80px', color:'#747373'}}>
                No user found
            </Box>)
          
        )}
      </Box>
      <SnackBar
        open={snackbar.open}
        message={snackbar.message}
        handleSnackbarClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default AddFriends;
