import Image from "next/image";
import React from "react";

interface EditMyProfilePicInterface {
  profilePic: string;
  userName: string;
}

const EditMyProfilePicture: React.FC<EditMyProfilePicInterface> = ({
  profilePic,
  userName,
}) => {
  return (
    <div className="change-profile-pic">
      <Image
        src={profilePic}
        width={200}
        height={200}
        alt={userName ?? "profile"}
      />
    </div>
  );
};

export default EditMyProfilePicture;
