import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate} from 'react-router-dom';
import db from '../firebase'; 
import { collection,query,getDocs, where } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';
import SignInWithGoogle from './SignInWithGoogle';

function Copyright(props) {
  return (
    <Typography variant="body2" color="inherit" align="center" {...props}>
      {'Copyright © '}
      <Link style={{textDecoration:'none',color:"#333"}} to="/">
      Chatophobia
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        input: {
            color: '#333', // red input color
          },
          root: {
              '&:before': {
                color:'#333' // color of the before pseudo-element
              },
              '&:after': {
                color:'#333' // color of the after pseudo-element
              },
              '&:hover:not(.Mui-disabled):before': {
                color:'#333' // color of the before pseudo-element on hover
              },
              '&.Mui-focused': {
                color:'#333' // color of the before pseudo-element when focused
              },
              color:'#333',
            },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
          notchedOutline: {
          borderColor: '#33333ab', // blue color
          },
          root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#333', // blue color
              },
              '&:(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: '#333', // blue color
              }, 
          },
      },
      },
      MuiCheckbox:{
        styleOverrides:{
          root:{
            color: '#333'
          }
        }
      },
      MuiInputBase:{
        styleOverrides:{
          input:{
            color: '#333',
          }
        }
      },
      MuiSnackbar: {
        styleOverrides:{
          root: {
            bottom:'0px' ,
            width :'320px'
          },
        }
        
      },
      MuiAutocomplete:{
        styleOverrides:{
          input:{
            backgroundColor:'transparent',
          }
        }
        
      },
    MuiInput: {
      styleOverrides: {
        input: {
          color: '#333', // input color
        },
        root: {
            '&:before': {
              borderBottom: '1px solid #333', // color of the before pseudo-element
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: '1px solid #333', // color of the before pseudo-element on hover
            },
          },
      },
    },
  },
});

export default function Login() {
  const [email,setEmail]=React.useState([]);
  const [password,setPassword]=React.useState([]);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email=="") {
      setSnackbar({
        open: true,
        message: 'Please enter your email.',
      });
      return;
    }

    if (password=="") {
      setSnackbar({
        open: true,
        message: 'Please enter your password.',
      });
      return;
    }
    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      setSnackbar({
        open: true,
        message: 'Invalid email or password!',
      });}
    else{
      querySnapshot.docs.map((doc)=>{
        var data = doc.data();
        localStorage.setItem("uID", data.userId);
        setSnackbar({
          open: true,
          message: 'Login successful!',
        });
        // navigate('/',{ replace: true });
        setTimeout(function() {navigate('../ChatApp/')},2000);
      })
      
    }

  };
  

  return (
    <Box sx={{minHeight:'100vh',display:'flex',placeItems:'center',justifyContent:'center'}}>
    <Box sx={{ bgcolor: '#fff', width:'80%', padding: '30px 20px 10px', boxShadow:'0px 0px 18px 0px #698b8db3', borderRadius:'8px' }}>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: '#ffd5d6' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5" sx={{color:'#698B8D', fontWeight:'600',letterSpacing:'0.06em'}}>
          Chatophobia
          </Typography> 
          <Typography component="p" variant="p">
            Login
          </Typography>         
          <Box component="form"  noValidate sx={{ mt: 1 ,padding:'24px 0'}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background:'#ffd5d6 !important', color:'#333', fontWeight:'600' }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link to="#" variant="body2" style={{color:'#fff', textDecoration:'none'}}>
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link to="../ChatApp/signup" className='loginSignupLink' variant="body2" style={{color:'#333',textDecoration:'none'}}>
                  Don't have an account?<span style={{fontWeight:'600', color:'#698B8D'}}> Sign Up</span> 
                </Link>
              </Grid>
            </Grid>
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