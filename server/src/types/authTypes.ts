
export interface VerifyOtpResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface SignInResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
}

export interface UpdateProfileResponse {
    id: string;
    email: string;
    fullName: string;
}