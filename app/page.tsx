import Image from 'next/image'
import Link from 'next/link' 
import { NavBar } from './components/nav'

export default function Landing() {
  return (
    <div className=''>
      <NavBar></NavBar>
      <section id ='heroImage' className=''>
        <div className='absolute inset-0 bg-black/40'></div>
        <div className='relative z-10 mx-auto px-6 py-32 text-center'>
          <h1 className='text-5xl font-extrabold mb-6'>
            Start tracking your Workouts!
          </h1>
        </div>
      </section>
      <section>
        <div className='flex'>
          <FeatureCard featureTitle='' featureDesc='' />
        </div>
      </section>
    </div>
  )
}
interface CardProps {
  featureTitle: string;
  featureDesc : string;
}
const FeatureCard: React.FC<CardProps> = ({featureTitle, featureDesc}) => {
  return (
    <div>
    </div>
  )
}
