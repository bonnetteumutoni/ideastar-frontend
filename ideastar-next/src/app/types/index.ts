export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  followers_count: number;
  following_count: number;
  created_at: string; 
  updated_at: string; 
}

export interface GetUserResponse {
  user: User;
}