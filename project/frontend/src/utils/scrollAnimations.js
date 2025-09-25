// src/utils/scrollAnimations.js

// This function sets up the IntersectionObserver
const setupScrollAnimations = (selector = '.reveal-section', threshold = 0.3, rootMargin = "0px 0px -50px 0px") => {
  const sections = document.querySelectorAll(selector);

  if (sections.length === 0) {
    // No sections to observe, so just return
    return null;
  }

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
  }, { threshold, rootMargin });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Return the observer instance and a cleanup function
  return () => {
    sections.forEach(section => observer.unobserve(section));
    observer.disconnect(); // Disconnect the observer entirely
  };
};

export default setupScrollAnimations; // Export the function