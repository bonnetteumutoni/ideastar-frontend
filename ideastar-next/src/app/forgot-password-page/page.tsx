"use client";
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { useForgotPassword } from '../hooks/useFetchForgotPassword';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPassword, loading, error, success } = useForgotPassword();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    if (result) {
      localStorage.setItem('resetEmail', email);
      router.push('/verify-otp');
    }
  };

  const inknutStyle: React.CSSProperties = {
    fontFamily: "var(--font-inknut, 'Inknut Antiqua'), serif",
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Reset</title>
        <meta name="description" content="Reset your password" />
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
            <h1 className="text-3xl font-bold mb-9" style={{ color: '#2F5A2B', ...inknutStyle }}>Forgot Password</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"  style={{ ...inknutStyle }}>
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

              <button
                type="submit"
                className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 bg-[#AC7A15] hover:bg-[#8F6412] disabled:opacity-50"
                 style={{ ...inknutStyle }}
                 disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset OTP'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500"  style={{ ...inknutStyle }}>Or</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                   style={{ ...inknutStyle }}
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Continue with Google
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600"  style={{ ...inknutStyle }}>
              Remember your password?{' '}
              <Link href="/signin" className="font-medium hover:underline" style={{ color: '#AC7A15',...inknutStyle  }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}