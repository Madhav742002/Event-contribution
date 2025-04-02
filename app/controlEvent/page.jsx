"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Edit, Upload, X, LogOut, Search, Ticket, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ControlEvent() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Main states initialized with data from localStorage
  const [formData, setFormData] = useState({
    role: "",
    organizationName: "",
    eventName: "",
    name: "",
    gender: "",
    email: "",
    userId: "" // Added unique user ID
  });
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
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
    customPost: ""
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    media: null,
    mediaType: "",
    mediaPreview: "",
    ticketPrice: "",
    ticketDesign: null,
    ticketDesignPreview: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    name: "",
    email: "",
    amount: "",
    paymentMethod: "credit_card",
    transactionId: ""
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    const loadInitialState = () => {
      if (typeof window !== 'undefined') {
        const savedFormData = localStorage.getItem('currentUser');
        const storedVolunteers = localStorage.getItem('volunteers');
        const storedEvents = localStorage.getItem('events');
        const storedSavedEvents = localStorage.getItem('savedEvents');
        const storedPayments = localStorage.getItem('payments');
        const loginStatus = localStorage.getItem('isLoggedIn');

        if (savedFormData) {
          const parsed = JSON.parse(savedFormData);
          // Generate user ID if not exists
          const userId = parsed.userId || Date.now().toString();
          setFormData({
            role: parsed.role || "",
            organizationName: parsed.organizationName || "",
            eventName: parsed.eventName || "",
            name: parsed.name || "",
            gender: parsed.gender || "",
            email: parsed.email || "",
            userId: userId
          });
          // Update localStorage with generated ID if it wasn't there
          if (!parsed.userId) {
            localStorage.setItem('currentUser', JSON.stringify({
              ...parsed,
              userId: userId
            }));
          }
        }
        if (storedVolunteers) setVolunteers(JSON.parse(storedVolunteers) || []);
        if (storedEvents) setEvents(JSON.parse(storedEvents) || []);
        if (storedSavedEvents) setSavedEvents(JSON.parse(storedSavedEvents) || []);
        if (storedPayments) setPayments(JSON.parse(storedPayments) || []);
        if (loginStatus === 'true') setSubmitted(true);
      }
    };
    loadInitialState();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('currentUser', JSON.stringify(formData));
      localStorage.setItem('volunteers', JSON.stringify(volunteers));
      localStorage.setItem('events', JSON.stringify(events));
      localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
      localStorage.setItem('payments', JSON.stringify(payments));
    }
  }, [formData, volunteers, events, savedEvents, payments, isClient]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (eventForm.mediaPreview) URL.revokeObjectURL(eventForm.mediaPreview);
      if (eventForm.ticketDesignPreview) URL.revokeObjectURL(eventForm.ticketDesignPreview);
    };
  }, [eventForm.mediaPreview, eventForm.ticketDesignPreview]);

  // Helper functions
  const getOrganizationEvents = () => {
    return events.filter(event => event.createdBy === formData.organizationName);
  };

  const getFilteredEvents = () => {
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getUserTickets = () => {
    return payments.filter(payment => payment.userId === formData.userId);
  };

  const handleDeleteTicket = (ticketId) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      const updatedPayments = payments.filter(payment => payment.id !== ticketId);
      setPayments(updatedPayments);
    }
  };

  // Event handlers
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('isLoggedIn');
      setSubmitted(false);
      router.push('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = Date.now().toString(); // Generate unique user ID
    const newSavedEvent = {
      ...formData,
      id: Date.now().toString(),
      userId: userId
    };
    
    const existingIndex = savedEvents.findIndex(
      event => event.organizationName === formData.organizationName && 
              event.eventName === formData.eventName
    );
    
    let updatedSavedEvents;
    if (existingIndex >= 0) {
      updatedSavedEvents = [...savedEvents];
      updatedSavedEvents[existingIndex] = newSavedEvent;
    } else {
      updatedSavedEvents = [...savedEvents, newSavedEvent];
    }
    
    setSavedEvents(updatedSavedEvents);
    setFormData(prev => ({ ...prev, userId }));
    localStorage.setItem('isLoggedIn', 'true');
    setSubmitted(true);
  };

  const handleEditSavedEvent = (index) => {
    const eventToEdit = savedEvents[index];
    setFormData({
      role: eventToEdit.role || "",
      organizationName: eventToEdit.organizationName || "",
      eventName: eventToEdit.eventName || "",
      name: eventToEdit.name || "",
      gender: eventToEdit.gender || "",
      email: eventToEdit.email || "",
      userId: eventToEdit.userId || Date.now().toString()
    });
    setSubmitted(false);
  };

  const handleDeleteSavedEvent = (index) => {
    if (confirm("Are you sure you want to delete this saved event?")) {
      const updatedSavedEvents = [...savedEvents];
      updatedSavedEvents.splice(index, 1);
      setSavedEvents(updatedSavedEvents);
    }
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    const newVolunteer = {
      ...volunteerForm,
      post: volunteerForm.post === "other" ? volunteerForm.customPost : volunteerForm.post
    };

    if (editingVolunteerIndex !== null) {
      const updatedVolunteers = [...volunteers];
      updatedVolunteers[editingVolunteerIndex] = newVolunteer;
      setVolunteers(updatedVolunteers);
    } else {
      setVolunteers([...volunteers, newVolunteer]);
    }

    setVolunteerForm({
      name: "",
      email: "",
      id: "",
      post: "volunteer",
      customPost: ""
    });
    setShowVolunteerForm(false);
    setEditingVolunteerIndex(null);
  };

  const handleEditVolunteer = (index) => {
    const volunteer = volunteers[index];
    setVolunteerForm({
      name: volunteer.name || "",
      email: volunteer.email || "",
      id: volunteer.id || "",
      post: volunteer.post || "volunteer",
      customPost: volunteer.post || ""
    });
    setEditingVolunteerIndex(index);
    setShowVolunteerForm(true);
  };

  const handleDeleteVolunteer = (index) => {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      const updatedVolunteers = [...volunteers];
      updatedVolunteers.splice(index, 1);
      setVolunteers(updatedVolunteers);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : '';
    
    if (!fileType) {
      alert('Please upload an image or video file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setEventForm({
      ...eventForm,
      media: file,
      mediaType: fileType,
      mediaPreview: previewUrl
    });
  };

  const handleTicketDesignUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file for ticket design');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setEventForm({
      ...eventForm,
      ticketDesign: file,
      ticketDesignPreview: previewUrl
    });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventForm,
      id: Date.now().toString(),
      createdBy: formData.organizationName,
      media: eventForm.media ? {
        name: eventForm.media.name,
        type: eventForm.mediaType,
        preview: eventForm.mediaPreview
      } : null,
      ticketDesign: eventForm.ticketDesign ? {
        name: eventForm.ticketDesign.name,
        preview: eventForm.ticketDesignPreview
      } : null
    };

    if (editingEventIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingEventIndex] = newEvent;
      setEvents(updatedEvents);
    } else {
      setEvents([...events, newEvent]);
    }

    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      media: null,
      mediaType: "",
      mediaPreview: "",
      ticketPrice: "",
      ticketDesign: null,
      ticketDesignPreview: ""
    });
    setShowEventForm(false);
    setEditingEventIndex(null);
  };

  const handleDeleteEvent = (index) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = [...events];
      updatedEvents.splice(index, 1);
      setEvents(updatedEvents);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: Date.now().toString(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      userName: paymentForm.name || formData.name,
      userEmail: paymentForm.email || formData.email,
      userId: formData.userId, // Store user ID with payment
      amount: selectedEvent.ticketPrice,
      paymentMethod: paymentForm.paymentMethod,
      transactionId: paymentForm.transactionId,
      date: new Date().toISOString(),
      organization: selectedEvent.createdBy
    };

    setPayments([...payments, newPayment]);
    setPaymentForm({
      name: "",
      email: "",
      amount: "",
      paymentMethod: "credit_card",
      transactionId: ""
    });
    setSelectedEvent(null);
    setShowPaymentForm(false);
  };

  // Only render the UI on the client-side
  if (!isClient) {
    return null;
  }

  // Initial form (not submitted yet)
  if (!submitted) {
    return (
      <div className="flex">
        {/* Saved Events Sidebar */}
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Saved Events</h2>
          {savedEvents.length > 0 ? (
            <div className="space-y-3">
              {savedEvents.map((event, index) => (
                <div key={event.id} className="border p-3 rounded-lg relative group">
                  <h3 className="font-semibold">{event.organizationName}</h3>
                  <p className="text-sm">{event.eventName}</p>
                  <p className="text-xs text-gray-500">{event.role}</p>
                  
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditSavedEvent(index)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSavedEvent(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No saved events yet</p>
          )}
        </div>
        
        {/* Main Form */}
        <div className="w-3/4 m-3 px-3">
          <h1 className="text-xl font-bold m-2 text-red-700">Event Registration Form</h1>
          <div className="mt-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Your Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard after submission
  return (
    <div className="flex">
      {/* Saved Events Sidebar */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Saved Events</h2>
        {savedEvents.length > 0 ? (
          <div className="space-y-3">
            {savedEvents.map((event, index) => (
              <div key={event.id} className="border p-3 rounded-lg relative group">
                <h3 className="font-semibold">{event.organizationName}</h3>
                <p className="text-sm">{event.eventName}</p>
                <p className="text-xs text-gray-500">{event.role}</p>
                
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditSavedEvent(index)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSavedEvent(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No saved events yet</p>
        )}
      </div>
      
      {/* Main Content */}
      <div className="w-3/4 m-3 px-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-red-700">
            {formData.organizationName} - {formData.eventName}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Welcome, {formData.name}!</h2>
          <p>Role: {formData.role === 'admin' ? 'Administrator' : 'User'}</p>
          <p>Email: {formData.email}</p>
        </div>

        {formData.role === 'admin' ? (
          <Tabs defaultValue="admin" className="w-full">
            <TabsList>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger value="control">Control</TabsTrigger>
            </TabsList>
            
            {/* Admin Tab */}
            <TabsContent value="admin">
              <div className="p-4 border rounded mt-4">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="border rounded p-4">
                    <h3 className="font-medium">Total Events</h3>
                    <p className="text-2xl font-bold">{getOrganizationEvents().length}</p>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-medium">Total Volunteers</h3>
                    <p className="text-2xl font-bold">{volunteers.length}</p>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold flex items-center">
                      <IndianRupee size={20} className="mr-1" />
                      {payments
                        .filter(p => p.organization === formData.organizationName)
                        .reduce((sum, payment) => sum + Number(payment.amount), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Volunteer Tab */}
            <TabsContent value="volunteer">
              <div className="p-4 border rounded mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Volunteer Management</h2>
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
                          {editingVolunteerIndex !== null ? "Edit Member" : "Add Member"}
                        </h3>
                        <button 
                          onClick={() => setShowVolunteerForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={volunteerForm.name}
                            onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={volunteerForm.email}
                            onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">ID/Roll Number</label>
                          <input
                            type="text"
                            name="id"
                            value={volunteerForm.id}
                            onChange={(e) => setVolunteerForm({...volunteerForm, id: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Post</label>
                          <select
                            name="post"
                            value={volunteerForm.post}
                            onChange={(e) => setVolunteerForm({...volunteerForm, post: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value="event coordinator">Event Coordinator</option>
                            <option value="vice event coordinator">Vice Event Coordinator</option>
                            <option value="discipline head">Discipline Head</option>
                            <option value="photography & media head">Photography & Media Head</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        {volunteerForm.post === "other" && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Specify Post</label>
                            <input
                              type="text"
                              name="customPost"
                              value={volunteerForm.customPost}
                              onChange={(e) => setVolunteerForm({...volunteerForm, customPost: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowVolunteerForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                          >
                            {editingVolunteerIndex !== null ? "Update" : "Submit"}
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
                            <td className="py-2 px-4 border">{volunteer.name}</td>
                            <td className="py-2 px-4 border">{volunteer.email}</td>
                            <td className="py-2 px-4 border">{volunteer.id}</td>
                            <td className="py-2 px-4 border capitalize">{volunteer.post}</td>
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
                                  onClick={() => handleDeleteVolunteer(index)}
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
                  <p className="text-center py-4 text-gray-500">No volunteers added yet</p>
                )}
              </div>
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
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">
                          {editingEventIndex !== null ? "Edit Event" : "Add Event"}
                        </h3>
                        <button 
                          onClick={() => setShowEventForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <form onSubmit={handleEventSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Event Title</label>
                          <input
                            type="text"
                            name="title"
                            value={eventForm.title}
                            onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            name="description"
                            value={eventForm.description}
                            onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                            className="w-full p-2 border rounded"
                            rows="3"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                              type="date"
                              name="date"
                              value={eventForm.date}
                              onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <input
                              type="time"
                              name="time"
                              value={eventForm.time}
                              onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                              className="w-full p-2 border rounded"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={eventForm.location}
                            onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Ticket Price (₹)</label>
                          <input
                            type="number"
                            name="ticketPrice"
                            value={eventForm.ticketPrice || ""}
                            onChange={(e) => setEventForm({...eventForm, ticketPrice: e.target.value})}
                            className="w-full p-2 border rounded"
                            min="0"
                          />
                        </div>

                        {/* Media Upload Section */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Upload Event Image/Video
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 border rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                              <Upload size={16} />
                              <span>Choose File</span>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                            {eventForm.media && (
                              <span className="text-sm">{eventForm.media.name}</span>
                            )}
                          </div>
                          {eventForm.mediaPreview && (
                            <div className="mt-2">
                              {eventForm.mediaType === 'image' ? (
                                <img 
                                  src={eventForm.mediaPreview} 
                                  alt="Preview" 
                                  className="max-h-40 rounded"
                                />
                              ) : (
                                <video 
                                  src={eventForm.mediaPreview} 
                                  controls 
                                  className="max-h-40 rounded"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => setEventForm({
                                  ...eventForm,
                                  media: null,
                                  mediaType: "",
                                  mediaPreview: ""
                                })}
                                className="text-red-500 text-sm mt-1 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Ticket Design Upload */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Upload Ticket Design (Image)
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 border rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                              <Upload size={16} />
                              <span>Choose Design</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleTicketDesignUpload}
                                className="hidden"
                              />
                            </label>
                            {eventForm.ticketDesign && (
                              <span className="text-sm">{eventForm.ticketDesign.name}</span>
                            )}
                          </div>
                          {eventForm.ticketDesignPreview && (
                            <div className="mt-2">
                              <img 
                                src={eventForm.ticketDesignPreview} 
                                alt="Ticket Design Preview" 
                                className="max-h-40 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => setEventForm({
                                  ...eventForm,
                                  ticketDesign: null,
                                  ticketDesignPreview: ""
                                })}
                                className="text-red-500 text-sm mt-1 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowEventForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                          >
                            {editingEventIndex !== null ? "Update" : "Submit"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Events List */}
                {getOrganizationEvents().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOrganizationEvents().map((event, index) => (
                      <div key={event.id} className="border rounded p-4 relative group hover:shadow-md transition-shadow">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEventForm({
                                title: event.title,
                                description: event.description,
                                date: event.date,
                                time: event.time,
                                location: event.location,
                                media: event.media,
                                mediaType: event.media?.type || "",
                                mediaPreview: event.media?.preview || "",
                                ticketPrice: event.ticketPrice || "",
                                ticketDesign: event.ticketDesign,
                                ticketDesignPreview: event.ticketDesign?.preview || ""
                              });
                              setEditingEventIndex(index);
                              setShowEventForm(true);
                            }}
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(index)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        <div className="text-sm">
                          <p><span className="font-medium">Date:</span> {event.date}</p>
                          <p><span className="font-medium">Time:</span> {event.time}</p>
                          <p><span className="font-medium">Location:</span> {event.location}</p>
                          {event.ticketPrice && (
                            <p><span className="font-medium">Ticket Price:</span> ₹{event.ticketPrice}</p>
                          )}
                        </div>
                        {event.media?.preview && (
                          <div className="mt-3">
                            <h4 className="font-medium mb-2">Event Media:</h4>
                            {event.media.type === 'image' ? (
                              <img 
                                src={event.media.preview} 
                                alt="Event media" 
                                className="w-full h-auto rounded"
                              />
                            ) : (
                              <video 
                                src={event.media.preview} 
                                controls 
                                className="w-full h-auto rounded"
                              />
                            )}
                          </div>
                        )}
                        {event.ticketDesign?.preview && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="font-medium mb-2">Ticket Design:</h4>
                            <img 
                              src={event.ticketDesign.preview} 
                              alt="Ticket Design" 
                              className="w-full h-auto rounded border"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No events added yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4 border rounded mt-4">
            {showPaymentForm && selectedEvent ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">Purchase Ticket for {selectedEvent.title}</h2>
                
                <div className="mb-6 border rounded p-4">
                  <h3 className="font-bold text-lg mb-2">{selectedEvent.title}</h3>
                  <p className="text-gray-600 mb-3">{selectedEvent.description}</p>
                  <div className="text-sm">
                    <p><span className="font-medium">Date:</span> {selectedEvent.date}</p>
                    <p><span className="font-medium">Time:</span> {selectedEvent.time}</p>
                    <p><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                    <p className="flex items-center">
                      <span className="font-medium">Ticket Price:</span> 
                      <IndianRupee size={16} className="mx-1" />
                      {selectedEvent.ticketPrice}
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                     type="text"
                     name="name"
                      value={paymentForm.name || formData.name || ""}
                      onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={paymentForm.email || formData.email}
                      onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="net_banking">Net Banking</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction ID</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="Enter payment reference number"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setSelectedEvent(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4 gap-2">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                </div>
                
                {getFilteredEvents().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredEvents().map((event, index) => (
                      <div key={event.id} className="border rounded p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <div className="text-sm mb-3">
                          <p><span className="font-medium">Date:</span> {event.date}</p>
                          <p><span className="font-medium">Time:</span> {event.time}</p>
                          <p><span className="font-medium">Location:</span> {event.location}</p>
                          <p><span className="font-medium">Organizer:</span> {event.createdBy}</p>
                          {event.ticketPrice && (
                            <p className="flex items-center">
                              <span className="font-medium">Ticket Price:</span> 
                              <IndianRupee size={16} className="mx-1" />
                              {event.ticketPrice}
                            </p>
                          )}
                        </div>
                        {event.media?.preview && (
                          <div className="mb-3">
                            {event.media.type === 'image' ? (
                              <img 
                                src={event.media.preview} 
                                alt="Event media" 
                                className="w-full h-auto rounded"
                              />
                            ) : (
                              <video 
                                src={event.media.preview} 
                                controls 
                                className="w-full h-auto rounded"
                              />
                            )}
                          </div>
                        )}
                        {event.ticketPrice && (
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowPaymentForm(true);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded w-full justify-center hover:bg-blue-600 transition-colors"
                          >
                            <Ticket size={18} /> Buy Ticket
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No events found</p>
                )}
                
                {/* User's Tickets Section */}
                {getUserTickets().length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Ticket size={20} /> Your Tickets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getUserTickets().map((ticket, index) => (
                        <div key={index} className="border rounded p-4 bg-gray-50 relative group">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete Ticket"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{ticket.eventTitle}</h3>
                          <div className="text-sm">
                            <p><span className="font-medium">Amount:</span> ₹{ticket.amount}</p>
                            <p><span className="font-medium">Payment Method:</span> {ticket.paymentMethod.replace('_', ' ')}</p>
                            <p><span className="font-medium">Transaction ID:</span> {ticket.transactionId}</p>
                            <p><span className="font-medium">Date:</span> {new Date(ticket.date).toLocaleString()}</p>
                            <p><span className="font-medium">Organizer:</span> {ticket.organization}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}