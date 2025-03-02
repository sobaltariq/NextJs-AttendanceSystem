"use client";
import React, { useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "./providers/MessageModalProvider";
interface AddFeedbackInterface {
  onClose: () => void;
}

const dropDown = ["Bug Report", "Feature Request"];

const FeedbackModal: React.FC<AddFeedbackInterface> = ({ onClose }) => {
  const [feedbackType, setFeedbackType] = useState<string>(dropDown[0]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!message.trim()) {
        showMessageModal("error", "Feedback message cannot be empty.", 5000);
        return;
      }

      const payload = { feedbackType, message };
      const response = await MyApi.post("/feedback", payload);

      const { success } = response.data;
      if (success) {
        showMessageModal("success", response.data?.message, 5000);
        onClose();
      }
      console.log(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Feedback Error";

      showMessageModal("error", errorMessage, 5000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  };

  return (
    <div className="give-feedback-modal">
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <select
            id="feedback-type"
            name="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
          >
            {dropDown.map((item, i) => {
              return (
                <option key={i} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-item">
          <textarea
            id="feedback-text"
            name="message"
            placeholder="Type here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="form-item">
          <SubmitButton label="Submit" isLoading={isLoading ? true : false} />
        </div>
      </form>
    </div>
  );
};

export default FeedbackModal;
