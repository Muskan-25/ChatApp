import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackBar from "../SnackBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function LeftHeader(props) {
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = React.useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem("uID");
    setTimeout(() => {
      navigate("../login");
    }, 1000);
    setSnackbar({
      open: true,
      message: "Logged out successfully.",
    });
  };

  const handleClick = (event) => {
    setMenuItem(event.currentTarget);
  };

  const handleClose = () => {
    setMenuItem(null);
  };

  return (
    <>
      <Box
        sx={{
          background: "#ffd5d6",
          padding: "10px 20px",
          borderTopLeftRadius: { md: "8px", xs: "0" },
          color: "#698B8D",
          
          display: "flex",
          placeItems: "center",
          justifyContent: "space-between",
          position:'sticky',
          top:0,
          zIndex:1
        }}
      >
        <Typography sx={{fontWeight: "600",
          letterSpacing: "0.06em",
          fontSize: "20px",cursor:'pointer'}} onClick={()=>{navigate('../')}}>
        Chatophobia
        </Typography>
        <Box sx={{ float: "right", display: "flex", gap: "20px" }}>
          <Typography
            sx={{
              padding: "0",
              color: "#333 !important",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("../");
            }}
          >
            {props.skipButton}
          </Typography>
          <MoreVertIcon onClick={handleClick} sx={{cursor :'pointer'}} />
          <Menu
            anchorEl={menuItem}
            keepMounted
            open={Boolean(menuItem)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Button
                sx={{
                  padding: "0",
                  fontSize: "12px",
                  color: "#21666a !important",
                  justifyContent:'flex-start'
                }}
                onClick={handleLogout}
              >
                {" "}
                Logout
              </Button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Button
                sx={{
                  padding: "0",
                  fontSize: "12px",
                  color: "#21666a !important",
                  justifyContent:'flex-start'
                }}
                onClick={()=>{navigate('../add-friends')}}
              >
                {" "}
                Add Friends
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <SnackBar
        open={snackbar.open}
        message={snackbar.message}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
}

export default LeftHeader;
