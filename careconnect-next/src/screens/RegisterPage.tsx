import {
    User,
    Mail,
    Lock,
    ArrowRight,
  } from 'lucide-react'
  
  import Link from 'next/link'
  
  import AppLayout from '../components/AppLayout'
  import PageTransition from '../components/PageTransition'
  
  export default function RegisterPage() {
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
  
            <h1 className='text-[64px] font-black leading-[0.95] tracking-[-3px] text-[#0f172a]'>
              Create
              <br />
              Account
            </h1>
  
            <p className='mx-auto mt-8 max-w-[320px] text-[20px] leading-[2] text-gray-500'>
              Start your caregiving capability journey and unlock assessments, analytics, and certifications.
            </p>
  
          </div>
  
          {/* Form Card */}
          <div className='mt-14 rounded-[40px] bg-white/95 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl'>
  
            {/* Full Name */}
            <div>
  
              <label className='text-sm font-semibold text-gray-700'>
                Full Name
              </label>
  
              <div className='mt-3 flex items-center gap-4 rounded-[26px] bg-[#f6f1ff] px-6 py-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-400'>
  
                <User
                  size={24}
                  className='text-purple-500'
                />
  
                <input
                  type='text'
                  placeholder='Enter your full name'
                  className='w-full bg-transparent text-lg outline-none placeholder:text-gray-400'
                />
  
              </div>
  
            </div>
  
            {/* Email */}
            <div className='mt-7'>
  
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
                  placeholder='Create a password'
                  className='w-full bg-transparent text-lg outline-none placeholder:text-gray-400'
                />
  
              </div>
  
            </div>
  
            {/* Create Button */}
            <Link
              href='/dashboard'
              className='mt-8 flex items-center justify-center gap-3 rounded-[30px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-6 text-xl font-bold text-white shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(124,58,237,0.5)] active:scale-[0.98]'
            >
  
              Create Account
  
              <ArrowRight size={24} />
  
            </Link>
  
          </div>
  
          {/* Login */}
          <div className='mt-10 text-center'>
  
            <p className='text-lg text-gray-500'>
  
              Already have an account?{' '}
  
              <Link
                href='/login'
                className='font-bold text-purple-600'
              >
                Sign In
              </Link>
  
            </p>
  
          </div>
  
        </PageTransition>
  
      </AppLayout>
    )
  }