"use client";
import { IMessageAndError, IRegistrationForm } from "@/types/api";
import React, { useActionState, useEffect, useState } from "react";
import { loginHandler } from "../login/loginHandler";
import { SubmitButton } from "@/components/buttons/custom-buttons";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const formMessages: IMessageAndError = {
  message: "",
  error: "",
};

const initialFormData: IRegistrationForm = {
  name: "",
  email: "",
  password: "",
  role: "",
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
  const [state, formAction, isPending] = useActionState(
    loginHandler,
    formMessages
  );

  const [passwordState, setPasswordState] = useState(false);

  useEffect(() => {
    if (state?.message) {
      // Clear the entire form on success
      setFormData((prev) => ({
        ...prev,
        email: prev.email,
        password: prev.password,
      }));
    } else if (state?.error) {
      // Clear only the password field on error
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  }, [state?.message, state?.error]);

  const roleOptions = [
    { value: "superAdmin", label: "super admin" },
    { value: "admin", label: "admin" },
    { value: "user", label: "user" },
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    formMessages;
    setPasswordState(false);
  };

  return (
    <div className="width-container">
      <section className="login-container">
        <h3>Register</h3>
        <form action={formAction}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
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
          <select name="cars" id="cars">
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
          <SubmitButton label="Register" />
          {state?.error && <p className="alert-error">{state?.error}</p>}
          {state?.message && <p className="alert-success">{state?.message}</p>}
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
