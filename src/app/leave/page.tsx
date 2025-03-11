"use client";
import MyApi from "@/api/MyApi";
import { SubmitButton } from "@/components/buttons/CustomButtons";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import { formatDate } from "@/components/utils/globalUse";
import { ApplyLeaveInterface, MyLeaveInterface } from "@/types/api";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface LoggedInUserInterface {
  id: string;
}

function LeavePage() {
  const [formData, setFormData] = useState<ApplyLeaveInterface>({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [leavesList, setLeavesList] = useState<MyLeaveInterface[]>([]);
  const [leavesBalance, setLeavesBalance] = useState<number>(0);
  const [leavesTaken, setLeavesTaken] = useState<number>(0);

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const handleApplyLeave = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await MyApi.post("/leave-requests", formData);
      const { success, data, message } = response.data;
      console.log("ok", data);

      if (success) {
        showMessageModal("success", message, 5000);
        setFormData({
          leaveType: "casual",
          startDate: "",
          endDate: "",
          reason: "",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      showMessageModal("error", errorMessage, 5000);
      console.log(errorMessage);
    }

    console.log(formData);
  };

  const getMyLeaveRequests = async (signal: AbortSignal) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const { id }: LoggedInUserInterface = JSON.parse(loggedInUser);
      const response = await MyApi.get(`/leave-requests/me/${id}`);
      const { success, data, total, leavesTaken, leavesBalance } =
        response.data;
      console.log("ok", response.data);

      if (success) {
        setLeavesList(data);
        setLeavesBalance(leavesBalance);
        setLeavesTaken(leavesTaken);
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

    getMyLeaveRequests(signal);

    return () => {
      controller.abort(); // Aborts the request when the component unmounts
    };
  }, []);

  const today = new Date();
  return (
    <div className="width-container">
      <section className="leave-page">
        <div className="apply-leave">
          <div className="header">
            <h2>Apply For Leave</h2>
            <p>Today: {formatDate(today.toISOString())}</p>
          </div>

          <form onSubmit={handleApplyLeave}>
            {/* Leave Type */}
            <div className="item">
              <label className="">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className=""
              >
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={5}
                className=""
                placeholder="Enter your reason (optional)"
              />
            </div>

            {/* Submit Button */}
            <SubmitButton label="Apply" className="btn-secondary" />
          </form>
        </div>
        <div className="leave-record">
          <div className="header">
            <h2>Leaves Record</h2>
            <div className="inner-top">
              <p>Remaining: {leavesBalance}</p>
              <p>Total: {leavesList.length}</p>
            </div>
          </div>

          <div className="leaves-list-container s-bar">
            {leavesList.map((item, i) => {
              return (
                <div key={i * 2} className="list-item">
                  <p className={item.status}>{i + 1}</p>
                  <div className="inner-wrapper">
                    <div className="top">
                      <p>Type: {item.leaveType}</p> <p>Status: {item.status}</p>
                    </div>
                    <div className="top">
                      <p>days: {item.daysRequested}</p>
                      <p>
                        From {formatDate(item.startDate)} - To{" "}
                        {formatDate(item.endDate)}
                      </p>
                    </div>
                    <div className="top">
                      <p>Applied: {formatDate(item.createdAt)}</p>
                      <p>Updated: {formatDate(item.updatedAt)}</p>
                    </div>
                    {item.reason && (
                      <div className="top">
                        <p>Reason: {item.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LeavePage;
