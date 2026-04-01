/**
 * UTP Originals Website Scripts
 */

/* ── Dynamic Copyright Year ── */
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.querySelector('.footer-copy');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace(/2025/g, currentYear);
  }
});

/* ── Scroll reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Navbar opacity on scroll ── */
window.addEventListener('scroll', () => {
  const n = document.getElementById('navbar');
  if (n) {
    n.style.background = window.scrollY > 50
      ? 'rgba(7,7,14,.97)'
      : 'rgba(7,7,14,.82)';
  }
});

/* ── Contact form ── */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.fsubmit');
  const originalText = btn.textContent;
  
  btn.textContent = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#00C851,#007E33)';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    e.target.reset();
  }, 3200);
}

/* ── Infinite Video Marquee ── */
const videoIds = ['dQw4w9WgXcQ', '3JZ_D3ELwOQ', '2Vv-BfVoq4g', 'L_jWHffIx5E', 'tPEE9ZwTmy0', 'JGwWNGJdvx8'];
const marqueeVideos = [...videoIds, ...videoIds];

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  track.innerHTML = marqueeVideos.map(id => `
    <div class="video-card">
      <iframe 
        src="https://www.youtube.com/embed/${id}?enablejsapi=1&mute=1" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initMarquee);
