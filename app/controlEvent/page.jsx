"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Edit, Upload, X } from "lucide-react";

export default function ControlEvent() {
  // Main form state
  const [formData, setFormData] = useState({
    role: "",
    organizationName: "",
    eventName: "",
    name: "",
    gender: ""
  });

  // UI states
  const [submitted, setSubmitted] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [editingVolunteerIndex, setEditingVolunteerIndex] = useState(null);
  
  // Volunteer management
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    id: "",
    post: "volunteer",
    customPost: ""
  });

  // Event management for Control section
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]); // New state for saved events
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    media: null, // Added for file upload
    mediaType: "", // Added to track if it's image or video
    mediaPreview: "" // Added for preview
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);

  // Load saved events from localStorage on component mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('savedEvents');
    if (storedEvents) {
      setSavedEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle volunteer form changes
  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteerForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle event form changes
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload for events
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is image or video
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      alert('Please upload an image or video file');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setEventForm(prev => ({
      ...prev,
      media: file,
      mediaType: fileType,
      mediaPreview: previewUrl
    }));
  };

  // Submit main form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save the current event data to saved events
    const newSavedEvent = {
      organizationName: formData.organizationName,
      eventName: formData.eventName,
      role: formData.role,
      name: formData.name,
      gender: formData.gender,
      id: Date.now()
    };
    
    const updatedSavedEvents = [...savedEvents, newSavedEvent];
    setSavedEvents(updatedSavedEvents);
    localStorage.setItem('savedEvents', JSON.stringify(updatedSavedEvents));
    
    setSubmitted(true);
  };

  // Submit volunteer form
  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    const newVolunteer = {
      ...volunteerForm,
      post: volunteerForm.post === "other" ? volunteerForm.customPost : volunteerForm.post
    };

    if (editingVolunteerIndex !== null) {
      // Update existing volunteer
      const updatedVolunteers = [...volunteers];
      updatedVolunteers[editingVolunteerIndex] = newVolunteer;
      setVolunteers(updatedVolunteers);
      setEditingVolunteerIndex(null);
    } else {
      // Add new volunteer
      setVolunteers([...volunteers, newVolunteer]);
    }

    // Reset form
    setVolunteerForm({
      name: "",
      email: "",
      id: "",
      post: "volunteer",
      customPost: ""
    });
    setShowVolunteerForm(false);
  };

  // Submit event form
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventForm,
      id: Date.now(),
      // Don't include the File object in the state as it's not serializable
      media: eventForm.media ? {
        name: eventForm.media.name,
        type: eventForm.mediaType,
        preview: eventForm.mediaPreview
      } : null
    };

    if (editingEventIndex !== null) {
      // Update existing event
      const updatedEvents = [...events];
      updatedEvents[editingEventIndex] = newEvent;
      setEvents(updatedEvents);
      setEditingEventIndex(null);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }

    // Reset form
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      media: null,
      mediaType: "",
      mediaPreview: ""
    });
    setShowEventForm(false);
  };

  // Edit volunteer
  const handleEditVolunteer = (index) => {
    const volunteer = volunteers[index];
    setVolunteerForm({
      name: volunteer.name,
      email: volunteer.email,
      id: volunteer.id,
      post: ["event coordinator", "vice event coordinator", "discipline head", "photography & media head", "volunteer"].includes(volunteer.post) 
        ? volunteer.post 
        : "other",
      customPost: ["event coordinator", "vice event coordinator", "discipline head", "photography & media head", "volunteer"].includes(volunteer.post)
        ? ""
        : volunteer.post
    });
    setEditingVolunteerIndex(index);
    setShowVolunteerForm(true);
  };

  // Delete volunteer
  const handleDeleteVolunteer = (index) => {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      setVolunteers(volunteers.filter((_, i) => i !== index));
    }
  };

  // Edit event
  const handleEditEvent = (index) => {
    const event = events[index];
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      media: event.media, // This will be the stored media info, not the File object
      mediaType: event.media?.type || "",
      mediaPreview: event.media?.preview || ""
    });
    setEditingEventIndex(index);
    setShowEventForm(true);
  };

  // Delete event
  const handleDeleteEvent = (index) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  // Edit saved event
  const handleEditSavedEvent = (index) => {
    const event = savedEvents[index];
    setFormData({
      role: event.role,
      organizationName: event.organizationName,
      eventName: event.eventName,
      name: event.name,
      gender: event.gender
    });
    
    // Remove from saved events
    const updatedSavedEvents = savedEvents.filter((_, i) => i !== index);
    setSavedEvents(updatedSavedEvents);
    localStorage.setItem('savedEvents', JSON.stringify(updatedSavedEvents));
    
    setSubmitted(false);
  };

  // Delete saved event
  const handleDeleteSavedEvent = (index) => {
    if (confirm("Are you sure you want to delete this saved event?")) {
      const updatedSavedEvents = savedEvents.filter((_, i) => i !== index);
      setSavedEvents(updatedSavedEvents);
      localStorage.setItem('savedEvents', JSON.stringify(updatedSavedEvents));
    }
  };

  // Initial form (not submitted yet)
  if (!submitted) {
    return (
      <div className="flex">
        {/* Saved Events Sidebar */}
        {savedEvents.length > 0 && (
          <div className="w-1/4 p-4 border-r">
            <h2 className="text-lg font-bold mb-4">Saved Events</h2>
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
          </div>
        )}
        
        {/* Main Form */}
        <div className={`m-3 px-3 ${savedEvents.length > 0 ? 'w-3/4' : 'w-full'}`}>
          <h1 className="text-xl font-bold m-2 text-red-700">Event Registration Form</h1>
          <div className="mt-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Your Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
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
      {savedEvents.length > 0 && (
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Saved Events</h2>
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
        </div>
      )}
      
      {/* Main Content */}
      <div className={`m-3 px-3 ${savedEvents.length > 0 ? 'w-3/4' : 'w-full'}`}>
        <h1 className="text-xl font-bold m-2 text-red-700">
          {formData.organizationName} - {formData.eventName}
        </h1>
        
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Welcome, {formData.name}!</h2>
          <p>Role: {formData.role === 'admin' ? 'Administrator' : 'User'}</p>
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
                <p>Administrator privileges and tools</p>
              </div>
            </TabsContent>
            
            {/* Volunteer Tab */}
            <TabsContent value="volunteer">
              <div className="p-4 border rounded mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Volunteer Management</h2>
                  <button 
                    onClick={() => setShowVolunteerForm(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded"
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
                        <button onClick={() => setShowVolunteerForm(false)}>
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
                            onChange={handleVolunteerChange}
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
                            onChange={handleVolunteerChange}
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
                            onChange={handleVolunteerChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Post</label>
                          <select
                            name="post"
                            value={volunteerForm.post}
                            onChange={handleVolunteerChange}
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
                              onChange={handleVolunteerChange}
                              className="w-full p-2 border rounded"
                              required={volunteerForm.post === "other"}
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowVolunteerForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
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
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded"
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
                        <button onClick={() => setShowEventForm(false)}>
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
                            onChange={handleEventChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            name="description"
                            value={eventForm.description}
                            onChange={handleEventChange}
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
                              onChange={handleEventChange}
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
                              onChange={handleEventChange}
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
                            onChange={handleEventChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>

                        {/* Media Upload Section */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Upload Image/Video
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 border rounded p-2 cursor-pointer hover:bg-gray-100">
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
                                onClick={() => setEventForm(prev => ({
                                  ...prev,
                                  media: null,
                                  mediaType: "",
                                  mediaPreview: ""
                                }))}
                                className="text-red-500 text-sm mt-1"
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
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                          >
                            {editingEventIndex !== null ? "Update" : "Submit"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Events List */}
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, index) => (
                      <div key={event.id} className="border rounded p-4 relative group">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditEvent(index)}
                            className="bg-blue-500 text-white p-1 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(index)}
                            className="bg-red-500 text-white p-1 rounded"
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
                        </div>
                        {event.media?.preview && (
                          <div className="mt-3">
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
            <h2 className="text-lg font-semibold">User Dashboard</h2>
            <p>Welcome to your user account</p>
          </div>
        )}
      </div>
    </div>
  );
}