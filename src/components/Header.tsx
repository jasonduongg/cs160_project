'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiChevronLeft } from 'react-icons/fi';

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
          <div className="absolute right-0 mt-8 w-48 rounded-xl shadow-lg bg-[#f9f9f6] border p-4 space-y-4 z-50">
            <Link href="/" className="block text-left text-gray-600 hover:text-blue-500">Home</Link>
            <Link href="/entries" className="block text-left text-gray-600 hover:text-blue-500">Entries</Link>
            <Link href="/create" className="block text-left text-gray-600 hover:text-blue-500">New Entry</Link>
            <Link href="/chat/example" className="block text-left text-gray-600 hover:text-blue-500">Chat</Link>
            <Link href="#" className="block text-left text-gray-600 hover:text-blue-500">Profile</Link>
          </div>
        )}
      </div>
    </div>
  );
}
