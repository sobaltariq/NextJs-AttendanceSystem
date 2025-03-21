import React, { useEffect, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "../modal/providers/MessageModalProvider";

const ChatBox = () => {
  const [chatHistory, setChatHistory] = useState();

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const messageSender = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  const getHistory = async () => {
    try {
      const response = await MyApi.get("/chat/");
      const { success, data } = response.data;
      if (success) {
        setChatHistory(data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Notice Error";
      showMessageModal("error", errorMessage, 5000);
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const messages = [
    "Hello there!",
    "How's your day going?",
    "Welcome to the chat!",
    "React is awesome!",
    "Keep pushing forward!",
    "What's your favorite movie?",
    "Did you try the new feature?",
    "Learning never stops!",
    "Enjoy the little things!",
    "Stay positive, stay coding!",
    "Here's a fun fact for you.",
    "Need help with your code?",
    "What's your latest project?",
    "Have a great day!",
    "Good luck with your work!",
    "Enjoy the little things!",
    "Welcome to the chat!",
    "React is awesome!",
    "Keep pushing forward!",
    "What's your favorite movie?",
    "Did you try the new feature?",
    "Learning never stops!",
    "Stay positive, stay coding!",
    "Here's a fun fact for you.",
    "Need help with your code?",
    "What's your latest project?",
    "Have a great day!",
  ];

  return (
    <div className="chat-container">
      <div className="message-list s-bar">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={messageSender}>
        <input type="text" name="chat" id="chat" placeholder="Type here..." />
        <SubmitButton label="Send" />
      </form>
    </div>
  );
};

export default ChatBox;
