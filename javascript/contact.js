// ==========================================
// GLOBAL STATE & REFERENCES
// ==========================================
let contactSubmitHandler = null;

// ==========================================
// THE MOUNT FUNCTION (Injects the Contact Page)
// ==========================================
function mountContact(container) {
    container.innerHTML = `
        <div id="contact-view" style="width: 100%; display: flex; flex: 1;">
            <div class="content-wrapper">
                <main class="main" style="width: 100%;">
                    
                    <!-- Contact Postcard Section -->
                    <section id="contact-section">
                        <h1>Get in touch</h1>
                        
                        <div class="contact-postcard">
                            <h2>What goes on?</h2>
                            <form id="contact-form">
                                <div class="postcard-message-side" style="grid-column: span 2;">
                                    <div class="form-group">
                                        <textarea id="message" name="message" rows="6" placeholder="Write your message here... what would you like to say to me?" required></textarea>
                                    </div>
                                </div>
                                <button type="submit" class="btn">Send via Email</button>
                            </form>
                        </div>
                        
                        <br>
                        
                        <!-- Social & Direct Contact Links -->
                        <h1>Contact Me</h1>
                        <p style="text-align: center;">If you would like to get in touch with me further, please feel free to reach out through any of the following:</p>
                        
                        <div class="icon-container">
                            <a href="https://www.facebook.com/artorandain/" target="_blank" class="icon-link" rel="noopener noreferrer">
                                <img src="assets/facebook.png" alt="Facebook" class="icon-img">
                            </a>
                            <a href="tel:+639085007951" target="_blank" class="icon-link" rel="noopener noreferrer">
                                <img src="assets/phone-call.png" alt="Phone" class="icon-img">
                            </a>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    `;

    // Grab the form element
    const contactForm = document.getElementById('contact-form');

    // Define the submission logic
    contactSubmitHandler = (e) => {
        e.preventDefault();
        
        const messageInput = document.getElementById('message');
        if (!messageInput) return;

        const message = messageInput.value;
        const myEmail = 'april.orandain@gmail.com';
        
        const subject = encodeURIComponent('A Message from Portfolio');
        const body = encodeURIComponent(message);
        
        // Open the user's default email client
        window.open(`mailto:${myEmail}?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
        
        // Reset the form after sending
        contactForm.reset();
    };

    // Attach the listener
    if (contactForm) {
        contactForm.addEventListener('submit', contactSubmitHandler);
    }
}

// ==========================================
// THE UNMOUNT FUNCTION (Cleanup)
// ==========================================
function unmountContact() {
    const contactForm = document.getElementById('contact-form');
    
    // Safely remove the event listener if it exists
    if (contactForm && contactSubmitHandler) {
        contactForm.removeEventListener('submit', contactSubmitHandler);
    }
    
    // Clear the reference
    contactSubmitHandler = null;
}