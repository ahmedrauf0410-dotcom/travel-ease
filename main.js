/* =========================================================
   TRAVEL TWIN — main.js
   ========================================================= */

// ---------- Loading screen ----------
window.addEventListener('load', function () {
  var loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(function () { loader.classList.add('hide'); }, 450);
  }
});

document.addEventListener("DOMContentLoaded", function () {
    // 1. Sample Destinations Data (Aap ismein aur cities add kar sakte hain)
    const destinations = [
        { name: "Bali, Indonesia", url: "destinations.html?search=bali" },
        { name: "Paris, France", url: "destinations.html?search=paris" },
        { name: "Tokyo, Japan", url: "destinations.html?search=tokyo" },
        { name: "Santorini, Greece", url: "destinations.html?search=santorini" },
        { name: "Swiss Alps, Switzerland", url: "destinations.html?search=swiss" },
        { name: "Dubai, UAE", url: "destinations.html?search=dubai" }
    ];

    // 2. HTML Elements ko select karna
    const searchInput = document.querySelector(".tt-search-input");
    const searchButton = document.querySelector(".search-bar-tt button");
    const suggestionsBox = document.querySelector(".search-suggestions");

    // CSS Styling for Suggestions Dropdown (Agar aapki style.css mein nahi hai)
    suggestionsBox.style.position = "absolute";
    suggestionsBox.style.width = "100%";
    suggestionsBox.style.backgroundColor = "#white";
    suggestionsBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    suggestionsBox.style.borderRadius = "8px";
    suggestionsBox.style.zIndex = "1000";
    suggestionsBox.style.maxHeight = "200px";
    suggestionsBox.style.overflowY = "auto";

    // 3. Input field mein type karne par suggestions dikhana
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase().trim();
        suggestionsBox.innerHTML = ""; // Pehle purane suggestions saaf karein

        if (query === "") {
            suggestionsBox.style.display = "none";
            return;
        }

        // Matching destinations filter karein
        const filtered = destinations.filter(dest => 
            dest.name.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            suggestionsBox.style.display = "block";
            filtered.forEach(dest => {
                const item = document.createElement("div");
                item.className = "p-2 border-bottom suggestion-item";
                item.style.cursor = "pointer";
                item.style.padding = "10px 15px";
                item.style.color = "#333";
                item.innerText = dest.name;

                // Hover effect
                item.addEventListener("mouseover", () => item.style.backgroundColor = "#f4f6f5");
                item.addEventListener("mouseout", () => item.style.backgroundColor = "transparent");

                // Click karne par redirection
                item.addEventListener("click", function () {
                    searchInput.value = dest.name;
                    suggestionsBox.style.display = "none";
                    window.location.href = dest.url; // Target page par le jayein
                });

                suggestionsBox.appendChild(item);
            });
        } else {
            // Agar kuch match na ho
            suggestionsBox.style.display = "block";
            const noResult = document.createElement("div");
            noResult.className = "p-2 text-muted text-center";
            noResult.innerText = "No destination found";
            suggestionsBox.appendChild(noResult);
        }
    });

    // 4. Search Button click hone par direct Destinations page par bhejna
    searchButton.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query !== "") {
            window.location.href = "destinations.html?search=" + encodeURIComponent(query);
        }
    });

    // Enter key press karne par bhi search chal jaye
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });

    // Baahar click karne par suggestions box band ho jaye
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = "none";
        }
    });
});


// ---------- Sticky navbar shrink ----------
var navbarTT = document.querySelector('.navbar-tt');
window.addEventListener('scroll', function () {
  if (navbarTT) {
    navbarTT.classList.toggle('scrolled', window.scrollY > 30);
  }
  var btt = document.querySelector('.back-to-top');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
});

// ---------- Back to top ----------
document.addEventListener('click', function (e) {
  if (e.target.closest('.back-to-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ---------- Scroll reveal ----------
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('in'); });
}

// ---------- Stats counter ----------
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-count'), 10) || 0;
  var duration = 1400;
  var startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
  }
  requestAnimationFrame(step);
}
var counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length && 'IntersectionObserver' in window) {
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(function (el) { counterIO.observe(el); });
}

// ---------- Smart Search / Autocomplete ----------
var TT_DESTINATIONS = [
  { name: 'Bali, Indonesia', type: 'Island • Beach' },
  { name: 'Paris, France', type: 'City • Culture' },
  { name: 'Tokyo, Japan', type: 'City • Modern' },
  { name: 'Santorini, Greece', type: 'Island • Romantic' },
  { name: 'Cape Town, South Africa', type: 'City • Adventure' },
  { name: 'Banff, Canada', type: 'Mountains • Nature' },
  { name: 'Marrakech, Morocco', type: 'City • Heritage' },
  { name: 'Reykjavik, Iceland', type: 'City • Nature' },
  { name: 'Kyoto, Japan', type: 'City • Heritage' },
  { name: 'Queenstown, New Zealand', type: 'Adventure • Nature' },
  { name: 'Lisbon, Portugal', type: 'City • Coastal' },
  { name: 'Hunza Valley, Pakistan', type: 'Mountains • Nature' }
];

