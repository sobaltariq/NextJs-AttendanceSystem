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
  userStatus: string;
  role: string;
  profilePicture: File | null;
}

// logged in user's profile
export interface MyProfileInterface {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  gender: string;
  position: string;
  leaveRequests: any[];
  paidLeavesTaken: number;
  leaveBalance: number;
  attendanceHistory: any[];
  notifications: any[];
  employeeOfTheMonthCount: number;
  monthlyPoints: number;
  hireDate: string;
  updatedAt: string;
  createdAt: string;
  username: string;
  userStatus: string;
}

// get my attendance
export interface MyAttendanceRecord {
  _id: string;
  userId: string;
  todayDate: string;
  status: "early" | "present" | "late" | "absent";
  checkInTime: string;
  createdAt: string;
  updatedAt: string;
}

// notice board
export interface CreatedBy {
  _id: string;
  name: string;
}
export interface NoticesInterface {
  title: String;
  content: String;
  createdBy: CreatedBy;
  type: "Reminder" | "Alert" | "Notice";
  createdAt: string;
}
