"use client";
import React, { Suspense, useEffect } from "react";
import MyApi from "@/api/MyApi";
import { MyProfileInterface } from "@/types/api";
import Image from "next/image";

import { BsGenderAmbiguous } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { FaUserClock } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { formatDate } from "@/components/utils/globalUse";
import AppModal from "@/components/modal/AppModal";
import EditMyProfile from "@/components/profile/EditMyProfile";

const page: React.FC = () => {
  const [profile, setProfile] = React.useState<MyProfileInterface | null>(null);
  const [shouldShowEditModel, setShouldShowEditModel] =
    React.useState<boolean>(false);

  const getMyProfile = async () => {
    try {
      const response = await MyApi.get("users/profile");
      console.log(response.data.user);
      setProfile(response.data.user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Register Error";
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
                <button
                  title={`Update at ${formatDate(profile?.updatedAt ?? "")}`}
                  onClick={() => {
                    setShouldShowEditModel(true);
                  }}
                >
                  <CiEdit />
                </button>
              </div>
              <div className="profile-header-content-wrapper">
                <div className="profile-picture">
                  <Image
                    src={
                      profile?.profilePicture ?? "/assets/profile-avatar.svg"
                    }
                    width={200}
                    height={200}
                    alt={profile?.name ?? "profile"}
                  />
                  <button
                    onClick={() => {
                      setShouldShowEditModel(true);
                    }}
                  >
                    Edit Profile
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
        isOpen={shouldShowEditModel}
        // isOpen={true}
        onClose={() => {
          setShouldShowEditModel(false);
        }}
        title="Edit Profile"
        children={<EditMyProfile />}
      />
    </>
  );
};

export default page;
