import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  socket.on("room_data", (data) => {
    setUserCount(data.userCount);
  });

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Your name"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} userCount={userCount} />
      )}
    </div>
  );
}

export default App;
