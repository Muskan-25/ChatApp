import * as React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import db from "../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "6px",
        },
        notchedOutline: {
          border: "0px",
          color: "#333",
        },
        root:{
          padding:'0px !important',
        }
      },
    },
  },
});

function Chat({ selectedFriend }) {
  const [friends, setFriends] = React.useState(false);
  const [chat, setChat] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [allMessages, setAllMessages] = React.useState([]);
  const [user, setUser] = React.useState("");
  const [friend, setFriend] = React.useState("");
  const uID = localStorage.getItem("uID");
  const navigate = useNavigate();
  const participants = [uID, selectedFriend];
  participants.sort(); // Sort the user IDs alphabetically

  const uniqueID = participants.join("-");

  //Check if user have any friends added or not
  React.useEffect(() => {
    async function getFriends() {
      const usersDocRef = await getDoc(doc(db, "users", uID));
      const friendsList = usersDocRef.data().friends;
      if (friendsList) {
        setFriends(true);
      }
    }
    getFriends();
  }, [selectedFriend]);

  React.useEffect(() => {
    setMessage("");
    if (selectedFriend) {
      const fetchFriendData = async () => {
        try {
          const friendDocRef = doc(db, "users", selectedFriend);
          const friendDocSnap = await getDoc(friendDocRef);
          if (friendDocSnap.exists()) {
            const friendData = friendDocSnap.data();
            setChat(friendData);
          }
        } catch (error) {
          console.error("Error fetching friend data:", error);
        }
      };

      fetchFriendData();
    }
  }, [selectedFriend]);

  //Fetch messages from the Firestore collection
  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatDocRef = doc(db, "chats", uniqueID);
        const userDocRef = await getDoc(doc(db, "users", uID));
        setUser(userDocRef.data());

        const friendDocRef = await getDoc(doc(db, "users", selectedFriend));
        setFriend(friendDocRef.data());

        const unsubscribe = onSnapshot(chatDocRef, (chatDocSnapshot) => {
          if (chatDocSnapshot.exists()) {
            const messages = chatDocSnapshot.data().messages || [];
            const sortedMessages = messages.sort(
              (message1, message2) => message1.timestamp - message2.timestamp
            );
            setAllMessages(sortedMessages);
          } else {
            setAllMessages([]); // If the chat document doesn't exist, set an empty array for messages
          }
        });

        return unsubscribe; // Clean up the listener when the component unmounts or when the dependency changes
      } catch (err) {
        console.log(err);
      }
    };

    const unsubscribe = fetchMessages();

    return () => unsubscribe; // Clean up the listener when the component unmounts or when the dependency changes
  }, [selectedFriend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date();
    const chatDocRef = doc(db, "chats", uniqueID);
    const chatDocSnapshot = await getDoc(chatDocRef);

    if (chatDocSnapshot.exists()) {
      const messages = chatDocSnapshot.data().messages || [];
      const updatedMessages = {
        senderId: uID,
        text: message,
        timestamp,
      };

      await updateDoc(chatDocRef, {
        messages: arrayUnion(updatedMessages),
      });
    }
    setMessage(""); // Clear the input field after submitting the message
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
  };

  return (
    /* header area for chat */
    selectedFriend ? (
      <Box
        sx={{
          background: "#fff",
          borderTopRightRadius: { md: "8px", xs: "0" },
          borderBottomRightRadius: { md: "8px", xs: "0" },
          width:
            (friends && { md: "65%", xs: "100%" }) ||
            (selectedFriend && { md: "65%", xs: "100%" }),
          display: friends
            ? { md: "flex", xs: "flex" }
            : { md: "none", xs: "none" },
          flexDirection: "column",
        }}
        className="chats"
      >
        {chat && (
          <>
            <Box
              sx={{
                background: "#fbe8e9",
                padding: { md: "10px 20px", xs: "10px" },
                borderTopRightRadius: { md: "8px", xs: "0" },
                color: "#333",
                position: "sticky",
                top: "0px",
              }}
            >
              <Box sx={{ display: "flex", placeItems: "center" }}>
                <ArrowBackIosNewIcon
                  sx={{
                    cursor: "pointer",
                    fontSize: "18px",
                    marginRight: "10px",
                    display: { md: "none", xs: "block" },
                  }}
                  onClick={() => {
                    // setFriends(false);
                    document.querySelector(".chats").style.display = "none";
                    document.querySelector(".contacts").style.display = "flex";
                    // navigate('./');
                  }}
                />
                <img
                  src={chat.dp}
                  alt="dp"
                  style={{
                    width: "26px",
                    borderRadius: "50px",
                    marginRight: "10px",
                  }}
                />
                <Typography sx={{ color: "#333" }}>{chat.name}</Typography>
              </Box>
            </Box>
            {/* Body Area for chat if any chat is active */}
            <Box
              sx={{
                background: "#bee0e275",
                padding: { md: "10px 20px", xs: "10px" },
                color: "#333",
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {allMessages.map((message, index) => {
                const previousMessage =
                  index > 0 ? allMessages[index - 1] : null;
                const showProfilePicture =
                  !previousMessage ||
                  previousMessage.senderId !== message.senderId;
                return (
                  <Box
                    key={index}
                    sx={{
                      textAlign: "left",
                      marginBottom: "8px",
                      display: "flex",
                      flexDirection:
                        message.senderId === uID ? "row-reverse" : "row",
                      alignItems: "center",
                      marginLeft: message.senderId === uID ? "22%" : "0",
                      marginRight: message.senderId === uID ? "0" : "22%",
                      placeItems: "flex-start",
                    }}
                  >
                    {showProfilePicture ? (
                      <Box
                        sx={{
                          marginLeft: "5px",
                          marginRight: "5px",
                          padding: "2px 0",
                        }}
                      >
                        {user && (
                          <img
                            src={message.senderId === uID ? user.dp : friend.dp}
                            style={{
                              width: "20px",
                              borderRadius: "50px",
                            }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          marginLeft: "5px",
                          marginRight: "5px",
                          padding:'0px 10px'
                        }}
                      ></Box>
                    )}
                    <Box
                      sx={{
                        backgroundColor:
                          message.senderId === uID ? "#fff" : "#bee0e275",
                        padding: "2px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      <Typography sx={{ wordWrap: "break-word" }}>
                        <pre style={{wordWrap:'break-word', whiteSpace:'pre-wrap', fontFamily:'inherit', margin:'0'}}>{message.text}</pre>
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            {/* Footer Area for chat if any chat is active */}
            <Box
              sx={{
                background: "#fff",
                borderBottomRightRadius: { md: "8px", xs: "0" },
                color: "#333",
                position: "sticky",
                bottom: "0px",
              }}
            >
              <form onSubmit={handleSubmit} style={{ display: "flex" }}>
                <ThemeProvider theme={theme}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="message"
                    placeholder="Type Something..."
                    name="message"
                    autoComplete="off"
                    autoFocus
                    value={message}
                    onChange={handleChange}
                    multiline
                    sx={{
                      margin: "0px !important",
                      fontSize: "16px",
                      border: "0",
                      padding:'0'
                    }}
                  />
                </ThemeProvider>
                <Button onClick={handleSubmit} disabled={message.length === 0}>
                  <SendIcon />
                </Button>{" "}
              </form>
            </Box>
          </>
        )}
      </Box>
    ) : (
      friends && (
        /* Chat Area when no chat is active */
        <Box
          sx={{
            background: "#fff",
            borderTopRightRadius: { md: "8px", xs: "0" },
            borderBottomRightRadius: { md: "8px", xs: "0" },
            width:
              (friends && { md: "65%", xs: "100%" }) ||
              (selectedFriend && { md: "65%", xs: "100%" }),
            display: { md: "flex", xs: "none" },
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: { md: "flex", xs: "none" },
              placeItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#aaa8a8" }}>
              Choose a chat to start the conversation
            </Typography>
          </Box>
        </Box>
      )
    )
  );
}

export default Chat;
