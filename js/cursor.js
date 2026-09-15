export function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // Touch device

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.innerHTML = '<span class="cursor-text"></span>';
  
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Set dot immediately
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  // Smooth lerp for ring (increased speed to reduce delay)
  function render() {
    ringX += (mouseX - ringX) * 0.6;
    ringY += (mouseY - ringY) * 0.6;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  document.body.addEventListener('mouseover', (e) => {
    const target = e.target.closest('button, a, .product-card');
    if (target) {
      ring.classList.add('cursor-ring--hover');
      dot.style.opacity = '0';
      
      const productCard = e.target.closest('.product-card');
      if (productCard && !e.target.closest('button, a:not(.product-card)')) {
        ring.querySelector('.cursor-text').textContent = "View";
      } else {
        ring.querySelector('.cursor-text').textContent = "";
      }
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const target = e.target.closest('button, a, .product-card');
    if (target) {
      // Check if we are moving to a child of the current target
      if (e.relatedTarget && target.contains(e.relatedTarget)) {
        return; // Don't remove hover state if moving between children
      }
      
      ring.classList.remove('cursor-ring--hover');
      dot.style.opacity = '1';
      ring.querySelector('.cursor-text').textContent = "";
    }
  });
}

// Initialize immediately if module loaded
initCursor();