document.querySelectorAll('.tt-search-input').forEach(function (input) {
  var wrap = input.closest('.search-bar-tt') ? input.closest('.search-bar-tt').parentElement : input.parentElement;
  var box = wrap ? wrap.querySelector('.search-suggestions') : null;
  if (!box) return;
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    box.innerHTML = '';
    if (!q) { box.classList.remove('show'); return; }
    var matches = TT_DESTINATIONS.filter(function (d) { return d.name.toLowerCase().includes(q); }).slice(0, 6);
    if (!matches.length) {
      box.innerHTML = '<div class="sug-item text-muted">No destinations found</div>';
    } else {
      matches.forEach(function (m) {
        var item = document.createElement('div');
        item.className = 'sug-item';
        item.innerHTML = '<i class="bi bi-geo-alt-fill text-success"></i><div><div>' + m.name + '</div><small class="text-muted">' + m.type + '</small></div>';
        item.addEventListener('click', function () {
          input.value = m.name;
          box.classList.remove('show');
        });
        box.appendChild(item);
      });
    }
    box.classList.add('show');
  });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) box.classList.remove('show');
  });
});

// ---------- Password visibility toggle ----------
document.querySelectorAll('.toggle-pass').forEach(function (icon) {
  icon.addEventListener('click', function () {
    var input = icon.closest('.input-group-tt').querySelector('input');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
  });
});

// ---------- Bootstrap form validation ----------
(function () {
  var forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        var toastTriggerId = form.getAttribute('data-success-toast');
        if (toastTriggerId) {
          event.preventDefault();
          showToast(toastTriggerId);
        }
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ---------- Toast helper ----------
function showToast(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var toast = new bootstrap.Toast(el);
  toast.show();
}
document.querySelectorAll('[data-toast-target]').forEach(function (btn) {
  btn.addEventListener('click', function () { showToast(btn.getAttribute('data-toast-target')); });
});

// ---------- AI Assistant chat widget ----------
var aiResponses = [
  "Great choice! Based on your budget, I'd suggest traveling in the shoulder season for better rates.",
  "For that destination you'll typically need a tourist visa — processing takes about 5–7 working days.",
  "Pack light layers, a universal adapter, and a reusable water bottle — most travelers forget those!",
  "The average daily budget for that destination is around $65–$110 depending on your travel style.",
  "Weather looks mild this time of year — light jacket for evenings should be enough.",
  "I'd recommend booking flights 6–8 weeks ahead for the best fares on that route."
];
function ttInitChat(bodyId, formId, inputId) {
  var body = document.getElementById(bodyId);
  var form = document.getElementById(formId);
  var input = document.getElementById(inputId);
  if (!form || !body || !input) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    var userMsg = document.createElement('div');
    userMsg.className = 'ai-msg user';
    userMsg.textContent = text;
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    var typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    setTimeout(function () {
      typing.remove();
      var botMsg = document.createElement('div');
      botMsg.className = 'ai-msg bot';
      botMsg.textContent = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      body.appendChild(botMsg);
      body.scrollTop = body.scrollHeight;
    }, 1100);
  });
}
document.addEventListener('DOMContentLoaded', function () {
  ttInitChat('aiChatBody', 'aiChatForm', 'aiChatInput');
  var fab = document.getElementById('aiFab');
  var win = document.getElementById('aiChatWindow');
  if (fab && win) {
    fab.addEventListener('click', function () { win.classList.toggle('open'); });
    var closeBtn = document.getElementById('aiChatClose');
    if (closeBtn) closeBtn.addEventListener('click', function () { win.classList.remove('open'); });
  }
});

// ---------- Budget Simulator ----------
function ttCalcBudget() {
  var ids = ['flights', 'hotels', 'food', 'transport', 'activities'];
  var total = 0;
  ids.forEach(function (id) {
    var el = document.getElementById('bud-' + id);
    if (el) total += parseFloat(el.value) || 0;
  });
  var days = parseFloat((document.getElementById('bud-days') || {}).value) || 1;
  var travelers = parseFloat((document.getElementById('bud-travelers') || {}).value) || 1;
  var grand = total * travelers;
  var out = document.getElementById('bud-total');
  if (out) out.textContent = '$' + grand.toLocaleString(undefined, { maximumFractionDigits: 0 });
  var perDay = document.getElementById('bud-per-day');
  if (perDay) perDay.textContent = '$' + Math.round(grand / days).toLocaleString();
  ids.forEach(function (id) {
    var bar = document.getElementById('bar-' + id);
    var el = document.getElementById('bud-' + id);
    if (bar && el) {
      var val = parseFloat(el.value) || 0;
      var pct = total ? Math.round((val / total) * 100) : 0;
      bar.style.width = pct + '%';
      var lbl = document.getElementById('val-' + id);
      if (lbl) lbl.textContent = '$' + val.toLocaleString();
    }
  });
}
document.querySelectorAll('.bud-input').forEach(function (el) {
  el.addEventListener('input', ttCalcBudget);
});
if (document.getElementById('bud-total')) { ttCalcBudget(); }

// ---------- Active nav link ----------
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-tt .nav-link').forEach(function (link) {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();
