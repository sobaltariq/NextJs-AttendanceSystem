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

// leave request
export interface ApplyLeaveInterface {
  leaveType: "casual" | "sick" | "personal";
  startDate: string;
  endDate: string;
  reason: string;
}

// get my leaves
export interface MyLeaveInterface {
  _id: string;
  userId: string;
  leaveType: "casual" | "sick" | "personal";
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
  reason: string;
  daysRequested: number;
  createdAt: string;
  updatedAt: string;
}

// employ of the month
export interface EmpInterface {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    username: string;
    monthlyPoints: number;
  };
  username: string;
  month:
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";
  year: number;
  reason: string;
  awardedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentEmpInterface {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    username: string;
    monthlyPoints: number;
  };
  username: string;
  month: string;
  year: number;
  reason: string;
  awardedAt: string; // ISO string date format
  createdAt: string; // ISO string date format
  updatedAt: string; // ISO string date format
  __v: number;
}

// interaction

export interface UsersListInterface {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  role: string;
}

// chat
export interface ChatInterface {
  _id: string;
  chatType: "private" | "group";
  groupName: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IMessageInterface {
  _id: string; // MongoDB ID will be returned as a string
  chatId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  status: "sent" | "delivered" | "read";
  deliveredAt?: string | null; // Dates are returned as strings in JSON responses
  readAt?: string | null;
  timestamp: string;
}

export interface ReceivedMessageInterface {
  chatId: string;
  message: IMessageInterface;
}

export interface GroupChatListInterface {
  _id: string;
  chatType: string;
  createdAt: string;
  groupAdmin: string;
  groupName: string;
  participants: any[];
  updatedAt: string;
}
