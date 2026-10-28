/* TOTALITY landing — form behavior
   One job: validate, POST to /api/subscribe, show success or error.
   No timers, no state machines (scope cost-driver rule). */

(function () {
  'use strict';

  var form = document.getElementById('signup-form');
  var input = document.getElementById('email');
  var button = document.getElementById('submit-btn');
  var status = document.getElementById('status');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function show(text, cls) {
    status.textContent = text;
    status.className = 'status' + (cls ? ' ' + cls : '');
    input.classList.remove('error-state');
  }

  function showError(text) {
    status.textContent = text;
    status.className = 'status error';
    input.classList.add('error-state');
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var email = input.value.trim();

    if (!email) {
      showError('Enter an email and I\'ll hold you a seat for totality.');
      input.focus();
      return;
    }

    if (!EMAIL_RE.test(email)) {
      showError('That doesn\'t look like an email — check it and send again.');
      // Error copy is the only unlocked wording on the page — tone-check when convenient.
      return;
    }

    show('Reaching the Core…', '');
    button.disabled = true;

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (res) {
        button.disabled = false;
        if (res.ok) {
          show('You\'re on the list. Watch your inbox as the sky goes dark.', 'success');
          form.reset();
        } else if (res.data && res.data.error) {
          showError(res.data.error);
        } else {
          showError('Something went wrong. Try again in a moment.');
        }
      })
      .catch(function () {
        button.disabled = false;
        showError('Can\'t reach the Core right now — check your connection and try again.');
      });
  });

  /* ---------------------------------------------------------------
     Visual pass (UI only): the panel drifts up when it comes into
     view, and the sky leans a few pixels with a fine pointer. Both
     are decoration — nothing here touches validation or the POST.
     --------------------------------------------------------------- */

  var panel = document.querySelector('.panel');

  if (panel && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          panel.classList.add('is-visible');
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(panel);
  } else if (panel) {
    panel.classList.add('is-visible');
  }

  var hero = document.querySelector('.hero');
  var sky = document.querySelector('.sky');
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  if (hero && sky && finePointer && !reduceMotion.matches) {
    var frame = null;
    var px = 0;
    var py = 0;

    var paint = function () {
      frame = null;
      sky.style.setProperty('--px', px.toFixed(3));
      sky.style.setProperty('--py', py.toFixed(3));
    };

    hero.addEventListener('pointermove', function (ev) {
      var box = hero.getBoundingClientRect();
      px = (ev.clientX - box.left) / box.width - 0.5;
      py = (ev.clientY - box.top) / box.height - 0.5;
      if (!frame) frame = window.requestAnimationFrame(paint);
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      px = 0;
      py = 0;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });
  }
})();
