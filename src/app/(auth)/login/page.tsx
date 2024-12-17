"use client";
import React, { useState, useEffect } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API delay
      console.log("Form submitted successfully:", formData);
      setIsSubmitting(false);
    } catch (error) {
      setSubmitError("An error occurred while submitting the form");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      <div className="width-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {submitError && <p>{submitError}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
