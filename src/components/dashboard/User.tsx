import { formatDate } from "@/components/utils/globalUse";
import { MyProfileInterface } from "@/types/api";
import Image from "next/image";
import React from "react";

import { MdArrowLeft } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";
import { FaIdBadge } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";
import MyApi from "@/api/MyApi";

interface UserProps {
  profile: MyProfileInterface;
}

const User: React.FC<UserProps> = ({ profile }) => {
  const [profilePicToggle, setProfilePicToggle] = React.useState<boolean>(
    () => {
      return localStorage.getItem("profilePicStatus") === "false"
        ? false
        : true;
    }
  );

  const getAttendances = () => {
    const response = MyApi.get();
  };

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
              onError={() => {
                // fallback image if the original fails
                setProfilePicToggle(false);
              }}
              priority
            />
          }
        </div>
      </div>

      <div className="user-inner-container">
        <div className="user-content-wrapper">
          <p className="user-name">{profile?.name}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Username:</p>
          <p>{profile?.username}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Email:</p>
          <p>{profile?.email}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Gender:</p>
          <p>{profile?.gender}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Position:</p>
          <p>{profile?.position}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Status:</p>
          <p>{profile?.userStatus}</p>
        </div>
        <div className="user-content-wrapper">
          <p>Joined:</p>
          <p>{formatDate(profile?.hireDate ?? "")}</p>
        </div>
        {/* <div className="user-content-wrapper"></div>
        <div className="user-content-wrapper"></div>
        <div className="user-content-wrapper"></div>
        <div className="user-content-wrapper"></div> */}
      </div>
    </div>
  );
};

export default User;
