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

/* ══════════════════════════════════════════
   YOUTUBE VIDEO GALLERY
   Fetches latest videos from channel RSS feed
   via rss2json (free, no API key needed)
══════════════════════════════════════════ */
const YT_CHANNEL_ID = 'UCp8BLYf-hTUwhH4TZfUDE_A';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=&count=12`;

function extractVideoId(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

function loadVideo(videoId, thumbEl) {
  const featured = document.getElementById('ytFeatured');
  if (!featured) return;

  featured.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white"
      title="UTP Originals"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>`;
    
  // highlight active thumb
  document.querySelectorAll('.yt-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
  
  // scroll to player smoothly
  const watchSection = document.getElementById('watch');
  if (watchSection) {
    watchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderVideos(items) {
  const grid = document.getElementById('ytGrid');
  const featured = document.getElementById('ytFeatured');

  if (!items || items.length === 0) {
    if (featured) {
      featured.innerHTML = `<div class="yt-loading" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-card)">
        <span style="font-size:32px;margin-bottom:12px">📺</span>
        <span>Visit our <a href="https://www.youtube.com/@UTPOriginals" target="_blank" style="color:var(--orange)">YouTube channel</a> to watch!</span>
      </div>`;
    }
    return;
  }

  // Load first video into featured player (no autoplay)
  const firstId = extractVideoId(items[0].link);
  if (firstId && featured) {
    featured.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${firstId}?rel=0&modestbranding=1&color=white"
        title="${items[0].title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>`;
  }

  // Build thumbnail grid for all videos
  if (grid) {
    grid.innerHTML = items.map((item, i) => {
      const vid = extractVideoId(item.link);
      if (!vid) return '';
      const thumb = item.thumbnail || `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
      return `
        <div class="yt-thumb${i === 0 ? ' active' : ''}" onclick="loadVideo('${vid}', this)" data-vid="${vid}">
          <div class="yt-thumb-img">
            <img src="${thumb}" alt="${item.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${vid}/mqdefault.jpg'">
            <div class="yt-play-overlay">
              <div class="yt-play-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <div class="yt-thumb-info">
            <div class="yt-thumb-title">${item.title}</div>
            <div class="yt-thumb-date">${formatDate(item.pubDate)}</div>
          </div>
        </div>`;
    }).join('');
  }
}

// Fetch videos on page load
if (document.getElementById('ytGrid')) {
  fetch(API_URL)
    .then(r => r.json())
    .then(data => {
      if (data.status === 'ok' && data.items && data.items.length) {
        renderVideos(data.items);
      } else {
        showYtFallback();
      }
    })
    .catch(() => {
      showYtFallback();
    });
}

function showYtFallback() {
  const featured = document.getElementById('ytFeatured');
  if (!featured) return;
  
  featured.innerHTML = `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-card);gap:16px">
      <span style="font-size:48px">📺</span>
      <p style="color:var(--gray);font-size:15px">Watch all our videos on YouTube</p>
      <a href="https://www.youtube.com/@UTPOriginals" target="_blank" class="btn-yt" style="margin-top:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        Watch on YouTube
      </a>
    </div>`;
}
