// ==========================================
// 1. PROJECT DATA RESOURCE
// ==========================================
const projectsData = [
    {
        title: "Automated Tricycle Fare Display System (ATFDS)",
        description: "Undergraduate Thesis Project: Arduino-based Real-Time Tricycle Fare Display System for Passenger Awareness in Virac, Catanduanes.",
        tech: "Arduino, Embedded Systems",
        videoEmbed: "https://www.youtube.com/embed/-TViXfhL0mM?si=8RhGcrp9X_wbavV4",
        url: "https://youtu.be/-TViXfhL0mM"
    },
    {
        title: "Bridge to Tomorrow",
        description: "Empowering Minds Through ICT 3.0: A Digital Age Online Essay Writing Challenge Entry.",
        tech: "Essay, Literary",
        videoEmbed: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FDICTRegionVBicol%2Fvideos%2F736507965578864%2F&show_text=false&width=560&t=0",
        url: "projects/Literary Works/BridgeToTomorrow.html"
    },
    {
        title: "Magkabilang Mundo",
        description: "A visual literary work exploring dual realities and emotional landscapes.",
        tech: "Visual Arts, Literary",
        image: "projects/Literary Works/Magkabilang Mundo/Magkabilang Mundo.jpg",
        url: "projects/Literary Works/MagkabilangMundo.html"
    },
    {
        title: "Thoughts of a Wanderer",
        description: "Reflections on society, simulated freedom, and the search for absolute truth.",
        tech: "Philosophy, Prose",
        url: "projects/Literary Works/ThoughtsOfAWanderer.html"
    },
    {
        title: "Stickman Adventures",
        description: "A very short stickman animation made using FlipaClip.",
        tech: "2D Animation",
        videoEmbed: "https://www.youtube.com/embed/TdfEaB891Gg?si=zJ_wUK8WS8CAbip5",
        url: "https://youtu.be/TdfEaB891Gg?si=zJ_wUK8WS8CAbip5"
    },
    {
        title: "Space Tron",
        description: "A classic 2D 2-player game made using Scratch.",
        tech: "Visual Programming, Game Development",
        videoEmbed: "https://scratch.mit.edu/projects/227546816/embed",
        url: "https://scratch.mit.edu/projects/227546816/fullscreen"
    },
    {
        title: "Victorian Newspage",
        description: "A digital recreation of a Victorian-era  themed newspaper, showcasing historical events and stories.",
        tech: "Video Editing, Web Design (HTML+CSS)",
        videoEmbed: "https://www.youtube.com/embed/xGbSWxqmeUc?si=JQgrH3SI0QUKLdPH",
        url: "projects/Victorian Newspage/VictorianNewspage.html"
    }
];

// ==========================================
// 2. GLOBAL STATE & REFERENCES
// ==========================================
let gridContainer = null;
let sidebarContainer = null;
let searchInput = null;
let currentSearchListener = null;
let isAutoScrolling = false;

// ==========================================
// 3. THE MOUNT FUNCTION
// ==========================================
function mountProjects(container) {
    // Inject the HTML skeleton for the Projects View
    container.innerHTML = `
        <div id="projects-view" style="width: 100%; display: flex; flex: 1;">
            <div class="content-wrapper">
                
                <!-- Sidebar Overview List -->
                <aside class="side">
                    <div style="width: 100%;">
                        <h3 style="text-align: center;">Overview</h3>
                        <hr>
                        <!-- Interactive Pill Container -->
                        <div class="sidebar-pills-container" id="sidebar-pills"></div>
                    </div>
                </aside>

                <!-- Main Content Area with Search & Grid -->
                <main class="main">
                    <h1 style="text-align: center;">Library of Works</h1>
                    <em style="display: block; text-align: center; margin-bottom: 1em;">What have I made so far?</em>
                    
                    <!-- Search Bar Input -->
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="Search projects by title, description, or tech...">
                    </div>

                    <!-- Dynamic Grid -->
                    <div id="project-grid" class="project-grid"></div>
                </main>

            </div>
        </div>
    `;

    // Grab the DOM elements we just injected
    gridContainer = document.getElementById('project-grid');
    sidebarContainer = document.getElementById('sidebar-pills');
    searchInput = document.getElementById('search-input');

    // Render the initial shuffled layout
    displayProjects(shuffleArray(projectsData));
    generateSidebarPills(projectsData);

    // Attach the Search Listener
    currentSearchListener = (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filteredProjects = projectsData.filter(project => {
            return project.title.toLowerCase().includes(query) || 
                   project.description.toLowerCase().includes(query) ||
                   project.tech.toLowerCase().includes(query);
        });
        displayProjects(filteredProjects);
    };
    searchInput.addEventListener('input', currentSearchListener);
}

