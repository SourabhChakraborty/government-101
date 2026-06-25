/* NYC Gov for Builders — playbook progressive-disclosure enhancement.
   This is an ENHANCEMENT only. With JS off, every <details class="step"> is
   rendered open (via the no-js rule in the page <head>), so the whole playbook
   is readable and followable. This script:
     1. collapses later steps so the trail reveals one stage at a time;
     2. opens the next step automatically as you finish one;
     3. keeps a "step N of M" progress indicator in sync.
   Motion is limited to the CSS chevron/bar transitions, which the global
   prefers-reduced-motion reset in style.css already neutralizes. */
(function () {
  "use strict";
  var root = document.querySelector("[data-playbook]");
  if (!root) return;

  var steps = Array.prototype.slice.call(root.querySelectorAll(".step"));
  if (!steps.length) return;

  // Signal that JS is on so the no-js "force open" rule is dropped.
  document.documentElement.classList.add("js");

  var fill = document.getElementById("pb-progress-fill");
  var label = document.getElementById("pb-progress-label");
  var total = steps.length;

  function furthestOpenIndex() {
    var idx = 0;
    steps.forEach(function (s, i) { if (s.open) idx = i; });
    return idx;
  }

  function updateProgress() {
    var current = furthestOpenIndex() + 1;
    var pct = Math.round((current / total) * 100);
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = "Step " + current + " of " + total;
  }

  // Start: first step open, the rest collapsed.
  steps.forEach(function (s, i) { s.open = (i === 0); });
  updateProgress();

  steps.forEach(function (step, i) {
    step.addEventListener("toggle", function () {
      // When a step is opened, surface the next one so progress feels earned.
      if (step.open && steps[i + 1] && !steps[i + 1].open) {
        steps[i + 1].open = true;
      }
      updateProgress();
    });
  });
})();
