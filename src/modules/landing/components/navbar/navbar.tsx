'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useNavbar } from './use-navbar'

const MusicToggle = dynamic(() => import('../music-toggle').then(m => m.MusicToggle), {
  ssr: false,
})

export function Navbar() {
  const { time, handleNavigation } = useNavbar()

  return (
    <div className="fixed top-0 left-0 w-full px-4 md:px-16 py-4 md:py-8 z-100000000 mix-blend-difference flex flex-row gap-8 items-start">
      <div className="flex-1 flex gap-8">
        <div className="flex-1">
          <Link href="/">
            <h3 className="font-mono font-normal text-4xl text-foreground">KAudit</h3>
          </Link>
        </div>
        <div className="flex-1 hidden md:block">
          <p className="relative top-0.5 font-mono font-normal text-lg text-foreground tracking-tight">{time}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-row gap-8 items-start">
        <div className="flex-1 flex flex-col md:flex-row items-end md:items-start md:gap-8 gap-2">
          <a href="#intro" onClick={(e) => handleNavigation(e, 'intro')} className="group">
            <p className="font-mono font-normal text-lg text-foreground tracking-tight group-hover:opacity-70 transition-opacity whitespace-nowrap">El Concepto</p>
          </a>
          <a href="#case-studies" onClick={(e) => handleNavigation(e, 'case-studies')} className="group">
            <p className="font-mono font-normal text-lg text-foreground tracking-tight group-hover:opacity-70 transition-opacity whitespace-nowrap">Relevancia</p>
          </a>
          <a href="#works" onClick={(e) => handleNavigation(e, 'works')} className="group">
            <p className="font-mono font-normal text-lg text-foreground tracking-tight group-hover:opacity-70 transition-opacity whitespace-nowrap">Innovaciones</p>
          </a>
        </div>
        <div className="flex-1 hidden md:flex justify-end">
          <MusicToggle />
        </div>
      </div>
    </div>
  )
}
