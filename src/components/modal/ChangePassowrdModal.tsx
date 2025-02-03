"use client";
import React, { useState } from "react";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import { SubmitButton } from "../buttons/CustomButtons";

const ChangePasswordModal: React.FC = () => {
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
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Password changed successfully!");
      // Add API call or password update logic here
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
              // value={formData.name}
              // onChange={handleInputChange}
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
              // value={formData.name}
              // onChange={handleInputChange}
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
              // value={formData.name}
              // onChange={handleInputChange}
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
                : false
            }
            label="Change Password"
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
