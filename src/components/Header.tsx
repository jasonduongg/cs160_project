'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiChevronLeft, FiBook, FiPlus, FiMessageSquare, FiHome, FiCalendar } from 'react-icons/fi';

export default function Header({ showBack }: { showBack?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full items-center">
      <div className="flex w-full" ref={menuRef}>
        <div className="flex-1">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          <div className="relative w-6 h-6">
            <FiMenu className={`absolute w-6 h-6 transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <FiX className={`absolute w-6 h-6 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-[40px] w-40 rounded-xl shadow-lg bg-[#f9f9f6] border p-2 z-50">
            <div className="py-0.5">
              <Link href="/" className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <FiHome className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link href="/create" className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <FiPlus className="w-4 h-4 mr-2" />
                Create
              </Link>
              <Link href="/entries" className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <FiBook className="w-4 h-4 mr-2" />
                Entries
              </Link>
              <Link href="/chat/example" className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <FiMessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Link>
              <Link href="/calendar" className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <FiCalendar className="w-4 h-4 mr-2" />
                Calendar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
