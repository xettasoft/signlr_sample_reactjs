import { HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44320/hubs/notification")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveOrderMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
          });
          connection.on("RegionSubscription", (message) => {
            const chatMessage = {
              user: "rygio",
              message: message,
            };
            const updatedChat = [...latestChat.current];
            updatedChat.push(chatMessage);

            setChat(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    if (connection.connectionStarted) {
      try {
        await connection.send("SendMessage", chatMessage);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  const joingroup = async (boardId) => {
    console.log(boardId);
    if (connection.connectionStarted) {
      try {
        connection.invoke("SubscribeToOrderActivity", boardId);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return (
    <div>
      <ChatInput sendMessage={sendMessage} joingroup={joingroup} />
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chat;
