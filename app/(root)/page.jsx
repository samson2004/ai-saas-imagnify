import { navLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
// import { UserButton } from '@clerk/nextjs'
import {Collection} from '@/components/shared/Collection';
import { GetAllImages } from '@/lib/actions/image.actions';

const Home = async ({searchParams}) => {
  const page=Number(searchParams?.page) ||1;
  const searchQuery=  (searchParams?.query) || ""; 

  const images=await GetAllImages({page,searchQuery});

  return (
   <>
   <section className='home sm:flex-center'>
    <h1 className='home-heading sm:leading-[56px] sm:text-[44px]'>Unleash Your Creative Vision with Imaginify</h1>
    <ul className='flex justify-center items-center w-full gap-20'>
      {navLinks.slice(1,5).map((link)=>(
        <Link 
        key={link.route}
        href={link.route}
        className='flex-center flex-col gap-2 '>
          <li className='flex-center w-fit rounded-full bg-white p-4'>
            <Image 
            src={link.icon}
            width={24}
            height={24}
            alt={link.label} />
          </li>
          <p className='p-14-medium text-center text-white '>{link.label}</p>
          
        </Link>
      ))}
    </ul>
   </section>
   <section className='sm:mt-12 '>
    <Collection 
    hasSearch={true} 
    images={images?.data} 
      totalPages={images?.totalPage} 
    page={page}/>
   </section>
   </>
  )
}

export default Home