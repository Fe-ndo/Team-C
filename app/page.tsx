import Image from 'next/image'
import Link from 'next/link' 
import { NavBar } from './components/nav'

export default function Landing() {
  return (
    <div>
      <NavBar></NavBar>
      <div className='opacity-20'>
        <Image 
          src= "/image.jpg"
          height={500}
          width={900}
          alt='backimage'
          />
        </div>
    </div>
  )
}
