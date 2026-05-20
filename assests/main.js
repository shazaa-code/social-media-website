/* ================================================
   UNFINISHED — main.js
   One file. Drop it in every page before </body>
   <script src="main.js"></script>
================================================ */


/* ── 1. MOBILE NAV TOGGLE ── */
const ham = document.getElementById('ham');
if (ham) {
  ham.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      document.getElementById('navLinks')?.classList.remove('open');
    }
  });
}


/* ── 2. MARK ACTIVE NAV LINK ── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});


/* ── 3. VOTE BUTTONS (feed, categories, search, trending) ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.vote-btn');
  if (!btn) return;
  const col   = btn.closest('.vote-col');
  const count = col?.querySelector('.vote-count');
  if (!count) return;
  const up  = btn.dataset.dir !== 'down';
  const was = btn.classList.contains('voted');
  // reset all vote btns in this col
  col.querySelectorAll('.vote-btn').forEach(b => { b.classList.remove('voted'); b.style.color = ''; });
  let n = parseInt(count.textContent.replace(/[^0-9]/g, '')) || 0;
  if (was) { count.textContent = n - 1; }          // undo
  else     { btn.classList.add('voted'); btn.style.color = 'var(--accent)'; count.textContent = up ? n + 1 : Math.max(0, n - 1); }
});


/* ── 4. RELATE / HEART BUTTON (post page) ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.rxn-btn[data-relate]');
  if (!btn) return;
  const heart = btn.querySelector('[data-heart]');
  const count = btn.querySelector('[data-count]');
  if (!heart || !count) return;
  const on = btn.classList.toggle('active');
  heart.textContent = on ? '♥' : '♡';
  heart.style.color = on ? 'var(--accent)' : '';
  count.textContent = parseInt(count.textContent) + (on ? 1 : -1);
});


/* ── 5. SAVE / BOOKMARK BUTTON ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-save]');
  if (!btn) return;
  const on = btn.classList.toggle('saved');
  btn.style.color = on ? 'var(--accent)' : '';
  if (btn.querySelector('[data-label]')) {
    btn.querySelector('[data-label]').textContent = on ? 'Saved' : 'Save';
  }
});


/* ── 6. PASSWORD SHOW / HIDE ── */
document.querySelectorAll('[data-pw-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.querySelector(btn.dataset.pwToggle);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
});


/* ── 7. PASSWORD STRENGTH (register page) ── */
const pwInput = document.querySelector('[data-pw-strength]');
if (pwInput) {
  pwInput.addEventListener('input', () => {
    const v = pwInput.value;
    const fill  = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (!fill || !label) return;
    let s = 0;
    if (v.length >= 8)           s++;
    if (/[A-Z]/.test(v))        s++;
    if (/[0-9]/.test(v))        s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const colors = ['','#e07070','#e8a86b','#9C8ADE','#7edea0'];
    const labels = ['','Weak','Fair','Good','Strong'];
    fill.style.width      = s * 25 + '%';
    fill.style.background = colors[s];
    label.textContent     = labels[s];
  });
}


/* ── 8. SIMPLE FORM VALIDATION ── */
// Works for login & register. Add data-required to inputs.
const mainForm = document.querySelector('[data-form]');
if (mainForm) {
  mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    mainForm.querySelectorAll('[data-required]').forEach(input => {
      const errId = input.dataset.err;
      const err   = errId ? document.getElementById(errId) : null;
      let bad = false;

      if (input.dataset.required === 'email') {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      } else if (input.dataset.required === 'min8') {
        bad = input.value.length < 8;
      } else if (input.dataset.required === 'match') {
        const target = document.querySelector(input.dataset.match);
        bad = !target || input.value !== target.value;
      } else {
        bad = input.value.trim().length < 2;
      }

      if (err) err.style.display = bad ? 'block' : 'none';
      if (bad) ok = false;
    });

    if (!ok) return;

    const msg  = document.getElementById('formMsg');
    const dest = mainForm.dataset.redirect || 'index.html';
    if (msg) { msg.textContent = 'Just a sec…'; msg.className = 'form-msg'; }
    setTimeout(() => {
      if (msg) { msg.textContent = '✓ Done! Redirecting…'; msg.className = 'form-msg ok'; }
      setTimeout(() => location.href = dest, 900);
    }, 700);
  });
}


/* ── 9. AUTO-RESIZE TEXTAREA ── */
document.querySelectorAll('textarea[data-autoresize]').forEach(el => {
  el.addEventListener('input', () => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  });
});


/* ── 10. SEARCH INPUT → live filter (search page only) ── */
const searchInput = document.getElementById('globalSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('[data-searchable]').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}
