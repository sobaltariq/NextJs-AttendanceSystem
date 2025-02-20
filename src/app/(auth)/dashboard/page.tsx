"use client";
import Calendar from "@/components/dashboard/Calendar";
import User from "@/components/dashboard/User";
import { useProfile } from "@/hooks/useProfile";
import React from "react";

const DashboardPage: React.FC = () => {
  const { profile } = useProfile();

  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return (
    <div className="width-container">
      <section className="dashboard-page">
        <User profile={profile} />
        <Calendar profile={profile} />
      </section>
    </div>
  );
};

export default DashboardPage;
