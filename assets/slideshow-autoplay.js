function setupSlideshowAutoplay(scope = document) {
  scope.querySelectorAll('.slideshow').forEach((slider) => {
    if (slider.dataset.autoplayReady === 'true') return;
    slider.dataset.autoplayReady = 'true';

    if (slider.dataset.autoplay !== 'true') return;

    const track = slider.querySelector('.slides');
    const slides = slider.querySelectorAll('.slide');
    const interval = Number(slider.dataset.autoplayInterval) || 5000;

    if (!track || slides.length < 2) return;

    let timer;
    let paused = false;

    const nextSlide = () => {
      if (paused) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      const next = (current + 1) % slides.length;
      track.scrollTo({
        left: next * track.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    };

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(nextSlide, interval);
    };

    slider.addEventListener('mouseenter', () => { paused = true; });
    slider.addEventListener('mouseleave', () => { paused = false; start(); });
    slider.addEventListener('focusin', () => { paused = true; });
    slider.addEventListener('focusout', () => { paused = false; start(); });
    start();
  });
}

setupSlideshowAutoplay();
document.addEventListener('shopify:section:load', (event) => setupSlideshowAutoplay(event.target));
