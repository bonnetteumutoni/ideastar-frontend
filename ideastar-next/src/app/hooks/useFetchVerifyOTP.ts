"use client";
import { useState } from "react";
import { verifyOtp } from "../utils/fetchVerifyOTP";

export function useVerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerifyOtp = async (payload: { email: string; otp: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await verifyOtp(payload);
      setSuccess("OTP verified successfully!");
      return data;
    } catch (err) {
      let errorMessage = "Something went wrong";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyOtp, loading, error, success };
}