import React from "react";

const EditMyProfile: React.FC = () => {
  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-modal__header">
        <h2 className="edit-profile-modal__title">Edit Profile</h2>
        <button className="edit-profile-modal__close" type="button">
          <svg
            className="edit-profile-modal__close-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M6 18L18 6M6 6l12
          18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EditMyProfile;
