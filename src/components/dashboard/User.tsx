import {
  formatDate,
  formattedDay,
  formattedMonth,
  formattedYear,
} from "@/components/utils/globalUse";
import { MyProfileInterface, NoticesInterface } from "@/types/api";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { MdArrowLeft } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { FaAddressCard } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
import { GrRefresh } from "react-icons/gr";

import MyApi from "@/api/MyApi";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import { useDispatch } from "react-redux";

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

  const [noticesList, setNoticesList] = useState<NoticesInterface[]>([]);
  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const getNotice = async () => {
    try {
      const response = await MyApi.get("/notice-board");
      const { success, data } = response.data;
      if (success) {
        setNoticesList(data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Notice Error";
      showMessageModal("error", errorMessage, 5000);
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getNotice();
    return () => controller.abort();
  }, []);

  return (
    <div className="user-container">
      <div className="box-wrapper">
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
          <div className="headings">
            <BsBank2 />
            <p>Bank</p>
          </div>
          <div className="details-container">
            <div className="user-content-wrapper">
              <p>Account Holder Name:</p>
              <p>{profile?.username}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Bank Name:</p>
              <p>{profile?.username}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Account Number:</p>
              <p>{profile?.username}</p>
            </div>
            <div className="user-content-wrapper">
              <p>IBAN:</p>
              <p>{profile?.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="box-wrapper">
        <div className="user-inner-container ">
          <div className="headings">
            <FaAddressCard />
            <p>User Details</p>
          </div>
          <div className="details-container s-bar">
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
              <p>Job Title:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Department:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Address:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>CNIC:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>DOB:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Contact Number:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Emergency Contact:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>WhatsApp:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Salary:</p>
              <p>{"000"}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Status:</p>
              <p>{profile?.userStatus}</p>
            </div>
            <div className="user-content-wrapper">
              <p>Joined:</p>
              <p>{formatDate(profile?.hireDate ?? "")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="box-wrapper">
        <div className="user-inner-container ">
          <div className="headings">
            <GrAnnounce />
            <p>Notice Board</p>

            <GrRefresh onClick={getNotice} />
          </div>
          <div className="notice-wrapper details-container s-bar">
            {noticesList.map((notice, i) => {
              return (
                <div
                  key={i}
                  className="notice-box"
                  title={`${notice.type.toLocaleLowerCase()}`}
                >
                  <div
                    className={`date-wrapper ${notice.type.toLocaleLowerCase()}`}
                  >
                    <p>
                      {formattedDay(notice.createdAt)}{" "}
                      {formattedMonth(notice.createdAt)}
                    </p>
                    <p>{formattedYear(notice.createdAt)}</p>
                  </div>
                  <div className={`user-content-wrapper`}>
                    <h4 className={`${notice.type.toLocaleLowerCase()}`}>
                      {notice.title}
                    </h4>
                    <p>{notice.content}</p>
                    <span>
                      <strong>By:</strong> {notice.createdBy.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
