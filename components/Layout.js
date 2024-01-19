
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] })

export default function Layout({children}) {
  const { data: session } = useSession();
  if(!session){
    return(
      
      <div className={'bg-bgGray w-screen h-screen flex items-center'}>
      <div className='text-center w-full'>
        <button onClick={() => signIn('google')} className='btn-primary'>Login with Google</button>
      </div>
    </div>
    )
  }
  return (
    <div className={'bg-bgGray w-screen h-screen flex'}>
      <Nav />
      <div className='bg-bgGray flex-grow mt-2 mr-2 mb-2 text-black rounded-lg p-4'>
      {children}
      </div>
    </div>
  )
}
