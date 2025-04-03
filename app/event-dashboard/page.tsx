"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

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
  // Load Razorpay SDK
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

 const handlePayment = async (event: Event) => {
   const options = {
     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
     amount: (event.ticketPrice || 0) * 100,
     currency: "INR",
     name: event.title,
     description: `Ticket for ${event.title}`,
     handler: function (response: any) {
       generateTicket(event, response.razorpay_payment_id);
     },
     prefill: {
       name: "Attendee Name",
       email: "attendee@example.com",
     },
     theme: {
       color: "#3B82F6",
     },
   };

   const razorpay = new (window as any).Razorpay(options);
   razorpay.open();
 };

  const generateTicket = (event: Event, paymentId: string) => {
    const ticketHTML = `
      <div style="padding: 20px; border: 2px solid #333; max-width: 500px; margin: 20px auto; font-family: Arial;">
        <h2 style="text-align: center; color: #2563eb;">${event.title} - Event Ticket</h2>
        <div style="margin: 15px 0;">
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    `;

    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${event.title}-${paymentId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


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

          {/* Search Bar */}
          <div className="mb-6 relative w-1/2 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

         {/* Events List */}
         <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
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
               {event.ticketPrice && (
                  <button
                    onClick={() => {
                      const options = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                        amount: (event.ticketPrice ?? 0) * 100,
                        currency: "INR",
                        name: event.title,
                        description: `Ticket for ${event.title}`,
                        handler: function(response: any) {
                          alert("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
                          generateTicket(event, response.razorpay_payment_id);
                        },
                        prefill: {
                          name: "Attendee",
                          email: "attendee@example.com",
                        },
                        theme: {
                          color: "#3B82F6"
                        }
                      };
                      const razorpay = new (window as any).Razorpay(options);
                      razorpay.open();
                    }}
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Buy Ticket - ₹{event.ticketPrice}
                  </button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}