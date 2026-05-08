import { useNavigate } from 'react-router-dom'

type Props = {
  title: string
}

export default function PageHeader({
  title,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className='mt-5 flex items-center justify-between'>

      <button
        onClick={() => navigate(-1)}
        className='rounded-full bg-purple-100 px-4 py-2 text-sm text-purple-600'
      >
        ←
      </button>

      <h1 className='text-2xl font-bold'>
        {title}
      </h1>

      <div className='w-10'></div>

    </div>
  )
}