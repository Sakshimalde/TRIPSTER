document.querySelector(".login").addEventListener("click",()=>{document.getElementById("login-form-container").style.display="block";})
document.querySelector(".register").addEventListener("click",()=>{document.getElementById("register-form-container").style.display="block";})

const carousel = document.querySelector('.carousel');
const carouselInner = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');

let currentSlide = 0;

function fadeNextSlide() {
  carouselItems[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % carouselItems.length;
  carouselItems[currentSlide].classList.add('active');
}

setInterval(fadeNextSlide, 2000); // adjust the interval as needed