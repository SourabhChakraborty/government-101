/* NYC Gov for Builders — playbook progressive-disclosure enhancement.
   This is an ENHANCEMENT only. With JS off, every <details class="step"> is
   rendered open (via the no-js rule in playbook.css), so the whole playbook
   is readable and followable. This script:
     1. collapses later steps so the trail reveals one stage at a time;
     2. opens the next step automatically as you finish one;
     3. keeps a "step N of M" progress indicator in sync;
     4. highlights the source-map node for the step you're on;
     5. collapses the sticky source map to a slim bar once it pins.
   Motion is limited to CSS transitions, which the global prefers-reduced-motion
   reset in style.css already neutralizes. */
(function () {
  "use strict";
  var root = document.querySelector("[data-playbook]");
  var steps = root ? Array.prototype.slice.call(root.querySelectorAll(".step")) : [];

  // Signal that JS is on so the no-js "force open" rule is dropped.
  document.documentElement.classList.add("js");

  var fill = document.getElementById("pb-progress-fill");
  var label = document.getElementById("pb-progress-label");
  var mapNodes = Array.prototype.slice.call(document.querySelectorAll(".sourcemap .map-node"));
  var total = steps.length;

  function furthestOpenIndex() {
    var idx = 0;
    steps.forEach(function (s, i) { if (s.open) idx = i; });
    return idx;
  }

  function syncCurrentNode(current) {
    if (!mapNodes.length) return;
    var target = "#step-" + current;
    mapNodes.forEach(function (n) {
      n.classList.toggle("is-current", n.getAttribute("href") === target);
    });
  }

  function updateProgress() {
    if (!total) return;
    var current = furthestOpenIndex() + 1;
    var pct = Math.round((current / total) * 100);
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = "Step " + current + " of " + total;
    syncCurrentNode(current);
  }

  if (total) {
    // Start: first step open, the rest collapsed.
    steps.forEach(function (s, i) { s.open = (i === 0); });
    updateProgress();
    steps.forEach(function (step, i) {
      step.addEventListener("toggle", function () {
        // When a step is opened, surface the next one so progress feels earned.
        if (step.open && steps[i + 1] && !steps[i + 1].open) steps[i + 1].open = true;
        updateProgress();
      });
    });
  }

  // ---- sticky source-map collapse ---------------------------------------
  var map = document.querySelector(".sourcemap");
  if (map) {
    // the sticky offset comes straight from the CSS `top` value
    var stickyTop = parseInt(getComputedStyle(map).top, 10) || 0;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var stuck = map.getBoundingClientRect().top <= stickyTop + 1;
        map.classList.toggle("is-stuck", stuck);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }
})();
