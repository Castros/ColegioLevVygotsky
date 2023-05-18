// Variables for the javascript file
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();






window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.transparent-navbar');
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = primaryColor;
  } else {
    navbar.style.backgroundColor = 'transparent';
  }
});

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

  $(document).ready(function () {
    $(".contact-btn").click(function () {
      $("html, body").animate(
        {
          scrollTop: $("#contact-form-section").offset().top,
        },
        1000
      );
    });
  });
  
  