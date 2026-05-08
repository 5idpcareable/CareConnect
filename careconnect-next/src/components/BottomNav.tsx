'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Home,
  ClipboardList,
  BarChart3,
  Award,
  User,
} from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Home',
    },
    {
      href: '/assessment',
      icon: ClipboardList,
      label: 'Assess',
    },
    {
      href: '/results',
      icon: BarChart3,
      label: 'Results',
    },
    {
      href: '/certificate',
      icon: Award,
      label: 'Certificate',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
    },
  ]

  return (
    <div className='absolute bottom-5 left-1/2 flex w-[90%] -translate-x-1/2 items-center justify-around rounded-[30px] bg-white py-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)]'>

      {navItems.map((item, index) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center transition-all duration-300 ${
              isActive
                ? 'scale-110 text-purple-600'
                : 'text-gray-400 hover:text-purple-500'
            }`}
          >

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-[#f3ebff] shadow-md'
                  : ''
              }`}
            >

              <item.icon size={24} />

            </div>

            <span className='mt-1 text-xs font-semibold'>
              {item.label}
            </span>

          </Link>
        )
      })}

    </div>
  )
}