// Example of how to implement IntersectionObserver in React
// This would typically go into a useEffect in your main App component
// or a custom hook like useScrollAnimation.

import React, { useEffect } from 'react';

const setupScrollAnimations = () => {
  const sections = document.querySelectorAll('.reveal-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Optional: Remove 'is-visible' if you want sections to hide again
        // when scrolled out of view. For a typical "About Us", you might
        // prefer them to stay visible once animated.
        // entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.3, // Percentage of the target element which is visible to trigger callback
    rootMargin: "0px 0px -50px 0px" // Start animating a bit before it hits bottom of viewport
  });

  sections.forEach(section => {
    observer.observe(section);
  });
};

// In your App.js or main component:
// import { useEffect } from 'react';
// import { setupScrollAnimations } from './ScrollAnimation'; // if in separate file

// function App() {
//   useEffect(() => {
//     setupScrollAnimations();
//   }, []);

//   return (
//     // ... your routes and components
//   );
// }

// If you want it specific to the About component:
// In About.js:
// import React, { useEffect } from 'react';
// ... rest of your About component

// function About() {
//   useEffect(() => {
//     const sections = document.querySelectorAll('.reveal-section');
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('is-visible');
//         }
//       });
//     }, {
//       threshold: 0.3,
//       rootMargin: "0px 0px -50px 0px"
//     });

//     sections.forEach(section => {
//       observer.observe(section);
//     });

//     // Cleanup function to unobserve elements when component unmounts
//     return () => {
//       sections.forEach(section => {
//         observer.unobserve(section);
//       });
//     };
//   }, []); // Empty dependency array means this runs once on mount

//   return (
//     // ... About component JSX
//   );
// }