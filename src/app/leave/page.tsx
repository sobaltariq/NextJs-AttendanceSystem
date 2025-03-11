"use client";
import MyApi from "@/api/MyApi";
import { SubmitButton } from "@/components/buttons/CustomButtons";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import { formatDate } from "@/components/utils/globalUse";
import { ApplyLeaveInterface } from "@/types/api";
import React, { ChangeEvent, FormEvent, useState } from "react";

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
            <p>Remaining: {formatDate(today.toISOString())}</p>
            <p>Total: {formatDate(today.toISOString())}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LeavePage;
