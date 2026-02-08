import { commonENDPOINTS } from "../../constants/endPointUrl";
import type { SignUpFormData, SignInFormData, SignUpResponse, VerifyOtpData, VerifyOtpResponse, SignInResponse } from "../../types/authTypes";
import API from "../../utils/axiosInstance";


export const signUp = async (userData: SignUpFormData): Promise<SignUpResponse> => {
    const response = await API.post(commonENDPOINTS.SIGNUP, userData)
    return response.data;
}

export const signIn = async (userData: SignInFormData): Promise<SignInResponse> => {
    const response = await API.post(commonENDPOINTS.LOGIN, userData)
    return response.data;
}

export const verifyOtp = async (userData: VerifyOtpData): Promise<VerifyOtpResponse> => {
    const response = await API.post(commonENDPOINTS.VERIFY_OTP, userData)
    return response.data;
}

export const googleSignIn = async (token: string): Promise<SignInResponse> => {
    const response = await API.post('/auth/google', { token });
    return response.data;
}

export const logout = async (): Promise<any> => {
    const response = await API.post('/auth/logout');
    return response.data;
}

export const updateProfile = async (fullName: string): Promise<any> => {
    const response = await API.put('/auth/update-profile', { fullName });
    return response.data;
}