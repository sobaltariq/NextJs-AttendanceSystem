export interface IMessageAndError {
  message?: string;
  error?: string;
}

// login
export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegistrationForm extends ILoginForm {
  name: string;
  username: string;
  gender: string;
  role: string;
  profilePicture: File | null;
}
