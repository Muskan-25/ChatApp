import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import db from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import gravatarUrl from 'gravatar-url';

const theme = createTheme({
    components: {
        MuiSnackbar: {
            styleOverrides:{
              root: {
                bottom:'0px' ,
                width :'320px'
              },
            }
            
          },
    }
});


const auth = getAuth();

function SignInWithGoogle() {
    const [snackbar, setSnackbar] = React.useState({
            open: false,
            message: '',
            });
            
            const handleSnackbarClose = () => {
            setSnackbar({
                ...snackbar,
                open: false,
            });
    };

    const navigate = useNavigate();
    const uId = `${Date.now()}`;
    const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      // Generate the random avatar URL using Gravatar
      const avatarUrl = gravatarUrl(user.email, { default: 'identicon' });

      if (!querySnapshot.empty) {
        const docRef = await getDocs(query(collection(db, 'users'), where("email",'==',user.email)));
        docRef.docs.map((doc)=>{
            var data = doc.data();
            localStorage.setItem('uID', data.userId);
            setTimeout(()=>{navigate('../ChatApp/')},2000);
            setSnackbar({
                open: true,
                message: "Login successful!"
            });
            return data;
        })
      } else {
        // Store user information in Firestore
        const userRef = doc(db, "users", uId);
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          userId: uId,
          dp:avatarUrl
          // photoURL: user.photoURL,
        });
        localStorage.setItem("uID", uId);
        setTimeout(function () {
          navigate("../ChatApp/");
        }, 2000);
        setSnackbar({
            open: true,
            message: "Login successful!"
        });
      }

      // User successfully logged in with Google and data stored in Firestore
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error while logging in. Please try again."
    });
      // Handle login error
    }
  };
  return (
    <>
      <Divider sx={{ margin: "20px 0" }}>or</Divider>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleClick}>
          <img
            src="../icons8-google-48.png"
            alt="google"
            style={{ width: "20px", marginRight: "10px" }}
          />{" "}
          Sign in with Google
        </Button>
        <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              position: "fixed",
              bottom: "24px",
              zIndex: "1",
            }}
          >
            <ThemeProvider theme={theme}>
              <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ display: "block", position: "sticky" }}
              />
            </ThemeProvider>
          </Box>
      </Box>
    </>
  );
}

export default SignInWithGoogle;
