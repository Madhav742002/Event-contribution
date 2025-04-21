"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Trash2,
  Edit,
  Upload,
  X,
  LogOut,
  Search,
  Ticket,
  IndianRupee,
  QrCode,
  Star,
  AlignLeft,
  Calendar,
  Clock,
  MapPin,
  Image,
  Plus,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function ControlEvent() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Main states
  const [formData, setFormData] = useState({
    role: "",
    organizationName: "",
    eventName: "",
    name: "",
    email: "",
    userId: "",
    gender: "",
  });

  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);

  // UI states
  const [submitted, setSubmitted] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [editingVolunteerIndex, setEditingVolunteerIndex] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Form states
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    id: "",
    post: "volunteer",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    ticketPrice: "",
    imageUrls: [],
    newImageUrl: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    name: "",
    email: "",
    paymentMethod: "credit_card",
    transactionId: "",
  });

  // Add this state for total revenue
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Add this state for recent payments
  const [recentPayments, setRecentPayments] = useState([]);

  // fetch events data from database
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  // Check login status on component mount
  useEffect(() => {
    setIsClient(true);
    const checkLoginStatus = () => {
      if (typeof window !== "undefined") {
        const loginStatus = localStorage.getItem("isLoggedIn");
        const savedFormData = localStorage.getItem("currentUser");

        if (loginStatus === "true" && savedFormData) {
          const parsed = JSON.parse(savedFormData);
          setFormData(parsed);
          setSubmitted(true);
        }
      }
    };
    checkLoginStatus();
  }, []);

  // Save login status and form data
  useEffect(() => {
    if (isClient && submitted) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(formData));
    }
  }, [formData, submitted, isClient]);

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      setSubmitted(false);
      router.push("/");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = Date.now().toString();
    const newEvent = {
      ...formData,
      id: userId,
      userId: userId,
    };

    try {
      console.log("Sending registration request with data:", newEvent);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to register event");
      }

      if (response.ok) {
        setFormData((prev) => ({ ...prev, userId }));
        setSubmitted(true);
        // Show success message
        alert("Event registered successfully!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Failed to register event. Please try again.");
    }
  };

  const handleAddImageUrl = () => {
    if (eventForm.newImageUrl.trim()) {
      setEventForm({
        ...eventForm,
        imageUrls: [...eventForm.imageUrls, eventForm.newImageUrl],
        newImageUrl: "",
      });
    }
  };

  const handleRemoveImageUrl = (index) => {
    setEventForm({
      ...eventForm,
      imageUrls: eventForm.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingEventIndex !== null ? "PUT" : "POST";
      const url =
        editingEventIndex !== null
          ? `/api/events?id=${eventForm.id}`
          : "/api/events";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventForm),
      });

      if (response.ok) {
      const result = await response.json();
        if (editingEventIndex !== null) {
          // Update existing event in state
          setEvents(
            events.map((event, index) =>
              index === editingEventIndex ? result.event : event
            )
          );
          toast.success("Event updated successfully");
        } else {
          // Add new event to state
          setEvents([...events, result.event]);
          toast.success("Event created successfully");
        }
        setShowEventForm(false);
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };
  // handle edit event
  const handleEditEvent = (event) => {
      setEventForm({
      id: event.id, // Make sure to include the ID for updates
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      ticketPrice: event.ticketPrice || "",
      imageUrls: event.imageUrls || [],
    });
    setEditingEventIndex(events.findIndex((e) => e.id === event.id));
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/events?id=${eventId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the event from local state
          setEvents(events.filter((event) => event.id !== eventId));
          toast.success("Event deleted successfully");
        } else {
          throw new Error("Failed to delete event");
        }
    } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  // Add this useEffect to fetch payment details and calculate total revenue
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch("/api/payment");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.payments) {
            // Calculate total revenue from all payments
            const total = data.payments.reduce((sum, payment) => {
              return sum + (parseFloat(payment.amount) || 0);
            }, 0);
            setTotalRevenue(total);
          }
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, []);

  // Add this useEffect to fetch recent payments
  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await fetch("/api/payment");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.payments) {
            // Sort payments by date in descending order and take the last 10
            const sortedPayments = data.payments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10);
            setRecentPayments(sortedPayments);
          }
        }
      } catch (error) {
        console.error("Error fetching recent payments:", error);
      }
    };

    fetchRecentPayments();
  }, []);

  // Only render the UI on the client-side
  if (!isClient) {
    return null;
  }

  // Initial form (not submitted yet)
  if (!submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Event Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData({ ...formData, eventName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard after submission
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.organizationName} - {formData.eventName}
                </h1>
                <p className="text-gray-600">Welcome, {formData.name}!</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {formData.role === "admin" ? (
              <Tabs defaultValue="admin" className="w-full p-5">
                <TabsList className="grid w-full grid-cols-3 ">
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                  <TabsTrigger value="control">➕ Create Event</TabsTrigger>
                </TabsList>

                {/* Admin Tab */}
                <TabsContent value="admin">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <h3 className="text-xl font-semibold mb-2">
                            Total Events
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">
                              {events.length}
                            </span>
                            <span className="text-sm opacity-80">
                              All Events
                            </span>
                          </div>
                        </Card>
                        <Card className="p-6 hover:shadow-lg transition-shadow bg-pink-400">
                          <h3 className="text-xl font-semibold mb-2 text-black">
                            Total Collection
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-black -font-bold text-5xl">
                              ₹{" "}
                            </span>
                            <span className="text-3xl font-bold text-green-600 border-2 p-2 rounded-lg w-full bg-white">
                              {totalRevenue.toLocaleString("en-IN")}
                              <span className="text-3xl font-bold">/-</span>
                            </span>
                          </div>
                        </Card>
                      </div>

                      {/* Recent Payment History */}
                      <div className="mt-8 bg-slate-400 p-3 rounded-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                          Recent Payment History
                        </h3>
                        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-green-200">
                                <tr className="">
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    #
                                  </th>
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Payment ID
                                  </th>
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Event
                                  </th>
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th className=" font-bold px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Date & Time
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-500">
                                {recentPayments.map((payment, index) => (
                                  <tr
                                    key={payment.id}
                                    className="transition-colors hover:bg-gray-50/80"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm font-medium text-gray-500">
                                        {index + 1}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                          <span className="text-indigo-600 font-medium">
                                            {payment.studentName
                                              .charAt(0)
                                              .toUpperCase()}
                                          </span>
                            </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {payment.studentName}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Student
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {payment.paymentId}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 font-medium">
                                        {payment.eventTitle}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Event
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm font-semibold text-green-600">
                                        ₹
                                        {parseFloat(
                                          payment.amount
                                        ).toLocaleString("en-IN")}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-600">
                                        {new Date(
                                          payment.createdAt
                                        ).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {new Date(
                                          payment.createdAt
                                        ).toLocaleDateString("en-IN", {
                                          weekday: "short",
                                        })}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {recentPayments.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      className="px-6 py-8 text-center"
                                    >
                                      <div className="flex flex-col items-center justify-center">
                                        <svg
                                          className="w-12 h-12 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                          ></path>
                                        </svg>
                                        <h4 className="mt-4 text-lg font-medium text-gray-700">
                                          No payments found
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                          There are no recent payments to
                                          display
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          {recentPayments.length > 0 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
                              <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">1</span>{" "}
                                to{" "}
                                <span className="font-medium">
                                  {recentPayments.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                  {recentPayments.length}
                                </span>{" "}
                                results
                              </div>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                                  Previous
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Volunteer Tab */}
                <TabsContent value="volunteer">
                  <div className="p-4 border rounded mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">
                        Volunteer Management
                      </h2>
                      <button
                        onClick={() => setShowVolunteerForm(true)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        <PlusCircle size={18} /> Add Volunteer
                      </button>
                    </div>

                    {/* Volunteer Form Modal */}
                    {showVolunteerForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                              {editingVolunteerIndex !== null
                                ? "Edit Member"
                                : "Add Member"}
                            </h3>
                            <button
                              onClick={() => setShowVolunteerForm(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X size={24} />
                            </button>
                          </div>
                          <form
                            onSubmit={handleVolunteerSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={volunteerForm.name}
                                onChange={(e) =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:border-blue-400 placeholder-gray-400"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={volunteerForm.email}
                                onChange={(e) =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:border-blue-400 placeholder-gray-400"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">
                                ID/Roll Number
                              </label>
                              <input
                                type="text"
                                name="id"
                                value={volunteerForm.id}
                                onChange={(e) =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    id: e.target.value,
                                  })
                                }
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:border-blue-400 placeholder-gray-400"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Post
                              </label>
                              <select
                                name="post"
                                value={volunteerForm.post}
                                onChange={(e) =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    post: e.target.value,
                                  })
                                }
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="event coordinator">
                                  Event Coordinator
                                </option>
                                <option value="vice event coordinator">
                                  Vice Event Coordinator
                                </option>
                                <option value="discipline head">
                                  Discipline Head
                                </option>
                                <option value="photography & media head">
                                  Photography & Media Head
                                </option>
                                <option value="volunteer">Volunteer</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            {volunteerForm.post === "other" && (
                              <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                  Specify Post
                                </label>
                                <input
                                  type="text"
                                  name="customPost"
                                  value={volunteerForm.customPost}
                                  onChange={(e) =>
                                    setVolunteerForm({
                                      ...volunteerForm,
                                      customPost: e.target.value,
                                    })
                                  }
                                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:border-blue-400 placeholder-gray-400"
                                  required
                                />
                              </div>
                            )}

                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setShowVolunteerForm(false)}
                                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105 font-medium shadow-md hover:shadow-lg"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 font-medium shadow-md hover:shadow-lg"
                              >
                                {editingVolunteerIndex !== null
                                  ? "Update"
                                  : "Submit"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Volunteers List */}
                    {volunteers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-4 border">Name</th>
                              <th className="py-2 px-4 border">Email</th>
                              <th className="py-2 px-4 border">ID/Roll</th>
                              <th className="py-2 px-4 border">Post</th>
                              <th className="py-2 px-4 border">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {volunteers.map((volunteer, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">
                                  {volunteer.name}
                                </td>
                                <td className="py-2 px-4 border">
                                  {volunteer.email}
                                </td>
                                <td className="py-2 px-4 border">
                                  {volunteer.id}
                                </td>
                                <td className="py-2 px-4 border capitalize">
                                  {volunteer.post}
                                </td>
                                <td className="py-2 px-4 border">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => handleEditVolunteer(index)}
                                      className="text-blue-500 hover:text-blue-700"
                                      title="Edit"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVolunteer(index)
                                      }
                                      className="text-red-500 hover:text-red-700"
                                      title="Delete"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        No volunteers added yet
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Control Tab */}
                <TabsContent value="control">
                  <div className="p-4 border rounded mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">
                        Event Management
                      </h2>
                      <button
                        onClick={() => setShowEventForm(true)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        <PlusCircle size={18} /> Add Event
                      </button>
                    </div>

                    {/* Event Form Modal */}
                    {showEventForm && (
                      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="w-full text-white max-w-2xl max-h-[90vh] overflow-y-auto border-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 shadow-2xl">
                          <CardHeader className="flex flex-row items-center justify-between border-b border-white/20 pb-4">
                            <div>
                              <CardTitle className="text-white text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                {editingEventIndex !== null
                                  ? "Edit Event"
                                  : "Create New Event"}
                              </CardTitle>
                              <CardDescription className="text-white/80">
                                {editingEventIndex !== null
                                  ? "Update your event details"
                                  : "Fill in the details for your amazing event"}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowEventForm(false)}
                              className="rounded-full hover:bg-white/10 transition-all"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </CardHeader>

                          <CardContent className="p-6">
                            <form
                              onSubmit={handleEventSubmit}
                              className="space-y-6"
                            >
                              {/* Event Title */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="title"
                                  className="text-white/90 flex items-center gap-2"
                                >
                                  <Star className="h-4 w-4 text-yellow-300" />
                                  Event Title
                                </Label>
                                <Input
                                  id="title"
                                  value={eventForm.title}
                                  onChange={(e) =>
                                    setEventForm({
                                      ...eventForm,
                                      title: e.target.value,
                                    })
                                  }
                                  required
                                  className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                  placeholder="Enter event title"
                                />
                              </div>

                              {/* Description */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="description"
                                  className="text-white/90 flex items-center gap-2"
                                >
                                  <AlignLeft className="h-4 w-4 text-blue-300" />
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  value={eventForm.description}
                                  onChange={(e) =>
                                    setEventForm({
                                      ...eventForm,
                                      description: e.target.value,
                                    })
                                  }
                                  required
                                  rows={4}
                                  className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                  placeholder="Tell people what your event is about..."
                                />
                              </div>

                              {/* Date & Time */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="date"
                                    className="text-white/90 flex items-center gap-2"
                                  >
                                    <Calendar className="h-4 w-4 text-pink-300" />
                                    Date
                                  </Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) =>
                                      setEventForm({
                                        ...eventForm,
                                        date: e.target.value,
                                      })
                                    }
                                    required
                                    className="bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor="time"
                                    className="text-white/90 flex items-center gap-2"
                                  >
                                    <Clock className="h-4 w-4 text-green-300" />
                                    Time
                                  </Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={eventForm.time}
                                    onChange={(e) =>
                                      setEventForm({
                                        ...eventForm,
                                        time: e.target.value,
                                      })
                                    }
                                    required
                                    className="bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {/* Location */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="location"
                                  className="text-white/90 flex items-center gap-2"
                                >
                                  <MapPin className="h-4 w-4 text-red-300" />
                                  Location
                                </Label>
                                <Input
                                  id="location"
                                  value={eventForm.location}
                                  onChange={(e) =>
                                    setEventForm({
                                      ...eventForm,
                                      location: e.target.value,
                                    })
                                  }
                                  required
                                  className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                  placeholder="Where is the event happening?"
                                />
                              </div>

                              {/* Ticket Price */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="ticketPrice"
                                  className="text-white/90 flex items-center gap-2"
                                >
                                  <IndianRupee className="h-4 w-4 text-emerald-300" />
                                  Ticket Price (₹)
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                                    ₹
                                  </span>
                                  <Input
                                    id="ticketPrice"
                                    type="number"
                                    value={eventForm.ticketPrice}
                                    onChange={(e) =>
                                      setEventForm({
                                        ...eventForm,
                                        ticketPrice: e.target.value,
                                      })
                                    }
                                    min="0"
                                    className="bg-white/10 border-white/20 text-white pl-8 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>

                              {/* Event Images */}
                              <div className="space-y-3">
                                <Label className="text-white/90 flex items-center gap-2">
                                  <Image className="h-4 w-4 text-purple-300" />
                                  Event Images
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="url"
                                    placeholder="Paste image URL here"
                                    value={eventForm.newImageUrl}
                                    onChange={(e) =>
                                      setEventForm({
                                        ...eventForm,
                                        newImageUrl: e.target.value,
                                      })
                                    }
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent flex-1"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleAddImageUrl}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-[1.02] font-medium shadow-lg"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                  </Button>
                                </div>

                                {eventForm.imageUrls.length > 0 && (
                                  <div className="mt-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      {eventForm.imageUrls.map((url, index) => (
                                        <div
                                          key={index}
                                          className="relative group"
                                        >
                                          <img
                                            src={url}
                                            alt={`Event image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-white/20 group-hover:border-cyan-400 transition-all"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              handleRemoveImageUrl(index)
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Form Actions */}
                              <div className="flex justify-end gap-3 pt-6">
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => setShowEventForm(false)}
                                  className="border-white/30 text-white hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg transition-all"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg transition-all transform hover:scale-[1.02] font-medium shadow-lg flex items-center gap-2"
                                >
                                  {editingEventIndex !== null ? (
                                    <>
                                      <Save className="h-4 w-4" />
                                      Update Event
                                    </>
                                  ) : (
                                    <>
                                      <PlusCircle className="h-4 w-4" />
                                      Create Event
                                    </>
                                  )}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Events List */}
                    {events.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                          <Card
                            key={event.id}
                            className="group relative hover:shadow-lg transition-shadow duration-300"
                          >
                            <CardContent className="pt-6">
                              {/* Edit/Delete Buttons (shown on hover) */}
                              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEvent(event);
                                  }}
                                  className="h-8 w-8 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEvent(event.id);
                                  }}
                                  className="h-8 w-8 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>

                              {/* Event Content */}
                              <h3 className="font-bold text-xl mb-2 text-gray-800">
                                {event.title}
                              </h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {event.description}
                              </p>

                              {/* Event Details */}
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span>{event.location}</span>
                                </div>
                                {event.ticketPrice && (
                                  <div className="flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-gray-500" />
                                    <span>{event.ticketPrice}</span>
                                  </div>
                                )}
                              </div>

                              {/* Event Images */}
                              {event.imageUrls?.length > 0 && (
                                <div className="mt-4">
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {event.imageUrls.map((url, index) => (
                                      <img
                                        key={index}
                                        src={url}
                                        alt={`Event image ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No events added yet</p>
                        <Button
                          onClick={() => setShowEventForm(true)}
                          className="mt-4"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Event
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  {/* User view content... */}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
