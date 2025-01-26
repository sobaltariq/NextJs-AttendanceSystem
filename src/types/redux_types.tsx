export interface AuthReduxState {
  isLoggedIn: boolean;
  loginToken: string | null;
  userRole: string | null;
  username: string | null;
  userGender: string | null;
  userId: number | null;
}
