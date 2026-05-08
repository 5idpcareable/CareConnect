type Props = {
    value: string
    label: string
    color?: string
  }
  
  export default function StatCard({
    value,
    label,
    color = 'text-purple-600',
  }: Props) {
    return (
      <div className='rounded-2xl bg-white p-4 text-center shadow-md'>
  
        <p className={`text-3xl font-bold ${color}`}>
          {value}
        </p>
  
        <p className='mt-2 text-sm text-gray-500'>
          {label}
        </p>
  
      </div>
    )
  }