'use client'

import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <div className='min-h-screen bg-[#ece8f5] flex items-center justify-center p-4'>

      <div className='relative flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center overflow-hidden rounded-[42px] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] shadow-[0_20px_80px_rgba(0,0,0,0.15)]'>

        {/* Glow */}
        <div className='absolute h-72 w-72 rounded-full bg-white/10 blur-3xl'></div>

        {/* Logo Animation */}
        <motion.div
          initial={{
            scale: 0.7,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          className='relative z-10'
        >

          <div className='flex h-36 w-36 items-center justify-center rounded-[40px] bg-white shadow-2xl'>

            <img
              src='/images/logo.png'
              alt='CareAble'
              className='h-24 w-24 object-contain'
            />

          </div>

        </motion.div>

        {/* Text */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className='relative z-10 mt-10 text-center text-white'
        >

          <h1 className='text-5xl font-black tracking-tight'>
            CareAble
          </h1>

          <p className='mt-4 text-base leading-8 text-white/80'>
            Caregiving Capability Platform
          </p>

        </motion.div>

        {/* Loading */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
          }}
          className='absolute bottom-16'
        >

          <div className='flex gap-2'>

            <div className='h-3 w-3 animate-bounce rounded-full bg-white'></div>

            <div className='h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:0.15s]'></div>

            <div className='h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:0.3s]'></div>

          </div>

        </motion.div>

      </div>

    </div>
  )
}