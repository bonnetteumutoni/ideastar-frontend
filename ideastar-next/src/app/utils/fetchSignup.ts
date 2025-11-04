export const fetchSignup = async (formData: {
  email: string;
  password: string;
  confirm_password: string;
}) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message =
        (data && (data.error || data.message)) ||
        (data && typeof data === "string" ? data : null) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};