'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, LayoutDashboard, GanttChartSquare, FlaskConical, CalendarClock, Info } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/revision', label: 'Revision', icon: GanttChartSquare },
  { href: '/labs', label: 'Labs', icon: FlaskConical },
  { href: '/weekly', label: 'Weekly Summary', icon: CalendarClock },
  { href: '/about', label: 'About', icon: Info },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>CCNA Journey</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`text-sm font-medium transition-colors ${pathname === href ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
