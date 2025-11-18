'use client';
import React, { useState, useEffect } from 'react';
import useFetchUsers from '../hooks/useFetchUsers';
import Navigation from '../sharedComponents/Navigation';
import { useRouter } from 'next/navigation';

export default function NetworkPage() {
    const { users, loading, error, refetch } = useFetchUsers();
    const router = useRouter();
    const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({});
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUserId(user.id || null);
    }, []);

    const handleFollow = async (userId: string) => {
        if (!currentUserId || currentUserId === userId) return;

        setUpdating(userId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/${userId}/follow/`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to follow user: ${response.status}`);
            }
            setFollowStatus(prev => ({ ...prev, [userId]: true }));
            await refetch();
        } catch (error) {
            alert('Failed to follow user');
        } finally {
            setUpdating(null);
        }
    };

    const handleUnfollow = async (userId: string) => {
        if (!currentUserId || currentUserId === userId) return;

        setUpdating(userId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/${userId}/unfollow/`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to unfollow user: ${response.status}`);
            }

            setFollowStatus(prev => ({ ...prev, [userId]: false }));
            await refetch();
        } catch (error) {
            alert('Failed to unfollow user');
        } finally {
            setUpdating(null);
        }
    };

    const handleViewProfile = (e: React.MouseEvent, userId: string) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('viewingUserId', userId);
        router.push(`/new-user-page?userId=${userId}`);
    };

    const handleCardClick = (userId: string) => {
        localStorage.setItem('viewingUserId', userId);
        router.push(`/new-user-page?userId=${userId}`);
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
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center max-w-md p-6">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navigation />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-[#2F5A2B] mb-6">Find people</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div 
                            key={user.id} 
                            className="bg-gray-200 rounded-lg shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow"
                            onClick={() => handleCardClick(user.id)}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={user.profile_image || '/default-avatar.png'}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-12 h-12 rounded-full mr-3 object-cover"
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
                                    onClick={(e) => handleViewProfile(e, user.id)}
                                    className="px-3 py-1 bg-[#2F5A2B] text-white text-xs rounded hover:bg-green-600"
                                >
                                    View Profile
                                </button>

                                {currentUserId !== user.id && (
                                    updating === user.id ? (
                                        <button
                                            disabled
                                            className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                                        >
                                            {followStatus[user.id] ? 'Unfollowing...' : 'Following...'}
                                        </button>
                                    ) : followStatus[user.id] ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUnfollow(user.id);
                                            }}
                                            className="px-3 py-1 bg-[#AC7A15] text-gray-700 text-sm rounded hover:bg-orange-400"
                                        >
                                            Unfollow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleFollow(user.id);
                                            }}
                                            className="px-3 py-1 bg-[#AC7A15] text-white text-sm rounded hover:bg-orange-400"
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
        </div >
    );
}