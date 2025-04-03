import React from 'react'

const About = () => {
  <title>About Us - Eventify</title>
  return (
    <div className="bg-gradient-to-r from-sky-200 to-sky-600 min-h-screen py-10 px-6 md:px-16 lg:px-32 flex items-center justify-center">
      <div className="max-w-5xl bg-white p-10 shadow-2xl rounded-3xl text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 uppercase tracking-wide">
          Welcome to Eventify
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Eventify is a cutting-edge platform designed to help organizations
          seamlessly manage event funding, volunteers, and ticketing.
          Our goal is to revolutionize event planning by providing an effortless
          solution for fund collection and volunteer coordination.
        </p>
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We strive to empower event organizers with an intuitive platform
            that simplifies collecting funds, managing volunteers, and generating tickets.
            Let us handle the logistics while you focus on creating an unforgettable event!
          </p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-700">Secure Fund Collection</h3>
            <p className="text-gray-700 mt-2">Effortlessly collect donations with integrated payment options.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700">Volunteer Management</h3>
            <p className="text-gray-700 mt-2">Assign and organize volunteers with a seamless tracking system.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-sky-500">
            <h3 className="text-xl font-semibold text-sky-700">Automatic Ticketing</h3>
            <p className="text-gray-700 mt-2">Generate unique tickets for events instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-xl font-semibold text-red-700">User-friendly Dashboard</h3>
            <p className="text-gray-700 mt-2">Monitor event progress with a powerful admin panel.</p>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Eventify?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Whether you're hosting a fundraiser, corporate event, or social gathering,
            Eventify provides everything you need for a smooth and successful experience.
            Join us today and take your event management to the next level!
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 text-white font-bold tracking-wide bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
          >home page</a>
        </div>
      </div>
    </div>
  );
};

export default About;
