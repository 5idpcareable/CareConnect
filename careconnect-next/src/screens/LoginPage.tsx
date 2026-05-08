import {
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react'

import Link from 'next/link'

import AppLayout from '../components/AppLayout'
import PageTransition from '../components/PageTransition'

export default function LoginPage() {
  return (
    <AppLayout>

      <PageTransition>

        {/* Back Button */}
        <div className='absolute left-6 top-8 z-20'>

          <button className='flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#f3ecff] shadow-sm transition-all duration-300 hover:scale-105'>

            <span className='text-3xl font-bold text-purple-600'>
              ‹
            </span>

          </button>

        </div>

        {/* Logo */}
        <div className='mt-8 flex flex-col items-center'>

          <img
            src='/images/logo.png'
            alt='CareAble'
            className='w-[220px] object-contain drop-shadow-[0_15px_35px_rgba(124,58,237,0.25)]'
          />

        </div>

        {/* Header */}
        <div className='mt-2 text-center'>

          <h1 className='text-[72px] font-black leading-[0.95] tracking-[-3px] text-[#0f172a]'>
            Welcome
            <br />
            Back
          </h1>

          <p className='mx-auto mt-8 max-w-[320px] text-[20px] leading-[2] text-gray-500'>
            Sign in to continue your caregiving capability journey and access your assessments, analytics, and certificates.
          </p>

        </div>

        {/* Form Card */}
        <div className='mt-14 rounded-[40px] bg-white/95 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl'>

          {/* Email */}
          <div>

            <label className='text-sm font-semibold text-gray-700'>
              Email Address
            </label>

            <div className='mt-3 flex items-center gap-4 rounded-[26px] bg-[#f6f1ff] px-6 py-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-400'>

              <Mail
                size={24}
                className='text-purple-500'
              />

              <input
                type='email'
                placeholder='Enter your email'
                className='w-full bg-transparent text-lg outline-none placeholder:text-gray-400'
              />

            </div>

          </div>

          {/* Password */}
          <div className='mt-7'>

            <label className='text-sm font-semibold text-gray-700'>
              Password
            </label>

            <div className='mt-3 flex items-center gap-4 rounded-[26px] bg-[#f6f1ff] px-6 py-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-400'>

              <Lock
                size={24}
                className='text-purple-500'
              />

              <input
                type='password'
                placeholder='Enter your password'
                className='w-full bg-transparent text-lg outline-none placeholder:text-gray-400'
              />

            </div>

          </div>

          {/* Forgot Password */}
          <div className='mt-5 flex justify-end'>

            <button className='text-sm font-semibold text-purple-600 transition hover:text-purple-800'>
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <Link
            href='/dashboard'
            className='mt-8 flex items-center justify-center gap-3 rounded-[30px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-6 text-xl font-bold text-white shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(124,58,237,0.5)] active:scale-[0.98]'
          >

            Sign In

            <ArrowRight size={24} />

          </Link>

          {/* Divider */}
          <div className='my-8 flex items-center gap-4'>

            <div className='h-px flex-1 bg-gray-200'></div>

            <span className='text-xs font-bold tracking-[4px] text-gray-400'>
              OR
            </span>

            <div className='h-px flex-1 bg-gray-200'></div>

          </div>

          {/* Social Login */}
          <div className='grid grid-cols-2 gap-4'>

            <button className='rounded-[24px] border border-gray-200 bg-white py-5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
              Google
            </button>

            <button className='rounded-[24px] border border-gray-200 bg-white py-5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
              Apple
            </button>

          </div>

        </div>

        {/* Register */}
        <div className='mt-10 text-center'>

          <p className='text-lg text-gray-500'>

            Don&apos;t have an account?{' '}

            <Link
              href='/register'
              className='font-bold text-purple-600'
            >
              Create Account
            </Link>

          </p>

        </div>

      </PageTransition>

    </AppLayout>
  )
}