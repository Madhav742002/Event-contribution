"use client";

import { useState } from "react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMsg(data.message);
      setLoading(false);

      if (res.ok) {
        setFormData({ subject: "", email: "", message: ""});
      }
    } catch (error) {
      setResponseMsg("Something went wrong, please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 md:px-16 lg:px-32">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-3xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="bg-yellow-200 p-10 flex flex-col justify-center md:w-1/3 text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">We are here for you</h2>
          <p className="text-gray-700 text-lg">
            If you have an inquiry regarding Eventify, we’ll help you find the
            right answer in no time.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-10 md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Do you want to know more or contact us?
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-gray-700"
            >
              <option value="">Select a Subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Collaboration">Collaboration</option>
            </select>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg text-gray-700"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your question here..."
              className="w-full p-3 border rounded-lg text-gray-700 h-24"
              required
            ></textarea>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <label className="text-gray-700">I agree to the terms and conditions</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {responseMsg && <p className="mt-4 text-center text-gray-700">{responseMsg}</p>}

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mt-6 text-2xl text-gray-600">
            <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/yourwhatsapp" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
