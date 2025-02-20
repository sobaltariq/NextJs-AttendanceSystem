"use client";
import React, { Suspense, useEffect } from "react";
import MyApi from "@/api/MyApi";
import { MyProfileInterface } from "@/types/api";
import Image from "next/image";

import { formatDate } from "@/components/utils/globalUse";
import AppModal from "@/components/modal/AppModal";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal";
import EditMyProfilePicture from "@/components/modal/ChangeProfilePicModal";

import { BsGenderAmbiguous } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { FaUserClock } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdArrowLeft } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";

const page: React.FC = () => {
  const [profile, setProfile] = React.useState<MyProfileInterface | null>(null);
  const [changePasswordModel, setChangePasswordModel] =
    React.useState<boolean>(false);
  const [shouldShowEditPicModel, setShouldShowEditPicModel] =
    React.useState<boolean>(false);
  const [profilePicToggle, setProfilePicToggle] = React.useState<boolean>(true);

  // to set profile pic after change
  const [newProfilePic, setNewProfilePic] = React.useState<string | null>(null);

  const getMyProfile = async () => {
    const isProfilePicVisible = localStorage.getItem("profilePicStatus");
    if (isProfilePicVisible == "false") {
      setProfilePicToggle(false);
    }
    try {
      const response = await MyApi.get("users/profile");
      console.log(response.data.user);
      setProfile(response.data.user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Profile Error";
      console.log("Error Response:", errorMessage);
    }
  };
  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <>
      <div className="width-container">
        <section className="profile-page">
          <div className="profile-wrapper">
            <div className="profile-header">
              <div className="profile-top-banner">
                <h3>{profile?.name ?? profile?.username}</h3>
                <div>
                  <button
                    className="btn-primary"
                    title={`Update at ${formatDate(profile?.updatedAt ?? "")}`}
                    onClick={() => {
                      setChangePasswordModel(true);
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>
              <div className="profile-header-content-wrapper">
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
                    {newProfilePic === null ? (
                      <Image
                        src={
                          profilePicToggle
                            ? profile?.profilePicture ??
                              "/assets/profile-avatar.svg"
                            : "/assets/profile-avatar.svg"
                        }
                        width={200}
                        height={200}
                        alt={profile?.name ?? "profile"}
                        priority
                      />
                    ) : (
                      <Image
                        src={
                          profilePicToggle
                            ? newProfilePic ?? "/assets/profile-avatar.svg"
                            : "/assets/profile-avatar.svg"
                        }
                        width={200}
                        height={200}
                        alt={profile?.name ?? "profile"}
                        priority
                      />
                    )}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setShouldShowEditPicModel(true);
                    }}
                  >
                    Change Picture
                  </button>
                </div>
                <div className="header_details">
                  <div className="details_wrapper">
                    <MdAlternateEmail />
                    <p style={{ textTransform: "lowercase" }}>
                      {profile?.email}
                    </p>
                  </div>
                  <div className="details_wrapper">
                    <BsGenderAmbiguous />
                    <p>{profile?.gender}</p>
                  </div>
                  <div className="details_wrapper">
                    <TiBusinessCard />
                    <p>{profile?.position}</p>
                  </div>
                  <div className="details_wrapper">
                    <FaUserClock />
                    <p>{profile?.userStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-content-wrapper">
                <p>Username: </p>
                <p>{profile?.username}</p>
              </div>
              <div className="profile-content-wrapper">
                <p>Paid Leaves: </p>
                <p>{profile?.paidLeavesTaken}</p>
              </div>
              <div className="profile-content-wrapper">
                <p>Leave Balance: </p>
                <p>{profile?.leaveBalance}</p>
              </div>
              <div className="profile-content-wrapper">
                <p>Monthly Points: </p>
                <p>{profile?.monthlyPoints}</p>
              </div>
              <div className="profile-content-wrapper">
                <p>EMP Win: </p>
                <p>{profile?.employeeOfTheMonthCount}</p>
              </div>
              <div className="profile-content-wrapper">
                <p>Joining: </p>
                <p>{formatDate(profile?.hireDate ?? "")}</p>
              </div>

              {/* <div className="profile-content-wrapper">
              <p>Id: </p>
              <p>{profile?._id}</p>
            </div>
            <div className="profile-content-wrapper">
              <p>Role: </p>
              <p>{profile?.role}</p>
            </div>
            <div className="profile-content-wrapper">
              <p>Leave Requests: </p>
              <p>{profile?.leaveRequests}</p>
            </div>
            <div className="profile-content-wrapper">
              <p>Notifications: </p>
              <p>{profile?.notifications}</p>
            </div> */}
            </div>
          </div>
        </section>
      </div>

      <AppModal
        isOpen={changePasswordModel}
        // isOpen={true}
        onClose={() => {
          setChangePasswordModel(false);
        }}
        title="Change Password"
        children={
          <ChangePasswordModal
            onClose={() => {
              setChangePasswordModel(false);
            }}
          />
        }
      />
      <AppModal
        isOpen={shouldShowEditPicModel}
        // isOpen={true}
        onClose={() => {
          setShouldShowEditPicModel(false);
        }}
        title="Change Profile Picture"
        children={
          <EditMyProfilePicture
            profilePic={newProfilePic ?? profile?.profilePicture ?? ""}
            userName={profile?.name ?? ""}
            onClose={(newProfilePic) => {
              setShouldShowEditPicModel(false);
              setNewProfilePic(newProfilePic);
            }}
          />
        }
      />
    </>
  );
};

export default page;
