import React from "react";
import Message from "./Message";

const ChatWindow = (props) => {
  const chat = props.chat.map((m) => (
    <Message
      key={Date.now() * Math.random()}
      user={m.senderName}
      message={m.message}
      dateTime={m.createdAt}
    />
  ));

  return <div>{chat}</div>;
};

export default ChatWindow;
