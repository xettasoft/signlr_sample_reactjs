import { HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState("");
  const [_status, setStatus] = useState("");
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()

      .withUrl("https://localhost:6001/hubs/chat")
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
            //console.log(message);
            setChat(updatedChat);
          });
          connection.on("Status", (status) => {
            //console.log(status["message"]);
            setStatus(status["isTyping"] ? status["message"] : "");
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    //console.log(user, message);
    const chatMessage = {
      OrderId: 1,
      UserId: 1,
      //ShippingAgentId: null,
      //BuyingDeliveryAgentId: null,
      SenderName: user,
      message: message,
      connectionString: room,
      CreatedAt: new Date(),
    };

    const ChatStatus = {
      isTyping: false,
      message: "",
      connectionString: room,
    };

    if (connection.connectionStarted) {
      try {
        await connection.send("SendMessage", chatMessage);
        await connection.send("UserStatus", ChatStatus);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  const MessageStatus = async (user) => {
    const ChatStatus = {
      isTyping: true,
      message: `User ${user} is typing...`,
      connectionString: room,
    };

    if (connection.connectionStarted) {
      try {
        await connection.send("UserStatus", ChatStatus);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  const joingroup = async (boardId) => {
    console.log(boardId);
    setRoom(boardId);
    if (connection.connectionStarted) {
      try {
        connection.invoke("SubscribeToOrderChat", boardId);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return (
    <div>
      <ChatInput
        sendMessage={sendMessage}
        joingroup={joingroup}
        MessageStatus={MessageStatus}
      />
      <br />
      <p>{_status}</p>
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chat;
