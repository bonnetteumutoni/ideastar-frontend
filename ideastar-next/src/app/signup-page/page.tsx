'use client';
import { useState } from 'react';
import { useFetchSignup } from '../hooks/useFetchSignup';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { signup, loading, error } = useFetchSignup();
  const router = useRouter();

  const inknutStyle: React.CSSProperties = {
    fontFamily: "var(--font-inknut, 'Inknut Antiqua'), serif",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirm_password) {
      setValidationError("Passwords don't match");
      return;
    }
    const result = await signup({ first_name, last_name, email, password, confirm_password });
    
    if (result) {
      router.push('/signin-page');
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Get Started</title>
        <meta name="description" content="Sign up to get started" />
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
            <h1 className="text-3xl font-bold mb-9" style={{ color: '#2F5A2B', ...inknutStyle }}>Get Started</h1>
            {(validationError || error) && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {validationError || error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={first_name}
                    onChange={(e) => setfirst_name(e.target.value)}
                    placeholder="First name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={last_name}
                    onChange={(e) => setlast_name(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" style={{ ...inknutStyle }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
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
                  autoComplete="new-password"
                  required
                  value={confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent placeholder:italic placeholder:opacity-70"
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password-page" className="text-sm text-gray-600 hover:text-gray-800 hover:underline" style={{ ...inknutStyle }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 bg-[#AC7A15] hover:bg-[#8F6412] disabled:opacity-50"
                style={{ ...inknutStyle }}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500" style={{ ...inknutStyle }}>Or</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  style={{ ...inknutStyle }}
                >
                  <FcGoogle className="h-5 w-5 mr-2" color="#4285F4" />
                  Sign up with Google
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600" style={{ ...inknutStyle }}>
              Already have an account?{' '}
              <Link href="/signin-page" className="font-medium hover:underline" style={{ color: '#AC7A15', ...inknutStyle }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}