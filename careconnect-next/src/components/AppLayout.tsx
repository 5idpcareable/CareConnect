'use client'

import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function AppLayout({
  children,
}: Props) {
  return (
    <div className='min-h-screen bg-[#ece8f5] flex items-center justify-center p-4'>

      <div className='relative w-full max-w-[430px] overflow-hidden rounded-[42px] bg-[#f7f5fb] shadow-[0_20px_80px_rgba(0,0,0,0.12)]'>

        {/* Background Glow */}
        <div className='absolute -top-20 -right-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl'></div>

        <div className='absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl'></div>

        {/* Dynamic Island */}
        <div className='absolute left-1/2 top-4 z-50 h-2 w-32 -translate-x-1/2 rounded-full bg-black'></div>

        {/* Main Content */}
        <div className='relative z-10 min-h-screen px-6 pb-10 pt-24'>

          {children}

        </div>

      </div>

    </div>
  )
}