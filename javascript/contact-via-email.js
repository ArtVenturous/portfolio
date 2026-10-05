const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = document.getElementById('message').value;
    const myEmail = 'april.orandain@gmail.com';
    
    const subject = encodeURIComponent('A Message from Portfolio');
    const body = encodeURIComponent(message);
    
    // Open in separate window/app and reset form
    window.open(`mailto:${myEmail}?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
    contactForm.reset();
});