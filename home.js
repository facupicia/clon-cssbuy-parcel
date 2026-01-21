// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Update carousel position
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoSlide();
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold) {
            // Swipe left - next slide
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
            resetAutoSlide();
        } else if (diff < -swipeThreshold) {
            // Swipe right - previous slide
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
            resetAutoSlide();
        }
    }

    // Start auto slide
    startAutoSlide();

    // Update Beijing time
    function updateBeijingTime() {
        const now = new Date();
        // Beijing is UTC+8
        const beijingOffset = 8 * 60;
        const localOffset = now.getTimezoneOffset();
        const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60000);
        
        const day = String(beijingTime.getDate()).padStart(2, '0');
        const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
        const hours = String(beijingTime.getHours()).padStart(2, '0');
        const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
        
        document.getElementById('beijing-time').textContent = `${day}/${month} ${hours}:${minutes}`;
    }

    updateBeijingTime();
    setInterval(updateBeijingTime, 60000); // Update every minute
});
