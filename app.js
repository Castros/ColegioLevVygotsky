// Add this to your 'scripts.js' file or in the <script> tag at the end of the body section of your HTML file

function shuffleGalleryItems() {
    const galleryRow = document.querySelector(".gallery-row");
    const galleryItems = Array.from(galleryRow.querySelectorAll(".gallery-item"));
    galleryItems.forEach((item) => item.classList.remove("visible-xs"));
  
    // Shuffle the array of gallery items
    const shuffledItems = galleryItems.sort(() => Math.random() - 0.5);
  
    // Show the first 5 items on mobile view
    shuffledItems.slice(0, 5).forEach((item) => item.classList.add("visible-xs"));
  }
  
  window.addEventListener("DOMContentLoaded", shuffleGalleryItems);
  window.addEventListener("resize", shuffleGalleryItems);
  