// "use server";

import MyApi from "@/api/MyApi";
import { IRegistrationForm, IMessageAndError } from "@/types/api";

export const registerHandler = async (
  previousState: IMessageAndError,
  formData: FormData
): Promise<IMessageAndError> => {
  console.log(`Form Data: ${formData.get("gender")?.toString().trim()}`);

  const userName = formData.get("name")?.toString().trim();
  const userEmail = formData.get("email")?.toString().trim();
  const userPassword = formData.get("password")?.toString().trim();
  const userGender = formData.get("gender")?.toString().trim();
  const userRole = formData.get("role")?.toString().trim();
  const userPic = formData.get("profilePicture")?.toString();

  // Validation
  if (!userName) return { message: "", error: "Name is required." };
  if (!userEmail) return { message: "", error: "Email is required." };
  if (!userPassword) return { message: "", error: "Password is required." };
  if (!userGender) return { message: "", error: "Gender is required." };
  if (!userRole) return { message: "", error: "Role is required." };
  if (!userPic) return { message: "", error: "Profile picture is required." };

  // Prepare the payload as a JSON object
  const payload = {
    userPic: userPic,
    name: userName,
    email: userEmail,
    password: userPassword,
    gender: userGender,
    role: userRole,
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  try {
    console.log("Submitting payload:", payload);
    await delay(1000);
    const response = await MyApi.post("users/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Register Response:", response.data);

    // const data = response.data;
    console.log("Response:", response.data.message);

    return {
      message: response.data.message || "Register Success",
      error: "",
    };
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error?.msg ||
      err.response?.data?.error ||
      "Register Error";
    console.log("Error Response:", errorMessage);
    return {
      message: "",
      error: errorMessage || "Register Error",
    };
  }
};
