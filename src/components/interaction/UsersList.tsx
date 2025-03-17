import React from "react";
import { UsersListInterface } from "@/types/api";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import Image from "next/image";
import UserImage from "./UserImage";

interface UsersListProps {
  users: UsersListInterface[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const { showMessageModal } = useMessageModal();

  // Grouping users by role
  const groupedUsers = Object.groupBy(users, (user) => user.role);

  // Combine admins first, then other users
  const sortedUsers = [
    ...(groupedUsers.admin || []),
    ...(groupedUsers.user || []),
  ];

  return (
    <div className="users-list s-bar">
      {sortedUsers.map((user, i) => (
        <div key={i} className={`list-item type-${user.role}`}>
          <UserImage
            src={user.profilePicture ?? "/assets/profile-avatar.svg"}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
