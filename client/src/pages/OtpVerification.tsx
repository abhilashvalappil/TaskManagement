import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import { verifyOtp } from '../api/auth/authService';
import '../styles/OtpVerification.css';

interface LocationState {
    email: string;
    expiresIn?: number;  
}

const OtpVerification: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    // Use state email or fallback (should ideally always have email)
    const email = state?.email || '';
    const expiresIn = state?.expiresIn || 0;
 
    const [otp, setOtp] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [timer, setTimer] = useState<number>(expiresIn); 
    const [canResend, setCanResend] = useState<boolean>(false);

    useEffect(() => {
        if (!email) {
            // If no email in state, redirect to registration
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (newOtp: string) => {
        setOtp(newOtp);
        if (error) setError(undefined); // Clear error on change
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError('Please enter a complete 6-digit code.');
            return;
        }

        setIsLoading(true);
        setError(undefined);
        setSuccessMessage(undefined);

        try {
            const response = await verifyOtp({ email, otp });
            if (response.success) {
                setSuccessMessage('Email verified successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');  
                }, 1500);
            } else {
                setError(response.message || 'Verification failed. Please try again.');
            }
        } catch (err: any) {
            // Handle axios error specifically
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred during verification.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        // TODO: Implement resend OTP API call here
        // await resendOtp(email);

        setTimer(30);
        setCanResend(false);
        setSuccessMessage('A new code has been sent to your email.');
        // Clear success message after a few seconds
        setTimeout(() => setSuccessMessage(undefined), 3000);
    };

    const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="otp-verification-container">
            <div className="otp-verification-card">
                <div className="otp-header">
                    <h1 className="otp-title">Verify Your Email</h1>
                    <p className="otp-subtitle">
                        We've sent a 6-digit code to <br />
                        <span className="otp-email-highlight">{email}</span>
                    </p>
                </div>

                <div className="otp-input-section">
                    <OtpInput
                        length={6}
                        onChange={handleOtpChange}
                        onComplete={(code) => setOtp(code)}
                        error={!!error}
                        errorMessage="" // We display error differently or pass it here
                        disabled={isLoading}
                    />
                </div>

                {error && <div className="otp-message-error">{error}</div>}
                {successMessage && <div className="otp-message-success">{successMessage}</div>}

                <button
                    className="otp-verify-btn"
                    onClick={handleVerify}
                    disabled={otp.length !== 6 || isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className="otp-resend-text">
                    Didn't receive the code?
                    {canResend ? (
                        <button className="otp-resend-link" onClick={handleResendOtp}>
                            Resend Code
                        </button>
                    ) : (
                        <span className="otp-timer"> Resend in {formatTime(timer)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
