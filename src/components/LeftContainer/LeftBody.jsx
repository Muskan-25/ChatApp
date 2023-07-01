import * as React from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import db from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import FriendContext from "../../FriendContext";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";

function LeftBody({ onFriendSelect }) {
  const [users, setUsers] = React.useState([]);
  //   const selectedFriend = React.useContext(FriendContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [recentMessage, setRecentMessage] = React.useState([]);
  const [messageSent, setMessageSent] = React.useState(true);
  const uID = localStorage.getItem("uID");
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getUsers() {
      const usersDocRef = await getDoc(doc(db, "users", uID));
      const friendsList = usersDocRef.data().friends;
      if (friendsList) {
        const friendsData = [];
        for (var i = 0; i < friendsList.length; i++) {
          const friendsDocRef = await getDocs(
            query(
              collection(db, "users"),
              where("userId", "==", friendsList[i])
            )
          );
          const friends = friendsDocRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          friendsData.push(...friends);
        }
        setUsers(friendsData);
        const recentMessagesOfFriends = friendsData.map(() => "");
        friendsData.forEach(async (friend, index) => {
          //display recent message
          var chatDocRef = await getDoc(doc(db, "chats", friend.chatId));
          var msgs = chatDocRef.data().messages;
          if (msgs.length === 0) {
            recentMessagesOfFriends[index] = "";
            setRecentMessage(recentMessagesOfFriends);
          } else {
            var messagesLength = msgs.length - 1;
            var recentmsg = msgs[messagesLength];
            recentMessagesOfFriends[index] = {
              text: recentmsg.text,
              senderId: recentmsg.senderId,
            };
            // if(recentmsg.senderId == uID){
            //   setMessageSent(true);
            // }else if(recentmsg.senderId != uID){
            //   setMessageSent(false);
            // }
            setRecentMessage(recentMessagesOfFriends);
          }
        });

        setIsLoading(false);
      } else {
        setRecentMessage([]);
        setUsers([]);
        setIsLoading(false);
      }
    }
    getUsers();
  }, [recentMessage]);

  const handleClick = async (userId) => {
    onFriendSelect(userId);
    const participants = [uID, userId];
    participants.sort(); // Sort the user IDs alphabetically

    const chatId = participants.join("-"); // Generate the chat ID

    const userDoc = await getDoc(doc(db, "users", uID));
    await updateDoc(userDoc.ref, {
      chatId: chatId,
    });
    const friendDoc = await getDoc(doc(db, "users", userId));
    await updateDoc(friendDoc.ref, {
      chatId: chatId,
    });

    // const chatID = userDoc.data().chatId;
    // check if the chat already exists or not
    const chat = await getDoc(doc(db, "chats", chatId));
    let timestamp;
    if (chat.exists()) {
      timestamp = chat.data().timestamp;
    } else {
      timestamp = Date.now();
      await setDoc(doc(db, "chats", chatId), {
        participants: participants,
        timestamp,
        messages: [],
      });
    }
    // document.querySelectorAll('.chats').style.display='flex';
    onFriendSelect(userId);

    // document.querySelectorAll('.contacts').style.display='none';
  };

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { md: "100vh", xs: "100vh" },
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "#fff" }} />
    </Box>
  ) : (
    <>
      {users.length > 0 ? (
        <Box sx={{ overflowY: "auto" }}>
          {users.map((user, index) => {
            // selectedFriend= user.userId;
            return (
              <Box
                sx={{
                  flexGrow: "0",
                  display: "grid",
                  gridTemplateRows: "1fr",
                }}
                key={index}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    padding: "10px 20px",
                  }}
                >
                  <Box sx={{ gridColumn: "-3", marginRight: "10px" }}>
                    <img
                      src={user.dp}
                      alt=""
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{ gridTemplateColumns: "1fr" }}
                    onClick={() => handleClick(user.userId)}
                  >
                    <Typography
                      sx={{ textTransform: "capitalize", cursor: "pointer" }}
                    >
                      {user.name}
                    </Typography>

                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        cursor: "pointer",
                        color: "#676767",
                        height: "21px",
                        overflow: "hidden",
                      }}
                    >
                      {recentMessage ? (
                        recentMessage[index].senderId===uID ? (
                          <CallMadeIcon style={{ fontSize: "15px" }} />
                        ) : (
                          <CallReceivedIcon style={{ fontSize: "15px" }} />
                        )
                      ) : (
                        ""
                      )}
                      {recentMessage ? recentMessage[index].text : ""}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: "1",
            display: "grid",
            gridTemplateRows: "1fr",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              placeItems: "center",
            }}
          >
            <Box sx={{ flexGrow: "1", display: "flex", placeItems: "center" }}>
              <Typography sx={{ color: "#698B8D" }}>
                Click here to{" "}
                <span
                  style={{ fontWeight: "600", cursor: "pointer" }}
                  onClick={() => {
                    navigate("../add-friends");
                    setIsLoading(false);
                  }}
                >
                  Add Friends
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default LeftBody;
