'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-200"
      >
        <div className="relative w-6 h-5">
          <span className={`absolute block h-0.5 w-6 bg-black transition ${open ? 'rotate-45 top-2.5' : 'top-0'}`} />
          <span className={`absolute block h-0.5 w-6 bg-black transition ${open ? 'opacity-0' : 'top-2.5'}`} />
          <span className={`absolute block h-0.5 w-6 bg-black transition ${open ? '-rotate-45 top-2.5' : 'top-5'}`} />
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
  );
}
