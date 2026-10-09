// JavaScript for Real-Time Search and Rendering
// 1. Project Data Array
const projects = [
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

const grid = document.getElementById('project-grid');
const searchInput = document.getElementById('search-input');
const sidebarContainer = document.getElementById('sidebar-pills'); 

// Helper function to create matching IDs for cards and pills
function createSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// 2. Render function for the project cards
function displayProjects(projectsToDisplay) {
    grid.innerHTML = ""; 

    if (projectsToDisplay.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No matching projects found.</p>`;
        return;
    }

    projectsToDisplay.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card'; 
        // Assign the generated ID to the card so the pill can find it
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

        // Check the project URL if it's external to determine if it should open in a new tab
        let targetAttribute = "";
        try {
            // Passing window.location.origin handles relative paths gracefully
            const parsedUrl = new URL(project.url, window.location.origin);
            if (parsedUrl.hostname !== window.location.hostname) {
                targetAttribute = 'target="_blank" rel="noopener noreferrer"';
            }
        } catch (e) {
            // Fallback in case project.url is empty or an invalid format
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
        grid.appendChild(card);
    });
}

// 3. Dynamic Sidebar Pill Generation (Alphabetical)
//Add a global flag to track when the page is auto-scrolling
let isAutoScrolling = false;

function generateSidebarPills(projectsList) {
    if (!sidebarContainer) return;
    
    sidebarContainer.innerHTML = ''; 

    const sortedProjects = [...projectsList].sort((a, b) => 
        a.title.localeCompare(b.title)
    );

    sortedProjects.forEach(project => {
        const pill = document.createElement('div'); 
        pill.className = 'project-pill';
        
        const targetId = createSlug(project.title);
        pill.setAttribute('data-target', targetId);
        pill.textContent = project.title;

        // Hover Enter
        pill.addEventListener('mouseenter', () => {
            // IGNORE HOVER IF SCROLLING
            if (isAutoScrolling) return; 

            const matchingCard = document.getElementById(targetId);
            if (matchingCard && !matchingCard.classList.contains('is-locked')) {
                grid.prepend(matchingCard);
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

            // --- UNLOCK LOGIC ---
            // If it's already locked, click again to unlock it
            if (pill.classList.contains('is-locked')) {
                pill.classList.remove('is-locked');
                matchingCard.classList.remove('is-locked', 'featured-row');
                return; // Stop here so it doesn't re-lock
            }

            // --- LOCK LOGIC ---
            // 1. Clear locks from all other pills and cards
            document.querySelectorAll('.project-pill').forEach(p => p.classList.remove('is-locked'));
            document.querySelectorAll('.project-card').forEach(c => {
                c.classList.remove('is-locked');
                c.classList.remove('featured-row');
            });

            // 2. Lock the clicked pill and card
            pill.classList.add('is-locked');
            matchingCard.classList.add('is-locked', 'featured-row');
            grid.prepend(matchingCard);

            // --- PREVENT ACCIDENTAL HOVERS ---
            // 3. Turn on the scroll shield
            isAutoScrolling = true;

            // 4. Scroll smoothly
            matchingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 5. Turn off the scroll shield after the scroll finishes
            setTimeout(() => {
                isAutoScrolling = false;
            }, 2000); 
        });

        sidebarContainer.appendChild(pill);
    });
}

// 4. Initial Layout Setup
function shuffle(cards) {
    const cardsCopy = [...cards]; // Shuffle a copy to leave original intact
    for (let i = cardsCopy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [cardsCopy[i], cardsCopy[randomIndex]] = [cardsCopy[randomIndex], cardsCopy[i]];
    }
    return cardsCopy;
}

// Render both elements on page load
displayProjects(shuffle(projects));
generateSidebarPills(projects);

// 5. Live search filtering listener
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    const filteredProjects = projects.filter(project => {
        return project.title.toLowerCase().includes(query) || 
                project.description.toLowerCase().includes(query) ||
                project.tech.toLowerCase().includes(query);
    });

    displayProjects(filteredProjects);
});