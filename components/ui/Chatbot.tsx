"use client";
import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How may I help you with events today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const eventResponses = {
    "how to create event": "To create an event, go to the Control Event page and click on the 'Add Event' button. Fill in the event details like title, description, date, time, and location.",
    "ticket price": "Ticket prices can be set when creating or editing an event in the Control Event section. You can also manage ticket sales and view purchases in the Event Dashboard.",
    "volunteer": "You can manage volunteers through the Control Event > Volunteer section. Add volunteers, assign roles, and track their participation.",
    "fund collection": "Fund collection for events can be managed through our Fund Collection page. You can track donations, generate reports, and manage all financial aspects.",
    "contact support": "You can reach our support team through the Contact Us page or email us at support@eventify.com",
    "event dashboard": "The Event Dashboard provides analytics, attendance tracking, and overall event performance metrics.",
    "default": "I apologize, I couldn't understand your question. Please try rephrasing or contact our support team for assistance."
  };

  const suggestedQuestions = [
    "How to create event?",
    "What about ticket price?",
    "How to manage volunteer?",
    "How to do fund collection?",
    "How to contact support?",
    "Show event dashboard details"
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, isBot: false };
    const botResponse = { 
      text: findResponse(input.toLowerCase()),
      isBot: true,
      showQuestions: true 
    };
    
    setMessages([...messages, userMessage, botResponse]);
    setInput('');

    // Auto-delete chat after 2 minutes
    setTimeout(() => {
      setMessages([{ text: "Hello! How may I help you with events today?", isBot: true }]);
      setIsOpen(false);
    }, 12000);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
    handleSend();
  };

  const findResponse = (query: string) => {
    for (const [key, value] of Object.entries(eventResponses)) {
      if (query.includes(key)) {
        return value;
      }
    }
    return eventResponses.default;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 max-h-[500px] flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-semibold">May I Help You?</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="grid gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
