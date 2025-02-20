import { formatDate } from "@/components/utils/globalUse";
import { MyProfileInterface } from "@/types/api";
import Image from "next/image";
import React from "react";

import { MdArrowLeft } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";

interface UserProps {
  profile: MyProfileInterface;
}

const User: React.FC<UserProps> = ({ profile }) => {
  const [profilePicToggle, setProfilePicToggle] = React.useState<boolean>(true);

  return (
    <div className="user-container">
      <div className="profile-picture">
        <div className="pic-box">
          <button
            onClick={() => {
              setProfilePicToggle((prev) => {
                const newValue = !prev;
                localStorage.setItem(
                  "profilePicStatus",
                  JSON.stringify(newValue)
                );
                return newValue;
              });
            }}
          >
            {profilePicToggle ? <MdArrowLeft /> : <MdArrowRight />}
          </button>
          {
            <Image
              src={
                profilePicToggle
                  ? profile?.profilePicture ?? "/assets/profile-avatar.svg"
                  : "/assets/profile-avatar.svg"
              }
              width={200}
              height={200}
              alt={profile?.name ?? "profile"}
              priority
            />
          }
        </div>
      </div>
      <p>{profile?.name}</p>
      <p>{profile?.username}</p>
      <p>{profile?.email}</p>
      <p>{profile?.gender}</p>
      <p>{profile?.position}</p>
      <p>{profile?.leaveRequests}</p>
      <p>{profile?.paidLeavesTaken}</p>
      <p>{profile?.leaveBalance}</p>
      <p>{profile?.leaveRequests}</p>
      <p>{profile?.employeeOfTheMonthCount}</p>
      <p>{profile?.monthlyPoints}</p>
      <p>{formatDate(profile?.hireDate ?? "")}</p>
    </div>
  );
};

export default User;
