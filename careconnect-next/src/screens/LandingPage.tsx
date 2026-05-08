import {
  ArrowRight,
  ShieldCheck,
  Brain,
  Award,
  HeartHandshake,
} from 'lucide-react'

import Link from 'next/link'

import AppLayout from '../components/AppLayout'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

export default function LandingPage() {
  return (
    <AppLayout>

      <PageTransition>

        <div className='pb-28'>

          {/* Hero */}
          <div className='text-center'>

            {/* Logo */}
            <div className='flex justify-center'>

              <img
                src='/images/logo.png'
                alt='CareAble'
                className='w-[220px] object-contain drop-shadow-[0_20px_40px_rgba(124,58,237,0.25)]'
              />

            </div>

            <p className='mt-6 text-sm font-black uppercase tracking-[6px] text-purple-600'>
              CAREGIVING CAPABILITY PLATFORM
            </p>

            <h1 className='mt-6 text-[64px] font-black leading-[0.95] tracking-[-4px] text-[#0f172a]'>
              Caregiver
              <br />
              Intelligence
            </h1>

            <p className='mx-auto mt-8 max-w-[340px] text-lg leading-9 text-gray-500'>
              Assess, validate, and improve caregiving capability through modern healthcare intelligence and verified digital credentials.
            </p>

          </div>

          {/* CTA */}
          <div className='mt-10 space-y-4'>

            <Link
              href='/onboarding'
              className='flex w-full items-center justify-center gap-4 rounded-[34px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-6 text-2xl font-black text-white shadow-[0_20px_60px_rgba(139,92,246,0.35)] transition-all duration-300 hover:scale-[1.02]'
            >

              Get Started

              <ArrowRight size={30} />

            </Link>

            <Link
              href='/login'
              className='flex w-full items-center justify-center rounded-[34px] border border-white/40 bg-white/70 py-6 text-2xl font-black text-[#0f172a] shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
            >

              Login

            </Link>

          </div>

          {/* Features */}
          <div className='mt-10 space-y-5'>

            {/* Feature */}
            <div className='rounded-[38px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>

              <div className='flex items-center gap-5'>

                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f3ebff]'>

                  <Brain
                    size={36}
                    className='text-purple-600'
                  />

                </div>

                <div>

                  <h2 className='text-2xl font-black text-[#0f172a]'>
                    Smart Assessments
                  </h2>

                  <p className='mt-2 text-base leading-8 text-gray-500'>
                    Dynamic caregiving capability evaluations powered by structured healthcare domains.
                  </p>

                </div>

              </div>

            </div>

            {/* Feature */}
            <div className='rounded-[38px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>

              <div className='flex items-center gap-5'>

                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#ecfeff]'>

                  <ShieldCheck
                    size={36}
                    className='text-cyan-600'
                  />

                </div>

                <div>

                  <h2 className='text-2xl font-black text-[#0f172a]'>
                    Verified Credentials
                  </h2>

                  <p className='mt-2 text-base leading-8 text-gray-500'>
                    Generate secure digital caregiver certificates for employers and organisations.
                  </p>

                </div>

              </div>

            </div>

            {/* Feature */}
            <div className='rounded-[38px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>

              <div className='flex items-center gap-5'>

                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fff7ed]'>

                  <Award
                    size={36}
                    className='text-orange-500'
                  />

                </div>

                <div>

                  <h2 className='text-2xl font-black text-[#0f172a]'>
                    Capability Insights
                  </h2>

                  <p className='mt-2 text-base leading-8 text-gray-500'>
                    Understand strengths, growth areas, and caregiving readiness through analytics.
                  </p>

                </div>

              </div>

            </div>

            {/* Feature */}
            <div className='rounded-[38px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>

              <div className='flex items-center gap-5'>

                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fdf2f8]'>

                  <HeartHandshake
                    size={36}
                    className='text-pink-500'
                  />

                </div>

                <div>

                  <h2 className='text-2xl font-black text-[#0f172a]'>
                    Human-Centred Care
                  </h2>

                  <p className='mt-2 text-base leading-8 text-gray-500'>
                    Designed to support empathy, resilience, and ethical caregiving practice.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        <BottomNav />

      </PageTransition>

    </AppLayout>
  )
}