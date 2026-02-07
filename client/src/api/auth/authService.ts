import { commonENDPOINTS } from "../../constants/endPointUrl";
import type { IUser, SignUpFormData, SignInFormData, SignUpResponse, VerifyOtpData, VerifyOtpResponse, SignInResponse } from "../../types/authTypes";
import API from "../../utils/axiosInstance";


export const signUp = async (userData: SignUpFormData): Promise<SignUpResponse> => {
    console.log("User Data: ", userData);
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