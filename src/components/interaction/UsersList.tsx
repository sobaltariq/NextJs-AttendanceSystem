import React, { useEffect, useState } from "react";
import { GroupChatListInterface, UsersListInterface } from "@/types/api";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import Image from "next/image";
import UserImage from "./UserImage";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

interface UsersListProps {
  users: UsersListInterface[];
  onUserSelect: (chatId: string) => void;
  setSelectedUserName: (userName: string) => void;
  groupsList: GroupChatListInterface[];
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onUserSelect,
  setSelectedUserName,
  groupsList,
}) => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const router = useRouter();

  // to show any message popup
  const { showMessageModal } = useMessageModal();
  const { emitEvent, onEvent } = useSocket(); // Access the socket instance

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

  // Grouping users by role
  const groupedUsers = Object.groupBy(users, (user) => user.role);

  // Combine admins first, then other users
  const sortedUsers = [
    ...(groupedUsers.admin || []),
    ...(groupedUsers.user || []),
  ];

  const handleSelectedUser = (
    userId: string,
    chatType: string,
    groupName?: string | null,
    participantIds?: string[] | [],
    groupId?: string | null
  ) => {
    const eventData: Record<string, any> = { userId, chatType };

    if (groupName && participantIds) {
      eventData.groupName = groupName;
      eventData.participantIds = participantIds;
    }

    emitEvent("joinRoom", eventData);
    onEvent<{
      chatId: string;
      chatType: string;
      groupAdmin?: string;
      message: string;
    }>("roomJoined", (data) => {
      console.log("Private Chat Event:", data);
      onUserSelect(data.chatId); // Update URL
      setActiveUserId(chatType === "private" ? userId : groupId ?? "");
      // Update the URL without refreshing the page
      // router.push(`/team-interaction-center?chatId=${data.chatId}`);
    });
  };

  return (
    <div className="users-list s-bar">
      {groupsList.map((group, i) => {
        return (
          <button
            key={i}
            className={`list-item group`}
            onClick={() => {
              handleSelectedUser(
                loggedInUserId ?? "",
                "group",
                group.groupName,
                group.participants,
                group._id
              );
            }}
            data-active={activeUserId === group._id}
          >
            <UserImage
              src={"/assets/profile-avatar.svg"}
              alt={group.groupName}
            />
            <p>{group.groupName}</p>
          </button>
        );
      })}
      {sortedUsers.map((user, i) => {
        return user._id === loggedInUserId ? null : (
          <button
            key={i}
            className={`list-item type-${user.role}`}
            onClick={() => {
              user._id != activeUserId &&
                handleSelectedUser(user._id, "private");
              setSelectedUserName(user.name);
            }}
            data-active={activeUserId === user._id}
          >
            <UserImage
              src={user.profilePicture ?? "/assets/profile-avatar.svg"}
              alt={user.name}
            />
            <p>{user.name}</p>
          </button>
        );
      })}
    </div>
  );
};

export default UsersList;
