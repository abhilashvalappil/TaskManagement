
export interface SignUpFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignUpResponse {
    success: boolean;
    message: string;
    expiresIn: number;
}


export interface SignInFormData {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  user: IUser;
}


export interface VerifyOtpData {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    user?: IUser;
    token?: string;
}