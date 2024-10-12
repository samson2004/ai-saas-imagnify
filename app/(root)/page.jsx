import { navLinks } from '@/constants'
import Link from 'next/link'
import React from 'react'
// import { UserButton } from '@clerk/nextjs'

const Home = () => {
  return (
   <>
   <section className='home sm:flex-center'>
    <h1 className='home-heading sm:leading-[56px] sm:text-[44px]'>Unleash Your Creative Vision with Imaginify</h1>
    <ul className='flex-center w-full gap-20'>
      {navLinks.slice(1,5).map((link)=>{
        <Link 
        key={link.route}
        href={link.route}
        className='flex-center flex-col gap-2 '>
          <li></li>
          <p>{link.label}</p>
        </Link>
      })}
    </ul>
   </section>
   </>
  )
}

export default Home