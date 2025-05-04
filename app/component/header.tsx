"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto-save user to DB
  useEffect(() => {
    async function saveUserToDB() {
      if (!user) return;

      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.fullName,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl,
          }),
        });
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    }

    if (isSignedIn) {
      saveUserToDB();
    }
  }, [isSignedIn, user]);

  return (
    <nav className="bg-zinc-800 rounded-b-lg shadow-lg p-3 sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          <Link href="/" className="p-2 text-white font-bold hover:text-gray-200 transition-colors">
            Eventify
          </Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-2 lg:space-x-6">
          <Link href="/" className="px-3 py-2 text-sm lg:text-base text-white font-bold hover:bg-white/20 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Home</span>
          </Link>
          <Link href="/component/about" className="px-3 py-2 text-sm lg:text-base text-white font-bold hover:bg-blue-400/30 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">About</span>
          </Link>
          <Link href="/component/contact-us" className="px-3 py-2 text-sm lg:text-base text-white font-bold hover:bg-green-400/30 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Contact Us</span>
          </Link>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
          <Button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/50 text-sm lg:text-base">
            <Link href="/controlEvent" className="px-3 py-1 text-white font-bold">
              Control Event
            </Link>
          </Button>

          {!isLoaded ? null : isSignedIn ? (
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Button className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-sm lg:text-base">
              <Link href="/sign-in" className="px-3 py-1 text-white font-bold">
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <TiThMenuOutline size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu-container md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 pt-16">
          <div className="bg-gradient-to-b from-blue-600 to-purple-700 shadow-lg animate-in slide-in-from-top-8">
            <ul className="flex flex-col items-center py-4 space-y-6">
              <li className="w-full text-center">
                <Link
                  href="/"
                  className="block py-3 text-white font-bold text-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="/controlEvent"
                  className="block py-3 text-white font-bold text-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Control Event
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="/component/about"
                  className="block py-3 text-white font-bold text-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="/component/contact-us"
                  className="block py-3 text-white font-bold text-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </li>

              <li className="w-full px-6 pt-4 border-t border-white/20">
                {!isLoaded ? null : isSignedIn ? (
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-3 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/sign-in" className="w-full block">
                      Login
                    </Link>
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}