'use client'

import { useState } from 'react'

import {
  Brain,
  ArrowRight,
} from 'lucide-react'

import AppLayout from '../components/AppLayout'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

export default function AssessmentPage() {
  const [selected, setSelected] = useState('')

  const options = [
    'Strongly Agree',
    'Agree',
    'Neutral',
    'Disagree',
  ]

  return (
    <AppLayout>

      <PageTransition>

        <div className='pb-28'>

          <AppHeader
            subtitle='Capability Assessment'
            title='Question 4'
          />

          {/* Progress */}
          <div className='mt-6 rounded-[32px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-5 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)]'>

            <div className='flex items-center justify-between'>

              <div>

                <p className='text-sm text-white/70'>
                  Progress
                </p>

                <h2 className='mt-2 text-5xl font-black'>
                  40%
                </h2>

              </div>

              <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/10'>

                <Brain size={32} />

              </div>

            </div>

            <div className='mt-5 h-3 overflow-hidden rounded-full bg-white/20'>

              <div className='h-full w-[40%] rounded-full bg-white'></div>

            </div>

          </div>

          {/* Question Card */}
          <div className='mt-8 rounded-[36px] bg-white p-6 shadow-sm'>

            <p className='text-sm font-bold uppercase tracking-[3px] text-purple-600'>
              Communication Skills
            </p>

            <h2 className='mt-5 text-3xl font-black leading-tight'>
              I feel confident communicating with individuals requiring care support.
            </h2>

            <p className='mt-5 text-base leading-8 text-gray-500'>
              Select the option that best reflects your caregiving confidence level.
            </p>

            {/* Options */}
            <div className='mt-8 space-y-4'>

              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(option)}
                  className={`w-full rounded-[24px] border p-5 text-left text-lg font-semibold transition-all duration-300 ${
                    selected === option
                      ? 'border-purple-500 bg-[#f3ebff] text-purple-700 shadow-lg'
                      : 'border-gray-200 bg-white hover:-translate-y-1 hover:shadow-lg'
                  }`}
                >

                  {option}

                </button>
              ))}

            </div>

            {/* Next */}
            <button className='mt-8 flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-5 text-lg font-bold text-white shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(124,58,237,0.5)] active:scale-[0.98]'>

              Next Question

              <ArrowRight size={22} />

            </button>

          </div>

        </div>

        <BottomNav />

      </PageTransition>

    </AppLayout>
  )
}