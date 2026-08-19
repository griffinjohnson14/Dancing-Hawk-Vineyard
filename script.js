// Set footer year on load
document.getElementById('year').textContent = new Date().getFullYear();


// Escapes anything typed in posts.js, so apostrophes, quotes and & in the
// text can never break the markup
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// "2026-06-15" becomes "June 15, 2026". Built from parts rather than
// new Date(string), which parses as UTC and can land a day early.
function formatPostDate(iso) {
    const [y, m, d] = String(iso).split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

// "zin-at-verasion.jpg" becomes "zin at verasion", so photos still get
// alt text without asking whoever writes the post to supply it
function altFromFilename(file) {
    return file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
}


// Builds the Grapevine posts from posts.js. Sorted newest first, so the order
// they were typed in does not matter.
function renderPosts() {
    const container = document.querySelector('.vine-posts');
    if (!container || typeof posts === 'undefined') return;

    const sorted = [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));

    container.innerHTML = sorted.map(post => {
        const photos = (post.photos || []).map(file => `
                <div class="post-photo">
                    <img src="images/${encodeURI(file)}" alt="${escapeHtml(altFromFilename(file))}" loading="lazy" />
                </div>`).join('');

        const body = (post.body || []).map(p => `<p class="post-body">${escapeHtml(p)}</p>`).join('');

        return `
        <article class="vine-post reveal">
            <h3 class="post-title">${escapeHtml(post.title || '')}</h3>
            <p class="post-date">${formatPostDate(post.date)}</p>
            <div class="post-photos">${photos}
            </div>
            ${body}
        </article>`;
    }).join('');

    // A mistyped file name shows a readable note instead of a broken-image icon
    container.querySelectorAll('.post-photos img').forEach(img => {
        img.addEventListener('error', () => {
            const frame = img.closest('.post-photo');
            if (frame) {
                frame.classList.add('post-photo--missing');
                frame.setAttribute('data-missing', 'Photo not found: ' + img.getAttribute('src'));
            }
        });
    });
}


// Mobile Menu Toggle
function toggleNav(forceClose) {
    const links = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-toggle');
    const open = forceClose === true ? false : !links.classList.contains('open');

    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}


// Navigation Function
function showPage(name) {
    // Closes the mobile menu after picking a page
    toggleNav(true);

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
    // Cleans up the URL bar (keep the current path so this still works from a subfolder)
    history.replaceState(null, '', location.pathname + location.search);
}


// Contact Form Submission
async function handleSubmit(event) {
    // Stops the browser doing its own page-reloading form post
    if (event) event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const reason = document.getElementById('reason').value;
    const msg = document.getElementById('message').value.trim();

    if (!name || !email || !msg) {
        alert('Please fill in your name, email, and message.');
        return;
    }

    // Blocks a second send while the first is still in flight
    const btn = document.querySelector('.contact-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const response = await fetch('https://formspree.io/f/xdarkvrp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
    } catch (err) {
        // fetch only rejects on a network failure, which the old code never caught
        alert('Could not reach the server. Please check your connection, or email directly at kjatfarm@gmail.com');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
}


// Scroll Reveal Animations — one shared observer. Re-creating it on every page
// change left the old ones alive and stacked up a new observer per nav click.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

function observeReveals() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('revealed')) revealObserver.observe(el);
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


// Lightbox Functionality
let lightboxOpener = null;

function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Remember which photo opened it so focus can return there on close
    lightboxOpener = img;
    document.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    // Without this guard, any stray Escape keypress anywhere on the site
    // still ran the close logic and cleared body overflow
    if (!lightbox.classList.contains('active')) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling

    if (lightboxOpener) {
        lightboxOpener.focus();
        lightboxOpener = null;
    }
}

// Close lightbox on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

// Post photos open the lightbox. They're made focusable and given a role so
// keyboard users can reach them too, instead of the lightbox being mouse-only.
function wirePhotos() {
    document.querySelectorAll('.post-photos img').forEach(img => {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');

        img.addEventListener('click', () => openLightbox(img));
        img.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(img);
            }
        });
    });
}


// Posts must be built before the photos are wired or the reveals observed,
// since both of those look for elements this creates.
renderPosts();
wirePhotos();
observeReveals();
