//components/chatbot/Chatbot.jsx
import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm EduStay Assistant. How can I help you find accommodation?", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState("");

    const predefinedResponses = {
        "hello": "Hello! Welcome to EduStay - your trusted student accommodation platform. I can help you find verified, budget-friendly housing near universities.",
        "hi": "Hi there! I'm here to help you find the perfect student accommodation. What would you like to know?",
        "help": "I can assist you with:\n• Property search by city/university\n• Booking process and requirements\n• Account registration and login\n• Property verification details\n• Pricing and payment options\n• Safety and security features",
        "price": "EduStay offers budget-friendly accommodation starting from ₹8,000-₹25,000 per month depending on location, amenities, and room type. Prices include utilities and WiFi.",
        "pricing": "Our pricing ranges:\n• Shared rooms: ₹8,000-₹15,000/month\n• Private rooms: ₹12,000-₹20,000/month\n• Studio apartments: ₹18,000-₹25,000/month\nAll prices include utilities, WiFi, and security.",
        "booking": "To book accommodation:\n1. Register/Login to EduStay\n2. Search properties by city/university\n3. View verified listings with photos\n4. Contact property owner\n5. Complete secure online booking\n6. Pay deposit through our platform",
        "how to book": "Booking is simple:\n1. Create your EduStay account\n2. Browse verified properties\n3. Schedule property visits\n4. Submit booking request\n5. Pay security deposit\n6. Move in with confidence!",
        "register": "To register on EduStay:\n1. Click 'Register' button\n2. Enter name, email, phone, password\n3. Verify your email\n4. Complete your profile\n5. Start searching for accommodation!",
        "login": "To login: Click 'Login' button and enter your registered email and password. Your session is secure with 30-minute auto-logout for safety.",
        "contact": "Contact EduStay:\n📧 Email: support@edustay.com\n📱 Phone: +91-9876543210\n🕒 Support Hours: 9 AM - 9 PM\n💬 Live Chat: Right here!",
        "cities": "We serve major student cities:\n• Delhi NCR • Mumbai • Bangalore\n• Chennai • Pune • Hyderabad\n• Kolkata • Ahmedabad • Kota\n• Coimbatore • Manipal • Vellore",
        "safety": "EduStay ensures safety through:\n• Verified property owners\n• Police verification of tenants\n• 24/7 security in properties\n• CCTV surveillance\n• Emergency contact system\n• Regular property inspections",
        "verified": "All EduStay properties are verified for:\n✅ Legal documentation\n✅ Safety standards\n✅ Basic amenities\n✅ Owner background check\n✅ Property condition\n✅ Neighborhood safety",
        "amenities": "Standard amenities include:\n• High-speed WiFi\n• 24/7 electricity backup\n• Water supply\n• Security services\n• Laundry facilities\n• Common areas\n• Kitchen access (in shared accommodations)",
        "payment": "Payment options:\n• Online UPI/Net Banking\n• Credit/Debit cards\n• EMI options available\n• Security deposit: 1-2 months rent\n• No hidden charges\n• Transparent pricing",
        "refund": "Refund policy:\n• Full refund if cancelled 7+ days before move-in\n• 50% refund if cancelled 3-7 days before\n• Security deposit refunded after checkout\n• Processing time: 5-7 business days",
        "student": "EduStay is designed specifically for students with:\n• Budget-friendly options\n• Study-friendly environment\n• Proximity to colleges\n• Student community\n• Flexible lease terms\n• Academic year contracts",
        "features": "EduStay platform features:\n🔍 Smart property search\n✅ Verified listings only\n📱 Mobile-friendly interface\n🔐 Secure JWT authentication\n⏰ 30-minute session timeout\n📊 User dashboard\n💬 24/7 chat support",
        "default": "I'm your EduStay assistant! Ask me about:\n• Property search & booking\n• Pricing & payments\n• Safety & verification\n• Cities & locations\n• Registration & login\n• Amenities & features\n\nWhat would you like to know?"
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            const newMessages = [...messages, { text: inputMessage, sender: "user" }];
            setMessages(newMessages);
            setInputMessage("");
            
            // Show typing indicator
            setMessages([...newMessages, { text: "Typing...", sender: "bot", isTyping: true }]);
            
            try {
                const botResponse = await getBotResponse(inputMessage);
                setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
            } catch (error) {
                setMessages([...newMessages, { text: "Sorry, I'm having trouble right now. Please try again later.", sender: "bot" }]);
            }
        }
    };

    const getBotResponse = async (userInput) => {
        const lowerInput = userInput.toLowerCase();
        
        // Check predefined responses
        for (const [key, response] of Object.entries(predefinedResponses)) {
            if (lowerInput.includes(key)) {
                return response;
            }
        }
        
        return predefinedResponses.default;
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h4>EduStay Assistant</h4>
                        <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender} ${message.isTyping ? 'typing' : ''}`}>
                                <div className="message-text">{message.text}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
            
            <button 
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>
        </div>
    );
}