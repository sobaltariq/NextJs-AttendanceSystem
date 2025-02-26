"use client";
import { MyAttendanceRecord, MyProfileInterface } from "@/types/api";
import React, { useEffect, useMemo, useState } from "react";
import { getDaysInMonth } from "../utils/calender";
import MyApi from "@/api/MyApi";

interface UserProps {
  profile: MyProfileInterface;
}

const Calendar: React.FC<UserProps> = ({ profile }) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [attendanceRecord, setAttendanceRecord] = useState<
    MyAttendanceRecord[]
  >([]);

  // Memoize the days so they are recalculated only when year or month changes.
  const days = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

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

  // to get day of week. 0 Sunday 1 Monday 2 Tuesday etc...
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  let weekDay: number = new Date().getDay();

  const getStatusForDate = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD
    const record = attendanceRecord.find(
      // (rec) => rec.todayDate === formattedDate
      (rec) => rec.todayDate.split("T")[0] === date.toISOString()
    );
    return record?.status || null;
  };

  const getCalendarDays = () => {
    let cells = [];

    // save empty days in list
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<td key={`empty-start-${i}`} className="empty-cell"></td>);
    }
    days.forEach((day, index) => {
      const isToday =
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear();
      const status = getStatusForDate(day);
      status && console.log(status);
      const statusClass = status ? status : "";
      cells.push(
        <td
          key={day.toISOString()}
          className={`calendar-cell ${isToday ? "today" : ""} ${statusClass}`}
        >
          {day.getDate()}
          {isToday && <span></span>}
        </td>
      );
    });

    // Add empty cells at the end to fill the last row.
    const totalCells = cells.length;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        cells.push(<td key={`empty-end-${i}`} className="empty-cell"></td>);
      }
    }

    // to make cell into a group of 7
    let row = [];
    for (let i = 0; i < cells.length; i += 7) {
      const weekCells = cells.slice(i, i + 7);
      row.push(<tr key={`row-${i / 7}`}>{weekCells}</tr>);
    }
    return row;
  };

  const getAttendances = async () => {
    try {
      const response = await MyApi.get(
        `/attendance/user/month?month=${currentMonth + 1}&year=${currentYear}`
      );
      // console.log(response.data);
      const { success, attendanceRecords } = response.data;
      if (success) {
        setAttendanceRecord(attendanceRecords);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Get Attendance Error";
      // setMessagesState(errorMessage);
      console.log("Error Response:", errorMessage);
    }
  };

  useEffect(() => {
    getAttendances();
  }, [currentYear, currentMonth, profile._id]);

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

      <table>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <th key={day} className={`${weekDay == i ? "today" : ""}`}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{getCalendarDays()}</tbody>
      </table>

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
