document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('indicators');
    const bgLayer = document.getElementById('carousel-bg-layer');

    if (!carouselContainer) return;
            
    let isAnimating = false;

    // Define the 5 cards. Colors match the dark, moody aesthetic of the mockup.
    const showcaseData = [
        {
            title: "1",
            desc: "I am a human being.",
            bg: "#0b1a16" // Dark Forest Green
        },
        {
            title: "2",
            desc: "I am an artist.",
            bg: "#111827" // Dark Slate Blue
        },
        {
            title: "3",
            desc: "I am a developer.",
            bg: "#1e111d" // Dark Purple/Maroon
        },
    ];

    showcaseData.forEach(data => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-bg', data.bg);
        
        card.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.desc}</p>
        `;
        carouselContainer.appendChild(card);
    });

    const cards = document.querySelectorAll('.card');
    const totalCards = cards.length;
    let currentIndex = 0;

    // Generate the indicator dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            if(isAnimating || currentIndex === index) return;
            currentIndex = index;
            updateCarousel();
        });
        indicatorsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');

    function updateCarousel() {
        isAnimating = true;

        // Reset all classes
        cards.forEach(card => card.className = 'card hidden');

        // Calculate prev/next with wrap-around
        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const nextIndex = (currentIndex + 1) % totalCards;

        // Apply spatial classes
        cards[currentIndex].classList.replace('hidden', 'active');
        cards[prevIndex].classList.replace('hidden', 'prev');
        cards[nextIndex].classList.replace('hidden', 'next');

        // Update pagination dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');

        // Smoothly update the background color to match the active card
        bgLayer.style.backgroundColor = cards[currentIndex].getAttribute('data-bg');

        // Lock animation spam
        setTimeout(() => {
            isAnimating = false;
        }, 800); // Matches --transition-speed in CSS
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (isAnimating) return;
            
            // Only trigger rotation if the user clicks a side card
            if (card.classList.contains('prev') || card.classList.contains('next')) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }
    });

    // Touch/Swipe navigation
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum pixel distance to count as a swipe

    carouselContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating) return;
        
        const swipeDistance = touchendX - touchstartX;
        
        // Swiped left (Next card)
        if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }
        // Swiped right (Previous card)
        else if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }
    }

    // Init first layout calculation
    updateCarousel();

    // --- AUTO-PLAY LOGIC ---
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds

    function startAutoPlay() {
        // Clear any existing interval to prevent multiple timers running at once
        clearInterval(autoPlayInterval);
        
        autoPlayInterval = setInterval(() => {
            if (isAnimating) return;
            // Move to the next card
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // 1. Start the auto-play when the page loads
    startAutoPlay();

    // 2. Pause when the mouse enters the carousel area
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);

    // 3. Resume when the mouse leaves the carousel area
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    //Pause when a user touches the screen
    carouselContainer.addEventListener('touchstart', stopAutoPlay, { passive: true });
    carouselContainer.addEventListener('touchend', startAutoPlay, { passive: true });
});
