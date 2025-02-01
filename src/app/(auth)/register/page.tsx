"use client";
import { IMessageAndError, IRegistrationForm } from "@/types/api";
import React, { useActionState, useEffect, useState } from "react";
import {
  NavigationLink,
  SubmitButton,
} from "@/components/buttons/CustomButtons";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import MyApi from "@/api/MyApi";
import { useRouter } from "next/navigation";
import LoginAuth from "@/components/hocs/LoginAuth";
import composeHOCs from "@/components/hocs/composeHOCs";
import { useDispatch } from "react-redux";
import { initializeAuthState } from "@/redux/features/auth/authSlice";

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

const statusOptions = [
  { value: "Permanent", label: "Permanent" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Probation", label: "Probation" },
  { value: "Other", label: "Other" },
];

const initialFormData: IRegistrationForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  gender: "",
  userStatus: "",
  role: "",
  profilePicture: null,
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<IRegistrationForm>(initialFormData);
  const [messagesState, setMessagesState] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [passwordState, setPasswordState] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, userStatus: e.target.value });
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
    const {
      name,
      username,
      email,
      password,
      gender,
      role,
      profilePicture,
      userStatus,
    } = formData;

    // Validate each field
    if (!name) return "Name is required.";
    if (!username) return "Username is required.";
    if (!email) return "Email is required.";
    if (!password) return "Password is required.";
    if (!gender) return "Gender is required.";
    if (!role) return "Role is required.";
    if (!profilePicture) return "Profile picture is required.";
    if (!userStatus) return "Status is required.";

    // Return no error if all fields are valid
    return "";
  };

  const registerHandler = async (event: React.FormEvent) => {
    event.preventDefault();

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
      const { token, user, success } = response.data;

      // const data = response.data;
      console.log("Response:", response.data.message);

      setMessagesState("");
      if (success) {
        const loggedInUser = {
          id: user.id,
          role: user.role,
          username: user.username,
          gender: user.gender,
        };
        localStorage.setItem("loggedInToken", token);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        dispatch(initializeAuthState());
        router.push("/");
      }
      setMessagesState("something went wrong");
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
    <div className="width-container" style={{ minHeight: "100vh" }}>
      <section className="login-container card-default">
        <div className="form-wrapper">
          <h1>Register</h1>
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
                  color="#10b981"
                  onMouseLeave={() => {
                    setPasswordState(false);
                  }}
                />
              ) : (
                <LuEyeClosed
                  color="#10b981"
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
            <div className="select-wrapper">
              <select
                name="status"
                id="status"
                value={formData.userStatus}
                onChange={handleStatusChange}
              >
                <option value="" disabled>
                  Select Status
                </option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
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

          <div className="login-links">
            <p>already have an account?</p>
            <NavigationLink link="/login" label="Login" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default composeHOCs(LoginAuth)(RegisterPage);
