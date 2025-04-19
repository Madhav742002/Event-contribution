"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Updated import
import React, { useState, useEffect } from "react"; // Added useEffect
import {
  TiSocialFacebookCircular,
  TiSocialGithubCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
} from "react-icons/ti";
import toast from "react-hot-toast";

export default function Footer() {
  const [formData, setFormData] = useState({});
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Track mount state

  useEffect(() => {
    setIsMounted(true); // Set mounted when component loads
  }, []);

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data", formData);

    if (!isLoaded || !isMounted) return; // Check both auth and mount status

    if (!userId) {
      router.push("/sign-in"); // Redirect to sign-in if not logged in
    } else {
      console.log("User is logged in, submitting the form...");

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success("Message submitted successfully!");
          setFormData({});
          e.target.reset();
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Failed to submit message:", error);
        toast.error("Failed to submit the message. Please try again later.");
      }
    }
  };
  // Return the JSX outside of handleSubmit
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-200 m-3 mb-0">
      <div className="md:flex justify-between m-3 ">
        <div className="p-4 m-1 flex flex-col justify-center items-center">
          <img src="logo.jpg" width={150} alt="logo" className="rounded-full" />
          <h1 className="font-extrabold text-2xl">EVENTIFY</h1>
          <h1>Social links</h1>
          <div className="flex justify-center gap-2">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-purple-100 transition-all duration-300">
              <TiSocialInstagramCircular className="text-4xl text-pink-600 hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <TiSocialFacebookCircular className="text-4xl text-blue-600 hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <TiSocialLinkedinCircular className="text-4xl text-blue-700 hover:scale-110 transition-transform" />
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300">
              <TiSocialGithubCircular className="text-4xl text-gray-800 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        <div className="p-4 flex flex-col items-center md:items-start">
          <h1 className="font-semibold mb-4">Support</h1>
          <ul className="flex flex-col items-center md:items-start space-y-3">
            <li>
            <a href="/component/blog" className="text-black hover:text-blue-600 transition-colors">
                Blogs
              </a>
            </li>
            <li>
            <a href="/component/pricing" className="text-black hover:text-blue-600 transition-colors">
                Pricing
              </a>
            </li>
            <li>
            <a href="/component/contact-us" className="text-black hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div className="p-4 m-1 flex flex-col items-center md:items-start">
          <h1 className="font-semibold mb-4">Quick Links</h1>
          <ul className="flex flex-col items-center md:items-start space-y-3">
            <li>
            <a href="/component/about" className="text-black hover:text-blue-600 transition-colors">
                About
              </a>
            </li>
            <li>
            <a href="/component/career" className="text-black hover:text-blue-600 transition-colors">
                Careers
              </a>
            </li>
            <li>
            <a href="/component/privacy-policy" className="text-black hover:text-blue-600 transition-colors">
                Privacy & Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="p-4 m-1 flex flex-col items-center md:items-start">
          <h1 className="font-semibold">Feedback</h1>
          <form onSubmit={handleSubmit}>
            <Input
              className="m-1 bg-slate-200"
              name="email"
              type="email"
              required
              placeholder="Email *"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
            <textarea
              className="m-1 w-full h-32 p-4 rounded-lg border border-gray-300"
              required
              name="message"
              type="text"
              placeholder="Message"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-white font-semibold">
              Submit
            </Button>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center bg-slate-950">
        <h1 className="p-4 text-white">
          © 2025 Eventify. All Rights Reserved.
        </h1>
      </div>
    </div>
  );
}