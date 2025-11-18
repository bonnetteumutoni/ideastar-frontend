const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/projects/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
       status: 200 
      });
  } catch (error) {
    return new Response((error as Error).message, { 
      status: 500
     });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('user');
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }
    backendFormData.set('user', userId.toString());
    
    const response = await fetch(`${baseUrl}/projects/`, {
      method: 'POST',
      body: backendFormData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      throw new Error(errorData.message || `Failed to create project: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}