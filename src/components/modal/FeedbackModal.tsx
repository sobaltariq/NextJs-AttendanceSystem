import React from "react";
interface AddFeedbackInterface {
  onClose: (newProfilePic: string) => void;
}
const FeedbackModal: React.FC<AddFeedbackInterface> = ({ onClose }) => {
  const dropDown = ["Bug Report", "Feature Request"];
  return (
    <div className="feedback-container">
      <form className="feedback-form">
        <select name="" id="">
          {dropDown.map((item, i) => {
            return (
              <option key={i} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <input type="text" />
        <input type="text" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default FeedbackModal;
