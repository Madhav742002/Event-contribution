"use client";
import "animate.css";
import Footer from "./component/footer";
import Team from "./component/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChatBot from "@/components/ui/Chatbot";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useUser } from "@clerk/nextjs";
import Dashboard from "./event-dashboard/page";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false })
  ]);

  const cardData = [
    {
      number: 1,
      title: "Control Event",
      description: "Set up your event details and requirements",
    },
    {
      number: 2,
      title: "Add Members",
      description: "Invite team members and assign roles",
    },
    {
      number: 3,
      title: "Manage Funds",
      description: "Track and manage event finances",
    },
    {
      number: 4,
      title: "Track Progress",
      description: "Monitor event progress in real-time",
    },
    {
      number: 5,
      title: "Celebrate Success",
      description: "Enjoy and review your event's success",
    },
  ];

  // if (!isLoaded) {
  //   return <div>Loading...</div>; // Or a loading spinner
  // }

  // If user is signed in, show only the Footer
  if (isSignedIn) {
    return <Dashboard />;
  }

  // If not signed in, show all home pages
  return (
    <div className="min-h-screen">
      <ChatBot />
      {/* Hero Section */}
      <section className="relative m-2 rounded-lg overflow-hidden text-white py-12 md:py-20">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/analyze.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to darken video for better text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Foreground Content */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-shadow-lg text-3xl md:text-5xl font-bold mb-4">
           <span className="text-5xl font-extrabold text-yellow-500">EVENTIFY</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            A web application based project in event management system
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/sign-in">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-4 px-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 rounded-full"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 font-bold py-4 px-8 transform hover:scale-105 transition-all duration-300 rounded-full"
              >
                Sign Up
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
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/party_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>

          <div className="flex justify-center">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {cardData.map((item, index) => (
                  <div className="embla__slide" key={index}>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center text-center p-6 bg-gray-800/80 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                          {item.number}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Team />
    </div>
  );
}