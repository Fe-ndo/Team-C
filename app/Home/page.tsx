import Image from 'next/image'
import Link from 'next/link' 
import { NavBar } from '../components/nav'

export default function Home() {
  return (
    <div>
        <NavBar></NavBar>
        <h1>Hello Home</h1>
    </div>
  )
}