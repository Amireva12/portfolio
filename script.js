

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const heroScroll = document.querySelector('.hero-scroll');
  const reveals = Array.from(document.querySelectorAll('.hero-pin .reveal'));
  if (!heroScroll || reveals.length === 0) return;

  const steps = reveals.length;


  const FADE_IN = 0.4;
  const HOLD = 0.1;
  const FADE_OUT = 0.3;

  function update() {
    const rect = heroScroll.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));
    const stepProgress = progress * steps;

    reveals.forEach((el, i) => {
      const distance = stepProgress - i;
      let opacity;
      if (distance < -FADE_IN || distance > HOLD + FADE_OUT) {
        opacity = 0;
      } else if (distance < 0) {
        opacity = 1 + distance / FADE_IN;
      } else if (distance > HOLD) {
        opacity = 1 - (distance - HOLD) / FADE_OUT;
      } else {
        opacity = 1;
      }
      opacity = Math.min(1, Math.max(0, opacity));

      el.style.opacity = opacity;
      el.style.transform = `translateY(${(1 - opacity) * 20}px)`;
      el.classList.toggle('is-active', opacity > 0.05);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener('resize', update);
  update();
})();
