(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.reveal, .reveal-group');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((target) => observer.observe(target));
  }

  const visitorId = String(Math.floor(10000 + Math.random() * 90000));
  const visitorLabel = document.querySelector('#visitor-label');
  const visitorInput = document.querySelector('#visitor-id-input');
  visitorLabel.textContent = `From Visitor #${visitorId}`;
  visitorInput.value = visitorId;

  const form = document.querySelector('.message-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  let submitting = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!form.reportValidity()) return;

    submitting = true;
    submitButton.disabled = true;
    status.textContent = 'Sending your note…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Message submission failed');
      form.reset();
      visitorInput.value = visitorId;
      status.textContent = 'Thank you—your note has been sent.';
    } catch (error) {
      status.textContent = 'Your note could not be sent. Please try again in a moment.';
    } finally {
      submitting = false;
      submitButton.disabled = false;
    }
  });
})();
