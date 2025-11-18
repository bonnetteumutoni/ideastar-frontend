const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}/users/`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }   
    const result = await response.json();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = user.id || null;
    
    return currentUserId 
      ? result.filter((user: { id: string }) => user.id !== currentUserId)
      : result;
  } catch (error) {
    throw new Error('Failed to fetch users: ' + (error as Error).message);
  }
}