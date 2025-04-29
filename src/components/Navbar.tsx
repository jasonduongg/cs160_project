'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavbarProps {
    title?: string;
}

const Navbar = ({ title = 'Digital Assistant' }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="text-black bg-white p-2 relative">
            <div className="flex justify-between items-center">
                <div className="w-10"></div> {/* Spacer for balance */}
                <h1 className="text-2xl font-bold">{title}</h1>
                {/* Hamburger Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="p-1 z-50 transition-transform duration-300"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* Mobile Menu */}
                <div
                    className={`absolute top-full right-0 w-48 bg-white p-2 shadow-lg z-40 transition-all duration-300 ease-in-out transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}
                >
                    <div className="flex flex-col space-y-1">
                        <Link
                            href="/create"
                            className="block py-2 px-3 hover:text-gray-300 transition-colors duration-200 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Create New Entry
                        </Link>
                        <Link
                            href="/catalogs"
                            className="block py-2 px-3 hover:text-gray-300 transition-colors duration-200 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Browse Catalogs
                        </Link>
                        <Link
                            href="/landing"
                            className="block py-2 px-3 hover:text-gray-300 transition-colors duration-200 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Landing
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 