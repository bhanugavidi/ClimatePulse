"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Leaf, UserCircle, LogOut, Moon, Sun, LayoutDashboard, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAdmin, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize dark mode based ONLY on user's saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      // Light mode is explicitly default
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Live Map', href: '/map' },
  ];
  
  if (user) {
    navLinks.push({ name: 'Report', href: '/report' });
    navLinks.push({ name: 'My Reports', href: '/profile' });
  }
  
  if (isAdmin) {
    navLinks.push({ name: 'Admin', href: '/admin' });
  }

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/60 backdrop-blur-lg border-b border-slate-200/60 shadow-sm py-0' 
        : 'bg-white border-b border-white py-1'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-emerald-700">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ClimatePulse
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                pathname === link.href ? 'text-emerald-700 underline underline-offset-4' : 'text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="text-slate-600 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-slate-100" 
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="text-slate-600 hover:text-slate-900 transition-colors hidden sm:block" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-300 pl-4 ml-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserCircle className="h-5 w-5 text-emerald-600" />
                <span className="hidden sm:inline-block capitalize">{isAdmin ? 'Admin' : 'Citizen'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-800 hover:shadow-md"
            >
              Get Started &rarr;
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
