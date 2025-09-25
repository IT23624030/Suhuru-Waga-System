import React from 'react';
import Nav from "../Home/Nav/Nav2";
import Navi from "./Navi/Nav3";
import './Features.css';
import Footer from "../Home/Footer/Footer";

// Step 1: Import the image file
import flowVideo from './video.mp4';

function Features() {
  return (
    <div>
      <Nav />
      <div className="features-content-layout">
        <Navi />
        <div className="features-video-container">
          {/* Display the video instead of an image */}
          <video
            src={flowVideo}
            className="features-main-video"
            controls
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Features;