import {
    Award,
    TrendingUp,
    ShieldCheck,
    Brain,
    ChevronRight,
  } from 'lucide-react'
  
  import AppLayout from '../components/AppLayout'
  import BottomNav from '../components/BottomNav'
  import PageTransition from '../components/PageTransition'
  
  export default function ResultsPage() {
    const domains = [
      {
        title: 'Communication & Relational Care',
        score: 4.6,
        color: 'from-purple-500 to-violet-600',
      },
  
      {
        title: 'Emotional Resilience',
        score: 4.1,
        color: 'from-pink-500 to-rose-500',
      },
  
      {
        title: 'Safety & Practical Care',
        score: 3.8,
        color: 'from-blue-500 to-cyan-500',
      },
    ]
  
    return (
      <AppLayout>
  
        <PageTransition>
  
          <div className='pb-28'>
  
            {/* Header */}
            <div>
  
              <p className='text-sm font-medium text-gray-400'>
                Assessment Completed
              </p>
  
              <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
                Results
              </h1>
  
            </div>
  
            {/* Main Score */}
            <div className='mt-8 overflow-hidden rounded-[40px] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-7 text-white shadow-[0_20px_60px_rgba(139,92,246,0.35)]'>
  
              <div className='flex items-center justify-between'>
  
                <div>
  
                  <p className='text-sm text-white/70'>
                    Overall Capability
                  </p>
  
                  <h2 className='mt-3 text-8xl font-black leading-none'>
                    4.2
                  </h2>
  
                  <p className='mt-4 text-lg text-white/80'>
                    Strong Caregiving Capability
                  </p>
  
                </div>
  
                <div className='flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl'>
  
                  <Award size={42} />
  
                </div>
  
              </div>
  
              {/* Progress */}
              <div className='mt-8 h-4 overflow-hidden rounded-full bg-white/20'>
  
                <div className='h-full w-[84%] rounded-full bg-white'></div>
  
              </div>
  
              <p className='mt-5 text-base leading-8 text-white/80'>
                You demonstrated strong communication, emotional awareness, and practical caregiving ability.
              </p>
  
            </div>
  
            {/* Strength Card */}
            <div className='mt-8 rounded-[40px] border border-white/40 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'>
  
              <div className='flex items-center gap-5'>
  
                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f3ebff]'>
  
                  <TrendingUp
                    size={36}
                    className='text-purple-600'
                  />
  
                </div>
  
                <div>
  
                  <p className='text-sm font-medium text-gray-400'>
                    Strongest Area
                  </p>
  
                  <h2 className='mt-2 text-3xl font-black text-[#0f172a]'>
                    Communication
                  </h2>
  
                </div>
  
              </div>
  
              <p className='mt-6 text-lg leading-9 text-gray-500'>
                You show excellent relational communication and empathy during caregiving interactions.
              </p>
  
            </div>
  
            {/* Domain Scores */}
            <div className='mt-8'>
  
              <div className='flex items-center justify-between'>
  
                <h2 className='text-3xl font-black text-[#0f172a]'>
                  Domain Scores
                </h2>
  
                <div className='flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#f3ebff]'>
  
                  <Brain
                    size={28}
                    className='text-purple-600'
                  />
  
                </div>
  
              </div>
  
              <div className='mt-6 space-y-5'>
  
                {domains.map((domain, index) => (
                  <div
                    key={index}
                    className='rounded-[36px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'
                  >
  
                    <div className='flex items-center justify-between'>
  
                      <div>
  
                        <h3 className='text-xl font-black text-[#0f172a]'>
                          {domain.title}
                        </h3>
  
                        <p className='mt-2 text-gray-500'>
                          Capability assessment domain
                        </p>
  
                      </div>
  
                      <div className={`rounded-[24px] bg-gradient-to-r ${domain.color} px-5 py-4 text-2xl font-black text-white shadow-lg`}>
  
                        {domain.score}
  
                      </div>
  
                    </div>
  
                    <div className='mt-6 h-4 overflow-hidden rounded-full bg-gray-200'>
  
                      <div
                        style={{
                          width: `${domain.score * 20}%`,
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${domain.color}`}
                      ></div>
  
                    </div>
  
                  </div>
                ))}
  
              </div>
  
            </div>
  
            {/* Certificate CTA */}
            <button className='mt-8 flex w-full items-center justify-between rounded-[36px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-7 text-white shadow-[0_20px_60px_rgba(139,92,246,0.35)] transition-all duration-300 hover:scale-[1.02]'>
  
              <div className='flex items-center gap-5'>
  
                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/15'>
  
                  <ShieldCheck size={36} />
  
                </div>
  
                <div className='text-left'>
  
                  <h2 className='text-2xl font-black'>
                    View Certificate
                  </h2>
  
                  <p className='mt-2 text-white/80'>
                    Access your verified caregiver credential
                  </p>
  
                </div>
  
              </div>
  
              <ChevronRight size={30} />
  
            </button>
  
          </div>
  
          <BottomNav />
  
        </PageTransition>
  
      </AppLayout>
    )
  }