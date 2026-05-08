type Props = {
    title: string
    subtitle?: string
  }
  
  export default function AppHeader({
    title,
    subtitle,
  }: Props) {
    return (
      <div className='mb-8'>
  
        {subtitle && (
          <p className='text-sm font-medium text-gray-400'>
            {subtitle}
          </p>
        )}
  
        <h1 className='mt-2 text-5xl font-black tracking-tight text-[#0f172a]'>
          {title}
        </h1>
  
      </div>
    )
  }