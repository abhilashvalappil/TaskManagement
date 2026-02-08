import React, { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import '../styles/OtpInput.css';

interface OtpInputProps {
    length?: number;
    onComplete?: (otp: string) => void;
    onChange?: (otp: string) => void;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    onComplete,
    onChange,
    disabled = false,
    error = false,
    errorMessage = '',
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Call onChange callback
        const otpString = newOtp.join('');
        if (onChange) {
            onChange(otpString);
        }

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete if all fields are filled
        if (newOtp.every((digit) => digit !== '') && onComplete) {
            onComplete(otpString);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Move to next input on arrow right
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Move to previous input on arrow left
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Only process if pasted data contains only digits
        if (!/^\d+$/.test(pastedData)) return;

        const pastedArray = pastedData.slice(0, length).split('');
        const newOtp = [...otp];

        pastedArray.forEach((digit, index) => {
            newOtp[index] = digit;
        });

        setOtp(newOtp);

        // Call onChange callback
        const otpString = newOtp.join('');
        if (onChange) {
            onChange(otpString);
        }

        // Focus on the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else {
            inputRefs.current[length - 1]?.focus();
        }

        // Call onComplete if all fields are filled
        if (newOtp.every((digit) => digit !== '') && onComplete) {
            onComplete(otpString);
        }
    };

    const handleFocus = (index: number) => {
        // Select the input content on focus
        inputRefs.current[index]?.select();
    };

    return (
        <div className="otp-input-container">
            <div className={`otp-input-wrapper ${error ? 'otp-input-error' : ''}`}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => handleFocus(index)}
                        disabled={disabled}
                        className={`otp-input-box ${digit ? 'otp-input-filled' : ''} ${disabled ? 'otp-input-disabled' : ''
                            }`}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>
            {error && errorMessage && (
                <div className="otp-error-message">
                    <span className="otp-error-icon">⚠</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default OtpInput;
