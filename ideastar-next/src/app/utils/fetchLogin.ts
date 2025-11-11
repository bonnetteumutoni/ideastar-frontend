const baseUrl = "/api/login";

interface LoginErrorResponse {
  message: string;
}

interface LoginSuccessResponse {
  access: string;
  user: {
    id: string;
    email: string;
    password: string;

  };
}

export async function fetchLogin(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = (data as LoginErrorResponse).message || "Invalid email or password";
      throw new Error(errorMessage);
    }
    
    console.log("API response:", data);
    return data as LoginSuccessResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

