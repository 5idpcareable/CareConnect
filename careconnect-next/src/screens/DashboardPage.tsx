import {
    Brain,
    Award,
    Clock3,
    BarChart3,
  } from 'lucide-react'
  
  import AppLayout from '../components/AppLayout'
  import AppHeader from '../components/AppHeader'
  import BottomNav from '../components/BottomNav'
  import PageTransition from '../components/PageTransition'
  
  export default function DashboardPage() {
    return (
      <AppLayout>
  
        <PageTransition>
  
          <div className='pb-28'>
  
            {/* Header */}
            <div className='flex items-start justify-between'>
  
              <AppHeader
                subtitle='Welcome Back'
                title='Alex Johnson'
              />
  
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e9ff] font-bold text-purple-600 shadow-sm'>
                AJ
              </div>
  
            </div>
  
            {/* Progress Card */}
            <div className='mt-2 rounded-[32px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-6 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-[1.01]'>
  
              <div className='flex items-start justify-between'>
  
                <div>
  
                  <p className='text-sm text-white/70'>
                    Assessment Progress
                  </p>
  
                  <h2 className='mt-2 text-6xl font-black'>
                    78%
                  </h2>
  
                </div>
  
                <div className='flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10'>
                  <BarChart3 size={32} />
                </div>
  
              </div>
  
              <div className='mt-6 h-3 overflow-hidden rounded-full bg-white/20'>
  
                <div className='h-full w-[78%] rounded-full bg-white'></div>
  
              </div>
  
              <p className='mt-4 text-sm text-white/80'>
                You’re close to completing your caregiving capability assessment.
              </p>
  
            </div>
  
            {/* Stats */}
            <div className='mt-6 grid grid-cols-2 gap-4'>
  
              <div className='rounded-[28px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <Brain
                  className='text-purple-600'
                  size={28}
                />
  
                <h3 className='mt-5 text-5xl font-black'>
                  42
                </h3>
  
                <p className='mt-2 text-sm text-gray-500'>
                  Questions Completed
                </p>
  
              </div>
  
              <div className='rounded-[28px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <Award
                  className='text-orange-500'
                  size={28}
                />
  
                <h3 className='mt-5 text-5xl font-black'>
                  4.1
                </h3>
  
                <p className='mt-2 text-sm text-gray-500'>
                  Current Capability Score
                </p>
  
              </div>
  
            </div>
  
            {/* Activity */}
            <div className='mt-8 flex items-center justify-between'>
  
              <h2 className='text-3xl font-black'>
                Recent Activity
              </h2>
  
              <button className='text-sm font-semibold text-purple-600'>
                View All
              </button>
  
            </div>
  
            <div className='mt-5 space-y-4'>
  
              <div className='flex items-center gap-4 rounded-[28px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3ebff]'>
  
                  <Brain
                    className='text-purple-600'
                    size={26}
                  />
  
                </div>
  
                <div className='flex-1'>
  
                  <h3 className='font-bold'>
                    Assessment Completed
                  </h3>
  
                  <p className='text-sm text-gray-500'>
                    Communication & Relational Care
                  </p>
  
                </div>
  
                <Clock3
                  className='text-gray-400'
                  size={18}
                />
  
              </div>
  
              <div className='flex items-center gap-4 rounded-[28px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8fff0]'>
  
                  <Award
                    className='text-green-600'
                    size={26}
                  />
  
                </div>
  
                <div className='flex-1'>
  
                  <h3 className='font-bold'>
                    Capability Updated
                  </h3>
  
                  <p className='text-sm text-gray-500'>
                    Your score increased by 12%
                  </p>
  
                </div>
  
                <Clock3
                  className='text-gray-400'
                  size={18}
                />
  
              </div>
  
            </div>
  
          </div>
  
          <BottomNav />
  
        </PageTransition>
  
      </AppLayout>
    )
  }