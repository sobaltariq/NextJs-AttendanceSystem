"use client";
import React, { useState, useEffect, useActionState } from "react";
import { loginHandler } from "./loginHandler";
import { ILoginForm, IMessageAndError } from "@/types/api";
import { SubmitButton } from "@/components/buttons/custom-buttons";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const formMessages: IMessageAndError = {
  message: "",
  error: "",
};

const initialFormData: ILoginForm = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
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
        <h3>Login</h3>
        <form action={formAction}>
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
          {/* <button style={{ color: "red" }} type="submit" disabled={isPending}>
            Submit
          </button> */}
          <SubmitButton label="Login" />
          {state?.error && <p className="alert-error">{state?.error}</p>}
          {state?.message && <p className="alert-success">{state?.message}</p>}
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
