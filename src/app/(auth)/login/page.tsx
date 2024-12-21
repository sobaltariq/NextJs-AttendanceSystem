"use client";
import React, { useState, useEffect, useActionState } from "react";
import { submitForm } from "./submitForm";

const initialFormData: any = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
  const [state, formAction, isPending] = useActionState(
    submitForm,
    initialFormData
  );

  return (
    <div className="width-container">
      <section className="login-container">
        <h3>Login</h3>
        <form action={formAction}>
          <input id="email" type="email" name="email" placeholder="Email" />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button style={{ color: "red" }} type="submit" disabled={isPending}>
            Submit
          </button>
          {state?.error && <p style={{ color: "red" }}>{state?.error}</p>}
          {state?.message && <p style={{ color: "green" }}>{state?.message}</p>}
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
