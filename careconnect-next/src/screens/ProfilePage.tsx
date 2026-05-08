import {
    User,
    Bell,
    Shield,
    FileText,
    LogOut,
    ChevronRight,
  } from 'lucide-react'
  
  import AppLayout from '../components/AppLayout'
  import BottomNav from '../components/BottomNav'
  import PageTransition from '../components/PageTransition'
  
  export default function ProfilePage() {
    return (
      <AppLayout>
  
        <PageTransition>
  
          <div className='pb-28'>
  
            {/* Header */}
            <div>
  
              <p className='text-sm font-medium text-gray-400'>
                Account Settings
              </p>
  
              <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
                My Profile
              </h1>
  
            </div>
  
            {/* User Card */}
            <div className='mt-8 rounded-[36px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-6 text-white shadow-[0_20px_60px_rgba(139,92,246,0.3)]'>
  
              <div className='flex items-center gap-5'>
  
                <div className='flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/15 text-4xl font-black backdrop-blur-xl'>
                  AJ
                </div>
  
                <div>
  
                  <h2 className='text-3xl font-black'>
                    Alex Johnson
                  </h2>
  
                  <p className='mt-2 text-white/80'>
                    Hidden Carer
                  </p>
  
                  <div className='mt-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-xl'>
                    Capability Score: 4.1 / 5
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
            {/* Menu */}
            <div className='mt-8 space-y-5'>
  
              {/* Personal */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-purple-100 p-4 text-purple-600'>
                    <User size={26} />
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-lg font-bold'>
                      Personal Information
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Update your profile details
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight
                  size={24}
                  className='text-gray-400'
                />
  
              </button>
  
              {/* Notifications */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-blue-100 p-4 text-blue-600'>
                    <Bell size={26} />
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-lg font-bold'>
                      Notifications
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Manage reminders and alerts
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight
                  size={24}
                  className='text-gray-400'
                />
  
              </button>
  
              {/* Privacy */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-green-100 p-4 text-green-600'>
                    <Shield size={26} />
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-lg font-bold'>
                      Privacy & Security
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Password and account protection
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight
                  size={24}
                  className='text-gray-400'
                />
  
              </button>
  
              {/* Policies */}
              <button className='flex w-full items-center justify-between rounded-[32px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <div className='flex items-center gap-5'>
  
                  <div className='rounded-[24px] bg-orange-100 p-4 text-orange-500'>
                    <FileText size={26} />
                  </div>
  
                  <div className='text-left'>
  
                    <h3 className='text-lg font-bold'>
                      Terms & Policies
                    </h3>
  
                    <p className='mt-1 text-sm text-gray-500'>
                      Read platform guidelines
                    </p>
  
                  </div>
  
                </div>
  
                <ChevronRight
                  size={24}
                  className='text-gray-400'
                />
  
              </button>
  
            </div>
  
            {/* Logout */}
            <button className='mt-8 flex w-full items-center justify-center gap-3 rounded-[30px] bg-red-500 py-5 text-xl font-bold text-white shadow-[0_15px_35px_rgba(239,68,68,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'>
  
              <LogOut size={26} />
  
              Logout
  
            </button>
  
          </div>
  
          <BottomNav />
  
        </PageTransition>
  
      </AppLayout>
    )
  }