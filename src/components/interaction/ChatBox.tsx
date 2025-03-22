import React, { useEffect, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import { useSocket } from "@/context/SocketContext";
import { IMessageInterface } from "@/types/api";

interface CurrentIdInterface {
  currentChatId: string;
}

const ChatBox: React.FC<CurrentIdInterface> = ({ currentChatId }) => {
  const [chatHistory, setChatHistory] = useState<IMessageInterface[]>([]);

  // to show any message popup
  const { showMessageModal } = useMessageModal();
  const { emitEvent, onEvent } = useSocket(); // Access the socket instance

  const messageSender = async (event: React.FormEvent) => {
    event.preventDefault();

    emitEvent("sendMessage", { chatId: currentChatId, message: "ok" });
    // onEvent<{ chatId: string; chatType: string; message: string }>(
    //   "roomJoined",
    //   (data) => {
    //     console.log("Private Chat Event:", data);
    //     onUserSelect(data.chatId); // Update URL
    //     setActiveUserId(userId);
    //   }
    // );
  };

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
        <input type="text" name="chat" id="chat" placeholder="Type here..." />
        <SubmitButton label="Send" />
      </form>
    </div>
  );
};

export default ChatBox;
