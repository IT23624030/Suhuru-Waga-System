import React from 'react';
import Nav from "../Home/Nav/Nav"; 
import Footer from "../Home/Footer/Footer"; 
import { Link } from 'react-router-dom';
import './Createp.css'


function Createp() {
  return (
    <div>
      {/* Add the Nav component here */}
      <Nav /> 
       <section className="features-section">
                <div className="features-header">
                    <h2 className="features-title">Register As a ......?</h2>
                    
                </div>

                <div className="features-grid">
                    {/* Feature Card 1 */}
                    <div className="feature-card">
                        <div className="feature-icon land-icon"></div>
                        <h3 className="card-title">Land Owner</h3>
                        <h4>If you register as a land owner You can sell your own land,view and purchase land posted for sale, identify the most suitable crops to cultivate, get a cultivation plan, find people to sell to, find equipment needed for cultivation, and view government announcements.</h4>
                         <Link to="/adduser" className="card-button-link">
                            <button className="card-button">Register Here</button>
                        </Link>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="feature-card">
                        <div className="feature-icon plan-icon"></div>
                        <h3 className="card-title">Farmer</h3>
                        <h4>If you register as a farmer You can view and purchase land posted for sale, sell your own land, identify the most suitable crops to cultivate, get a cultivation plan, find people to sell to, find equipment needed for cultivation, and view government announcements.</h4>
                        <Link to="/adduser" className="card-button-link">
                            <button className="card-button">Register Here</button>
                        </Link>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="feature-card">
                        <div className="feature-icon buyer-icon"></div>
                        <h3 className="card-title">Buyer</h3>
                        <h4>If you register as a buyer You can buy the products,sell your own land,view and purchase land posted for sale, identify the most suitable crops to cultivate, get a cultivation plan, find people to sell to, find equipment needed for cultivation, and view government announcements.</h4>
                         <Link to="/adduser" className="card-button-link">
                            <button className="card-button">Register Here</button>
                        </Link>
                    </div>

                    {/* Feature Card 4 */}
                    <div className="feature-card">
                        <div className="feature-icon reso-icon"></div>
                        <h3 className="card-title">Resource Provider</h3>
                        <h4>If you register as a resource provider You can sell the resources,sell your own land,view and purchase land posted for sale, identify the most suitable crops to cultivate, get a cultivation plan, find people to sell to, find equipment needed for cultivation, and view government announcements.</h4>
                         <Link to="/adduser" className="card-button-link">
                            <button className="card-button">Register Here</button>
                        </Link>
                    </div>  
                </div>
            </section>
            <Footer /> 
    </div>
    
  );
}

export default Createp;