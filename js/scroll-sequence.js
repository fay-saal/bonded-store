import { scroll, animate, inView } from "https://esm.sh/motion";

export function initScrollSequence() {
  const wrapper = document.getElementById('bento-scroll-wrapper');
  if (!wrapper) return;

  const isMobile = window.innerWidth <= 768;

  // Animate Bento Header on enter
  inView(".bento-header", (info) => {
    animate(".bento-title", { y: [40, 0], opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    animate(".bento-subtitle", { y: [20, 0], opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.8, delay: 0.1, easing: [0.16, 1, 0.3, 1] });
  });

  // Animate Testimonials Header on enter
  inView(".testimonials-header", (info) => {
    animate(".testimonials-title", { y: [40, 0], opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    animate(".testimonials-subtitle", { y: [20, 0], opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.8, delay: 0.1, easing: [0.16, 1, 0.3, 1] });
  });

  // Mobile: simple fade-in per card (no sticky scroll)
  if (isMobile) {
    const cards = document.querySelectorAll('.bento-card--stacked');
    cards.forEach((card, index) => {
      // Reset any inline styles from desktop
      card.style.opacity = '';
      card.style.transform = '';
      card.style.transition = '';
      card.style.zIndex = '';

      inView(card, () => {
        animate(card, 
          { opacity: [0, 1], y: [30, 0], scale: [0.95, 1] }, 
          { duration: 0.6, delay: index * 0.08, easing: [0.16, 1, 0.3, 1] }
        );
      }, { margin: "0px 0px -50px 0px" });
    });
    return; // Skip desktop scroll-pinned behavior
  }

  // Desktop: scroll-pinned card stack
  const progressFill = document.getElementById('bento-progress-fill');
  const progressDot = document.getElementById('bento-progress-dot');
  
  const cards = [
    document.getElementById('bento-card-1'),
    document.getElementById('bento-card-2'),
    document.getElementById('bento-card-3'),
    document.getElementById('bento-card-4')
  ];

  scroll((rawProgress) => {
    const progress = Math.max(0, Math.min(1, rawProgress)); // clamp 0-1

    // 1. Update progress line and dot
    progressFill.style.height = `${progress * 100}%`;
    progressFill.style.width = '100%';
    progressDot.style.top = `${progress * 100}%`;
    progressDot.style.left = '50%';

    // 2. Determine which card is active based on 4 segments
    const activeIndex = Math.min(3, Math.floor(progress * 4));

    // 3. Apply styles to cards
    cards.forEach((card, index) => {
      if (!card) return;
      
      card.style.transition = 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

      if (index === activeIndex) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.zIndex = '5';
      } else if (index < activeIndex) {
        card.style.opacity = '0.3';
        card.style.transform = 'translateY(-30px) scale(0.95)';
        card.style.zIndex = '1';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) scale(0.95)';
        card.style.zIndex = '1';
      }
    });

  }, {
    target: wrapper,
    offset: ["start start", "end end"] 
  });
}

// Check if ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollSequence);
} else {
  initScrollSequence();
}
