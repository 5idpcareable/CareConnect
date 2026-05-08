import {
    Award,
    ShieldCheck,
    Download,
    Share2,
  } from 'lucide-react'
  
  export default function CertificatePage() {
    return (
      <div className='min-h-screen bg-[#ece8f5] flex justify-center py-6'>
  
        <div className='relative w-full max-w-[430px] overflow-hidden rounded-[42px] bg-[#f7f5fb] shadow-2xl'>
  
          {/* Dynamic Island */}
          <div className='absolute left-1/2 top-3 z-50 h-2 w-32 -translate-x-1/2 rounded-full bg-black'></div>
  
          <div className='px-5 pb-10 pt-10'>
  
            {/* Header */}
            <div className='text-center'>
  
              <p className='text-sm text-gray-400'>
                Digital Certificate
              </p>
  
              <h1 className='mt-2 text-4xl font-black'>
                CareAble Certificate
              </h1>
  
            </div>
  
            {/* Certificate Card */}
            <div className='mt-8 overflow-hidden rounded-[36px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)]'>
  
              {/* Top */}
              <div className='bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-6 py-8 text-white'>
  
                <div className='flex items-center justify-between'>
  
                  <div>
  
                    <p className='text-sm text-white/70'>
                      Certificate ID
                    </p>
  
                    <h2 className='mt-2 text-2xl font-black'>
                      CA-2026-00123
                    </h2>
  
                  </div>
  
                  <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/10'>
                    <Award size={42} />
                  </div>
  
                </div>
  
              </div>
  
              {/* Content */}
              <div className='p-6'>
  
                <div className='text-center'>
  
                  <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f3ebff]'>
  
                    <ShieldCheck
                      size={50}
                      className='text-purple-600'
                    />
  
                  </div>
  
                  <p className='mt-6 text-sm uppercase tracking-[4px] text-gray-400'>
                    Certificate of Achievement
                  </p>
  
                  <h2 className='mt-4 text-4xl font-black'>
                    Alex Johnson
                  </h2>
  
                  <p className='mt-5 text-base leading-8 text-gray-500'>
                    Successfully completed the CareAble caregiving
                    capability assessment and demonstrated strong
                    caregiving competencies.
                  </p>
  
                </div>
  
                {/* Score */}
                <div className='mt-8 rounded-[30px] bg-[#f7f4ff] p-6'>
  
                  <div className='flex items-center justify-between'>
  
                    <div>
  
                      <p className='text-sm text-gray-400'>
                        Overall Capability Score
                      </p>
  
                      <h3 className='mt-2 text-5xl font-black text-purple-600'>
                        4.2
                      </h3>
  
                    </div>
  
                    <div className='rounded-[24px] bg-white px-5 py-4 shadow-sm'>
  
                      <p className='text-sm text-gray-400'>
                        Completion
                      </p>
  
                      <h3 className='mt-1 text-xl font-black'>
                        100%
                      </h3>
  
                    </div>
  
                  </div>
  
                </div>
  
                {/* Skills */}
                <div className='mt-8'>
  
                  <h3 className='text-2xl font-black'>
                    Top Capability Areas
                  </h3>
  
                  <div className='mt-5 flex flex-wrap gap-3'>
  
                    {[
                      'Communication',
                      'Empathy',
                      'Resilience',
                      'Leadership',
                      'Digital Literacy',
                    ].map((item, index) => (
                      <div
                        key={index}
                        className='rounded-2xl bg-[#f3ebff] px-5 py-3 text-sm font-semibold text-purple-700'
                      >
                        {item}
                      </div>
                    ))}
  
                  </div>
  
                </div>
  
                {/* Footer */}
                <div className='mt-10 border-t border-gray-100 pt-6'>
  
                  <div className='flex items-center justify-between text-sm text-gray-400'>
  
                    <div>
  
                      <p>Date Issued</p>
  
                      <h4 className='mt-1 font-bold text-gray-700'>
                        March 2026
                      </h4>
  
                    </div>
  
                    <div className='text-right'>
  
                      <p>Verified By</p>
  
                      <h4 className='mt-1 font-bold text-gray-700'>
                        CareAble
                      </h4>
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
            {/* Buttons */}
            <div className='mt-8 flex gap-4'>
  
              <button className='flex flex-1 items-center justify-center gap-3 rounded-[28px] bg-white py-5 text-lg font-bold shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
  
                <Share2 size={22} />
  
                Share
  
              </button>
  
              <button className='flex flex-1 items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-5 text-lg font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] active:scale-[0.98]'>
  
                <Download size={22} />
  
                Download
  
              </button>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    )
  }