type Props = {
    children: React.ReactNode
  }
  
  export default function Card({ children }: Props) {
    return (
      <div className='rounded-[28px] bg-white p-5 shadow-md'>
        {children}
      </div>
    )
  }