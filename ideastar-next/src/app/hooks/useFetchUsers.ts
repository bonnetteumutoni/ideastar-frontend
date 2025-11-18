import { useEffect, useState } from "react";

interface UserType {
  id: string;
  name: string;
  first_name: string;
  last_name?: string;
  profile_image: string;
  followers_count: number;
  following_count: number;
  role: string;
  created_at: string;
  updated_at: string;
  email?: string;
}

const useFetchUsers = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const refetch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        mode: 'cors',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const result = await response.json();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = user.id || null;
      const filteredUsers = currentUserId 
        ? result.filter((user: UserType) => user.id !== currentUserId)
        : result;
        
      setUsers(filteredUsers);
    } catch (error) {
      if ((error as Error).message.includes('CORS') || (error as Error).message.includes('Failed to fetch')) {
        setError('Internal Server Error.');
      } else {
        setError((error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { users, loading, error, refetch };
};

export default useFetchUsers;