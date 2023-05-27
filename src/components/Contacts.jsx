import React from "react";
import { Box } from "@mui/material";
import LeftHeader from "./LeftContainer/LeftHeader";
import LeftBody from "./LeftContainer/LeftBody";

function Contacts({ onFriendSelect }) {
  // const friendId = useContext(FriendContext);

  const [isFriendSelected, setIsFriendSelected] = React.useState(false);

  const handleFriendSelect = (friend) => {
    setIsFriendSelected(!!friend);
    onFriendSelect(friend);
    const chatsElement = document.querySelector(".chats");
  const contactsElement = document.querySelector(".contacts");
  
  if (chatsElement && contactsElement) {
    if (window.innerWidth <= 600) {
      chatsElement.style.display = "flex";
      contactsElement.style.display = "none";
    } else {
      // Reset the display property for other device sizes
      chatsElement.style.display = "flex";
      contactsElement.style.display = "flex";
    }
  }

  };
  return (
    <Box
      sx={{
        background: "#ffd5d640",
        borderTopLeftRadius: { md: "8px", xs: "0" },
        borderBottomLeftRadius: { md: "8px", xs: "0" },
        flexGrow: "1",
        display: isFriendSelected ? { md: "flex", xs: "none" } : "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        bottom: 0,
      }}
      className="contacts"
    >
      <LeftHeader />
      <LeftBody onFriendSelect={handleFriendSelect} />
    </Box>
  );
}

export default Contacts;
