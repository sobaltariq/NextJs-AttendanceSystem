"use client";
import Calendar from "@/components/dashboard/Calendar";
import EmployOfTheMonth from "@/components/dashboard/EmployOfTheMonth";
import User from "@/components/dashboard/User";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import React from "react";

const DashboardPage: React.FC = () => {
  const { profile } = useProfile();

  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return (
    <div className="width-container">
      <section className="dashboard-page">
        <div className="top-bar">
          <Link href={"/leave"}>Apply Leave</Link>
          <div>
            <Link href={"/team-interaction-center"}>
              Team Interaction Center <span>{}</span>
            </Link>
          </div>
        </div>
        <User profile={profile} />
        <EmployOfTheMonth />
        <Calendar profile={profile} />
      </section>
    </div>
  );
};

export default DashboardPage;
