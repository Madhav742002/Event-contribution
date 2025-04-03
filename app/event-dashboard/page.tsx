"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


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

  interface StudentDetails {
    name: string;
    Email: string;
    branch: string;
    program: string;
    academicYear: string;
    enrollmentNo: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    name: '',
    Email: '',
    branch: '',
    program: '',
    academicYear: '',
    enrollmentNo: ''
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    const storedVolunteers = localStorage.getItem('volunteers');
    if (storedVolunteers) {
      setVolunteers(JSON.parse(storedVolunteers));
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (event: Event, details: StudentDetails) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: (event.ticketPrice ?? 0) * 100,
      currency: "INR",
      name: event.title,
      description: `Ticket for ${event.title}`,
      handler: function(response: any) {
        generateTicket(event, response.razorpay_payment_id, details);
      },
      prefill: {
        name: details.name,
        email: `${details.enrollmentNo}@example.com`,
      },
      theme: {
        color: "#3B82F6"
      }
    };
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const generateTicket = (event: Event, paymentId: string, details: StudentDetails) => {
    const ticketHTML = `
      <div style="width: 600px; border-radius: 10px; overflow: hidden; font-family: Arial, sans-serif; border: 2px solid #ccc;">
        <div style="display: flex; background: #111; color: #fff; padding: 20px;">
          <div style="flex: 1;">
            <h2 style="margin: 0; font-size: 28px; text-transform: uppercase;">${event.title}</h2>
            <p style="margin: 5px 0; font-size: 16px;">${event.description}</p>
            <p style="margin: 5px 0; font-size: 18px;">${event.date} | ${event.time}</p>
            <p style="margin: 5px 0; font-size: 16px;">${event.location}</p>
            <p style="margin: 5px 0; font-size: 14px;">Organized by: ${event.createdBy}</p>
            <hr style="margin: 10px 0; border-color: #333;" />
            <h3 style="margin: 5px 0;">Student Details:</h3>
            <p style="margin: 3px 0;">Name: ${details.name}</p>
            <p style="margin: 3px 0;">Name: ${details.Email}</p>
            <p style="margin: 3px 0;">Branch: ${details.branch}</p>
            <p style="margin: 3px 0;">Program: ${details.program}</p>
            <p style="margin: 3px 0;">Academic Year: ${details.academicYear}</p>
            <p style="margin: 3px 0;">Enrollment No: ${details.enrollmentNo}</p>
            <p style="margin: 5px 0; font-size: 14px;">Payment ID: ${paymentId}</p>
          </div>
          <div style="flex: 0.5; text-align: center; background: #fff; padding: 10px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${paymentId}" alt="QR Code" />
            <p style="font-size: 12px; color: #333;">Scan for verification</p>
          </div>
        </div>
        ${event.media ? `<div style="text-align: center; padding: 10px;">
          ${event.media.type === 'image' ? 
            `<img src="${event.media.preview}" alt="Event Image" style="max-width: 100%; border-radius: 5px;" />` : 
            `<video src="${event.media.preview}" controls style="max-width: 100%; border-radius: 5px;"></video>`}
        </div>` : ''}
        <div style="text-align: center; padding: 15px; font-size: 14px; background: #222; color: #fff;">
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

        <div className="mb-6 relative w-1/2">
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
                      setSelectedEvent(event);
                      setShowStudentForm(true);
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

      <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fill Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedEvent) {
              handlePayment(selectedEvent, studentDetails);
              setShowStudentForm(false);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                required
                value={studentDetails.name}
                onChange={(e) => setStudentDetails({...studentDetails, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                required
                value={studentDetails.Email}
                onChange={(e) => setStudentDetails({...studentDetails, Email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <Input
                required
                value={studentDetails.branch}
                onChange={(e) => setStudentDetails({...studentDetails, branch: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <Input
                required
                value={studentDetails.program}
                onChange={(e) => setStudentDetails({...studentDetails, program: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Academic Year</label>
              <Input
                required
                value={studentDetails.academicYear}
                onChange={(e) => setStudentDetails({...studentDetails, academicYear: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enrollment No.</label>
              <Input
                required
                value={studentDetails.enrollmentNo}
                onChange={(e) => setStudentDetails({...studentDetails, enrollmentNo: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
