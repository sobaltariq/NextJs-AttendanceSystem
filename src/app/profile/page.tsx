"use client";
import React, { Suspense, useEffect } from "react";
import MyApi from "@/api/MyApi";
import { MyProfileInterface } from "@/types/api";
import Image from "next/image";

const page: React.FC = () => {
  const [profile, setProfile] = React.useState<MyProfileInterface | null>(null);
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
    <div className="width-container">
      <div className="profile-page">
        <Suspense fallback={<p>Loading weather...</p>}>
          <div>
            <Image
              src={profile?.profilePicture ?? "/assets/profile-avatar.svg"}
              width={50}
              height={50}
              alt={profile?.name ?? "profile"}
            />
          </div>
        </Suspense>
        <h3>{profile?.name}</h3>

        <div>
          <div>
            <p>Username: </p>
            <p>{profile?.username}</p>
          </div>
          <div>
            <p>Email: </p>
            <p>{profile?.email}</p>
          </div>
          <div>
            <p>Gender: </p>
            <p>{profile?.gender}</p>
          </div>
          <div>
            <p>EMP Win: </p>
            <p>{profile?.employeeOfTheMonthCount}</p>
          </div>
          <div>
            <p>Joining: </p>
            <p>{profile?.hireDate}</p>
          </div>
          <div>
            <p>Leave Balance: </p>
            <p>{profile?.leaveBalance}</p>
          </div>
          <div>
            <p>Leave Requests: </p>
            <p>{profile?.leaveRequests}</p>
          </div>
          <div>
            <p>Monthly Points: </p>
            <p>{profile?.monthlyPoints}</p>
          </div>
          <div>
            <p>Notifications: </p>
            <p>{profile?.notifications}</p>
          </div>
          <div>
            <p>Paid Leaves: </p>
            <p>{profile?.paidLeavesTaken}</p>
          </div>
          <div>
            <p>Position: </p>
            <p>{profile?.position}</p>
          </div>
          <div>
            <p>Role: </p>
            <p>{profile?.role}</p>
          </div>
          <div>
            <p>Id: </p>
            <p>{profile?.id}</p>
          </div>
          <div>
            <p>Edited At: </p>
            <p>{profile?.updatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
