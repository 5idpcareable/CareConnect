import {
    Brain,
    HeartHandshake,
    ShieldCheck,
    TrendingUp,
    Award,
  } from 'lucide-react'
  
  export default function ResultsPage() {
    return (
      <div className='min-h-screen bg-[#ece8f5] flex justify-center py-6'>
  
        <div className='relative w-full max-w-[430px] overflow-hidden rounded-[42px] bg-[#f7f5fb] shadow-2xl'>
  
          {/* Dynamic Island */}
          <div className='absolute left-1/2 top-3 z-50 h-2 w-32 -translate-x-1/2 rounded-full bg-black'></div>
  
          <div className='px-5 pb-10 pt-10'>
  
            {/* Header */}
            <div>
  
              <p className='text-sm text-gray-400'>
                Assessment Results
              </p>
  
              <h1 className='mt-1 text-4xl font-black'>
                Your Insights
              </h1>
  
            </div>
  
            {/* Main Score */}
            <div className='mt-7 rounded-[36px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] p-6 text-white shadow-xl'>
  
              <div className='flex items-center justify-between'>
  
                <div>
  
                  <p className='text-sm text-white/70'>
                    Capability Score
                  </p>
  
                  <h2 className='mt-2 text-7xl font-black'>
                    4.2
                  </h2>
  
                </div>
  
                <div className='flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/10'>
                  <Award size={40} />
                </div>
  
              </div>
  
              <p className='mt-5 text-base leading-8 text-white/80'>
                Excellent caregiving capability demonstrated across communication,
                emotional resilience, and care coordination.
              </p>
  
            </div>
  
            {/* Category Scores */}
            <div className='mt-8'>
  
              <div className='flex items-center justify-between'>
  
                <h2 className='text-3xl font-black'>
                  Category Scores
                </h2>
  
                <button className='text-sm font-semibold text-purple-600'>
                  Details
                </button>
  
              </div>
  
              <div className='mt-5 space-y-4'>
  
                {[
                  {
                    icon: Brain,
                    title: 'Communication',
                    score: '92%',
                    color: 'text-violet-600',
                    bg: 'bg-violet-100',
                  },
                  {
                    icon: HeartHandshake,
                    title: 'Empathy & Support',
                    score: '88%',
                    color: 'text-pink-600',
                    bg: 'bg-pink-100',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Resilience',
                    score: '81%',
                    color: 'text-green-600',
                    bg: 'bg-green-100',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='rounded-[30px] bg-white p-5 shadow-sm'
                  >
  
                    <div className='flex items-center gap-4'>
  
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-[24px] ${item.bg}`}
                      >
  
                        <item.icon
                          size={30}
                          className={item.color}
                        />
  
                      </div>
  
                      <div className='flex-1'>
  
                        <h3 className='text-xl font-bold'>
                          {item.title}
                        </h3>
  
                        <div className='mt-3 h-3 overflow-hidden rounded-full bg-gray-200'>
  
                          <div
                            className='h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]'
                            style={{
                              width: item.score,
                            }}
                          ></div>
  
                        </div>
  
                      </div>
  
                      <div className='text-xl font-black text-purple-600'>
                        {item.score}
                      </div>
  
                    </div>
  
                  </div>
                ))}
  
              </div>
  
            </div>
  
            {/* Growth */}
            <div className='mt-8 rounded-[32px] bg-white p-6 shadow-sm'>
  
              <div className='flex items-center gap-4'>
  
                <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#f3ebff]'>
                  <TrendingUp
                    className='text-purple-600'
                    size={30}
                  />
                </div>
  
                <div>
  
                  <h2 className='text-2xl font-black'>
                    Growth Potential
                  </h2>
  
                  <p className='mt-1 text-sm text-gray-500'>
                    Recommended next learning pathway
                  </p>
  
                </div>
  
              </div>
  
              <div className='mt-6 rounded-[24px] bg-[#f7f4ff] p-5'>
  
                <h3 className='text-lg font-bold'>
                  Advanced Care Communication
                </h3>
  
                <p className='mt-2 text-sm leading-7 text-gray-500'>
                  Improve healthcare communication confidence and emotional
                  support techniques through guided modules.
                </p>
  
              </div>
  
            </div>
  
            {/* Button */}
            <button className='mt-8 w-full rounded-[28px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] py-5 text-lg font-bold text-white shadow-xl transition active:scale-95'>
              Download Certificate
            </button>
  
          </div>
  
        </div>
  
      </div>
    )
  }