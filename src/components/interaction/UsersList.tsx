import React from "react";
import { UsersListInterface } from "@/types/api";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import Image from "next/image";
import UserImage from "./UserImage";
import useSocket from "@/hooks/useSocket";

interface UsersListProps {
  users: UsersListInterface[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const { socket, isConnected, emitEvent, onEvent, offEvent, reconnect } =
    useSocket({
      onConnect: () => console.log("Connected to server"),
      onDisconnect: (reason) => console.log(`Disconnected: ${reason}`),
      onError: (error) => console.error("Connection error:", error),
    });

  // Grouping users by role
  const groupedUsers = Object.groupBy(users, (user) => user.role);

  // Combine admins first, then other users
  const sortedUsers = [
    ...(groupedUsers.admin || []),
    ...(groupedUsers.user || []),
  ];

  // const handleSelectedUser = (userId: string, type: string) => {
  //   if (!isConnected) return;

  //   // Join the room
  //   emitEvent("joinRoom", { userId: userId, chatType: type });

  //   // Listen for incoming messages
  //   onEvent("message", (data: { user: string; message: string }) => {
  //     console.log("New message received:", data);
  //   });

  //   // Clean up the listener on unmount
  //   return () => {
  //     offEvent("message");
  //   };
  // };

  return (
    <div className="users-list s-bar">
      {sortedUsers.map((user, i) => {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const { id } = JSON.parse(loggedInUser ?? "");

        return user._id === id ? null : (
          <div
            key={i}
            className={`list-item type-${user.role}`}
            onClick={() => {
              // handleSelectedUser(user._id, "private");
            }}
          >
            <UserImage
              src={user.profilePicture ?? "/assets/profile-avatar.svg"}
              alt={user.name}
            />
            <p>{user.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
