"use client";
import React, { useState, useEffect, useActionState } from "react";
import { loginHandler } from "./loginHandler";
import { ILoginForm, IMessageAndError } from "@/types/api";
import {
  NavigationLink,
  SubmitButton,
} from "@/components/buttons/CustomButtons";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { initializeAuthState } from "@/redux/features/auth/authSlice";

const FORM_MESSAGES: IMessageAndError = {
  message: "",
  error: "",
};

const INITIAL_FORM_DATA: ILoginForm = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [state, formAction, isPending] = useActionState(
    loginHandler,
    FORM_MESSAGES
  );

  const [passwordState, setPasswordState] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (state?.message) {
      // Clear the entire form on success
      dispatch(initializeAuthState());
      router.push("/");
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
    FORM_MESSAGES;
    setPasswordState(false);
  };

  return (
    <div className="width-container" style={{ minHeight: "100vh" }}>
      <section className="login-container card-default">
        <div className="form-wrapper">
          <h1>Login</h1>
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
            {/* <button style={{ color: "red" }} type="submit" disabled={isPending}>
            Submit
          </button> */}
            <SubmitButton label="Login" />
            {state?.error && <p className="alert-error">{state?.error}</p>}
          </form>
          <div className="login-links">
            <p>don't have an account?</p>
            <NavigationLink link="/register" label="Register" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
