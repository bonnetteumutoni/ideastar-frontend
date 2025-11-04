export const verifyOtp = async (payload: { email: string; otp: string }) => {
  try {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify OTP");
    }

    return data;
  } catch (error) {
    throw error;
  }
};