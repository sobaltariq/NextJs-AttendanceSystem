"use client";
import { IMessageAndError, IRegistrationForm } from "@/types/api";
import React, { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/buttons/custom-buttons";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { registerHandler } from "./registerHandler";
import Image from "next/image";

const formMessages: IMessageAndError = {
  message: "",
  error: "",
};

const initialFormData: IRegistrationForm = {
  name: "",
  email: "",
  password: "",
  role: "",
  profilePicture: null,
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
  const [state, formAction, isPending] = useActionState(
    registerHandler,
    formMessages
  );

  const [passwordState, setPasswordState] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name,
      email: prev.email,
      role: prev.role,
      password: prev.password,
      profilePicture: prev.profilePicture,
    }));
  }, [state?.message, state?.error]);

  const roleOptions = [
    { value: "user", label: "user" },
    { value: "superAdmin", label: "super admin" },
    { value: "admin", label: "admin" },
  ];

  const genderOptions = [
    { value: "male", label: "male" },
    { value: "female", label: "female" },
    { value: "other", label: "other" },
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordState(false);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Set preview image URL
      };
      reader.readAsDataURL(file); // Create a preview of the selected image
    }
  };

  return (
    <div className="width-container">
      <section className="login-container">
        <h3>Register</h3>
        <form action={formAction}>
          <div className="profile-pic">
            <input
              id="profilePicture"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              capture
            />
            {avatarPreview ? (
              <Image
                width={100}
                height={100}
                src={avatarPreview}
                alt="Profile Preview"
                className="avatar-preview"
              />
            ) : (
              <Image
                width={100}
                height={100}
                src="/assets/profile-avatar.svg"
                alt="Profile Preview"
                className="avatar-preview"
              />
            )}
          </div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div className="password-wrapper">
            <input
              id="password"
              type={passwordState ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {passwordState ? (
              <LuEye
                onMouseLeave={() => {
                  setPasswordState(false);
                }}
              />
            ) : (
              <LuEyeClosed
                onMouseEnter={() => {
                  setPasswordState(true);
                }}
              />
            )}
          </div>
          <div className="select-wrapper">
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Role
              </option>
              {roleOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <IoIosArrowDown />
          </div>
          <div className="select-wrapper">
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Gender
              </option>
              {genderOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <IoIosArrowDown />
          </div>
          <SubmitButton label="Register" />
          {state?.error && <p className="alert-error">{state?.error}</p>}
          {state?.message && <p className="alert-success">{state?.message}</p>}
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
