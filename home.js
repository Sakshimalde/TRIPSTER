document.querySelector(".login").addEventListener("click",()=>{document.getElementById("login-form-container").style.display="block";})
document.querySelector(".register").addEventListener("click",()=>{document.getElementById("register-form-container").style.display="block";})


// carousal
// script.js

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

// Initialize the carousel
function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
    });
    slides[currentIndex].classList.add('active');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Auto-slide every 3 seconds
setInterval(nextSlide, 3000);

// carousal end