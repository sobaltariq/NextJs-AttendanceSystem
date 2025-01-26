"use client";

import { useState } from "react";

function GenderForm() {
  const [gender, setGender] = useState("");
  const [submittedGender, setSubmittedGender] = useState("");

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    setSubmittedGender(gender);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="gender">Select Gender:</label>
        <select
          name="gender"
          id="gender"
          value={gender}
          onChange={handleGenderChange}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {submittedGender && (
        <p>
          You selected: <strong>{submittedGender}</strong>
        </p>
      )}
    </div>
  );
}

export default GenderForm;
