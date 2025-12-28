import { type ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-red-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-christmas-green text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading text-lg mb-1">
            🎄 Santa's Smart Budget App 🎄
          </p>
          <p className="text-sm opacity-90">
            Version 1.0.0 | © 2025 | Built with ❄️ and 🎅
          </p>
        </div>
      </footer>
    </div>
  );
}
