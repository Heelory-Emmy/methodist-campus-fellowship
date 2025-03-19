
// ----------------------PRELOAD SCRIPT---------------
document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");
    
    let progress = 0;
    const loadingStatus = document.querySelector(".loading-status");
    
    const interval = setInterval(() => {
        progress += Math.random() * 5;  // Slower progress increase
        if (progress >= 100) {
            progress = 100;
            loadingStatus.textContent = "Welcome!";
            clearInterval(interval);
            
            // Longer delay before fade-out
            setTimeout(() => {
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                    if (content) content.style.display = "block";
                    document.body.style.overflow = "auto";
                }, 1000);  // Longer fade-out
            }, 1000);  // Longer delay
        } else {
            loadingStatus.textContent = `Loading... ${Math.floor(progress)}%`;
        }
    }, 300);  // Slower interval
});

// Pop up Script
// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const popupContainer = document.getElementById('popupContainer');
    const popupSlider = document.querySelector('.popup-slider');
    const slides = document.querySelectorAll('.popup-slide');
    const indicators = document.querySelectorAll('.indicator');
    const closeBtn = document.getElementById('closePopup');
    
    let currentSlide = 0;
    let slideInterval;

    // Show popup after 5 seconds of page load
    setTimeout(() => {
        popupContainer.classList.add('active');
        startSlideShow();
    }, 5000);

    function startSlideShow() {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlide();
        }, 10000); // Change slide every 10 seconds
    }

    function updateSlide() {
        popupSlider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    // Click events for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
            resetInterval();
        });
    });

    function resetInterval() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Close popup
    closeBtn.addEventListener('click', () => {
        popupContainer.classList.remove('active');
        clearInterval(slideInterval);
    });

    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your newsletter subscription logic here
        alert('Thank you for subscribing!');
    });
});

// Add touch support
let touchStartX = 0;
let touchEndX = 0;

popupSlider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

popupSlider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});


// ------------ TopBar Script
// topbar.js
document.addEventListener('DOMContentLoaded', () => {
    const topbar = document.getElementById('topbar');
    let lastScroll = 0;
    const scrollThreshold = 50;

    // Handle scroll events for hiding/showing topbar
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Show/hide based on scroll direction
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down & past threshold - hide topbar
            topbar.classList.add('hidden');
        } else {
            // Scrolling up or at top - show topbar
            topbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Optional: Add click handlers for mobile
    if (window.innerWidth <= 480) {
        const phoneLink = document.querySelector('.topbar-item[href^="tel:"]');
        const emailLink = document.querySelector('.topbar-item[href^="mailto:"]');

        // Show text on touch/click for mobile
        [phoneLink, emailLink].forEach(link => {
            if (link) {
                link.addEventListener('click', (e) => {
                    const text = link.querySelector('.topbar-text');
                    if (text) {
                        text.style.display = 'inline-block';
                        setTimeout(() => {
                            text.style.display = '';
                        }, 2000);
                    }
                });
            }
        });
    }
});






// Welcome Section Script
document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.video-player');
  const playPauseBtn = document.querySelector('.play-pause-btn');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const volumeBtn = document.querySelector('.volume-btn');
  const volumeOnIcon = document.querySelector('.volume-on-icon');
  const volumeOffIcon = document.querySelector('.volume-off-icon');
  const volumeSlider = document.querySelector('.volume-slider');

  // Play/Pause functionality
  playPauseBtn.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      video.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  });

  // Volume controls
  volumeBtn.addEventListener('click', function() {
    if (video.muted) {
      video.muted = false;
      volumeOnIcon.style.display = 'block';
      volumeOffIcon.style.display = 'none';
      volumeSlider.value = video.volume;
    } else {
      video.muted = true;
      volumeOnIcon.style.display = 'none';
      volumeOffIcon.style.display = 'block';
      volumeSlider.value = 0;
    }
  });

  volumeSlider.addEventListener('input', function() {
    video.volume = this.value;
    video.muted = (this.value === 0);
    
    if (video.muted || this.value === 0) {
      volumeOnIcon.style.display = 'none';
      volumeOffIcon.style.display = 'block';
    } else {
      volumeOnIcon.style.display = 'block';
      volumeOffIcon.style.display = 'none';
    }
  });

  // Update play/pause button when video ends
  video.addEventListener('ended', function() {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  });
  
  // Initial state setup
  if (video.paused) {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  } else {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }
  
  if (video.muted) {
    volumeOnIcon.style.display = 'none';
    volumeOffIcon.style.display = 'block';
    volumeSlider.value = 0;
  } else {
    volumeOnIcon.style.display = 'block';
    volumeOffIcon.style.display = 'none';
    volumeSlider.value = video.volume;
  }
});


