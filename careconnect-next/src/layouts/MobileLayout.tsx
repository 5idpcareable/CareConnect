import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function MobileLayout({
  children,
}: Props) {
  return (
    <div className='min-h-screen bg-[#ece8f5] flex justify-center px-4 py-6'>

      <div className='relative w-full max-w-[440px] overflow-hidden rounded-[42px] bg-[#f6f4fb] shadow-[0_20px_80px_rgba(0,0,0,0.12)]'>

        {/* Dynamic Island */}
        <div className='absolute left-1/2 top-3 z-50 h-2 w-32 -translate-x-1/2 rounded-full bg-black'></div>

        {children}

      </div>

    </div>
  )
}