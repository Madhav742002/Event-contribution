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
    semester?: string;
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
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Ticket</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        .ticket {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
}

.ticket-header {
    background: linear-gradient(135deg, #f8f8f8, #ffffff);
    color: #333;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
}

.ticket-title {
    font-size: 24px;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-weight: bold;
    color: #222;
}

.ticket-subtitle {
    font-size: 16px;
    margin-bottom: 12px;
    color: #555;
}

.ticket-details {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    background: #fff;
}

.ticket-info {
    flex: 1;
    min-width: 250px;
    padding-right: 15px;
}

.ticket-qr {
    flex: 0 0 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-left: 15px;
    border: 1px solid #e0e0e0;
}

.ticket-qr img {
    width: 120px;
    height: 120px;
    margin-bottom: 10px;
}

.ticket-qr p {
    font-size: 12px;
    color: #666;
    text-align: center;
}

.detail-row {
    margin-bottom: 10px;
}

.detail-label {
    font-weight: bold;
    color: #555;
    font-size: 14px;
    margin-bottom: 3px;
}

.detail-value {
    font-size: 15px;
    color: #333;
}

.divider {
    height: 1px;
    background: #eee;
    margin: 15px 0;
}

.section-title {
    font-size: 18px;
    margin-bottom: 12px;
    color: #222;
}

.ticket-footer {
    background: #f5f5f5;
    padding: 15px;
    text-align: center;
    font-size: 14px;
    color: #666;
    border-top: 1px dashed #ccc;
}

.event-media {
    width: 100%;
    padding: 10px 20px;
    text-align: center;
    background: #fff;
}

.event-media img, .event-media video {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
    .ticket-details {
        flex-direction: column;
    }
    .ticket-info {
        padding-right: 0;
        margin-bottom: 20px;
    }
    .ticket-qr {
        margin-left: 0;
        margin-top: 15px;
    }
}
    </style>
</head>
<body>
    <div class="ticket">
        <div class="ticket-header">
            <h1 class="ticket-title">${event.title}</h1>
            <p class="ticket-subtitle">${event.description}</p>
            <div class="detail-row">
                <div class="detail-value">${event.date} | ${event.time}</div>
                <div class="detail-value">${event.location}</div>
                <div class="detail-value">Organized by: ${event.createdBy}</div>
            </div>
        </div>
        
        ${event.media ? `
        <div class="event-media">
            ${event.media.type === 'image' ? 
                `<img src="${event.media.preview}" alt="Event Image" />` : 
                `<video src="${event.media.preview}" controls></video>`}
        </div>` : ''}
        
        <div class="ticket-details">
            <div class="ticket-info">
                <h3 class="section-title">Student Details</h3>
                <div class="detail-row">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${studentDetails.name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${studentDetails.Email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Branch</div>
                    <div class="detail-value">${studentDetails.branch}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Program</div>
                    <div class="detail-value">${studentDetails.program}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Academic Year</div>
                    <div class="detail-value">${studentDetails.academicYear}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Semester</div>
                    <div class="detail-value">${studentDetails.semester}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Enrollment No</div>
                    <div class="detail-value">${studentDetails.enrollmentNo}</div>
                </div>
                <div class="divider"></div>
                <div class="detail-row">
                    <div class="detail-label">Payment ID</div>
                    <div class="detail-value">${paymentId}</div>
                </div>
            </div>
          <div class="ticket-qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `Event: ${event.title}\n` +
                    `Date: ${event.date}\n` +
                    `Time: ${event.time}\n` +
                    `Location: ${event.location}\n` +
                    `Organizer: ${event.createdBy}\n` +
                    `Attendee: ${studentDetails.name}\n` +
                    `Email: ${studentDetails.Email}\n` +
                    `Enrollment: ${studentDetails.enrollmentNo}\n` +
                    `Payment ID: ${paymentId}`
                )}" alt="QR Code" />
                <p>Scan for verification</p>
            </div>
        </div>
        
        <div class="ticket-footer">
            Thank you for your purchase!
        </div>
    </div>
</body>
</html>
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
