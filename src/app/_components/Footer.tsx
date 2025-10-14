import { House } from 'lucide-react';
import { Search } from 'lucide-react';
import { SquarePlus } from 'lucide-react';
import { CircleUser } from 'lucide-react';
import Link from "next/link"

export const Footer = () => {
    return(
        <div className='fixed bottom-0 flex justify-between w-screen px-8 py-2'>
          <Link href="/">
          <House />
          </Link>
          <Link href="/search">
          <Search />
          </Link>
          <Link href="/create">
          <SquarePlus />
          </Link>
          <Link href="/profile">
          <CircleUser />
          </Link>  
        </div>
    )
}