"use client";
import { IMessageAndError, IRegistrationForm } from "@/types/api";
import React, { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/buttons/custom-buttons";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import MyApi from "@/api/MyApi";

const roleOptions = [
  { value: "user", label: "user" },
  { value: "superAdmin", label: "super admin" },
  { value: "admin", label: "admin" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const initialFormData: IRegistrationForm = {
  name: "",
  email: "",
  password: "",
  gender: "",
  role: "",
  profilePicture: null,
};

const formMessages: IMessageAndError = {
  message: "",
  error: "",
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<IRegistrationForm>(initialFormData);
  const [messagesState, setMessagesState] =
    useState<IMessageAndError>(formMessages);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [passwordState, setPasswordState] = useState(false);

  useEffect(() => {
    console.log("FormData updated formData.gender:", formData.gender);
    console.log("FormData updated formMessages.field?.gender:");
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordState(false);
    setMessagesState({ message: "", error: "" });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      gender: newGender,
    }));
    setPasswordState(false);
    setMessagesState({ message: "", error: "" });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value });
    setPasswordState(false);
    setMessagesState({ message: "", error: "" });
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
    setMessagesState({ message: "", error: "" });
  };

  const validateForm = (formData: IRegistrationForm) => {
    const { name, email, password, gender, role, profilePicture } = formData;

    // Validate each field
    if (!name) return { message: "", error: "Name is required." };
    if (!email) return { message: "", error: "Email is required." };
    if (!password) return { message: "", error: "Password is required." };
    if (!gender) return { message: "", error: "Gender is required." };
    if (!role) return { message: "", error: "Role is required." };
    if (!profilePicture)
      return { message: "", error: "Profile picture is required." };

    // Return no error if all fields are valid
    return { message: "", error: "" };
  };

  const registerHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    // Validate form data
    const validationResult = validateForm(formData);
    if (validationResult.error) {
      setMessagesState(validationResult);
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value as Blob);
    });
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      console.log("Submitting payload:", formPayload);
      await delay(1000);
      const response = await MyApi.post("users/register", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Register Response:", response.data);

      // const data = response.data;
      console.log("Response:", response.data.message);

      return {
        message: response.data.message || "Register Success",
        error: "",
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Register Error";
      console.log("Error Response:", errorMessage);
      return {
        message: "",
        error: errorMessage || "Register Error",
      };
    }
  };

  return (
    <div className="width-container">
      <section className="login-container">
        <h3>Register</h3>
        <form onSubmit={registerHandler}>
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
                priority
              />
            ) : (
              <Image
                width={100}
                height={100}
                src="/assets/profile-avatar.svg"
                alt="Profile Preview"
                className="avatar-preview"
                priority
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
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleGenderChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
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
              onChange={handleRoleChange}
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
          <SubmitButton
            isLoading={messagesState?.error ? true : false}
            label="Register"
          />
          {messagesState?.error && (
            <p className="alert-error">{messagesState?.error}</p>
          )}
          {messagesState?.message && (
            <p className="alert-success">{messagesState?.message}</p>
          )}
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
