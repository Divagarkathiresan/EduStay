import React, { useState } from 'react';
import './ContactUs.css';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-container">
            <div className="contact-hero">
                <h1>Contact Us</h1>
                <p>Get in touch with the EduStay team</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <h2>Get In Touch</h2>
                    <div className="contact-item">
                        <h3>📧 Email</h3>
                        <p>support@edustay.com</p>
                    </div>
                    <div className="contact-item">
                        <h3>📱 Phone</h3>
                        <p>+91-9876543210</p>
                    </div>
                    <div className="contact-item">
                        <h3>🕒 Support Hours</h3>
                        <p>Monday - Sunday: 9:00 AM - 9:00 PM</p>
                    </div>
                    <div className="contact-item">
                        <h3>🏢 Office</h3>
                        <p>EduStay Headquarters<br/>Student Housing Solutions<br/>India</p>
                    </div>
                </div>

                <div className="contact-form">
                    <h2>Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a subject</option>
                                <option value="booking">Booking Inquiry</option>
                                <option value="property">Property Listing</option>
                                <option value="technical">Technical Support</option>
                                <option value="general">General Question</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>

            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>How do I book accommodation?</h4>
                        <p>Register on EduStay, browse verified properties, and complete secure online booking.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Are all properties verified?</h4>
                        <p>Yes, all properties undergo thorough verification for safety, quality, and authenticity.</p>
                    </div>
                    <div className="faq-item">
                        <h4>What payment methods do you accept?</h4>
                        <p>We accept UPI, Net Banking, Credit/Debit cards with EMI options available.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Can I cancel my booking?</h4>
                        <p>Yes, we have a flexible cancellation policy with full refund for early cancellations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}