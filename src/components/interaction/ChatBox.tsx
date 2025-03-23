import React, { useEffect, useRef, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import { useSocket } from "@/context/SocketContext";
import { IMessageInterface, ReceivedMessageInterface } from "@/types/api";
import { formatDate, formattedDay, formatTime } from "../utils/globalUse";

interface CurrentIdInterface {
  currentChatId: string;
  selectedUserName: string;
}

const ChatBox: React.FC<CurrentIdInterface> = ({
  currentChatId,
  selectedUserName,
}) => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<IMessageInterface[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [displayChatTime, setDisplayChatTime] = useState<string | null>(null);

  // to show any message popup
  const { showMessageModal } = useMessageModal();
  const { emitEvent, onEvent, offEvent } = useSocket(); // Access the socket instance

  const getHistory = async () => {
    try {
      const response = await MyApi.get(`/chats/${currentChatId}`);
      const { success, data } = response.data;
      if (success) {
        setChatHistory(data.reverse());
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

  useEffect(() => {
    // Fetch logged-in user ID from localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        const { id } = JSON.parse(loggedInUser);
        setLoggedInUserId(id);
      } catch (error) {
        console.error("Error parsing loggedInUser:", error);
      }
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className="chat-container">
      {chatHistory.length < 1 ? (
        <p className="say-hi">Say Hi!</p>
      ) : (
        <div className="message-list s-bar">
          {chatHistory.map((message, index) => {
            return (
              <div key={index} className="inner-wrapper">
                {/* {formattedDay(message.timestamp) === displayChatTime && (
                  <p>{formattedDay(message.timestamp)}</p>
                )} */}
                <div
                  className="message"
                  data-user={loggedInUserId === message.senderId}
                >
                  <p className="name">
                    {loggedInUserId === message.senderId
                      ? "You"
                      : selectedUserName}
                  </p>
                  <p className="content">{message.content}</p>
                  <p className="date">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
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
