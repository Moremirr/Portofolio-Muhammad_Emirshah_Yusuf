import './style.css';

// DOM Elements
const submarine = document.getElementById('submarine');
const root = document.documentElement;

// Ocean Depth Colors
// Surface: #f5fcff (245, 252, 255) - Very light sky/water
// Shallow: #c7eefb (199, 238, 251) - Light blue
// Mid: #55b2d4 (85, 178, 212) - Mid blue
// Twilight: #1b6287 (27, 98, 135) - Darker blue
// Trench: #031c2d (3, 28, 45) - Very dark blue
const colors = [
  { r: 245, g: 252, b: 255 }, // 0%
  { r: 199, g: 238, b: 251 }, // 25%
  { r: 85, g: 178, b: 212 },  // 50%
  { r: 27, g: 98, b: 135 },   // 75%
  { r: 3, g: 28, b: 45 }      // 100%
];

// Calculate color interpolation
function interpolateColor(color1, color2, factor) {
  const r = Math.round(color1.r + factor * (color2.r - color1.r));
  const g = Math.round(color1.g + factor * (color2.g - color1.g));
  const b = Math.round(color1.b + factor * (color2.b - color1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

// Calculate perceived brightness (YIQ formula) to determine text color
function getBrightness(r, g, b) {
  return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

// Handle scroll
function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
  
  // 1. Submarine Movement
  const subMaxY = window.innerHeight * 0.8; 
  const subY = scrollPercent * subMaxY;
  submarine.style.transform = `translateY(${subY}px) rotate(${scrollPercent * 15}deg)`;

  // 2. Background Color Transition
  let bgColor;
  let currentR, currentG, currentB;
  
  if (scrollPercent < 0.25) {
    const factor = scrollPercent / 0.25;
    currentR = interpolateColor(colors[0], colors[1], factor);
    bgColor = currentR;
    const r = colors[0].r + factor * (colors[1].r - colors[0].r);
    const g = colors[0].g + factor * (colors[1].g - colors[0].g);
    const b = colors[0].b + factor * (colors[1].b - colors[0].b);
    currentR = r; currentG = g; currentB = b;
  } else if (scrollPercent < 0.5) {
    const factor = (scrollPercent - 0.25) / 0.25;
    bgColor = interpolateColor(colors[1], colors[2], factor);
    currentR = colors[1].r + factor * (colors[2].r - colors[1].r);
    currentG = colors[1].g + factor * (colors[2].g - colors[1].g);
    currentB = colors[1].b + factor * (colors[2].b - colors[1].b);
  } else if (scrollPercent < 0.75) {
    const factor = (scrollPercent - 0.5) / 0.25;
    bgColor = interpolateColor(colors[2], colors[3], factor);
    currentR = colors[2].r + factor * (colors[3].r - colors[2].r);
    currentG = colors[2].g + factor * (colors[3].g - colors[2].g);
    currentB = colors[2].b + factor * (colors[3].b - colors[2].b);
  } else {
    const factor = (scrollPercent - 0.75) / 0.25;
    bgColor = interpolateColor(colors[3], colors[4], factor);
    currentR = colors[3].r + factor * (colors[4].r - colors[3].r);
    currentG = colors[3].g + factor * (colors[4].g - colors[3].g);
    currentB = colors[3].b + factor * (colors[4].b - colors[3].b);
  }
  
  root.style.setProperty('--bg-color', bgColor);
  
  // 3. Text Color Transition based on background brightness
  const brightness = getBrightness(currentR, currentG, currentB);
  if (brightness > 130) {
    // Light background, use dark text
    root.style.setProperty('--text-color', 'var(--text-dark)');
    document.body.setAttribute('data-theme', 'light');
    
    // Change bubble color to match dark text
    document.documentElement.style.setProperty('--bubble-color', 'rgba(0, 0, 0, 0.15)');
  } else {
    // Dark background, use light text
    root.style.setProperty('--text-color', 'var(--text-light)');
    document.body.setAttribute('data-theme', 'dark');
    
    // Change bubble color to match light text
    document.documentElement.style.setProperty('--bubble-color', 'rgba(255, 255, 255, 0.2)');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', handleScroll);

// Create Bubbles
function createBubbles() {
  const container = document.getElementById('bubbles-container');
  const bubbleCount = 15;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 30 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 5;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    
    // Set dynamic bubble color
    bubble.style.borderColor = 'var(--bubble-color, rgba(255,255,255,0.2))';

    container.appendChild(bubble);
  }
}

// Initial setup
setTimeout(() => {
  createBubbles();
  handleScroll();
}, 100);
