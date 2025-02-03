"user client";

import React, { useState } from "react";

import { IoMdCloudUpload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";

interface EditMyProfilePicInterface {
  profilePic: string;
  userName: string;
  onClose: (newProfilePic: string) => void;
}

const EditMyProfilePictureModal: React.FC<EditMyProfilePicInterface> = ({
  profilePic,
  userName,
  onClose,
}) => {
  const [messagesState, setMessagesState] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>("start");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Set preview image URL
      };
      reader.readAsDataURL(file); // Create a preview of the selected image
      setSelectedFile(file);
    }
  };

  const changePicHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessagesState("Please choose a new image to upload.");
      return;
    }
    const formPayload = new FormData();
    formPayload.append("profilePicture", selectedFile);

    try {
      const response = await MyApi.patch("users/profile", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status) {
        setMessagesState(null);
        onClose(URL.createObjectURL(selectedFile));
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        err.response?.data?.error?.message ||
        "Register Error";
      setMessagesState(errorMessage);
      console.log("Error Response:", errorMessage);
    }
  };

  return (
    <div className="change-profile-pic">
      <div className="pic-wrapper">
        {avatarPreview === "start" && (
          <img src={profilePic} alt={userName ?? "profile"} />
        )}
        {avatarPreview !== null && avatarPreview !== "start" && (
          <img src={avatarPreview} alt={userName ?? "profile"} />
        )}
      </div>
      <form onSubmit={changePicHandler}>
        <div className="input-group">
          <label htmlFor="profilePicture">
            <IoMdCloudUpload />
          </label>
          <input
            id="profilePicture"
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            capture
          />
        </div>
        <div className="input-group">
          <button
            onClick={() => {
              setAvatarPreview(null);
            }}
          >
            <MdDeleteForever />
          </button>
        </div>

        <SubmitButton
          isLoading={
            avatarPreview === null ||
            avatarPreview === "start" ||
            messagesState !== null
              ? true
              : false
          }
          label="Save"
        />
      </form>
    </div>
  );
};

export default EditMyProfilePictureModal;
