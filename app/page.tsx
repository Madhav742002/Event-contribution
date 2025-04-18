"use client";
import "animate.css";
import type { Metadata } from "next";
import Footer from "./component/footer";
import Team from "./component/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChatBot from "@/components/ui/Chatbot";
import { useEffect, useRef } from "react";
import * as anime from "animejs";

export default function Home() {
  return (
    <div className="min-h-screen">
      <ChatBot />
      {/* Hero Section */}
      <section className="m-2 rounded-lg shadow-lg shadow-black bg-hero-pattern bg-cover bg-center text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-shadow-lg text-3xl md:text-5xl font-bold mb-4">
            Welcome to E-collection
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Manage your events efficiently and effectively
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/controlEvent">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-4 px-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 rounded-full"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-green-200 to-red-300 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-100 rounded-full filter blur-3xl opacity-20 animate-float1"></div>
          <div className="absolute top-1/2 right-20 w-40 h-40 bg-purple-100 rounded-full filter blur-3xl opacity-20 animate-float2"></div>
          <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-pink-100 rounded-full filter blur-3xl opacity-20 animate-float3"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 relative">
            <span className="relative inline-block">
              Our Powerful Features
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 - Event Dashboard */}
            <Link href="/event-dashboard" className="cursor-pointer group">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                    Event Dashboard
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive overview of all your events and metrics
                  </p>
                  <div className="flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                    <span>Explore feature</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Feature 2 - Fund Collection */}
            <Link href="/fund-collection" className="cursor-pointer group">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-rotate-12 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    Fund Collection
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Efficient management of donations and contributions
                  </p>
                  <div className="flex items-center text-purple-600 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                    <span>Explore feature</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Feature 3 - Task Management */}
            <Link href="/task-management" className="cursor-pointer group">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-pink-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                    Task Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Organize and track event-related tasks
                  </p>
                  <div className="flex items-center text-pink-600 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                    <span>Explore feature</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Add this to your global CSS or style tag */}
        <style jsx>{`
          @keyframes float1 {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }
          @keyframes float2 {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(10px) translateX(-15px);
            }
          }
          @keyframes float3 {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-15px) translateX(-10px);
            }
          }
          .animate-float1 {
            animation: float1 8s ease-in-out infinite;
          }
          .animate-float2 {
            animation: float2 10s ease-in-out infinite;
          }
          .animate-float3 {
            animation: float3 9s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Event</h3>
              <p className="text-gray-600">
                Set up your event details and requirements
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Members</h3>
              <p className="text-gray-600">
                Invite team members and assign roles
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Funds</h3>
              <p className="text-gray-600">Track and manage event finances</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor event progress in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Team />
      <Footer />
    </div>
  );
}
