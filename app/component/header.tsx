"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser(); // Get authentication state

  return (
    <nav className="bg-amber-600 p-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-white">
          <Link href="/" className="p-2 text-white font-bold">
            Eventify
          </Link>
        </h1>

        {/* Desktop Menu (Hidden on mobile) */}
        <ul className="hidden md:flex space-x-4">
          <Link href="/" className="p-2 text-white font-bold">
            Home
          </Link>
          <Link href="/event-dashboard" className="p-2 text-white font-bold">
            Event Dashboard
          </Link>
          <Link href="/fund-collection" className="p-2 text-white font-bold">
            Fund Collection
          </Link>
          <Link href="/task-management" className="p-2 text-white font-bold">
            Task Management
          </Link>
        </ul>

        {/* Buttons (Desktop Only) */}
        <div className="hidden md:flex space-x-4">
          <Button className="bg-green-600">
            <Link href="/controlEvent" className="p-2 text-white font-bold">
              Control Event
            </Link>
          </Button>

          {/* Conditional Login/User Button */}
          {!isLoaded ? null : isSignedIn ? (
            <UserButton />
          ) : (
            <Button>
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
        <div className="absolute top-16 left-0 w-full bg-amber-700 md:hidden">
          <ul className="flex flex-col items-center py-4 space-y-4">
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
