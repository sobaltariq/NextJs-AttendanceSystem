// "use server";

import MyApi from "@/api/MyApi";
import { IRegistrationForm, IMessageAndError } from "@/types/api";

export const registerHandler = async (
  previousState: IMessageAndError,
  formData: FormData
): Promise<IMessageAndError> => {
  const userName = formData.get("name") as string;
  const userEmail = formData.get("email") as string;
  const userPassword = formData.get("password") as string;
  const userRole = formData.get("role") as string;
  const userPic = formData.get("profilePicture") as string;

  let validationError = "";

  switch (true) {
    case !userPic:
      validationError = "Name is required.";
      break;
    case !userName:
      validationError = "Name is required.";
      break;
    case !userEmail:
      validationError = "Email is required.";
      break;
    case !userPassword:
      validationError = "Password is required.";
      break;
    case !userRole:
      validationError = "Role is required.";
      break;
  }
  if (validationError) {
    return { message: "", error: validationError };
  }

  // Prepare the payload as a JSON object
  const payload = {
    userPic: userPic,
    name: userName,
    email: userEmail,
    password: userPassword,
    role: userRole,
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  try {
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
