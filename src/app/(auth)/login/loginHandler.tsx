// "use server";

import MyApi from "@/api/MyApi";
import { ILoginForm, IMessageAndError } from "@/types/api";

export const loginHandler = async (
  previousState: IMessageAndError,
  formData: FormData
): Promise<IMessageAndError> => {
  const userEmail = formData.get("email") as string;
  const userPassword = formData.get("password") as string;

  if (!userEmail || !userPassword) {
    return { message: "", error: "Email and password are required." };
  }

  // Prepare the payload as a JSON object
  const payload = {
    email: userEmail,
    password: userPassword,
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  try {
    await delay(10000);
    const response = await MyApi.post("users/login", payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { token, user, success } = response.data;
    console.log("Login Response:", response.data);

    // const data = response.data;
    console.log("Response:", response.data.message);
    if (success) {
      const loggedInUser = {
        id: user.id,
        role: user.role,
        username: user.username,
        gender: user.gender,
      };
      localStorage.setItem("loggedInToken", token);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      return {
        message: response.data.message || "Login Success",
        error: "",
      };
    }
    return {
      message: "",
      error: "something went wrong",
    };
  } catch (err: any) {
    console.log("Error Response:", err.response.data);
    return { message: "", error: err.response?.data?.error || "Login Error" };
  }
};
