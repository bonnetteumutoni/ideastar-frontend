"use client";
import { useState } from "react";
import { resetPassword } from "../utils/fetchResetPassword";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (payload: { email: string; password: string; token?: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("useResetPassword called with:", { ...payload, password: "***" }); 
      const data = await resetPassword(payload);
      console.log("Password reset successful:", data); 
      setSuccess(data.message || "Password reset successfully!");
      return data;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Password reset failed:", errorMessage); 
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading, error, success };
}