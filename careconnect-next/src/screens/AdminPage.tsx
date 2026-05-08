import {
    Users,
    ShieldCheck,
    FileBadge,
    Brain,
    ChevronRight,
    Search,
    BarChart3,
  } from 'lucide-react'
  
  import AppLayout from '../components/AppLayout'
  import BottomNav from '../components/BottomNav'
  import PageTransition from '../components/PageTransition'
  
  export default function AdminPage() {
    return (
      <AppLayout>
  
        <PageTransition>
  
          <div className='pb-28'>
  
            {/* Header */}
            <div className='flex items-start justify-between'>
  
              <div>
  
                <p className='text-sm font-medium text-gray-400'>
                  CareAble Administration
                </p>
  
                <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
                  Admin
                </h1>
  
              </div>
  
              <div className='flex h-16 w-16 items-center justify-center rounded-[26px] bg-[#f3ebff]'>
  
                <ShieldCheck
                  size={30}
                  className='text-purple-600'
                />
  
              </div>
  
            </div>
  
            {/* Stats */}
            <div className='mt-8 grid grid-cols-2 gap-4'>
  
              <div className='rounded-[32px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-5 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)]'>
  
                <Users size={28} />
  
                <h2 className='mt-5 text-5xl font-black'>
                  142
                </h2>
  
                <p className='mt-2 text-sm text-white/80'>
                  Total Users
                </p>
  
              </div>
  
              <div className='rounded-[32px] bg-white p-5 shadow-sm'>
  
                <FileBadge
                  size={28}
                  className='text-purple-600'
                />
  
                <h2 className='mt-5 text-5xl font-black'>
                  89
                </h2>
  
                <p className='mt-2 text-sm text-gray-500'>
                  Certificates Issued
                </p>
  
              </div>
  
            </div>
  
            {/* Analytics */}
            <div className='mt-8 rounded-[36px] bg-white p-6 shadow-sm'>
  
              <div className='flex items-center justify-between'>
  
                <div>
  
                  <p className='text-sm text-gray-400'>
                    Platform Analytics
                  </p>
  
                  <h2 className='mt-2 text-3xl font-black'>
                    Capability Overview
                  </h2>
  
                </div>
  
                <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#f3ebff]'>
  
                  <BarChart3
                    size={28}
                    className='text-purple-600'
                  />
  
                </div>
  
              </div>
  
              <div className='mt-6 h-4 overflow-hidden rounded-full bg-gray-200'>
  
                <div className='h-full w-[78%] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]'></div>
  
              </div>
  
              <p className='mt-5 text-base leading-8 text-gray-500'>
                Overall caregiver capability scores improved by 18% this month.
              </p>
  
            </div>
  
            {/* Search */}
            <div className='mt-8 flex items-center gap-4 rounded-[30px] bg-white px-5 py-5 shadow-sm'>
  
              <Search
                size={24}
                className='text-gray-400'
              />
  
              <input
                type='text'
                placeholder='Search users, certificates...'
                className='w-full bg-transparent text-lg outline-none placeholder:text-gray-400'
              />
  
            </div>
  
            {/* Admin Menu */}
            <div className='mt-8 space-y-5'>
  
              {/* Users */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-blue-100 p-4 text-blue-600'>
  
                    <Users size={28} />
  
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-xl font-bold'>
                      User Management
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Manage users and permissions
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight className='text-gray-400' />
  
              </button>
  
              {/* Assessments */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-purple-100 p-4 text-purple-600'>
  
                    <Brain size={28} />
  
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-xl font-bold'>
                      Assessment Engine
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Configure domains and questions
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight className='text-gray-400' />
  
              </button>
  
              {/* Certificates */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-green-100 p-4 text-green-600'>
  
                    <FileBadge size={28} />
  
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-xl font-bold'>
                      Certificate Validation
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Verify issued caregiver credentials
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight className='text-gray-400' />
  
              </button>
  
            </div>
  
          </div>
  
          <BottomNav />
  
        </PageTransition>
  
      </AppLayout>
    )
  }