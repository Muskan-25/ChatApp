import React from 'react'
import { Box, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


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

function SnackBar(props) {

  return (
    <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "fixed",
          bottom: "24px",
          zIndex: "1",
          left:0
        }}
      >
        <ThemeProvider theme={theme}>
          <Snackbar
            open={props.open}
            message={props.message}
            autoHideDuration={2000}
            onClose={props.handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{ display: "block", position: "sticky" }}
          />
        </ThemeProvider>
      </Box>
  )
}

export default SnackBar