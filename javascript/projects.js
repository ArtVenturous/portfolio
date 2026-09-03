// JavaScript for Real-Time Search and Rendering
// 1. Project Data Array
const projects = [
    {
        title: "Bridge to Tomorrow",
        description: "Empowering Minds Through ICT 3.0: A Digital Age Online Essay Writing Challenge Entry.",
        tech: "Essay, Literary",
        url: "projects/Literary Works/BridgeToTomorrow.html"
    },
    {
        title: "Magkabilang Mundo",
        description: "A visual literary work exploring dual realities and emotional landscapes.",
        tech: "Visual Arts, Literary",
        url: "projects/Literary Works/MagkabilangMundo.html"
    },
    {
        title: "Thoughts of a Wanderer",
        description: "Reflections on society, simulated freedom, and the search for absolute truth.",
        tech: "Philosophy, Prose",
        url: "projects/Literary Works/ThoughtsOfAWanderer.html"
    }
];

const grid = document.getElementById('project-grid');
const searchInput = document.getElementById('search-input');

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

        let mediaHTML = "";
        
        // Check if the project has an embedded video
        if (project.videoEmbed) {
            mediaHTML = `
                <div class="video-container">
                    <iframe src="${project.videoEmbed}" title="${project.title}" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
        } 
        // Check if it has a standard image preview
        else if (project.image) {
            mediaHTML = `
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}">
                </div>
            `;
        }

        card.innerHTML = `
            ${mediaHTML}
            <div>
                <h3><a href="${project.url}" style="color: inherit; text-decoration: none;">${project.title}</a></h3>
                <p>${project.description}</p>
            </div>
            <span class="project-tech">${project.tech}</span>
        `;
        grid.appendChild(card);
    });
}

// Initial display of all projects
displayProjects(projects);

// 3. Live search filtering listener
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    const filteredProjects = projects.filter(project => {
        return project.title.toLowerCase().includes(query) || 
                project.description.toLowerCase().includes(query) ||
                project.tech.toLowerCase().includes(query);
    });

    displayProjects(filteredProjects);
});

// Sidebar pill hover effect
const pills = document.querySelectorAll('.project-pill');

pills.forEach(pill => {
    const targetId = pill.getAttribute('data-target');
    const matchingCard = document.getElementById(targetId);

    if (matchingCard) {
        pill.addEventListener('mouseenter', () => {
            matchingCard.style.borderColor = '#FFD25F';
            matchingCard.style.boxShadow = '0 0 20px rgba(255, 210, 95, 0.4)';
        });

        pill.addEventListener('mouseleave', () => {
            matchingCard.style.borderColor = '#433360';
            matchingCard.style.boxShadow = 'none';
        });
    }
});