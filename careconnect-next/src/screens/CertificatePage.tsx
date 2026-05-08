import {
    ShieldCheck,
    Download,
    Share2,
    Award,
    BadgeCheck,
  } from 'lucide-react'
  
  import AppLayout from '../components/AppLayout'
  import BottomNav from '../components/BottomNav'
  import PageTransition from '../components/PageTransition'
  
  export default function CertificatePage() {
    return (
      <AppLayout>
  
        <PageTransition>
  
          <div className='pb-28'>
  
            {/* Header */}
            <div>
  
              <p className='text-sm font-medium text-gray-400'>
                Verified Credential
              </p>
  
              <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
                Certificate
              </h1>
  
            </div>
  
            {/* Certificate Card */}
            <div className='mt-8 overflow-hidden rounded-[40px] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-[1px] shadow-[0_20px_60px_rgba(139,92,246,0.35)]'>
  
              <div className='rounded-[40px] bg-white px-7 py-10'>
  
                {/* Badge */}
                <div className='flex justify-center'>
  
                  <div className='flex h-28 w-28 items-center justify-center rounded-full bg-[#f3ebff]'>
  
                    <Award
                      size={50}
                      className='text-purple-600'
                    />
  
                  </div>
  
                </div>
  
                {/* Title */}
                <div className='mt-8 text-center'>
  
                  <p className='text-sm font-bold uppercase tracking-[5px] text-purple-600'>
                    CareAble Platform
                  </p>
  
                  <h2 className='mt-4 text-4xl font-black leading-tight text-[#0f172a]'>
                    Capability
                    <br />
                    Certificate
                  </h2>
  
                  <p className='mt-5 text-base leading-8 text-gray-500'>
                    This certifies that the following participant successfully completed the caregiving capability assessment.
                  </p>
  
                </div>
  
                {/* User */}
                <div className='mt-10 text-center'>
  
                  <h3 className='text-5xl font-black text-[#7c3aed]'>
                    Alex Johnson
                  </h3>
  
                  <div className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#f3ebff] px-5 py-3 text-sm font-bold text-purple-700'>
  
                    <BadgeCheck size={18} />
  
                    Verified Caregiver
  
                  </div>
  
                </div>
  
                {/* Score */}
                <div className='mt-10 rounded-[32px] bg-[#f8f5ff] p-6'>
  
                  <div className='flex items-center justify-between'>
  
                    <div>
  
                      <p className='text-sm text-gray-400'>
                        Capability Score
                      </p>
  
                      <h3 className='mt-2 text-6xl font-black text-[#0f172a]'>
                        4.2
                      </h3>
  
                    </div>
  
                    <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm'>
  
                      <ShieldCheck
                        size={36}
                        className='text-purple-600'
                      />
  
                    </div>
  
                  </div>
  
                </div>
  
                {/* Certificate Details */}
                <div className='mt-8 space-y-5'>
  
                  <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
  
                    <p className='text-gray-400'>
                      Certificate ID
                    </p>
  
                    <h4 className='font-bold text-[#0f172a]'>
                      CRB-2026-AX41
                    </h4>
  
                  </div>
  
                  <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
  
                    <p className='text-gray-400'>
                      Completion Date
                    </p>
  
                    <h4 className='font-bold text-[#0f172a]'>
                      08 May 2026
                    </h4>
  
                  </div>
  
                  <div className='flex items-center justify-between'>
  
                    <p className='text-gray-400'>
                      Status
                    </p>
  
                    <div className='rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700'>
                      Verified
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
            {/* Actions */}
            <div className='mt-8 grid grid-cols-2 gap-4'>
  
              <button className='flex items-center justify-center gap-3 rounded-[30px] bg-white py-5 text-lg font-bold shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <Download size={24} />
  
                Download
  
              </button>
  
              <button className='flex items-center justify-center gap-3 rounded-[30px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-5 text-lg font-bold text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-[1.02]'>
  
                <Share2 size={24} />
  
                Share
  
              </button>
  
            </div>
  
          </div>
  
          <BottomNav />
  
        </PageTransition>
  
      </AppLayout>
    )
  }