// ==========================================
// 4. THE UNMOUNT FUNCTION (Like queue_free)
// ==========================================
function unmountProjects() {
    // Safely detach the event listener to prevent memory leaks
    if (searchInput && currentSearchListener) {
        searchInput.removeEventListener('input', currentSearchListener);
    }
    
    // Clear references
    gridContainer = null;
    sidebarContainer = null;
    searchInput = null;
    currentSearchListener = null;
    isAutoScrolling = false;
}

// ==========================================
// 5. HELPER FUNCTIONS
// ==========================================

function createSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function shuffleArray(cards) {
    const cardsCopy = [...cards]; 
    for (let i = cardsCopy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [cardsCopy[i], cardsCopy[randomIndex]] = [cardsCopy[randomIndex], cardsCopy[i]];
    }
    return cardsCopy;
}

function displayProjects(projectsToDisplay) {
    if (!gridContainer) return;
    gridContainer.innerHTML = ""; 

    if (projectsToDisplay.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No matching projects found.</p>`;
        return;
    }

    projectsToDisplay.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card'; 
        card.id = createSlug(project.title); 

        let mediaHTML = "";
        if (project.videoEmbed) {
            mediaHTML = `
                <div class="video-container">
                    <iframe 
                        width="560" height="315" 
                        src="${project.videoEmbed}" title="${project.title}" 
                        frameborder="0" scrolling="no" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen="true">
                    </iframe>
                </div>
            `;
        } else if (project.image) {
            mediaHTML = `
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}">
                </div>
            `;
        }

        let targetAttribute = "";
        try {
            const parsedUrl = new URL(project.url, window.location.origin);
            if (parsedUrl.hostname !== window.location.hostname) {
                targetAttribute = 'target="_blank" rel="noopener noreferrer"';
            }
        } catch (e) {
            console.error("Invalid URL encountered:", project.url);
        }

        card.innerHTML = `
            <div>
                <h3><a href="${project.url}" ${targetAttribute} style="color: inherit; text-decoration: none;">${project.title}</a></h3>
                ${mediaHTML}
                <p>${project.description}</p>
            </div>
            <span class="project-tech">${project.tech}</span>
        `;
        gridContainer.appendChild(card);
    });
}

function generateSidebarPills(projectsList) {
    if (!sidebarContainer) return;
    sidebarContainer.innerHTML = ''; 

    const sortedProjects = [...projectsList].sort((a, b) => a.title.localeCompare(b.title));

    sortedProjects.forEach(project => {
        const pill = document.createElement('div'); 
        pill.className = 'project-pill';
        
        const targetId = createSlug(project.title);
        pill.setAttribute('data-target', targetId);
        pill.textContent = project.title;

        // Hover Enter
        pill.addEventListener('mouseenter', () => {
            if (isAutoScrolling) return; 
            const matchingCard = document.getElementById(targetId);
            if (matchingCard && !matchingCard.classList.contains('is-locked')) {
                gridContainer.prepend(matchingCard);
                matchingCard.classList.add('featured-row');
            }
        });

        // Hover Leave
        pill.addEventListener('mouseleave', () => {
            if (isAutoScrolling) return; 
            const matchingCard = document.getElementById(targetId);
            if (matchingCard && !matchingCard.classList.contains('is-locked')) {
                matchingCard.classList.remove('featured-row');
            }
        });

        // Click to Lock/Unlock
        pill.addEventListener('click', () => {
            const matchingCard = document.getElementById(targetId);
            if (!matchingCard) return;

            // Unlock Logic
            if (pill.classList.contains('is-locked')) {
                pill.classList.remove('is-locked');
                matchingCard.classList.remove('is-locked', 'featured-row');
                return; 
            }

            // Lock Logic
            document.querySelectorAll('.project-pill').forEach(p => p.classList.remove('is-locked'));
            document.querySelectorAll('.project-card').forEach(c => {
                c.classList.remove('is-locked', 'featured-row');
            });

            pill.classList.add('is-locked');
            matchingCard.classList.add('is-locked', 'featured-row');
            gridContainer.prepend(matchingCard);

            // Scroll Animation Shielding
            isAutoScrolling = true;
            matchingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => { isAutoScrolling = false; }, 2000); 
        });

        sidebarContainer.appendChild(pill);
    });
}