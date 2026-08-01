/* ============================================================
   BONDED STORE - PREMIUM UI ANIMATIONS (Vanilla JS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SCROLL PROGRESS BAR
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });


  // 2. MAGNETIC BUTTONS
  const magneticButtons = document.querySelectorAll('.btn--primary-large');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move the button slightly towards the cursor
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Reset position with spring-like feel (handled by CSS transition)
      btn.style.transform = `translate(0px, 0px)`;
    });
  });


  // 3. CART ICON BOUNCE (Hooking into state change)
  const cartIcon = document.getElementById('nav-cart');
  const originalUpdateBadge = window.updateCartBadge;
  
  // Intercept the cart badge update to add animation
  if (originalUpdateBadge && cartIcon) {
    window.updateCartBadge = function() {
      originalUpdateBadge();
      
      // Remove class if it exists to allow re-triggering
      cartIcon.classList.remove('cart-bounce');
      
      // Force reflow
      void cartIcon.offsetWidth;
      
      // Add animation class
      cartIcon.classList.add('cart-bounce');
    };
  }


  // 4. INTERSECTION OBSERVER FOR PRODUCT CARDS (STAGGER)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const productObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay based on index (rough approximation for grid rows)
        const delay = (index % 4) * 100;
        setTimeout(() => {
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('reveal-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // We need to observe cards after they are rendered.
  // We can hook into renderProducts() or just run a MutationObserver on the grid.
  const grid = document.getElementById('product-grid');
  if (grid) {
    const renderObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('product-card')) {
              node.classList.add('reveal-hidden');
              productObserver.observe(node);
            }
          });
        }
      });
    });
    renderObserver.observe(grid, { childList: true });
  }


  // 5. SPA PAGE TRANSITIONS
  const main = document.querySelector('main');
  const originalHandleRouting = window.handleRouting;

  if (originalHandleRouting && main) {
    window.handleRouting = function() {
      // Exit animation
      main.classList.remove('page-enter-active');
      main.classList.add('page-exit');
      
      // Wait for exit transition, then route and enter
      setTimeout(() => {
        originalHandleRouting(); // Actually switch display blocks
        
        main.classList.remove('page-exit');
        main.classList.add('page-enter');
        
        // Force reflow
        void main.offsetWidth;
        
        // Trigger enter transition
        main.classList.add('page-enter-active');
      }, 300); // matches CSS transition duration
    };
  }

});

