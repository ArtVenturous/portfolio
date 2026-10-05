// --- GLOBAL REFERENCES FOR CLEANUP ---
let autoPlayInterval = null;
let homeKeydownHandler = null;

function mountHome(container) {
    // ==========================================
    // 1. INJECT HTML SKELETON
    // ==========================================
    container.innerHTML = `
        <div id="home-view">
            <!-- Highlights Carousel Section -->
            <section class="carousel-section">
                <div class="carousel-bg-layer" id="carousel-bg-layer"></div>
                <div class="carousel-vignette"></div>

                <div class="carousel-container" id="carousel-wrapper">
                    <div class="carousel" id="carousel"></div>
                    <div class="indicators" id="indicators"></div>
                </div>
            </section>

            <!-- Main Layout Container -->
            <div class="content-wrapper">
                <main class="main">
                    <section class="">
                        <div>
                        
                        </div>
                    </section>
                </main>
            </div>
        </div>
    `;

    // ==========================================
    // 2. DOM ELEMENTS & STATE
    // ==========================================
    const carouselContainer = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('indicators');
    const bgLayer = document.getElementById('carousel-bg-layer');
    const carouselWrapper = document.getElementById('carousel-wrapper');

    if (!carouselContainer) return;
            
    let isAnimating = false;
    let currentIndex = 0;

    const showcaseData = [
        {
            title: "1",
            desc: "I am a human being.",
            bg: "#0b1a16",
            mediaType: "image",
            mediaSrc: "./assets/human.jpg"
        },
        {
            title: "2",
            desc: "I am an artist.",
            bg: "#310707", 
            mediaType: "image",
            mediaSrc: "./assets/eye.jpg"
        },
        {
            title: "3",
            desc: "I am a developer.",
            bg: "#1e111d", 
            mediaType: "image",
            mediaSrc: "./assets/dev.png"
        },
    ];

    const totalCards = showcaseData.length;

    // ==========================================
    // 3. GENERATE DOM NODES
    // ==========================================
    showcaseData.forEach(data => {
        // Build Foreground Card
        const card = document.createElement('div');
        card.className = 'card hidden';
        
        let thumbnailHTML = '';
        if (data.mediaType === 'image' && data.mediaSrc) {
            thumbnailHTML = `<img src="${data.mediaSrc}" class="card-thumbnail"><div class="card-overlay"></div>`;
        } else if (data.mediaType === 'video' && data.mediaSrc) {
            thumbnailHTML = `<video src="${data.mediaSrc}" autoplay loop muted playsinline class="card-thumbnail"></video><div class="card-overlay"></div>`;
        }
        
        card.innerHTML = `
            ${thumbnailHTML}
            <div class="card-content">
                <h2>${data.title}</h2>
                <p>${data.desc}</p>
            </div>
        `;
        carouselContainer.appendChild(card);

        // Build Background Layer
        const bgItem = document.createElement('div');
        bgItem.className = 'bg-media-item';
        bgItem.style.backgroundColor = data.bg || '#0b0d17';
        
        if (data.mediaType === 'image' && data.mediaSrc) {
            bgItem.innerHTML = `<img src="${data.mediaSrc}">`;
        } else if (data.mediaType === 'video' && data.mediaSrc) {
            bgItem.innerHTML = `<video src="${data.mediaSrc}" autoplay loop muted playsinline></video>`;
        }
        
        bgLayer.appendChild(bgItem);
    });

    const cards = document.querySelectorAll('#home-view .card');

    // Build Indicator Dots
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
    
    const dots = document.querySelectorAll('#home-view .dot');

    // ==========================================
    // 4. LOGIC & EVENT LISTENERS
    // ==========================================
    function updateCarousel() {
        isAnimating = true;
        cards.forEach(card => card.className = 'card hidden');

        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const nextIndex = (currentIndex + 1) % totalCards;

        cards[currentIndex].classList.replace('hidden', 'active');
        cards[prevIndex].classList.replace('hidden', 'prev');
        cards[nextIndex].classList.replace('hidden', 'next');

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');

        const bgItems = document.querySelectorAll('#home-view .bg-media-item');
        bgItems.forEach(item => item.classList.remove('active'));
        if (bgItems[currentIndex]) bgItems[currentIndex].classList.add('active');

        setTimeout(() => { isAnimating = false; }, 800); 
    }

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

    // Keyboard Navigation (Assigned to named variable for cleanup)
    homeKeydownHandler = (e) => {
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
    };
    document.addEventListener('keydown', homeKeydownHandler);

    // Mobile Swipe
    let touchstartX = 0;
    let touchendX = 0;
    
    carouselWrapper.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating) return;
        const swipeDistance = touchendX - touchstartX;
        if (swipeDistance < -50) {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
            resetAutoPlay();
        } else if (swipeDistance > 50) {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
            resetAutoPlay();
        }
    }

    // Auto-Play
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAnimating) return;
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, 5000);
    }

    function stopAutoPlay() { clearInterval(autoPlayInterval); }
    function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

    carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);

    // Boot Carousel
    updateCarousel();
    startAutoPlay();
}

function unmountHome() {
    // 1. Stop the autoplay loop so it doesn't run while on other pages
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }

    // 2. Remove the keyboard listener so left/right arrows don't trigger phantom shifts
    if (homeKeydownHandler) {
        document.removeEventListener('keydown', homeKeydownHandler);
        homeKeydownHandler = null;
    }
}