import React, { useState } from 'react';
import './Contact.css'; // make sure you have the CSS file
import DulaNav from "../DulaNav/DulaNav";
import Footer from '../Home/Footer/Footer'; 

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
      setFormMessage('⚠ Please fill in all fields.');
      setMessageType('error');
      return;
    }

    // Simple email check
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      setFormMessage('⚠ Please enter a valid email.');
      setMessageType('error');
      return;
    }

    // Simulate sending data (in a real app, you'd send this to a server)
    setTimeout(() => {
      setFormMessage('✅ Message sent successfully! We\'ll be in touch soon.');
      setMessageType('success');
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    }, 1000); // Simulate network delay
  };

  return (
    <div className=""> {/* Added wrapper for full page styling */}
      <DulaNav />
      <div className="contact-container agriculture-theme"> {/* Added theme class */}
        <div className="contact-header">
          <h2>Get In Touch With Us</h2>
          <p>We'd love to hear from you! Reach out for inquiries, partnerships, or just to say hello.</p>
        </div>

        <form id="contactForm" onSubmit={handleSubmit} className="contact-form-grid">
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Your Name"
          />
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Your Email"
          />
          <textarea
            id="message"
            rows="5" // Increased rows for more space
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            aria-label="Your Message"
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
        <div
          id="formMessage"
          className={`message ${messageType} ${formMessage ? 'show' : ''}`} // Added show class for animation
          role="alert" // Accessibility improvement
        >
          {formMessage}
        </div>

        {/* Optional: Add more contact info or a map here */}
        <div className="additional-contact-info">
            <h3>Find Us</h3>
            <p>123 Farmstead Lane, Green Valley, AG 45678</p>
            <p>Email: <a href="mailto:info@yourfarm.com">info@yourfarm.com</a></p>
            <p>Phone: <a href="tel:+15551234567">+1 (555) 123-4567</a></p>
            {/* You could embed a map here */}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Contact;