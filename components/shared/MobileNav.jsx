"use client";

import { navLinks } from '@/constants';
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { usePathname } from 'next/navigation'
  
const MobileNav = () => {
    const pathname=usePathname();
  return (
    
    <header className='header lg:hidden '>
        <Link href='/' className='flex items-center gap-2 md:py-2'>
        <Image src="assets/images/logo-text.svg" alt="" width={180} height={28}/>
        </Link>
        <nav className='flex gap-4'>
        <UserButton />
        <Sheet>
            <SheetTrigger>
                <Image 
                src="/assets/icons/menu.svg"
                alt="Menu"
                width={28}
                height={28}
                className='cursor-pointer'
                 />
            </SheetTrigger>
            <SheetContent className="sheet-content  focus:ring-0 focus-visible:ring-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-none sm:w-24 ">
                <>
                <Image  src='assets/images/logo-text.svg' alt='logo' width={180} height={28}/>
                <ul className="header-nav_elements md:flex">
                  {navLinks.map((link)=>{
                    const isactive=link.route ===pathname
                    return(
                      <li key={link.route}
                      className={` ${isactive? "gradient-text":"" } 
                      p-18 flex whitespace-nowrap text-dark-700 cursor-pointer `}>
                          <Link href={link.route} className="sidebar-link">
                          <Image src={link.icon}
                          alt='logo' 
                          width={24}
                          height={24}
                          
                      />
                          {link.label}</Link>
                         </li>
                    )
                  })}
                    </ul>
                </>
            </SheetContent>
        </Sheet>
        </nav>

    </header>
  )
}

export default MobileNav