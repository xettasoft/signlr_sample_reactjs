import React, { useState } from "react";

const ChatInput = (props) => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const isUserProvided = user && user !== "";
    const isMessageProvided = message && message !== "";

    if (isUserProvided && isMessageProvided) {
      props.sendMessage(user, message);
    } else {
      alert("Please insert an user and a message.");
    }
  };

  const onUserUpdate = (e) => {
    setUser(e.target.value);
  };

  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };

  const joinGroup = (e) => {
    //console.log(e.target.value);
    if (e && e.target.value !== undefined) props.joingroup(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="user">User:</label>
      <br />
      <input id="user" name="user" value={user} onChange={onUserUpdate} />
      <br />
      <label htmlFor="message">Message:</label>
      <br />
      <input
        type="text"
        id="message"
        name="message"
        value={message}
        onChange={onMessageUpdate}
      />
      <br />
      <label htmlFor="group">Select a Group:</label>
      <br />
      <select onChange={joinGroup} name="group">
        <option>Select</option>
        <option value="region_1">region_1</option>
        <option value="region_2">region_2</option>
        <option value="ee28cd33-ab34-48df-8180-1ec49b383ce9">Order_1</option>
      </select>
      <br />
      <br />
      <button>Submit</button>
    </form>
  );
};

export default ChatInput;
