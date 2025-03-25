import React, { useEffect, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import { UsersListInterface } from "@/types/api";

interface CreateGroupChatInterface {
  users: UsersListInterface[];
  onClose: () => void;
}

const CreateGroupChatModal: React.FC<CreateGroupChatInterface> = ({
  users,
  onClose,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<string>("");
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [toggleUsers, setToggleUsers] = useState<boolean>(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "groupName") {
      setGroupName(value);
    } else if (name === "participants") {
      setCurrentParticipant(value);
    }
  };

  const handleAddParticipant = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("====================================");
    console.log(toggleUsers);
    console.log("====================================");
    if (e.key === "Enter" && currentParticipant.trim() !== "") {
      e.preventDefault();
      setParticipants((prev) => [...prev, currentParticipant.trim()]);
      setCurrentParticipant(""); // Clear input field
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() === "" || participants.length === 0) return;

    console.log("Creating group chat with:", { groupName, participants });

    // Call API here to create group chat

    onClose();
  };

  // Grouping users by role
  const groupedUsers = Object.groupBy(users, (user) => user.role);

  // Combine admins first, then other users
  const sortedUsers = [
    ...(groupedUsers.admin || []),
    ...(groupedUsers.user || []),
  ];

  return (
    <div className="create-group-modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="groupName"
          id="groupName"
          placeholder="Group Name"
          value={groupName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="participants"
          id="participants"
          placeholder="Enter Member & Press Enter"
          value={currentParticipant}
          onChange={handleInputChange}
          onKeyDown={handleAddParticipant}
        />

        <div className="all-users-list s-bar">
          {sortedUsers.map((user, i) => {
            return (
              <div key={i} className="user-wrapper">
                <p>{user.name}</p>
                <p>{user.username}</p>
              </div>
            );
          })}
        </div>

        {/* Show Added Participants */}
        {participants.length > 0 && (
          <div className="participants-list">
            {participants.map((p, index) => (
              <span key={index} className="participant">
                {p}
              </span>
            ))}
          </div>
        )}
        <SubmitButton
          label="Send"
          isLoading={!groupName || participants.length === 0}
        />
      </form>
    </div>
  );
};

export default CreateGroupChatModal;
