'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit, FiPlus, FiBarChart2, FiX } from 'react-icons/fi';
import useFetchUsers from '../hooks/useFetchProfile';
import useFetchProjects from '../hooks/useFetchProjects';
import { fetchProfile, updateUser } from '../utils/fetchProfile';
import Navigation from '../sharedComponents/Navigation';

export default function ProfilePage() {
  const { user, loading: userLoading, error: userError } = useFetchUsers();
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useFetchProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError('');
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      role: user?.role || '',
    });
    setProfileImage(null);
  };

  const handleSaveProfile = async () => {
    try {
      setSaveError('');
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('email', formData.email);
      data.append('role', formData.role);
      
      if (profileImage) {
        data.append('profile_image', profileImage);
      }
      console.log('Saving profile with data:', Object.fromEntries(data));
      
      const response = await updateUser(data);
      console.log('Update response:', response);
      
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError((error as Error).message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleNewProject = () => {
    router.push('/projects/new');
  };

  const handleAnalyzeProject = (projectId: number) => {
    console.log(`Analyzing project with ID: ${projectId}`);
  };
  const userProjects = projects.filter(project => project.user === parseInt(user?.id || '0'));
  const projectCount = userProjects.length;

  if (userLoading || projectsLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (userError || projectsError) {
    return <div className="flex justify-center items-center h-screen">Error: {userError || projectsError}</div>;
  }

  return (
    <div>
      <Navigation/>
      <div className="container mx-auto p-6 ">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:w-1/4">
            <div className="relative">
              <img
                src={user?.profile_image || '/default-avatar.png'}
                alt={`${user?.first_name} ${user?.last_name}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <h2 className="mt-4 text-xl font-bold">{user?.name || `${user?.first_name} ${user?.last_name}`}</h2>
            <p className="text-gray-600 mt-1">{user?.role || ''}</p>
            <button
              onClick={handleEditProfile}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
            >
              <FiEdit className="h-4 w-4 mr-2" />
              Edit profile
            </button>
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
            <button
              onClick={handleNewProject}
              className="px-6 py-2 bg-[#AC7A15] text-white h-14 mt-1 rounded-md hover:bg-orange-600 flex items-center"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-xl font-bold mb-4">My Projects</h3>
          <hr className='p-3 text-gray-400'></hr>
          {userProjects.length > 0 ? (
            <div>
              {userProjects.map(project => (
                <div key={project.id} className="flex w-full mt-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={project.cover_image || '/placeholder-project.jpg'}
                      alt={project.project_name}
                      className="w-140 h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg">{project.project_name}</h4>
                    <p className="text-gray-600 mt-2">{project.project_description}</p>
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
                
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any projects yet.</p>
              <button
                onClick={handleNewProject}
                className="mt-4 px-6 py-2 bg-[#AC7A15] text-white rounded-md hover:bg-orange-600"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gradient-to-br from-black/70 via-gray-900/50 to-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
            
            {saveError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {saveError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Artist, Designer, Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-[#AC7A15] text-white rounded-md hover:bg-blue-600 flex-1"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}