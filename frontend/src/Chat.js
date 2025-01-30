import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

function Chat({ socket, username, room, userCount }) {
     const [currentMessage, setCurrentMessage] = useState("");
     const [messageList, setMessageList] = useState([]);

     const sendMessage = async () => {
          if (currentMessage !== "") {
               const messageData = {
                    room: room,
                    author: username,
                    message: currentMessage,
                    time: new Date(Date.now()).toLocaleTimeString(),
               };

               await socket.emit("send_message", messageData);
               setMessageList((list) => [...list, messageData]);
               setCurrentMessage("");
          }
     };

     useEffect(() => {
          socket.off("receive_message").on("receive_message", (data) => {
               setMessageList((list) => [...list, data]);
          });

          return () => {
               socket.off("receive_message");
          };
     }, [socket]);

     return (
          <div className="chat-window">
               <div className="chat-header">
                    <p>Live Chat - Room {room}</p>
                    <p className="user-count">Users: {userCount}</p>
               </div>
               <div className="chat-body">
                    <ScrollToBottom className="message-container">
                         {messageList.map((messageContent, index) => (
                              <div
                                   key={index}
                                   className={`message ${username === messageContent.author ? "you" : "other"}`}

                              >
                                   <div>
                                        <div className="message-content">
                                             <p>{messageContent.message}</p>
                                        </div>
                                        <div className="message-meta">
                                             <p className="time">{messageContent.time}</p>
                                             <p className="author">{username === messageContent.author ? "You" : messageContent.author}</p>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </ScrollToBottom>
               </div >
               <div className="chat-footer">
                    <input
                         type="text"
                         value={currentMessage}
                         placeholder="Type a message"
                         onChange={(e) => setCurrentMessage(e.target.value)}
                         onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
               </div>
          </div >
     );
}

export default Chat;