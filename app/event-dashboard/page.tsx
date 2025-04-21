"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Script from "next/script";
import TrueFocus from "../component/TrueFocus";

export default function Dashboard() {
  interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    createdBy: string;
    ticketPrice?: number;
    imageUrls?: string[];
    media?: {
      type: "image" | "video";
      preview: string;
    };
    createdAt: string;
    status: "active" | "ended";
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

  type FilterType = "all" | "upcoming" | "ended";

  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    name: "",
    Email: "",
    branch: "",
    program: "",
    academicYear: "",
    enrollmentNo: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedEventImages, setSelectedEventImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        // Process and sort events
        const processedEvents = data
          .map((event: any) => ({
            ...event,
            status:
              new Date(`${event.date}T${event.time}`) < new Date()
                ? "ended"
                : "active",
          }))
          .sort(
            (a: Event, b: Event) =>
              new Date(`${b.date}T${b.time}`).getTime() -
              new Date(`${a.date}T${a.time}`).getTime()
          );

        setEvents(processedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (event: Event, details: StudentDetails) => {
    if (!razorpayLoaded) {
      alert("Payment system is still loading. Please try again in a moment.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: (event.ticketPrice ?? 0) * 100, // Convert to paise
      currency: "INR",
      name: event.title,
      description: `Ticket for ${event.title}`,
      image: "/logo.png",
      handler: async function (response: any) {
        try {
          // Store payment details in database
          const paymentResponse = await fetch("/api/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event,
              studentDetails: details,
              paymentId: response.razorpay_payment_id,
              amount: event.ticketPrice,
            }),
          });

          if (!paymentResponse.ok) {
            throw new Error("Failed to store payment details");
          }

          // Generate and download ticket
          generateTicket(event, response.razorpay_payment_id, details);
          
          // Show success message
          alert("Payment successful! Your ticket has been downloaded.");
          setShowStudentForm(false);
        } catch (error) {
          console.error("Error processing payment:", error);
          alert("Payment successful but failed to store details. Please contact support.");
        }
      },
      prefill: {
        name: details.name,
        email: details.Email,
        contact: details.program,
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        },
      },
    };

    try {
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert("Error initializing payment. Please try again.");
    }
  };

  const generateTicket = (
    event: Event,
    paymentId: string,
    details: StudentDetails
  ) => {
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
        
        ${
          event.media
            ? `
        <div class="event-media">
            ${
              event.media.type === "image"
                ? `<img src="${event.media.preview}" alt="Event Image" />`
                : `<video src="${event.media.preview}" controls></video>`
            }
        </div>`
            : ""
        }
        
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
                    <div class="detail-value">${
                      studentDetails.academicYear
                    }</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Semester</div>
                    <div class="detail-value">${studentDetails.semester}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Enrollment No</div>
                    <div class="detail-value">${
                      studentDetails.enrollmentNo
                    }</div>
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

    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${event.title}-${paymentId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getFilteredEvents = () => {
    const now = new Date();
    const searchFiltered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (filterType) {
      case "upcoming":
        return searchFiltered.filter((event) => event.status === "active");
      case "ended":
        return searchFiltered.filter((event) => event.status === "ended");
      default:
        return searchFiltered;
    }
  };

  const filteredEvents = getFilteredEvents();

  const handleImageClick = (event: Event) => {
    const images =
      event.imageUrls || (event.media?.preview ? [event.media.preview] : []);
    if (images.length > 0) {
      setSelectedEventImages(images);
      setCurrentImageIndex(0);
      setShowImageModal(true);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedEventImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedEventImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            <TrueFocus
              sentence="Book Your Ticket Now"
              manualMode={false}
              blurAmount={3}
              borderColor="red"
              animationDuration={2}
              pauseBetweenAnimations={0.5}
            />
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h3 className="text-xl font-semibold mb-2">Total Events</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{events.length}</span>
                <span className="text-sm opacity-80">All Events</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {events.filter((event) => event.status === "active").length}
                </span>
                <span className="text-sm opacity-80">Upcoming</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h3 className="text-xl font-semibold mb-2">Ended Events</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {events.filter((event) => event.status === "ended").length}
                </span>
                <span className="text-sm opacity-80">Ended</span>
              </div>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Search 
      className={`h-5 w-5 transition-colors duration-300 ${searchTerm ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}
    />
  </div>
  <Input
    type="text"
    placeholder="Search events..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm"
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <X className="h-5 w-5" />
    </button>
  )}
</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filterType === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setFilterType("upcoming")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filterType === "upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilterType("ended")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filterType === "ended"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Ended
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">
              {filterType === "all"
                ? "All Events"
                : filterType === "upcoming"
                ? "Upcoming Events"
                : "Ended Events"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-tr from-green-300 to-purple-300"
                >
                  <div
                    className="relative w-full h-48 mb-4 overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(event)}
                  >
                    {event.imageUrls && event.imageUrls.length > 0 ? (
                      <>
                        <img
                          src={event.imageUrls[0]}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                        {event.imageUrls.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            +{event.imageUrls.length - 1} more
                          </div>
                        )}
                      </>
                    ) : event.media?.preview ? (
                      event.media.type === "image" ? (
                        <img
                          src={event.media.preview}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                      ) : (
                        <video
                          src={event.media.preview}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Date:</span> {event.date}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {event.time}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {event.location}
                    </p>
                    <p>
                      <span className="font-medium">Organizer:</span>{" "}
                      {event.createdBy}
                    </p>
                    {event.ticketPrice && (
                      <p>
                        <span className="font-medium">Ticket Price:</span> ₹
                        {event.ticketPrice}
                      </p>
                    )}
                  </div>
                  {event.ticketPrice && (
                    <div className="mt-4">
                      {new Date(event.date) < new Date() ? (
                        <button
                          disabled
                          className="w-full bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                        >
                          Event Ended
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowStudentForm(true);
                          }}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                          Buy Ticket - ₹{event.ticketPrice}
                        </button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Fill Details</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedEvent) {
                  handlePayment(selectedEvent, studentDetails);
                  setShowStudentForm(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  required
                  value={studentDetails.name}
                  onChange={(e) =>
                    setStudentDetails({
                      ...studentDetails,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  required
                  value={studentDetails.Email}
                  onChange={(e) =>
                    setStudentDetails({
                      ...studentDetails,
                      Email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  required
                  value={studentDetails.branch}
                  onChange={(e) =>
                    setStudentDetails({
                      ...studentDetails,
                      branch: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number
                </label>
                <Input
                  required
                  value={studentDetails.program}
                  onChange={(e) =>
                    setStudentDetails({
                      ...studentDetails,
                      program: e.target.value,
                    })
                  }
                />
              </div>
             
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enrollment No.
                </label>
                <Input
                  required
                  value={studentDetails.enrollmentNo}
                  onChange={(e) =>
                    setStudentDetails({
                      ...studentDetails,
                      enrollmentNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
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

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Event Images</span>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img
                src={selectedEventImages[currentImageIndex]}
                alt={`Event image ${currentImageIndex + 1}`}
                className="w-full h-[500px] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                }}
              />
              {selectedEventImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedEventImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
