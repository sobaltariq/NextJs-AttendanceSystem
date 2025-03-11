"use client";
import { MyAttendanceRecord, MyProfileInterface } from "@/types/api";
import React, { useEffect, useMemo, useState } from "react";
import { getDaysInMonth } from "../utils/calendar";
import MyApi from "@/api/MyApi";
import { SubmitButton } from "../buttons/CustomButtons";
import AppModal from "../modal/AppModal";
import FeedbackModal from "../modal/FeedbackModal";

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

  const [PunchInStatus, setPunchInStatus] = useState<string | null>(null);

  const [feedbackModal, setFeedbackModal] = useState<boolean>(false);

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
      (rec) => rec.todayDate.split("T")[0] === date.toISOString().split("T")[0]
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
      const statusClass = status ? status : "";
      cells.push(
        <td
          // title={statusClass}
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

        const today = new Date().toISOString().split("T")[0];
        const existingRecord = attendanceRecords.find(
          (record: MyAttendanceRecord) =>
            record.todayDate.split("T")[0] === today
        );
        console.log("====================================");
        console.log(attendanceRecords[0].todayDate.split("T")[0], today);
        console.log("====================================");

        if (existingRecord) {
          console.log("Attendance record for today exists:", existingRecord);

          setPunchInStatus(existingRecord);
        }
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

  const handlePunchIn = async () => {
    setPunchInStatus("marked");
    try {
      const response = await MyApi.post(`/attendance/`);
      console.log(response);

      if (response.data.success) {
        // Refresh attendance records to update the status
        getAttendances();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Punch In Error";
      console.log("Error Response:", errorMessage);
    }
  };

  return (
    <>
      <div className="calendar-container">
        <h3>
          Calendar for {monthNames[currentMonth]} {currentYear}
        </h3>

        <div className="heading-wrapper">
          <div className="colors-indicators">
            <p className="late">Late</p>
            <p className="absent">Absent</p>
            <p className="present">Present</p>
            <p className="leave">Leave</p>
          </div>
          <div className="punch-in-button">
            {PunchInStatus ? null : (
              <button className="btn-primary" onClick={handlePunchIn}>
                Punch In
              </button>
            )}
          </div>
          <div className="calendar-nav">
            <button onClick={handlePrevMonth}>Previous</button>

            <button onClick={handleNextMonth}>Next</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <th key={day} className={`${weekDay == i ? "today" : ""}`}>
                    {day}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>{getCalendarDays()}</tbody>
        </table>

        {/* Optionally, display user info from profile */}
        <div className="feed-back-button">
          <button onClick={() => setFeedbackModal(true)}>Give Feedback</button>
        </div>
      </div>
      <AppModal
        isOpen={feedbackModal}
        // isOpen={true}
        onClose={() => {
          setFeedbackModal(false);
        }}
        title="Give Feedback"
        children={
          <FeedbackModal
            onClose={() => {
              setFeedbackModal(false);
            }}
          />
        }
      />
    </>
  );
};

export default Calendar;
