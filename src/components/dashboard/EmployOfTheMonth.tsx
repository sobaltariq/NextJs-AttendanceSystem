"use client";
import React, { useEffect, useState } from "react";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import MyApi from "@/api/MyApi";
import { CurrentEmpInterface, EmpInterface } from "@/types/api";

function EmployOfTheMonth() {
  const [empList, setEmpList] = useState<EmpInterface[]>([]);
  const [currentEmp, setCurrentEmp] = useState<CurrentEmpInterface>();

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const getEmpList = async (signal: AbortSignal) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const response = await MyApi.get(`/employee-of-the-month/history`);
      const { success, data } = response.data;
      console.log("ok", response.data);

      if (success) {
        setEmpList(data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      showMessageModal("error", errorMessage, 5000);
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getEmpList(signal);

    return () => {
      controller.abort();
    };
  }, []);

  const getCurrentEmp = async (signal: AbortSignal) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const response = await MyApi.get(`/employee-of-the-month/`);
      const { success, data } = response.data;
      console.log("0000", response.data);

      if (success) {
        setCurrentEmp(data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      showMessageModal("error", errorMessage, 5000);
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getCurrentEmp(signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="emp-container">
      <div className="all-time-list">
        <h2>Recent Employ of the month</h2>
        <div className="emp-list-wrapper s-bar">
          {empList.map((emp, i) => {
            return (
              <div key={i} className="inner-content">
                <h3>{emp.username}</h3>
                <div className="date-wrapper">
                  <p>{emp.month}</p>
                  <p>{emp.year}</p>
                </div>
                <p>{emp.reason}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="all-time-list">
        <h2>Current EMP</h2>
        <div className="emp-list-wrapper s-bar">
          <div className="inner-content">
            <h3>{currentEmp?.username}</h3>
            <div className="date-wrapper">
              <p>{currentEmp?.month}</p>
              <p>{currentEmp?.year}</p>
            </div>
            <p>{currentEmp?.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployOfTheMonth;
