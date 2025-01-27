"use client";
import { IMessageAndError, IRegistrationForm } from "@/types/api";
import React, { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/buttons/custom-buttons";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import MyApi from "@/api/MyApi";
import { useRouter } from "next/navigation";
import LoginAuth from "@/components/hocs/LoginAuth";
import composeHOCs from "@/components/hocs/composeHOCs";

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
  username: "",
  email: "",
  password: "",
  gender: "",
  role: "",
  profilePicture: null,
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<IRegistrationForm>(initialFormData);
  const [messagesState, setMessagesState] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [passwordState, setPasswordState] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordState(false);
    setMessagesState("");
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      gender: newGender,
    }));
    setPasswordState(false);
    setMessagesState("");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value });
    setPasswordState(false);
    setMessagesState("");
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
    setMessagesState("");
  };

  const validateForm = (formData: IRegistrationForm) => {
    const { name, username, email, password, gender, role, profilePicture } =
      formData;

    // Validate each field
    if (!name) return "Name is required.";
    if (!username) return "Username is required.";
    if (!email) return "Email is required.";
    if (!password) return "Password is required.";
    if (!gender) return "Gender is required.";
    if (!role) return "Role is required.";
    if (!profilePicture) return "Profile picture is required.";

    // Return no error if all fields are valid
    return "";
  };

  const registerHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // clean localStorage
    localStorage.removeItem("loggedInToken");
    localStorage.removeItem("loggedInUser");

    // Validate form data
    const validationResult = validateForm(formData);
    if (validationResult) {
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
      const { token, user } = response.data;

      // const data = response.data;
      console.log("Response:", response.data.message);

      setMessagesState("");
      const loggedInUser = {
        id: user.id,
        role: user.role,
        username: user.username,
        gender: user.gender,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      router.push("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Register Error";
      setMessagesState(errorMessage);
      console.log("Error Response:", errorMessage);
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
              <div className="avatar-preview-placeholder">
                <Image
                  width={100}
                  height={100}
                  src="/assets/profile-avatar.svg"
                  alt="Profile Preview"
                  className="avatar-preview"
                  priority
                />
                <Image
                  width={20}
                  height={20}
                  src="/assets/plus-icon.svg"
                  alt="Profile Preview"
                  className="avatar-preview"
                  priority
                />
              </div>
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
            type="text"
            id="username"
            name="username"
            placeholder="username"
            value={formData.username}
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
            isLoading={messagesState ? true : false}
            label="Register"
          />
          {messagesState && <p className="alert-error">{messagesState}</p>}
        </form>
      </section>
    </div>
  );
};

export default composeHOCs(LoginAuth)(RegisterPage);
