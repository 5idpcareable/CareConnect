'use client'

import { useState } from 'react'

import {
  ArrowRight,
  Brain,
  HeartHandshake,
} from 'lucide-react'

import {
  assessmentDomains,
} from '../data/questions'

import AppLayout from '../components/AppLayout'
import BottomNav from '../components/BottomNav'
import PageTransition from '../components/PageTransition'

export default function AssessmentEnginePage() {
  const [domainIndex, setDomainIndex] = useState(0)

  const [questionIndex, setQuestionIndex] = useState(0)

  const [selected, setSelected] = useState('')

  const currentDomain =
    assessmentDomains[domainIndex]

  const currentQuestion =
    currentDomain.questions[questionIndex]

  const totalQuestions =
    assessmentDomains.reduce(
      (acc, domain) => acc + domain.questions.length,
      0
    )

  const currentStep =
    assessmentDomains
      .slice(0, domainIndex)
      .reduce((acc, domain) => acc + domain.questions.length, 0)
      + questionIndex
      + 1

  const progress =
    Math.round((currentStep / totalQuestions) * 100)

  const options = [
    'Strongly Agree',
    'Agree',
    'Neutral',
    'Disagree',
    'Strongly Disagree',
  ]

  const handleNext = () => {
    if (questionIndex < currentDomain.questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else if (domainIndex < assessmentDomains.length - 1) {
      setDomainIndex(domainIndex + 1)
      setQuestionIndex(0)
    } else {
      alert('Assessment Completed')
    }

    setSelected('')
  }

  return (
    <AppLayout>

      <PageTransition>

        <div className='pb-28'>

          {/* Header */}
          <div>

            <p className='text-sm font-medium text-gray-400'>
              CareAble Assessment
            </p>

            <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
              Question {currentStep}
            </h1>

          </div>

          {/* Progress */}
          <div className='mt-8 rounded-[40px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-6 text-white shadow-[0_20px_60px_rgba(139,92,246,0.35)]'>

            <div className='flex items-center justify-between'>

              <div>

                <p className='text-sm text-white/70'>
                  Assessment Progress
                </p>

                <h2 className='mt-2 text-6xl font-black'>
                  {progress}%
                </h2>

                <p className='mt-3 text-sm text-white/70'>
                  {currentStep} / {totalQuestions} Questions
                </p>

              </div>

              <div className='flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl'>

                <Brain size={40} />

              </div>

            </div>

            <div className='mt-6 h-4 overflow-hidden rounded-full bg-white/20'>

              <div
                style={{
                  width: `${progress}%`,
                }}
                className='h-full rounded-full bg-white transition-all duration-500'
              ></div>

            </div>

          </div>

          {/* Question Card */}
          <div className='mt-8 rounded-[40px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>

            {/* Domain */}
            <div className='flex items-start gap-4'>

              <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#f3ebff]'>

                <HeartHandshake
                  size={30}
                  className='text-purple-600'
                />

              </div>

              <div>

                <p className='text-sm font-black uppercase tracking-[5px] text-purple-600'>
                  {currentDomain.title}
                </p>

              </div>

            </div>

            {/* Question */}
            <h2 className='mt-8 text-[48px] font-black leading-[1.05] tracking-tight text-[#0f172a]'>

              {currentQuestion}

            </h2>

            <p className='mt-6 text-lg leading-9 text-gray-500'>
              Select the response that best reflects your caregiving capability.
            </p>

            {/* Options */}
            <div className='mt-10 space-y-5'>

              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(option)}
                  className={`w-full rounded-[30px] border p-6 text-left text-xl font-bold transition-all duration-300 ${
                    selected === option
                      ? 'border-purple-500 bg-[#f3ebff] text-purple-700 shadow-[0_10px_30px_rgba(139,92,246,0.2)]'
                      : 'border-white/50 bg-white/60 backdrop-blur-md hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >

                  {option}

                </button>
              ))}

            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!selected}
              className='mt-10 flex w-full items-center justify-center gap-4 rounded-[32px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-6 text-2xl font-black text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
            >

              Next Question

              <ArrowRight size={28} />

            </button>

          </div>

        </div>

        <BottomNav />

      </PageTransition>

    </AppLayout>
  )
}