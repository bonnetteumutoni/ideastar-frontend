const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    if (!BASE_URL) {
      console.error("BASE_URL is not configured");
      return new Response(JSON.stringify({ message: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    console.log("Reset password request body:", body); 
    
    const { email, password, token } = body;

    if (!email || !password) {
      console.error("Missing required fields:", { email: !!email, password: !!password });
      return new Response(
        JSON.stringify({ 
          message: "Missing required fields: email and password",
          received: { email: !!email, password: !!password, token: !!token }
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    const requestBody = token ? { email, password, token } : { email, password };
    console.log("Sending to backend:", requestBody); 

    const response = await fetch(`${BASE_URL}/reset-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Backend response:", { status: response.status, data }); 

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || "Password reset failed" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reset password route error:", error);
    return new Response(
      JSON.stringify({ 
        message: (error as Error).message || "Something went wrong",
        error: (error as Error).stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}