import React, { useCallback, useEffect, useState } from "react";
import { SubmitButton } from "../buttons/CustomButtons";
import { UsersListInterface } from "@/types/api";

import { RxCross2 } from "react-icons/rx";
import { useSocket } from "@/context/SocketContext";
import { useMessageModal } from "./providers/MessageModalProvider";

interface CreateGroupChatInterface {
  users: UsersListInterface[];
  onClose: () => void;
}

const CreateGroupChatModal: React.FC<CreateGroupChatInterface> = ({
  users,
  onClose,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);
  const [currentParticipant, setCurrentParticipant] = useState<string>("");
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [toggleUsers, setToggleUsers] = useState<boolean>(false);

  const { emitEvent, onEvent, offEvent } = useSocket();
  const { showMessageModal } = useMessageModal();

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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "groupName") {
      setGroupName(value);
    } else if (name === "participants") {
      setCurrentParticipant(value);
      setToggleUsers(true);
    }
  };

  const handleAddParticipant = useCallback(
    (userId: string, name: string) => {
      if (!name.trim() || participants.some((p) => p.id === userId)) return;
      setToggleUsers(false);
      setParticipants((prev) => [...prev, { id: userId, name }]);
      setCurrentParticipant("");
    },
    [participants]
  );

  const handleRemoveParticipant = useCallback((userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chatType = "group";
    const participantIds = participants.map((p) => p.id);

    console.log("ok", { loggedInUserId, chatType, groupName, participants });

    if (groupName.trim() === "" || participants.length === 0) return;

    console.log("Creating group chat with:", {
      groupName,
      chatType,
      userId: loggedInUserId,
      participantIds,
    });

    emitEvent("joinRoom", {
      userId: loggedInUserId,
      chatType,
      groupName,
      participantIds,
    });
    onEvent<{
      chatId: string;
      chatType: string;
      message: string;
      success: boolean;
    }>("roomJoined", (data) => {
      console.log("Private Chat Event:", data);
      if (!data.success) {
        // onUserSelect(data.chatId); // Update URL
        // setActiveUserId(userId);
        showMessageModal("error", data.message, 5000);
      }

      onClose();
      showMessageModal("success", data.message, 5000);

      // Update the URL without refreshing the page
      // router.push(`/team-interaction-center?chatId=${data.chatId}`);
    });
  };

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
          placeholder="Search Member"
          value={currentParticipant}
          onChange={handleInputChange}
        />

        {toggleUsers && (
          <div className="users-wrapper">
            <div className="all-users-list s-bar">
              {users.filter(
                (user) =>
                  user._id !== loggedInUserId && // Exclude logged-in user
                  !participants.some((p) => p.id === user._id) && // Exclude already added participants
                  user.name
                    .toLowerCase()
                    .includes(currentParticipant.toLowerCase()) // Apply search filter
              ).length === 0 ? (
                <p className="no-users-found">No users found</p>
              ) : (
                users
                  .filter(
                    (user) =>
                      user._id !== loggedInUserId && // Exclude logged-in user
                      !participants.some((p) => p.id === user._id) && // Exclude already added participants
                      user.name
                        .toLowerCase()
                        .includes(currentParticipant.toLowerCase()) // Apply search filter
                  )
                  .map((user, i) => {
                    if (
                      user._id === loggedInUserId ||
                      participants.some((p) => p.id === user._id)
                    )
                      return;
                    return (
                      <div
                        key={i}
                        className="user-wrapper"
                        onClick={() => {
                          handleAddParticipant(user._id, user.username);
                        }}
                      >
                        <p>{user.name}</p>
                        <p>{user.username}</p>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* Show Added Participants */}
        {participants.length > 0 && (
          <div className="participants-list">
            {participants.map((p, index) => (
              <div key={index} className="participant">
                <span>{p.name}</span>
                <RxCross2
                  onClick={() => {
                    handleRemoveParticipant(p.id);
                  }}
                ></RxCross2>
              </div>
            ))}
          </div>
        )}
        <SubmitButton
          label="Create Chat"
          isLoading={!groupName || participants.length === 0}
        />
      </form>
    </div>
  );
};

export default CreateGroupChatModal;
