'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiBarChart2 } from 'react-icons/fi';
import useFetchProjects from '../hooks/useFetchProjects';
import Navigation from '../sharedComponents/Navigation';

interface User {
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

export default function NewUserPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const { projects, loading: projectsLoading, error: projectsError } = useFetchProjects();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [updatingFollow, setUpdatingFollow] = useState(false);
  const DESCRIPTION_CHAR_LIMIT = 100;
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    return token;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = searchParams.get('userId');
      if (!userId) {
        userId = localStorage.getItem('viewingUserId');
      }
      if (!userId) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const loggedInUserId = currentUser.id || null;
      setCurrentUserId(loggedInUserId);

      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to fetch user profile: ${response.status}. ${errorData.detail || errorData.message || ''}`);
        }

        const userData = await response.json();
        setUser(userData);
        if (loggedInUserId && loggedInUserId !== userId) {
          try {
            const followResponse = await fetch(`${API_BASE_URL}/users/${userId}/check-follow/`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (followResponse.ok) {
              const followData = await followResponse.json();
              setIsFollowing(followData.is_following);
            }
          } catch (e) {
          }
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [searchParams]);

  const handleFollow = async () => {
    if (!user || !currentUserId || currentUserId === user.id) return;
    
    setUpdatingFollow(true);
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/follow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to follow user: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += `. ${errorData.detail || errorData.message || JSON.stringify(errorData)}`;
        } catch (e) {
          errorMessage += '. Server error details unavailable.';
        }
        throw new Error(errorMessage);
      }

      setIsFollowing(true);
      setUser(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
      
    } catch (error) {
      alert(`Failed to follow user: ${(error as Error).message}`);
    } finally {
      setUpdatingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user || !currentUserId || currentUserId === user.id) return;
    
    setUpdatingFollow(true);
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/unfollow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to unfollow user: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += `. ${errorData.detail || errorData.message || JSON.stringify(errorData)}`;
        } catch (e) {
          errorMessage += '. Server error details unavailable.';
        }
        throw new Error(errorMessage);
      }

      setIsFollowing(false);
      setUser(prev => prev ? { ...prev, followers_count: Math.max(0, prev.followers_count - 1) } : null);
      
    } catch (error) {
      alert(`Failed to unfollow user: ${(error as Error).message}`);
    } finally {
      setUpdatingFollow(false);
    }
  };

  const handleAnalyzeProject = (projectId: number) => {
  };
  const toggleProjectExpanded = (projectId: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const userProjects = projects.filter(project => project.user === parseInt(user?.id || '0'));
  const projectCount = userProjects.length;

  if (loading || projectsLoading) {
    return (
      <div>
        <Navigation />
        <div className="flex justify-center items-center h-screen">Loading...</div>
      </div>
    );
  }

  if (error || projectsError) {
    return (
      <div>
        <Navigation />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md p-6">
            <p className="text-red-500 mb-4">Error: {error || projectsError}</p>
            <button onClick={() => router.back()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Go Back</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Reload</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:w-1/4">
            <img
              src={user?.profile_image || '/default-avatar.png'}
              alt={`${user?.first_name} ${user?.last_name}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <h2 className="mt-4 text-xl font-bold">{user?.name || `${user?.first_name} ${user?.last_name}`}</h2>
            <p className="text-gray-600 mt-1">{user?.role || ''}</p>
            {currentUserId && currentUserId !== user?.id && (
              <div className="mt-4 w-full">
                {updatingFollow ? (
                  <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                    {isFollowing ? 'Unfollowing...' : 'Following...'}
                  </button>
                ) : isFollowing ? (
                  <button onClick={handleUnfollow} className="w-full px-3 py-2 bg-orange-300 text-gray-700 rounded hover:bg-orange-400">
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="w-full px-3 py-2 bg-[#AC7A15] text-white rounded hover:bg-orange-600">
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col md:w-1/2">
            <div className="flex justify-around mt-15">
              <div className="text-center">
                <p className="text-2xl font-bold">{projectCount}</p>
                <p className="text-gray-600">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{user?.followers_count || 0}</p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{user?.following_count || 0}</p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end md:w-1/4">
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-xl font-bold mb-4">Projects</h3>
          <hr className='p-3 text-gray-400 pt-2'></hr>
          {userProjects.length > 0 ? (
            <div>
              {userProjects.map(project => {
                const isExpanded = expandedProjects.has(project.id);
                const description = project.project_description || '';
                const shouldTruncate = description.length > DESCRIPTION_CHAR_LIMIT;
                const displayDescription = isExpanded ? description : truncateText(description, DESCRIPTION_CHAR_LIMIT);
                
                return (
                  <div key={project.id} className="flex w-full mt-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative w-100 h-48">
                      <img
                        src={project.cover_image || '/placeholder-project.jpg'}
                        alt={project.project_name}
                        className="w-100 h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-lg">{project.project_name}</h4>
                      <p className="text-gray-600 mt-2">
                        {displayDescription}
                        {shouldTruncate && (
                          <button 
                            onClick={() => toggleProjectExpanded(project.id)}
                            className="text-[#AC7A15] font-medium ml-1 hover:underline"
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </p>
                      <div className="mt-4 flex justify-between">
                        <span className="text-sm text-black-500">{project.project_field}</span>
                        <span className="text-10 font-900 text-[#2F5A2B]">{project.project_location}</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => handleAnalyzeProject(project.id)}
                          className="px-4 py-2 bg-[#2F5A2B] text-white rounded-md hover:bg-[#AC7A15] flex items-center"
                        >
                          <FiBarChart2 className="h-4 w-4 mr-2" />
                          Analyze
                        </button>
                        <span className="text-12 text-[#AC7A15] font-800 self-center">
                          Updated: {new Date(project.updated_at || '2025-07-20').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{user?.first_name} doesn't have any projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}