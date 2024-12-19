"use server";
export const submitForm = async (
  previousState: { message: string; error: string },
  formData: FormData
) => {
  const userEmail = formData.get("email");
  const userPassword = formData.get("password");
  console.log("====================================");
  console.log("Serve Side");
  console.log("====================================");
  // Simulate an API call
  if (userEmail && userPassword) {
    return { message: "Login successful", error: null };
  } else {
    return { message: null, error: "Invalid credentials" };
  }
};
