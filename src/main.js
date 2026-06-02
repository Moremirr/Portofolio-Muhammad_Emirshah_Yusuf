import './style.css';

// DOM Elements
const submarine = document.getElementById('submarine');
const root = document.documentElement;

// Colors for interpolation (RGB format)
// Surface: #4facfe (79, 172, 254)
// Shallow: #00f2fe (0, 242, 254)
// Twilight: #0a4b78 (10, 75, 120)
// Trench: #011124 (1, 17, 36)
const colors = [
  { r: 79, g: 172, b: 254 }, // 0%
  { r: 0, g: 242, b: 254 },  // 33%
  { r: 10, g: 75, b: 120 },  // 66%
  { r: 1, g: 17, b: 36 }     // 100%
];

// Calculate color interpolation
function interpolateColor(color1, color2, factor) {
  const r = Math.round(color1.r + factor * (color2.r - color1.r));
  const g = Math.round(color1.g + factor * (color2.g - color1.g));
  const b = Math.round(color1.b + factor * (color2.b - color1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

// Handle scroll
function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight));
  
  // 1. Submarine Movement
  // Move it down based on scroll, with a slight parallax feel
  // Submarine stops before the very bottom
  const subMaxY = window.innerHeight * 0.8; 
  const subY = scrollPercent * subMaxY;
  
  // Angle it slightly when scrolling down
  submarine.style.transform = `translateY(${subY}px) rotate(${scrollPercent * 10}deg)`;

  // 2. Background Color Transition
  let bgColor;
  if (scrollPercent < 0.33) {
    const factor = scrollPercent / 0.33;
    bgColor = interpolateColor(colors[0], colors[1], factor);
  } else if (scrollPercent < 0.66) {
    const factor = (scrollPercent - 0.33) / 0.33;
    bgColor = interpolateColor(colors[1], colors[2], factor);
  } else {
    const factor = (scrollPercent - 0.66) / 0.34;
    bgColor = interpolateColor(colors[2], colors[3], factor);
  }
  
  root.style.setProperty('--bg-color', bgColor);
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Create Bubbles
function createBubbles() {
  const container = document.getElementById('bubbles-container');
  const bubbleCount = 20;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Randomize properties
    const size = Math.random() * 20 + 5; // 5px to 25px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 10 + 5; // 5s to 15s
    const delay = Math.random() * 5; // 0s to 5s

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    container.appendChild(bubble);
  }
}

// Initial setup
createBubbles();
handleScroll(); // Set initial color and position
