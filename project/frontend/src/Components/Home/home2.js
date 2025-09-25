import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Nav from "./Nav/Nav2";
import './Home.css';
import home from './home.jpg';
import home2 from './home2.jpg';
import home3 from './home3.jpg';
import newpic from './newpic.webp';

function Home() {
    // Hero section images
      const navigate = useNavigate();

    const images = [home, home2, home3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Change hero image every 1 minute (60000ms)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Nav />

            {/* Hero Section */}
            <main
                className="hero-sectionro"
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transition: "background-image 1s ease-in-out"
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Welcome to Suhuru Waga</h1>
                    <h2>Connecting Farms, Growing Futures.</h2>
                    <p>
                        Our platform is the future of smart agriculture in Sri Lanka, empowering farmers with data-driven insights and a unified digital ecosystem. We bridge the gaps between cultivators, landowners, and buyers to foster a transparent and profitable agricultural community. With tools for real-time decision-making, we ensure every harvest is more productive and every farmer's effort is rewarded.
                    </p>
                    
                </div>
            </main>

            {/* Features Section */}
            <section
                className="features-sections"
                style={{
                    backgroundImage: `url(${newpic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative"
                }}
            >
                
                <div className="features-header">
                    <h4 className="features-subtitle">FEATURES</h4>
                    <h2 className="features-title">Exploring SuhuruWaga Core Features</h2>
                    <p className="features-description">Explore our unique set of features below</p>
                </div>

                <div className="features-grids">
      <div
        className="feature-card cursor-pointer"
        onClick={() => navigate("/land")}
      >
        <div className="feature-icon land-icons"></div>
        <h3 className="card-title">Lands</h3>
        <h4 className="card-subtitle">Buy or Sell your lands</h4>
        <p className="card-text">Land management involves overseeing the use and development of landresources, and the "Lands" feature provides a platform for users tolist, buy, or sell agricultural land.
        </p>
      </div>

                    <div className="feature-card">
                        <div className="feature-icon plan-icons"></div>
                        <h3 className="card-title">Crop Planning</h3>
                        <h4 className="card-subtitle">Get suitable crop and give work plan</h4>
                        <p className="card-text">The Crop Planning feature helps farmers determine the most suitable crops for their district, provides a detailed work plan, and calculates the potential income based on a separate vegetable earnings calculator.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon buyer-icons"></div>
                        <h3 className="card-title">Buyers</h3>
                        <h4 className="card-subtitle">Find buyer to sell your products</h4>
                        <p className="card-text">Suhuru Waga enables you to sell your products directly by allowing you to choose a specific buyer from a list of available options.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon reso-icons"></div>
                        <h3 className="card-title">Resources</h3>
                        <h4 className="card-subtitle">Get the resources you need</h4>
                        <p className="card-text">The resources providers box connects users with suppliers of agricultural inputs, such as seeds, fertilizers, and tools.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon noti-icons"></div>
                        <h3 className="card-title">Government Notices</h3>
                        <h4 className="card-subtitle">Show all government notices</h4>
                        <p className="card-text">The government notices provides a centralized location for users to access and view official circulars, gazettes, and other important announcements from various government departments.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon cal-icons"></div>
                        <h3 className="card-title">Earning Calculator</h3>
                        <h4 className="card-subtitle">Show the income that you can earn.</h4>
                        <p className="card-text">An income calculator is a tool used to estimate your earnings. It helps you understand how much money you make over a specific period. This can be useful for budgeting, financial planning, and setting savings goals.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="main-footerr">
                <div className="footer-top">
                    <div className="footer-column contact-us">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>No: 34, Balagolla Kandy</li>
                            <li>+94 114 239 200(7)</li>
                            <li>+94 112 965 050</li>
                            <li>+94 112 450 230(3)</li>
                            <li><a href="mailto:info@agridept.gov.lk">suhuruwaga@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-column related-links">
                        <h4>Related Links</h4>
                        <div className="links-grid">
                            <ul>
                                <li><a href="#">Ministry of Agriculture</a></li>
                                <li><a href="#">Ministry of Science Technology and Research</a></li>
                                <li><a href="#">Ministry of Irrigation</a></li>
                                <li><a href="#">Department of Animal Production & Health</a></li>
                            </ul>
                            <ul>
                                <li><a href="#">Ministry of Fisheries and Aquatic Resources Development</a></li>
                                <li><a href="#">Ministry of Plantation Industries</a></li>
                                <li><a href="#">Department of Agriculture</a></li>
                                <li><a href="#">More links</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">Copyright@2025 Department of Agriculture. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;