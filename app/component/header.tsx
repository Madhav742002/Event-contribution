"use client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@radix-ui/react-toggle";
import Link from "next/link";
import { useState } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X } from "lucide-react"; // Close icon for mobile menu

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-amber-600 p-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold">E-Collection</h1>

        {/* Desktop Menu (Hidden on mobile) */}
        <ul className="hidden md:flex space-x-4">
          <Link href="/event-dashboard" className="p-2 text-white font-bold">
            Event Dashboard
          </Link>
          <Link href="/home" className="p-2 text-white font-bold">
            Home
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
          <Button>Login</Button>
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
            <Link href="/event-dashboard" className="text-white font-bold" onClick={() => setIsOpen(false)}>
              Event Dashboard
            </Link>
            <Link href="/home" className="text-white font-bold" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/fund-collection" className="text-white font-bold" onClick={() => setIsOpen(false)}>
              Fund Collection
            </Link>
            <Link href="/task-management" className="text-white font-bold" onClick={() => setIsOpen(false)}>
              Task Management
            </Link>
            {/* Buttons inside Mobile Menu */}
            <Button className="bg-green-600 w-full" onClick={() => setIsOpen(false)}>
              <Link href="/controlEvent" className="p-2 text-white font-bold">
                Control Event
              </Link>
            </Button>
            <Button className="w-full">Login</Button>
          </ul>
        </div>
      )}
    </nav>
  );
}
