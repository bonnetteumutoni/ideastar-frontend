const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    if (!BASE_URL) {
      return new Response(JSON.stringify({ message: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();

    const response = await fetch(`${BASE_URL}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    
    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || "Failed to send reset email" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Forgot password route error:", error);

    return new Response(
      JSON.stringify({ message: (error as Error).message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}