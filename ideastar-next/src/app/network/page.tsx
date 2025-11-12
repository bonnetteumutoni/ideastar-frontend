'use client';
import React, { useState, useEffect } from 'react';
import useFetchUsers from '../hooks/useFetchUsers';
import Navigation from '../sharedComponents/Navigation';
import { useRouter } from 'next/navigation';

export default function NetworkPage() {
  const { users, loading, error } = useFetchUsers();
  const router = useRouter();
  const [followStatus, setFollowStatus] = useState<{[key: string]: boolean}>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id || null);
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      // Update follow status
      setFollowStatus(prev => ({ ...prev, [userId]: true }));
      
      // Refresh the page to show updated follower counts
      window.location.reload();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/unfollow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }

      // Update follow status
      setFollowStatus(prev => ({ ...prev, [userId]: false }));
      
      // Refresh the page to show updated follower counts
      window.location.reload();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="flex justify-center items-center h-screen">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="flex justify-center items-center h-screen">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Network</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <img 
                  src={user.profile_image || '/default-avatar.png'} 
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{user.first_name} {user.last_name}</h3>
                  <p className="text-gray-600 text-sm">{user.role}</p>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>{user.followers_count} followers</span>
                <span>{user.following_count} following</span>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => handleViewProfile(user.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Profile
                </button>
                
                {currentUserId !== user.id && (
                  followStatus[user.id] ? (
                    <button
                      onClick={() => handleUnfollow(user.id)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Follow
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}