"use client";
import React, { useEffect, useState } from "react";
import { useMessageModal } from "../modal/providers/MessageModalProvider";
import MyApi from "@/api/MyApi";
import { EmpInterface } from "@/types/api";

function EmployOfTheMonth() {
  const [empList, setEmpList] = useState<EmpInterface[]>([]);

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

  return (
    <div className="emp-container">
      <h2>ok</h2>
      <div className="emp-list-wrapper s-bar">
        {empList.map((emp, i) => {
          return (
            <div key={i}>
              <h2>{emp.username}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmployOfTheMonth;
