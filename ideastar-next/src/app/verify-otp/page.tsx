"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVerifyOtp } from '../hooks/useFetchVerifyOTP';
import { useResendOtp } from '../hooks/useFetchResendOTP';

export default function OTPVerify() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const { handleVerifyOtp, loading: verifyLoading, error: verifyError, success: verifySuccess } = useVerifyOtp();
  const { resendOtp, loading: resendLoading, error: resendError, success: resendSuccess } = useResendOtp();
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/forgot-password');
    }
  }, [router]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    setOtp([...otp.map((d, i) => (i === index ? element.value : d))]);
    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      return;
    }
    
    const result = await handleVerifyOtp({ email, otp: otpString });
    
    if (result) {
      if (result.token) {
        localStorage.setItem('resetToken', result.token);
      }
      router.push('/reset-password-page');
    }
  };

  const handleResend = async () => {
    if (email) {
      try {
        await resendOtp(email);
        setOtp(['', '', '', '']);
        const firstInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      } catch (error) {
        console.error('Resend OTP failed:', error);
      }
    }
  };

  const inknutStyle: React.CSSProperties = {
    fontFamily: "var(--font-inknut, 'Inknut Antiqua'), serif",
  };
  const error = verifyError || resendError;
  const success = verifySuccess || resendSuccess;
  const isLoading = verifyLoading || resendLoading;

  return (
    <>
      <Head>
        <title>Verify OTP - Authentication</title>
        <meta name="description" content="Enter your verification code" />
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
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#2F5A2B', ...inknutStyle }}>Verify OTP</h1>
            <p className="text-gray-600 mb-9 text-sm" style={{ ...inknutStyle }}>
              We've sent a verification code to {email || 'your email'}
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex gap-1 ml-10">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC7A15] focus:border-transparent"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 bg-[#AC7A15] hover:bg-[#8F6412] disabled:opacity-50"
                style={{ ...inknutStyle }}
                disabled={isLoading || otp.join('').length !== 4}
              >
                {verifyLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600" style={{ ...inknutStyle }}>
                Didn't receive the code?{' '}
                <button 
                  onClick={handleResend}
                  className="font-medium hover:underline" 
                  style={{ color: '#AC7A15',...inknutStyle }}
                  disabled={isLoading}
                >
                  {resendLoading ? 'Sending...' : 'Resend'}
                </button>
              </p>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600"  style={{ ...inknutStyle }}>
              Back to{' '}
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