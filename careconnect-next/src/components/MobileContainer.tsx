type Props = {
    children: React.ReactNode
  }
  
  export default function MobileContainer({
    children,
  }: Props) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-[#f8f4ff] to-[#efe7ff] flex justify-center'>
  
        <div className='w-full max-w-[430px] min-h-screen bg-[#fcfbff] px-5 pb-28 pt-4'>
  
          {children}
  
        </div>
  
      </div>
    )
  }