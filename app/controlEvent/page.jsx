"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Trash2,
  Edit,
  X,
  IndianRupee,
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
  // 1. All hooks at the top, unconditionally
  const router = useRouter();

  // State hooks
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    role: "",
    organizationName: "",
    eventName: "",
    name: "",
    email: "",
    userId: "",
    gender: "",
  });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  
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

  // const [paymentForm, setPaymentForm] = useState({
  //   name: "",
  //   email: "",
  //   paymentMethod: "credit_card",
  //   transactionId: "",
  // });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  

  const initialEventFormState = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    ticketPrice: "",
    imageUrls: [],
  };

  // Effect hooks
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/get-user");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      }
    }
    fetchUserData();
  }, []);

  
//   total amount
useEffect(() => {
  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch("/api/payment");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTotalRevenue(data.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError("Failed to fetch payment details. Please try again later.");
    }
  };
  
  fetchPaymentDetails();
}, []);
  
useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await fetch("/api/payment");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.payments) {
            const sortedPayments = data.payments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10);
            setRecentPayments(sortedPayments);
          }
        }
      } catch (error) {
        console.error("Error fetching recent payments:", error);
        setError("Failed to fetch recent payments. Please try again later.");
      }
    };
    fetchRecentPayments();
  }, []);

  // useEffect(() => {
  //   const fetchMyPayments = async () => {
  //     try {
  //       const response = await fetch("/api/payment?createdBy=me");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch payments");
  //       }
  //       const data = await response.json();
  //       if (data && Array.isArray(data.payments)) {
  //         setRecentPayments(data.payments);
  //       } else {
  //         setRecentPayments([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching payments:", error);
  //       setError("Failed to load payment records.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMyPayments();
  // }, []);

  const handleAddImageUrl = () => {
    if (eventForm.newImageUrl.trim()) {
      setEventForm({
        ...eventForm,
        imageUrls: [...eventForm.imageUrls, eventForm.newImageUrl.trim()],
        newImageUrl: "",
      });
    }
  };
  
  const handleRemoveImageUrl = (index) => {
    const updatedImageUrls = [...eventForm.imageUrls];
    updatedImageUrls.splice(index, 1);
    setEventForm({
      ...eventForm,
      imageUrls: updatedImageUrls,
    });
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/get-events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      } else {
        setError("Failed to load events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Then use it in both useEffect and handleEventSubmit
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let endpoint = "/api/create-events";
      let method = "POST";
      
      if (editingEventIndex !== null) {
        endpoint = `/api/events/${eventForm.id}`;
        method = "PUT";
      }
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventForm),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process event");
      }
  
      const data = await response.json();
      alert(
        editingEventIndex !== null 
          ? "Event updated successfully!" 
          : "Event created successfully!"
      );
      
      // Reset form and refresh events
      setEventForm(initialEventFormState);
      setShowEventForm(false);
      setEditingEventIndex(null);
      fetchEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
      alert(error.message || 
        `Failed to ${editingEventIndex !== null ? "update" : "create"} event. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Update handleDeleteEvent to use the correct endpoint
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete event");
        }
  
        alert("Event deleted successfully!");
        fetchEvents(); // Refresh the events list
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(error.message || "Failed to delete event. Please try again later.");
      }
    }
  };
  const handleEditEvent = (event) => {
    setEventForm({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      ticketPrice: event.ticketPrice || "0",
      imageUrls: event.imageUrls || [],
      newImageUrl: "", // Reset the new image URL field
    });
    setEditingEventIndex(events.findIndex((e) => e.id === event.id));
    setShowEventForm(true);
  };

  // Ensure handleEditEvent works correctly

  if (loading) {
    return <p className="text-center py-8 text-gray-500 p-40">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  if (!formData) {
    return <div>Loading...</div>;
  }

  // Main render return
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.organizationName || "Evenify"} -{" "}
                  {formData.eventName || "Your Events"}
                </h1>
                <p className="text-gray-600">Welcome, {formData.name}!</p>
              </div>
            </div>

            <Tabs defaultValue="admin" className="w-full p-5">
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger value="admin">Admin</TabsTrigger>
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
                          <span className="text-sm opacity-80">All Events</span>
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
                                        There are no recent payments to display
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
                              Showing <span className="font-medium">1</span> to{" "}
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

             
              

              {/* Control Tab */}
              <TabsContent value="control">
                <div className="p-4 border rounded mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Event Management</h2>
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
                      {events.map((event) => (
                        <Card
                          key={event.id}
                          className="group relative hover:shadow-lg transition-shadow duration-300"
                        >
                          <CardContent className="pt-6">
                            {/* Edit/Delete Buttons */}
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

                            {/* Event Title and Description */}
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
                                  {event.imageUrls.map((url, idx) => (
                                    <img
                                      key={idx}
                                      src={url}
                                      alt={`Event image ${idx + 1}`}
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
                      <p className="text-gray-500">No events added yet.</p>
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

            <Card>
              <CardContent className="pt-6">
                {/* User view content... */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
