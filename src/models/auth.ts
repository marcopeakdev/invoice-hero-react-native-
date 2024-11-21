import { HumanName } from "./common";
import { User, UserRole } from "./user";

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface SignupRequest {
  name?: HumanName;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupResponse {
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
