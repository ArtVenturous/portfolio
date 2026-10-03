document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('indicators');
    const bgLayer = document.getElementById('carousel-bg-layer');

    if (!carouselContainer) return;
            
    let isAnimating = false;

    // 1. Portfolio Data Array (Hardcoded)
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

    // 2. Generate Cards Dynamically
    showcaseData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'card hidden';
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

    // 3. Generate Indicator Dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            if(isAnimating || currentIndex === index) return;
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        });
        indicatorsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');

    // 4. Core Rotation Logic
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

        // Smoothly update the background color
        bgLayer.style.backgroundColor = cards[currentIndex].getAttribute('data-bg');

        // Lock animation spam
        setTimeout(() => {
            isAnimating = false;
        }, 800); 
    }

    // 5. Click Navigation (Side Cards)
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (isAnimating) return;
            if (card.classList.contains('prev') || card.classList.contains('next')) {
                currentIndex = index;
                updateCarousel();
                resetAutoPlay();
            }
        });
    });

    // 6. Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
            resetAutoPlay();
        }
    });

    // 7. Mobile Swipe Navigation
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50;

    carouselContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating) return;
        const swipeDistance = touchendX - touchstartX;
        
        if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
            resetAutoPlay();
        } else if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
            resetAutoPlay();
        }
    }

    // 8. Auto-Play Logic
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAnimating) return;
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Start auto-play on load
    startAutoPlay();

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Initialize first layout calculation
    updateCarousel();
});