
"use client";
import { Button } from '../ui/button';
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn,SignedOut } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation'
const Sidebar = () => {
  const pathname=usePathname();
  return (
    <aside className="sidebar lg:flex" >
        <div className="flex size-full flex-col gap-4" >
            <Link href="/" className="sidebar-logo md:py-2">
            <Image  src='assets/images/logo-text.svg' alt='logo' width={180} height={28}/></Link>
            <nav className="sidebar-nav md:flex md:gap-4">
              <SignedIn>
                <ul className="sidebar-nav_elements md:flex">
                  {navLinks.slice(0,6).map((link)=>{
                    const isactive=link.route ===pathname
                    return(
                      <li key={link.route} className={`sidebar-nav_element hover:bg-purple-100
                         hover:shadow-inner group ${isactive? 'bg-purple-gradient text-white':'text-grap-700'}`}>
                          <Link href={link.route} className="sidebar-link">
                          <Image src={link.icon}
                          alt='logo' 
                          width={24}
                          height={24}
                          className={isactive ?'brightness-200':""} />
                          {link.label}</Link>
                         </li>
                    )
                  })}
                    </ul>
                    <ul className="sidebar-nav_elements md:flex">
                  {navLinks.slice(6).map((link)=>{
                    const isactive=link.route ===pathname
                    return(
                      <li key={link.route} className={`sidebar-nav_element hover:bg-purple-100
                         hover:shadow-inner group ${isactive? 'bg-purple-gradient text-white':'text-grap-700'}`}>
                          <Link href={link.route} className="sidebar-link">
                          <Image src={link.icon}
                          alt='logo' 
                          width={24}
                          height={24}
                          className={isactive ?'brightness-200':""} />
                          {link.label}</Link>
                         </li>
                    )
                  })}
                  <li className='flex-center cursor-pointer gap-2 p-4'>
                    <UserButton afterSignOutUrl='/' showName/>
                  </li>
                  </ul>
              </SignedIn>
              <SignedOut>
                <Button asChild className="button bg-purple-gradient bg-cover focus-visible:ring-offset-0 focus-visible:ring-transparent!important">
                  <Link href='/sign-in'>sign-up</Link>
                </Button>
              </SignedOut>
            </nav>
        </div>
    </aside>
  )
}

export default Sidebar;