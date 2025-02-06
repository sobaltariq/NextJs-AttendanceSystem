"use client";
import React, { useState } from "react";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import { SubmitButton } from "../buttons/CustomButtons";
import MyApi from "@/api/MyApi";
import { useMessageModal } from "./providers/MessageModalProvider";

interface ChangePasswordInterface {
  onClose: () => void;
}

interface LoggedInUserInterface {
  id: string;
}

const ChangePasswordModal: React.FC<ChangePasswordInterface> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordState, setPasswordState] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [disableButton, setDisableButton] = useState<boolean>(true);

  const { showMessageModal } = useMessageModal();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required.";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "New and Confirm Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error message when user types
    setErrors({ ...errors, [name]: "" });
    setDisableButton(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableButton(true);
    if (!validateForm()) {
      return;
    }
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const { id }: LoggedInUserInterface = JSON.parse(loggedInUser);
      console.log("Password changed successfully!", formData);

      const endpoint = `/users/change-password/${id}`;

      const response = await MyApi.patch(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const { success, message } = response.data;
      if (success) {
        await showMessageModal("success", "Password changed successfully");
        onClose();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Register Error";
      await showMessageModal("warning", errorMessage);
      console.log("Error Response:", errorMessage);
      setDisableButton(false);
    }
  };

  return (
    <div className="change-password-modal">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div
            className="password-wrapper"
            data-error={errors.oldPassword ? true : false}
          >
            <input
              type={passwordState.oldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleInputChange}
            />
            {passwordState.oldPassword ? (
              <LuEye
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, oldPassword: false })
                }
              />
            ) : (
              <LuEyeClosed
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, oldPassword: true })
                }
              />
            )}
          </div>
          {errors.oldPassword && (
            <p className="error-text">{errors.oldPassword}</p>
          )}
        </div>
        <div className="form-group">
          <div
            className="password-wrapper"
            data-error={errors.newPassword ? true : false}
          >
            <input
              type={passwordState.newPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            {passwordState.newPassword ? (
              <LuEye
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, newPassword: false })
                }
              />
            ) : (
              <LuEyeClosed
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, newPassword: true })
                }
              />
            )}
          </div>
          {errors.newPassword && (
            <p className="error-text">{errors.newPassword}</p>
          )}
        </div>
        <div className="form-group">
          <div
            className="password-wrapper"
            data-error={errors.confirmPassword ? true : false}
          >
            <input
              type={passwordState.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {passwordState.confirmPassword ? (
              <LuEye
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, confirmPassword: false })
                }
              />
            ) : (
              <LuEyeClosed
                color="#10b981"
                onClick={() =>
                  setPasswordState({ ...passwordState, confirmPassword: true })
                }
              />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="form-group">
          <SubmitButton
            isLoading={
              errors.confirmPassword ?? errors.newPassword ?? errors.oldPassword
                ? true
                : disableButton
                ? true
                : false
            }
            label="Save Password"
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
