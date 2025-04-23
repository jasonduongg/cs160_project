'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">
            Welcome to Your Digital Workspace
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Organize your projects, manage tasks, and collaborate seamlessly with our powerful platform.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <ul className="space-y-4">
            <li>
              <Link href="/create" className="block p-4 bg-white text-black rounded-lg shadow hover:shadow-md transition-shadow">
                Create New Entry
              </Link>
            </li>
            <li>
              <Link href="/catalogs" className="block p-4 bg-white text-black rounded-lg shadow hover:shadow-md transition-shadow">
                Browse Catalogs
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
