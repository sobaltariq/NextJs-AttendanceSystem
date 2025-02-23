"use client";
import { MyProfileInterface } from "@/types/api";
import React, { useState } from "react";
import { getDaysInMonth } from "../utils/calender";

interface UserProps {
  profile: MyProfileInterface;
}

const Calendar: React.FC<UserProps> = ({ profile }) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const days = getDaysInMonth(currentYear, currentMonth);
  console.log(today);

  // Format month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Handlers for navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="calendar-container">
      <h3>
        Calendar for {monthNames[currentMonth]} {currentYear}
      </h3>

      <div className="colors-indicators">
        <p className="today">Today</p>
        <p className="present">Present</p>
        <p className="leave">Leave</p>
        <p className="absent">Absent</p>
      </div>

      <div className="calendar-nav">
        <button onClick={handlePrevMonth}>Previous</button>
        <button onClick={handleNextMonth}>Next</button>
      </div>

      {/* Render Weekdays Header */}
      <div className="calendar-grid header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <p key={day} className="calendar-cell">
            {day}
          </p>
        ))}
      </div>

      <div className="calendar-grid">
        {/* Add empty cells for days before the first of the month */}
        {(() => {
          const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
          const emptyCells = [];
          for (let i = 0; i < firstDayIndex; i++) {
            emptyCells.push(
              <p key={`empty-${i}`} className="calendar-cell empty"></p>
            );
          }
          return emptyCells;
        })()}

        {/* Render each day */}
        {days.map((day) => {
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <p
              key={day.toISOString()}
              className={`calendar-cell ${isToday ? "today" : ""}`}
            >
              {day.getDate()}
              {isToday && <span></span>}
            </p>
          );
        })}
      </div>

      {/* Optionally, display user info from profile */}
      <div className="user-info">
        <p>
          Viewing calendar for <strong>{profile.name}</strong>
        </p>
      </div>
    </div>
  );
};

export default Calendar;
