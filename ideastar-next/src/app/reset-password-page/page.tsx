"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResetPassword } from '../hooks/useFetchResetPassword';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { handleResetPassword, loading, error, success } = useResetPassword();
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedToken = localStorage.getItem('resetToken');
    
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    setIsDataLoaded(true);
    if (!storedEmail) {
      router.push('/forgot-password');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return;
    }
    if (newPassword.length < 8) {
      return;
    }
    if (!email) {
      return;
    }
    
    const result = await handleResetPassword({ 
      email, 
      password: newPassword,
      token 
    });
    
    if (result) {
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetToken');
      setTimeout(() => {
        router.push('/signin-page');
      }, 2000);
    }
  };

  const inknutStyle: React.CSSProperties = {
    fontFamily: "var(--font-inknut, 'Inknut Antiqua'), serif",
  };
  if (!isDataLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC7A15] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Create New Password</title>
        <meta name="description" content="Reset your account password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen font-sans">
        <div className="hidden lg:block lg:w-1/2 relative rounded-tr-[200px] rounded-br-[200px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2F5A2B] to-[#2F5A2B] opacity-50 z-10"></div>
          <Image
            src="/images/Lamp.jpg"
            alt="Modern wall lamp"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-9" style={{ color: '#2F5A2B', ...inknutStyle }}>Reset Password</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success} Redirecting to login...
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                  disabled={loading}
                />
              </div>

              {newPassword && confirmPassword && (
                <div className="mt-2 text-sm">
                  {newPassword !== confirmPassword ? (
                    <p className="text-red-500">Passwords don't match</p>
                  ) : newPassword.length < 8 ? (
                    <p className="text-red-500">Password must be at least 8 characters long</p>
                  ) : (
                    <p className="text-green-500">Passwords match</p>
                  )}
                </div>
              )}

              <div className="mt-6 text-xs text-gray-500" style={{ ...inknutStyle }}>
                Password must be at least 8 characters long
              </div>

              <button
                type="submit"
                className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 bg-[#AC7A15] hover:bg-[#8F6412] disabled:opacity-50"
                style={{ ...inknutStyle }}
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || !email}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-800 hover:underline" style={{ ...inknutStyle }}>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}