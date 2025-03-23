import React, { useEffect, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import { useSocket } from "@/context/SocketContext";
import { IMessageInterface, ReceivedMessageInterface } from "@/types/api";

interface CurrentIdInterface {
  currentChatId: string;
}

const ChatBox: React.FC<CurrentIdInterface> = ({ currentChatId }) => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<IMessageInterface[]>([]);

  // to show any message popup
  const { showMessageModal } = useMessageModal();
  const { emitEvent, onEvent, offEvent } = useSocket(); // Access the socket instance

  const getHistory = async () => {
    try {
      const response = await MyApi.get(`/chats/${currentChatId}`);
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
      console.log(err);
    }
  };

  useEffect(() => {
    getHistory();
  }, [currentChatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setMessage(value);
  };

  const messageSender = async (event: React.FormEvent) => {
    event.preventDefault();

    emitEvent("sendMessage", { chatId: currentChatId, message });

    onEvent<{ chatId: string; message: string }>("messageSent", (data) => {
      console.log("messageSent Private Chat Event:", data);
    });

    setMessage("");
  };

  useEffect(() => {
    console.log("Listening for messages...");

    // Listening for incoming messages
    onEvent("messageReceived", (data: ReceivedMessageInterface) => {
      const { chatId, message } = data;
      console.log("Message received:", chatId === currentChatId, data);
      if (chatId === currentChatId) {
        setChatHistory((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      console.log("Removing message listener...");
      offEvent("messageReceived");
    };
  }, [currentChatId, onEvent]);

  return (
    <div className="chat-container">
      {chatHistory.length < 1 ? (
        <p style={{ textAlign: "center" }}>Say Hi!</p>
      ) : (
        <div className="message-list s-bar">
          {chatHistory.map((message, index) => (
            <div key={index} className="message">
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={messageSender}>
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Type here..."
          value={message}
          onChange={handleInputChange}
        />
        <SubmitButton label="Send" isLoading={message ? false : true} />
      </form>
    </div>
  );
};

export default ChatBox;
