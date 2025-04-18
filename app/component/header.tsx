"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser(); // Get authentication state

  return (
    <nav className="bg-zinc-800 rounded-b-lg shadow-b-lg shadow-lg p-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-white">
          <Link href="/" className="p-2 text-white font-bold">
            Eventify
          </Link>
        </h1>

        {/* Desktop Menu (Hidden on mobile) */}
        <ul className="hidden md:flex space-x-6">
          <Link href="/" className="px-4 py-2 text-white font-bold hover:bg-white/20 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Home</span>
          </Link>
          <Link href="/event-dashboard" className="px-4 py-2 text-white font-bold hover:bg-purple-500/30 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Event Dashboard</span>
          </Link>
          <Link href="/fund-collection" className="px-4 py-2 text-white font-bold hover:bg-blue-400/30 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Fund Collection</span>
          </Link>
          <Link href="/task-management" className="px-4 py-2 text-white font-bold hover:bg-green-400/30 rounded-full transition-all duration-300 flex items-center group">
            <span className="group-hover:scale-105 transition-transform">Task Management</span>
          </Link>
        </ul>

        {/* Buttons (Desktop Only) */}
        <div className="hidden md:flex space-x-4">
        <Button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/50">
            <Link href="/controlEvent" className="p-2 text-white font-bold">
              Control Event
            </Link>
          </Button>

          {/* Conditional Login/User Button */}
          {!isLoaded ? null : isSignedIn ? (
            <UserButton />
          ) : (
            <Button className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
              <Link href="/sign-in" className="text-white font-bold">
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <TiThMenuOutline size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Visible when isOpen) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-600 md:hidden z-50">
          <ul className="flex flex-col items-center py-4 space-y-4 shadow-lg">
            <Link
              href="/"
              className="text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/event-dashboard"
              className="text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              Event Dashboard
            </Link>
            <Link
              href="/fund-collection"
              className="text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              Fund Collection
            </Link>
            <Link
              href="/task-management"
              className="text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              Task Management
            </Link>

            {/* Buttons inside Mobile Menu */}
            <Link href="/controlEvent" className="p-2 text-white font-bold">
              <Button
                className="bg-green-600 w-full"
                onClick={() => setIsOpen(false)}
              >
                Control Event
              </Button>
            </Link>

            {/* Conditional Login/User Button */}
            {!isLoaded ? null : isSignedIn ? (
              <UserButton />
            ) : (
              <Link href="/sign-in" className="text-white font-bold">
                <Button onClick={() => setIsOpen(false)}>Login</Button>
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}