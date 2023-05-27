import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebase";
import {
  setDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import SignInWithGoogle from "./SignInWithGoogle";
import gravatarUrl from 'gravatar-url';

function Copyright(props) {
  return (
    <Typography variant="body2" color="inherit" align="center" {...props}>
      {"Copyright © "}
      <Link style={{ textDecoration: "none", color: "#333" }} to="/">
      Chatophobia
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        input: {
          color: "#333", // red input color
        },
        root: {
          "&:before": {
            color: "#333", // color of the before pseudo-element
          },
          "&:after": {
            color: "#333", // color of the after pseudo-element
          },
          "&:hover:not(.Mui-disabled):before": {
            color: "#333", // color of the before pseudo-element on hover
          },
          "&.Mui-focused": {
            color: "#333", // color of the before pseudo-element when focused
          },
          color: "#333",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#333", // blue color
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333", // blue color
          },
          "&:(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333", // blue color
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#333",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: "0px",
          width: "320px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#333",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          color: "#333", // input color
        },
        root: {
          "&:before": {
            borderBottom: "1px solid #333", // color of the before pseudo-element
          },

          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "1px solid #333", // color of the before pseudo-element on hover
          },
          "&:-internal-autofill-selected": {
            appearance: "menulist-button",
            backgroundImage: "none",
            backgroundColor: "#1a202c",
          },
        },
      },
    },
  },
});

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [password, setPassword] = React.useState([]);
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

  const uId = `${Date.now()}`;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name == "") {
      setSnackbar({
        open: true,
        message: "Please enter your name.",
      });
      return;
    }
    if (email == "") {
      setSnackbar({
        open: true,
        message: "Please enter your email.",
      });
      return;
    }
    if (password == "") {
      setSnackbar({
        open: true,
        message: "Please enter your password.",
      });
      return;
    }

    // Generate the random avatar URL using Gravatar
  const avatarUrl = gravatarUrl(email, { default: 'identicon' });

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Email already exists in Firestore
      setSnackbar({
        open: true,
        message: "Email already exists.",
      });
    } else {
      await setDoc(doc(db, "users", uId), {
        name,
        email,
        password,
        userId: uId,
        dp: avatarUrl
      });
      setSnackbar({
        open: true,
        message: "Registration Successful.",
      });
      localStorage.setItem("uID", uId);
      setTimeout(function () {
        navigate("../login");
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        placeItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ bgcolor: "#fff", width: { md: "50%", xs: "80%" }, padding:'30px 20px 10px', boxShadow:'0px 0px 18px 0px #698b8db3', borderRadius:'8px'}}>
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="md">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar> */}
              <Typography component="h1" variant="h5" sx={{color:'#698B8D', fontWeight:'600',letterSpacing:'0.06em'}}>
                Chatophobia
              </Typography>
              <Typography>
                Sign Up
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1, padding: "24px 0" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  autoComplete="off"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  autoComplete="off"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background:'#ffd5d6 !important', color:'#333', fontWeight:'600' }}
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
                <Link
                  to="../login"
                  variant="body2"
                  style={{ color: "#333", textDecoration: "none"}}
                  className="loginSignupLink"
                >
                  Already a User? <span style={{fontWeight:'600', color:'#698B8D'}}>Login Here</span>
                </Link>
                <SignInWithGoogle/>
              </Box>
              <Copyright sx={{ mt: 0, mb: 4 }} />
            </Box>
          </Container>
        </ThemeProvider>
      </Box>
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
  );
}
