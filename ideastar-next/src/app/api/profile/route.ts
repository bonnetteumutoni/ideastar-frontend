import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

if (!baseUrl) {
  throw new Error("BASE_URL environment variable is not set");
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const userId = new URL(request.url).searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const backendUrl = `${baseUrl}/users/${userId}/`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `Backend error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error",
      details: (error as Error).message 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const userId = new URL(request.url).searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    
    const contentType = request.headers.get("content-type") || "";
    const body = contentType.includes("multipart/form-data") 
      ? await request.formData() 
      : await request.json();

    const backendUrl = `${baseUrl}/users/${userId}/`;
    
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': token || '',
        ...(contentType.includes("multipart/form-data") ? {} : { 'Content-Type': 'application/json' }),
      },
      body: contentType.includes("multipart/form-data") ? body : JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `Backend error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error",
      details: (error as Error).message 
    }, { status: 500 });
  }
}