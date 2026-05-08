'use client'

import { useState } from 'react'

import {
  ShieldCheck,
  Search,
  BadgeCheck,
  CircleAlert,
  User,
  Calendar,
  Award,
} from 'lucide-react'

import AppLayout from '../components/AppLayout'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

export default function VerifyPage() {
  const [verified] = useState(true)

  return (
    <AppLayout>

      <PageTransition>

        <div className='pb-28'>

          {/* Header */}
          <div>

            <p className='text-sm font-medium text-gray-400'>
              Employer Validation Portal
            </p>

            <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
              Verify
            </h1>

          </div>

          {/* Search Card */}
          <div className='mt-8 rounded-[36px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-6 text-white shadow-[0_20px_60px_rgba(139,92,246,0.35)]'>

            <div className='flex items-center gap-4'>

              <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/15'>

                <ShieldCheck size={30} />

              </div>

              <div>

                <h2 className='text-3xl font-black'>
                  Certificate Validation
                </h2>

                <p className='mt-2 text-white/80'>
                  Verify caregiver credentials instantly
                </p>

              </div>

            </div>

            {/* Input */}
            <div className='mt-8 flex items-center gap-4 rounded-[28px] bg-white/10 px-5 py-5 backdrop-blur-xl'>

              <Search size={24} />

              <input
                type='text'
                placeholder='Enter certificate ID'
                className='w-full bg-transparent text-lg outline-none placeholder:text-white/60'
              />

            </div>

            {/* Button */}
            <button className='mt-6 w-full rounded-[28px] bg-white py-5 text-xl font-black text-purple-600 transition-all duration-300 hover:scale-[1.02]'>

              Verify Certificate

            </button>

          </div>

          {/* Result */}
          {verified ? (
            <div className='mt-8 rounded-[36px] bg-white p-7 shadow-sm'>

              {/* Verified Badge */}
              <div className='flex justify-center'>

                <div className='flex h-28 w-28 items-center justify-center rounded-full bg-green-100'>

                  <BadgeCheck
                    size={56}
                    className='text-green-600'
                  />

                </div>

              </div>

              {/* Title */}
              <div className='mt-6 text-center'>

                <h2 className='text-4xl font-black text-[#0f172a]'>
                  Verified
                </h2>

                <p className='mt-3 text-base leading-8 text-gray-500'>
                  This caregiver capability certificate is authentic and valid.
                </p>

              </div>

              {/* Info */}
              <div className='mt-8 space-y-5'>

                {/* Name */}
                <div className='flex items-center gap-5 rounded-[28px] bg-[#f7f4ff] p-5'>

                  <div className='rounded-[22px] bg-white p-4 shadow-sm'>

                    <User
                      size={26}
                      className='text-purple-600'
                    />

                  </div>

                  <div>

                    <p className='text-sm text-gray-400'>
                      Caregiver Name
                    </p>

                    <h3 className='mt-1 text-xl font-bold'>
                      Alex Johnson
                    </h3>

                  </div>

                </div>

                {/* Date */}
                <div className='flex items-center gap-5 rounded-[28px] bg-[#f7f4ff] p-5'>

                  <div className='rounded-[22px] bg-white p-4 shadow-sm'>

                    <Calendar
                      size={26}
                      className='text-purple-600'
                    />

                  </div>

                  <div>

                    <p className='text-sm text-gray-400'>
                      Completion Date
                    </p>

                    <h3 className='mt-1 text-xl font-bold'>
                      08 May 2026
                    </h3>

                  </div>

                </div>

                {/* Score */}
                <div className='flex items-center gap-5 rounded-[28px] bg-[#f7f4ff] p-5'>

                  <div className='rounded-[22px] bg-white p-4 shadow-sm'>

                    <Award
                      size={26}
                      className='text-purple-600'
                    />

                  </div>

                  <div>

                    <p className='text-sm text-gray-400'>
                      Capability Score
                    </p>

                    <h3 className='mt-1 text-xl font-bold'>
                      4.2 / 5
                    </h3>

                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className='mt-8 rounded-[36px] bg-white p-7 shadow-sm'>

              <div className='flex justify-center'>

                <div className='flex h-28 w-28 items-center justify-center rounded-full bg-red-100'>

                  <CircleAlert
                    size={56}
                    className='text-red-500'
                  />

                </div>

              </div>

              <div className='mt-6 text-center'>

                <h2 className='text-4xl font-black text-[#0f172a]'>
                  Not Found
                </h2>

                <p className='mt-3 text-base leading-8 text-gray-500'>
                  No valid caregiver certificate exists for this ID.
                </p>

              </div>

            </div>
          )}

        </div>

        <BottomNav />

      </PageTransition>

    </AppLayout>
  )
}