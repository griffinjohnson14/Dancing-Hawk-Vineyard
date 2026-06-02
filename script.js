// Set footer year on load
document.getElementById('year').textContent = new Date().getFullYear();

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
}