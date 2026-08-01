import { animate, stagger } from "https://esm.sh/motion";

document.addEventListener("DOMContentLoaded", () => {
  const orbitContainer = document.getElementById("hero-orbit");
  const brand = document.getElementById("hero-brand");
  const tagline = document.getElementById("hero-tagline");
  const cta = document.getElementById("hero-cta");
  const glow = document.getElementById("hero-glow");
  
  if (!orbitContainer || !brand) return;

  // Ensure ICONS exists
  if (typeof ICONS === 'undefined') {
    console.error("ICONS not defined. Make sure main.js is loaded before hero-animation.js.");
    return;
  }

  // 1. Generate Icons for the Orbit Ring
  const iconKeys = Object.keys(ICONS).filter(k => k !== 'cart' && k !== 'cartSmall' && k !== 'user' && k !== 'search' && k !== 'trash');
  
  if (!iconKeys || iconKeys.length === 0) {
    console.error("No valid icons found for orbit ring.");
    return;
  }

  const totalIcons = Math.min(12, iconKeys.length); 
  const radius = window.innerWidth < 768 ? 140 : 250;
  
  const iconElements = [];
  
  for (let i = 0; i < totalIcons; i++) {
    const angle = (i / totalIcons) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Starting coordinates (far outside)
    const startDistance = Math.max(window.innerWidth, window.innerHeight);
    const startX = Math.cos(angle) * startDistance;
    const startY = Math.sin(angle) * startDistance;
    
    const iconDiv = document.createElement("div");
    iconDiv.className = "hero-cinematic__icon-badge";
    iconDiv.innerHTML = ICONS[iconKeys[i]];
    
    // Initial hidden state
    // Set native transforms using x, y, scale for safer animation with Motion
    iconDiv.style.transform = `translate(${startX}px, ${startY}px) scale(0)`;
    iconDiv.style.opacity = 0;
    
    // Store target positions
    iconDiv.dataset.targetX = x;
    iconDiv.dataset.targetY = y;
    iconDiv.dataset.startX = startX;
    iconDiv.dataset.startY = startY;
    
    orbitContainer.appendChild(iconDiv);
    iconElements.push(iconDiv);
  }

  // Initial state for text
  brand.style.opacity = 0;
  tagline.style.transform = "translateY(20px)";
  tagline.style.opacity = 0;
  cta.style.opacity = 0;
  glow.style.transform = "translate(-50%, -50%) scale(0)";
  glow.style.opacity = 0;

  if (iconElements.length === 0) return;

  // 2. Orchestrate Animation
  
  // A. Icons fly in (0.3s - 1.2s)
  setTimeout(() => {
    iconElements.forEach((el, i) => {
      // Set initial state manually, since spring doesn't support array keyframes
      el.style.transform = `translate(${parseFloat(el.dataset.startX)}px, ${parseFloat(el.dataset.startY)}px) scale(0)`;
      el.style.opacity = '0';
      
      animate(el, { 
        x: parseFloat(el.dataset.targetX),
        y: parseFloat(el.dataset.targetY),
        scale: 1 
      }, { 
        duration: 0.9, 
        delay: i * 0.05, 
        easing: "ease-out" 
      });
      animate(el, { opacity: [0, 1] }, { duration: 0.5, delay: i * 0.05, easing: "ease-out" });
    });
  }, 300);

  // B. Initiate slow continuous orbit rotation (1.2s onwards)
  setTimeout(() => {
    // Fade down slightly
    animate(orbitContainer, { opacity: [1, 0.25] }, { duration: 1.5, easing: "ease-in-out" });

    // Rotate container
    animate(
      orbitContainer,
      { rotate: [0, 360] },
      { duration: 40, repeat: Infinity, easing: "linear" }
    );
    
    // Counter-rotate icons
    iconElements.forEach(el => {
      animate(
        el,
        { rotate: [0, -360] },
        { duration: 40, repeat: Infinity, easing: "linear" }
      );
    });
  }, 1200);

  // C. Brand "ignites" with radial flash (1.4s)
  setTimeout(() => {
    // Glow Flash
    animate(
      glow,
      { x: "-50%", y: "-50%", scale: [0, 3], opacity: [0, 0.8, 0] },
      { duration: 0.8, easing: "ease-out" }
    );
    
    // Premium Text Reveal
    brand.style.opacity = 1;
    brand.style.transform = "none";
    
    const letters = brand.querySelectorAll('.hero-cinematic__brand-text span');
    const dot = brand.querySelector('.hero-cinematic__brand-dot');
    
    const allTextElements = [...Array.from(letters)];
    if (dot) allTextElements.push(dot);

    if (allTextElements.length > 0) {
      allTextElements.forEach(l => {
        l.style.opacity = '0';
        l.style.transform = 'translateY(40px) scale(0.8)';
        l.style.filter = 'blur(10px)';
      });

      animate(
        allTextElements,
        { 
          y: [40, 0], 
          scale: [0.8, 1.1, 1],
          opacity: [0, 1],
          filter: ["blur(10px)", "blur(0px)"]
        },
        { 
          duration: 1.0, 
          delay: stagger(0.06),
          easing: [0.16, 1, 0.3, 1] // Custom snappy spring-like bezier
        }
      );
    }
  }, 1400);

  // D. Tagline and CTA fade in (2.2s)
  setTimeout(() => {
    animate(
      tagline,
      { y: [20, 0], opacity: [0, 1], filter: ["blur(5px)", "blur(0px)"] },
      { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  }, 2200);

  setTimeout(() => {
    animate(
      cta,
      { y: [10, 0], opacity: [0, 1], filter: ["blur(5px)", "blur(0px)"] },
      { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  }, 2400);

});
