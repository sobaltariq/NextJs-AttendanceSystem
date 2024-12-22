"use client";
import React, { useState, useEffect, useActionState } from "react";
import { loginHandler } from "./loginHandler";
import { IMessageAndError } from "@/types/api";
import { useFormState, useFormStatus } from "react-dom";

const initialFormData: IMessageAndError = {
  message: "",
  error: "",
};

const LoginPage: React.FC = () => {
  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
  const [state, formAction, isPending] = useActionState(
    loginHandler,
    initialFormData
  );

  return (
    <div className="width-container">
      <section className="login-container">
        <h3>Login</h3>
        <p>AAA{process.env.REACT_APP_BASE_URL}</p>
        <form action={formAction}>
          <input id="email" type="email" name="email" placeholder="Email" />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          {/* <button style={{ color: "red" }} type="submit" disabled={isPending}>
            Submit
          </button> */}
          <SubmitButton />
          {state?.error && <p style={{ color: "red" }}>{state?.error}</p>}
          {state?.message && <p style={{ color: "green" }}>{state?.message}</p>}
        </form>
      </section>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button style={{ color: "red" }} type="submit" disabled={pending}>
      Submit
    </button>
  );
};

export default LoginPage;
