// JavaScript for Real-Time Search and Rendering
// 1. Project Data Array
const projects = [
    {
        title: "ATFDS",
        description: "Automated Tricycle Fare Display System in Virac, Catanduanes: Undergraduate Thesis Project.",
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
                    <iframe 
                        width="560" 
                        height="315" 
                        src="${project.videoEmbed}" 
                        title="${project.title}" 
                        frameborder="0" 
                        scrolling="no" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen="true"
                        allowFullScreen="true"
                        >
                    </iframe>
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
            <div>
                <h3><a href="${project.url}" target="_blank" style="color: inherit; text-decoration: none;">${project.title}</a></h3>
                ${mediaHTML}
                <p>${project.description}</p>
            </div>
            <span class="project-tech">${project.tech}</span>
        `;
        grid.appendChild(card);
    });
}

// Initial display of all projects
function shuffle(cards) {
  // Loop from the last element down to the second element
  for (let i = cards.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Swap the elements using destructuring assignment
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
  return cards;
}
displayProjects(shuffle(projects));

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

