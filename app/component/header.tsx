"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check for user role in localStorage when component mounts
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [isSignedIn]); // Re-run when auth state changes

  const handleLoginClick = () => {
    if (!isSignedIn) {
      setShowRoleSelection(!showRoleSelection);
    }
  };

  const handleRoleSelection = (role: string) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
    setShowRoleSelection(false);
    window.location.href = '/sign-in';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleSelection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="hidden md:flex items-center space-x-4">
          {/* Show selected role when signed in */}
          {isClient && isSignedIn && userRole && (
            <span className="text-white font-bold bg-amber-700 px-3 py-1 rounded-md">
              {userRole === 'admin' ? 'Admin' : 'User'}
            </span>
          )}

          {/* Show Control Event button only for admin */}
          {isClient && isSignedIn && userRole === 'admin' && (
            <Button className="bg-green-600">
              <Link href="/controlEvent" className="p-2 text-white font-bold">
                Control Event
              </Link>
            </Button>
          )}

          {/* Conditional Login/User Button */}
          {!isLoaded ? null : isSignedIn ? (
            <UserButton />
          ) : (
            <div className="relative" ref={dropdownRef}>
              <Button onClick={handleLoginClick}>
                <span className="text-white font-bold">Login</span>
              </Button>
              
              {showRoleSelection && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleSelection('admin')}
                      className="block w-full text-center px-3 py-1 text-sm text-white font-bold bg-green-500 hover:bg-black mt-1"
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => handleRoleSelection('user')}
                      className="block w-full text-center px-3 py-1 text-sm text-white font-bold bg-green-500 hover:bg-black mt-1"
                    >
                      User
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <TiThMenuOutline size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Visible when isOpen) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-amber-700 md:hidden z-20">
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

            {/* Show selected role when signed in (mobile) */}
            {isClient && isSignedIn && userRole && (
              <span className="text-white font-bold bg-amber-800 px-4 py-2 rounded-md">
                {userRole === 'admin' ? 'Admin' : 'User'}
              </span>
            )}

            {/* Show Control Event button only for admin in mobile */}
            {isClient && isSignedIn && userRole === 'admin' && (
              <Link href="/controlEvent" className="p-2 text-white font-bold w-full px-4">
                <Button
                  className="bg-green-600 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Control Event
                </Button>
              </Link>
            )}

            {/* Conditional Login/User Button */}
            {!isLoaded ? null : isSignedIn ? (
              <UserButton />
            ) : (
              <div className="flex flex-col items-center space-y-2 w-full px-4">
                {showRoleSelection ? (
                  <>
                    <Button 
                      onClick={() => handleRoleSelection('admin')}
                      className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                      Admin
                    </Button>
                    <Button 
                      onClick={() => handleRoleSelection('user')}
                      className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                      User
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleLoginClick} className="w-full">
                    Login
                  </Button>
                )}
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}