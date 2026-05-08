'use client'

import { useState } from 'react'

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

import AppLayout from '../components/AppLayout'
import AppHeader from '../components/AppHeader'
import PageTransition from '../components/PageTransition'

export default function OnboardingPage() {
  const [roles, setRoles] = useState<string[]>([])

  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role))
    } else {
      setRoles([...roles, role])
    }
  }

  const roleOptions = [
    'Carer',
    'Admin',
    'Employer',
  ]

  return (
    <AppLayout>

      <PageTransition>

        <div className='pb-20'>

          <AppHeader
            subtitle='CareAble Registration'
            title='Onboarding'
          />

          {/* Progress */}
          <div className='mt-6 rounded-[30px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-5 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)]'>

            <div className='flex items-center justify-between'>

              <div>

                <p className='text-sm text-white/70'>
                  Registration Progress
                </p>

                <h2 className='mt-2 text-5xl font-black'>
                  20%
                </h2>

              </div>

              <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/10'>

                <ShieldCheck size={30} />

              </div>

            </div>

            <div className='mt-5 h-3 overflow-hidden rounded-full bg-white/20'>

              <div className='h-full w-[20%] rounded-full bg-white'></div>

            </div>

          </div>

          {/* Form */}
          <div className='mt-8 rounded-[36px] bg-white p-6 shadow-sm'>

            {/* Roles */}
            <div>

              <label className='text-sm font-bold uppercase tracking-[3px] text-purple-600'>
                Select Role
              </label>

              <div className='mt-5 grid grid-cols-3 gap-3'>

                {roleOptions.map((role, index) => (
                  <button
                    key={index}
                    onClick={() => toggleRole(role)}
                    className={`rounded-[24px] border p-4 text-sm font-bold transition-all duration-300 ${
                      roles.includes(role)
                        ? 'border-purple-500 bg-[#f3ebff] text-purple-700 shadow-lg'
                        : 'border-gray-200 bg-white hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >

                    {role}

                  </button>
                ))}

              </div>

            </div>

            {/* First Name */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                First Name
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <User
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='text'
                  placeholder='Enter first name'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Last Name */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Last Name
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <User
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='text'
                  placeholder='Enter last name'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* DOB */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Date of Birth
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <Calendar
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='date'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Phone */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Phone Number
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <Phone
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='tel'
                  placeholder='Enter phone number'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Postcode */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Postcode
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <MapPin
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='text'
                  placeholder='Enter postcode'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Email */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Email Address
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <Mail
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='email'
                  placeholder='Enter email'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Password */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Password
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <Lock
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='password'
                  placeholder='Create password'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Repeat Password */}
            <div className='mt-7'>

              <label className='text-sm font-semibold text-gray-700'>
                Repeat Password
              </label>

              <div className='mt-3 flex items-center gap-4 rounded-[24px] bg-[#f6f1ff] px-5 py-5'>

                <Lock
                  size={22}
                  className='text-purple-500'
                />

                <input
                  type='password'
                  placeholder='Repeat password'
                  className='w-full bg-transparent outline-none'
                />

              </div>

            </div>

            {/* Checkboxes */}
            <div className='mt-8 space-y-4'>

              <label className='flex items-start gap-3 text-sm text-gray-600'>

                <input type='checkbox' className='mt-1' />

                I accept the Terms of Service and Privacy Policy

              </label>

              <label className='flex items-start gap-3 text-sm text-gray-600'>

                <input type='checkbox' className='mt-1' />

                I consent to anonymised research data usage

              </label>

            </div>

            {/* Submit */}
            <button className='mt-8 flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-5 text-lg font-bold text-white shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02]'>

              Continue

              <ArrowRight size={22} />

            </button>

          </div>

        </div>

      </PageTransition>

    </AppLayout>
  )
}