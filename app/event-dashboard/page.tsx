"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  interface Event {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    createdBy: string;
    ticketPrice?: number;
    media?: {
      type: 'image' | 'video';
      preview: string;
    };
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    // Load volunteers from localStorage
    const storedVolunteers = localStorage.getItem('volunteers');
    if (storedVolunteers) {
      setVolunteers(JSON.parse(storedVolunteers));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Event Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Events</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{events.length}</span>
              <span className="text-sm opacity-80">Active Events</span>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Volunteers</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{volunteers.length}</span>
              <span className="text-sm opacity-80">Registered</span>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">92%</span>
              <span className="text-sm opacity-80">This Month</span>
            </div>
          </Card>
        </div>

        {/* Events List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                <div className="text-sm">
                  <p><span className="font-medium">Date:</span> {event.date}</p>
                  <p><span className="font-medium">Time:</span> {event.time}</p>
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                  <p><span className="font-medium">Organizer:</span> {event.createdBy}</p>
                  {event.ticketPrice && (
                    <p><span className="font-medium">Ticket Price:</span> ₹{event.ticketPrice}</p>
                  )}
                </div>
                {event.media?.preview && (
                  <div className="mt-3">
                    {event.media.type === 'image' ? (
                      <img 
                        src={event.media.preview} 
                        alt="Event media" 
                        className="w-full h-40 object-cover rounded"
                      />
                    ) : (
                      <video 
                        src={event.media.preview} 
                        controls 
                        className="w-full h-40 object-cover rounded"
                      />
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
