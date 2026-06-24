// Set footer year on load
document.getElementById('year').textContent = new Date().getFullYear();


// Navigation Function
function showPage(name) {
    // Hides all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Removes the actives from all nav links
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    // Shows the selected page
    document.getElementById('page-' + name).classList.add('active');
    // Marks the nav link as active
    document.getElementById('nav-' + name).classList.add('active');
    // Scrolls to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Re-trigger the reveals on a new page
    observeReveals();
}


// Contact Form Submission
async function handleSubmit() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const reason = document.getElementById('reason').value;
    const msg = document.getElementById('message').value.trim();

    if (!name || !email || !msg) {
        alert('Please fill in your name, email, and message.');
        return;
    }

    const response = await fetch('https://formspree.io/f/xdarkvrp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name, email, reason, message: msg })
    });

    if (response.ok) {
        alert('Thank you, ' + name + '! Ken will be in touch soon.');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('reason').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Something went wrong. Please email directly at kjatfarm@gmail.com');
    }
}


// Scroll Reveal Animations
function observeReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(e1 => {
        if (!e1.classList.contains('revealed')) observer.observe(e1);
    });
}


// Parallax Effect and Navigation Shrink on Scroll
window.addEventListener('scroll', function() {
    // Paralaax Effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = 'translateY(' + window.scrollY * 0.4 + 'px)';
    }

    // Navigation Shrink
    const nav = document.querySelector('nav');
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    }
    else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });

observeReveals();