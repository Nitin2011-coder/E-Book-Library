// Generate book cards only when the page provides a book list and data
const bookGrid = document.querySelector('.book-grid');
if (bookGrid && typeof books !== 'undefined' && Array.isArray(books)) {
    books.forEach((book) => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p>by ${book.author}</p>
            <img src="${book.cover}" alt="${book.title} cover">
        `;
        bookGrid.appendChild(bookCard);
    });
}

function searchBooks() {
  // 1. Get the search text
  let input = document.getElementById('search-input').value.toLowerCase();
 
  // 2. Get all book items
  let books = document.getElementsByClassName('book-item');

  // 3. Loop through each book
  for (let i = 0; i < books.length; i++) {
    let title = books[i].textContent.toLowerCase();
   
    // 4. If title matches search, show it. Otherwise, hide it.
    if (title.includes(input)) {
      books[i].style.display = "";
    } else {
      books[i].style.display = "none";
    }
  }
}

// ===========================
// FAVORITES & POINTS SYSTEM
// ===========================

/**
 * Get favorites for a specific user
 */
function getFavorites(userId) {
  const favorites = localStorage.getItem(`favorites_${userId}`);
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Save favorites for a specific user
 */
function saveFavorites(userId, favorites) {
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
}

/**
 * Get points for a specific user
 */
function getPoints(userId) {
  const points = localStorage.getItem(`points_${userId}`);
  return points ? parseInt(points) : 0;
}

/**
 * Save points for a specific user
 */
function savePoints(userId, points) {
  localStorage.setItem(`points_${userId}`, points.toString());
}

/**
 * Toggle favorite status of a book
 */
function toggleFavorite(bookTitle, event) {
  event.preventDefault();
  event.stopPropagation();
  
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert('Please login to add favorites');
    window.location.href = 'more.html';
    return;
  }

  const favorites = getFavorites(currentUser);
  const button = event.target;
  const isFavorite = favorites.includes(bookTitle);

  if (isFavorite) {
    // Remove from favorites
    const index = favorites.indexOf(bookTitle);
    favorites.splice(index, 1);
    button.classList.remove('active');
    button.textContent = '☆';
    // Deduct 5 points for removing a favorite
    const currentPoints = getPoints(currentUser);
    if (currentPoints >= 5) {
      savePoints(currentUser, currentPoints - 5);
    }
    showPointsToast(`Removed "${bookTitle}" from favorites. -5 Points`, 'info');
  } else {
    // Add to favorites
    favorites.push(bookTitle);
    button.classList.add('active');
    button.textContent = '★';
    // Award 5 points for adding a favorite
    addPointsToUser(currentUser, 5);
    showPointsToast(`Added "${bookTitle}" to favorites! +5 Points ⭐`, 'success');
  }

  saveFavorites(currentUser, favorites);
  updateAllFavoritesUI(currentUser);
}

/**
 * Update favorite button status on page load
 */
function updateAllFavoritesUI(userId) {
  const favorites = getFavorites(userId);
  const buttons = document.querySelectorAll('.favorite-btn');
  
  buttons.forEach(btn => {
    // Get the book title from the next h2 element - extract text content properly
    const h2Element = btn.nextElementSibling;
    let bookTitle = '';
    
    if (h2Element && h2Element.tagName === 'H2') {
      // Extract text between <u> tags or direct text
      const uElement = h2Element.querySelector('u');
      if (uElement) {
        bookTitle = uElement.textContent.trim();
      } else {
        bookTitle = h2Element.textContent.trim();
      }
    }
    
    // Check if this book is in favorites
    const isFavorite = bookTitle && favorites.includes(bookTitle);
    
    if (isFavorite) {
      btn.classList.add('active');
      btn.textContent = '★';
    } else {
      btn.classList.remove('active');
      btn.textContent = '☆';
    }
  });

  updatePointsDisplay();
}

/**
 * Add points to user
 */
function addPointsToUser(userId, points) {
  const currentPoints = getPoints(userId);
  savePoints(userId, currentPoints + points);
  updatePointsDisplay();
}

/**
 * Spend points from user (for rewards)
 */
function spendPoints(userId, points) {
  const currentPoints = getPoints(userId);
  if (currentPoints >= points) {
    savePoints(userId, currentPoints - points);
    updatePointsDisplay();
    return true;
  }
  return false;
}

/**
 * Update points display on the page
 */
function updatePointsDisplay() {
  const currentUser = localStorage.getItem('currentUser');
  const userPoints = getPoints(currentUser);
  const pointsElement = document.getElementById('pointsDisplay');
  if (pointsElement) {
    pointsElement.textContent = userPoints;
  }
}

/**
 * Show points toast notification
 */
function showPointsToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'points-toast';
  
  let icon = '✓';
  if (type === 'success') {
    icon = '✓';
  } else if (type === 'info') {
    icon = 'ℹ';
  } else if (type === 'error') {
    icon = '✕';
  }
  
  toast.textContent = `${icon} ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('remove');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Initialize favorites on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    updateAllFavoritesUI(currentUser);
    updatePointsDisplay();
  }
});

// Points System - Daily Bonus
function grantDailyBonus(userId) {
  const lastBonusDate = localStorage.getItem(`lastBonus_${userId}`);
  const today = new Date().toDateString();

  if (lastBonusDate !== today) {
    addPointsToUser(userId, 10);
    localStorage.setItem(`lastBonus_${userId}`, today);
    showPointsToast('Daily Bonus! +10 Points ⭐', 'success');
  }
}

// Grant daily bonus on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    grantDailyBonus(currentUser);
  }
});

/* Sine animation: draws an animated colorful sine wave on the canvas with floating dots */
function initSineAnimation() {
  const canvas = document.getElementById('sineCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.clientWidth * ratio);
    canvas.height = Math.floor(canvas.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  let t = 0;
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // background glow
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(102,126,234,0.06)');
    grad.addColorStop(1, 'rgba(118,75,162,0.06)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // draw multiple sine lines
    for (let layer = 0; layer < 3; layer++) {
      const offset = layer * 0.6;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const px = x;
        const freq = 0.01 + layer * 0.005;
        const amplitude = 18 + layer * 10;
        const y = h / 2 + Math.sin((x * freq) + t * (0.02 + layer * 0.01)) * amplitude * Math.cos(t * 0.002 + layer);
        if (x === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.lineWidth = 3 - layer;
      const strokeGrad = ctx.createLinearGradient(0, 0, w, 0);
      strokeGrad.addColorStop(0, `hsla(${200 + layer * 40},90%,60%,${0.9 - layer*0.25})`);
      strokeGrad.addColorStop(1, `hsla(${320 - layer * 30},90%,60%,${0.6 - layer*0.18})`);
      ctx.strokeStyle = strokeGrad;
      ctx.stroke();
    }

    // floating dots along main sine
    for (let i = 0; i < 22; i++) {
      const x = (i / 22) * w;
      const y = h / 2 + Math.sin((x * 0.012) + t * 0.018) * 24;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.85 - (i%6)*0.08})`;
      ctx.shadowColor = 'rgba(255,255,255,0.25)';
      ctx.shadowBlur = 8;
      ctx.arc(x, y, 4 + (Math.sin(t * 0.01 + i) + 1) * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    t += 1;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

// Initialize sine if present on page
window.addEventListener('DOMContentLoaded', () => {
  try { initSineAnimation(); } catch (e) { console.warn('sine init failed', e); }
});
