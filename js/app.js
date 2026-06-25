/* NYC Gov for Builders — shared client logic.
   Renders the Directory, the Start-here problem→sources map, and the Glossary
   from data/sources.json + data/glossary.json. No framework, no build step. */

(function () {
  "use strict";

  const DATA_ACCESS = {
    api:  { label: "API",          cls: "data-api",  ic: "{ }", title: "Programmatic API access" },
    bulk: { label: "Bulk download", cls: "data-bulk", ic: "⤓",   title: "Bulk download available" },
    web:  { label: "Web only",      cls: "data-web",  ic: "◍",   title: "Web interface only — no structured feed" },
    none: { label: "No data",       cls: "data-none", ic: "—",   title: "No structured data" }
  };

  // Resolve a path relative to the site root so pages in /playbooks/ work too.
  const ROOT = (function () {
    const p = location.pathname;
    return /\/playbooks\//.test(p) ? "../" : "./";
  })();

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c != null) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  async function loadJSON(path) {
    const res = await fetch(ROOT + path, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load " + path + " (" + res.status + ")");
    return res.json();
  }

  // ---- shared renderers --------------------------------------------------

  function runBadge(s) {
    const official = s.runBy === "official";
    return el("span", {
      class: "badge run-" + s.runBy,
      title: official ? "Official government source" : "Independent (not government-run)"
    }, [el("span", { class: "ic", "aria-hidden": "true", text: official ? "★" : "◇" }),
        official ? "Official" : "Independent"]);
  }

  function dataBadge(s) {
    const d = DATA_ACCESS[s.dataAccess] || DATA_ACCESS.web;
    return el("span", { class: "badge " + d.cls, title: d.title },
      [el("span", { class: "ic", "aria-hidden": "true", text: d.ic }), d.label]);
  }

  function sourceCard(s) {
    const badges = el("div", { class: "badges" }, [runBadge(s), dataBadge(s)]);
    if (s.staleWarning) badges.appendChild(el("span", { class: "badge warn", title: "Stale-prone source" },
      [el("span", { class: "ic", "aria-hidden": "true", text: "!" }), "Stale-prone"]));
    if (s.verified === false) badges.appendChild(el("span", { class: "badge warn", title: "Link not verified" },
      [el("span", { class: "ic", "aria-hidden": "true", text: "?" }), "Unverified"]));

    const annot = el("div", { class: "annot" }, [
      annotRow("What it is", s.whatItIs),
      annotRow("Best for", s.bestFor),
      annotRow("Watch out for", s.watchOutFor),
      s.dataAccessNote ? annotRow("Data access", s.dataAccessNote) : null,
      s.updateCadence ? annotRow("Updates", s.updateCadence) : null
    ]);

    let extras = null;
    if (s.extras && s.extras.length) {
      extras = el("div", { class: "extras" }, [
        el("span", { class: "k", text: "Tools / links" }),
        el("div", {}, s.extras.map(x =>
          el("a", { href: x.url, target: "_blank", rel: "noopener" }, [x.label + " ↗"])))
      ]);
    }

    const titleLink = el("a", { href: s.url, target: "_blank", rel: "noopener" }, [s.name]);
    const foot = el("div", { class: "card-foot" }, [
      el("span", { class: "muted small", text: hostOf(s.url) }),
      el("a", { class: "visit", href: s.url, target: "_blank", rel: "noopener" }, ["Visit ↗"])
    ]);

    const card = el("article", {
      class: "source-card" + (s.verified === false ? " is-unverified" : ""),
      id: "src-" + s.id,
      "data-category": s.category,
      "data-run": s.runBy,
      "data-access": s.dataAccess
    }, [
      el("h3", {}, [titleLink]),
      s.aka ? el("p", { class: "aka", text: s.aka }) : null,
      badges,
      annot,
      extras,
      foot
    ]);
    return card;
  }

  function annotRow(k, v) {
    return el("div", {}, [el("span", { class: "k", text: k }), document.createTextNode(v || "")]);
  }

  function hostOf(url) {
    try { return new URL(url).host.replace(/^www\./, ""); } catch (e) { return url; }
  }

  // ---- Directory page ----------------------------------------------------

  async function initDirectory(root) {
    const data = await loadJSON("data/sources.json");
    const sources = data.sources.slice().sort((a, b) => a.name.localeCompare(b.name));
    const grid = root.querySelector("#directory-grid");
    const count = root.querySelector("#result-count");
    const search = root.querySelector("#dir-search");

    // Render all cards once, then filter by toggling .hidden.
    grid.textContent = "";
    sources.forEach(s => grid.appendChild(sourceCard(s)));

    function activeValues(name) {
      return Array.from(root.querySelectorAll('input[name="' + name + '"]:checked')).map(i => i.value);
    }

    function apply() {
      const q = (search.value || "").trim().toLowerCase();
      const cats = activeValues("f-cat");
      const runs = activeValues("f-run");
      const accs = activeValues("f-access");
      let shown = 0;
      sources.forEach(s => {
        const card = grid.querySelector("#src-" + s.id);
        const hay = (s.name + " " + (s.aka || "") + " " + s.whatItIs + " " + s.bestFor).toLowerCase();
        const ok =
          (!q || hay.includes(q)) &&
          (!cats.length || cats.includes(s.category)) &&
          (!runs.length || runs.includes(s.runBy)) &&
          (!accs.length || accs.includes(s.dataAccess));
        card.classList.toggle("hidden", !ok);
        if (ok) shown++;
      });
      count.textContent = shown + " of " + sources.length + " sources";
    }

    root.querySelectorAll('input[type="checkbox"]').forEach(i => i.addEventListener("change", apply));
    search.addEventListener("input", apply);
    apply();
  }

  // ---- Start-here page ---------------------------------------------------

  async function initStart(root) {
    const data = await loadJSON("data/sources.json");
    const byId = Object.fromEntries(data.sources.map(s => [s.id, s]));
    const problems = data.problems;
    const playbookMeta = {
      "pb-street-cleaning": { title: "Advocate for street cleaning on your block", href: ROOT + "playbooks/street-cleaning.html" },
      "pb-asylum": { title: "Help an asylum seeker access jobs & benefits", href: ROOT + "playbooks/asylum-seeker.html" },
      "pb-agency-prep": { title: "Get up to speed on an agency before a meeting", href: ROOT + "playbooks/agency-prep.html" },
      "pb-development": { title: "Track a new development near you", href: ROOT + "playbooks/track-development.html" }
    };

    const grid = root.querySelector("#problem-grid");
    const result = root.querySelector("#problem-result");
    let currentAudience = "all";

    const cards = problems.map(p => {
      const card = el("button", {
        class: "problem-card", type: "button",
        "aria-expanded": "false", "aria-controls": "problem-result",
        "data-problem": p.id
      }, [
        el("span", { class: "iwant", text: "I want to…" }),
        el("b", { text: p.label }),
        el("span", { text: p.blurb })
      ]);
      card.addEventListener("click", () => choose(p.id));
      return card;
    });
    grid.textContent = "";
    cards.forEach(c => grid.appendChild(c));

    function audienceLine(p) {
      const lines = {
        technologist: "Builder view: each source below carries its data-access route — start with the API/bulk ones for anything programmatic.",
        gov: "New-employee view: the official sources are your record of truth; the independent ones tell you what's actually being said.",
        cbo: "CBO view: every source below is self-serve and plain-language — no insider login or veteran required."
      };
      return currentAudience !== "all" ? lines[currentAudience] : null;
    }

    function choose(pid) {
      const p = problems.find(x => x.id === pid);
      cards.forEach(c => c.setAttribute("aria-expanded", String(c.dataset.problem === pid)));

      const list = p.sources.map(id => byId[id]).filter(Boolean);
      const head = el("div", { class: "shortlist-head" }, [
        el("h3", { text: p.label }),
        el("span", { class: "result-count", text: list.length + " sources to start with" })
      ]);

      const note = audienceLine(p);
      const noteEl = note ? el("p", { class: "note small", text: note }) : null;

      const cardsWrap = el("div", { class: "cards" }, list.map(sourceCard));

      // copyable shortlist for a README
      const copyText = buildCopyText(p, list);
      const copyBox = el("div", { class: "copybox" }, [
        el("div", { class: "copy-row" }, [
          el("strong", { text: "Copy this shortlist into your README" }),
          el("button", {
            class: "btn secondary", type: "button",
            onclick: function (e) {
              navigator.clipboard && navigator.clipboard.writeText(copyText).then(() => {
                const ok = e.target.parentNode.querySelector(".copy-ok");
                if (ok) { ok.classList.remove("hidden"); setTimeout(() => ok.classList.add("hidden"), 2000); }
              });
            }
          }, ["Copy"]),
          el("span", { class: "copy-ok hidden", text: "Copied ✓" })
        ]),
        el("pre", { text: copyText })
      ]);

      const blocks = [head, noteEl, cardsWrap];

      if (p.playbooks && p.playbooks.length) {
        blocks.push(el("h4", { class: "eyebrow", text: "Walk through it", style: "margin-top:1.5rem" }));
        blocks.push(el("div", { class: "rail" }, p.playbooks.map(pb => {
          const m = playbookMeta[pb];
          return m ? el("a", { href: m.href }, [el("b", { text: "Playbook: " + m.title }),
            el("span", { text: "A step-by-step guided walk through these sources." })]) : null;
        })));
      }

      blocks.push(el("h4", { class: "eyebrow", text: "Hackathon quick-start", style: "margin-top:1.5rem" }));
      blocks.push(copyBox);

      result.textContent = "";
      blocks.forEach(b => b && result.appendChild(b));
      result.hidden = false;
      // move focus to result heading for keyboard/screen-reader users
      head.querySelector("h3").setAttribute("tabindex", "-1");
      head.querySelector("h3").focus({ preventScroll: false });
    }

    function buildCopyText(p, list) {
      const lines = [];
      lines.push("# NYC data sources — " + p.label);
      lines.push("# via NYC Gov for Builders");
      lines.push("");
      list.forEach(s => {
        lines.push("- " + s.name + " — " + s.url);
        lines.push("    what: " + s.whatItIs);
        lines.push("    best for: " + s.bestFor);
        lines.push("    data: " + (DATA_ACCESS[s.dataAccess] || DATA_ACCESS.web).label +
          (s.runBy === "official" ? " · official" : " · independent"));
      });
      return lines.join("\n");
    }

    // audience switch
    root.querySelectorAll(".chip[data-audience]").forEach(chip => {
      chip.addEventListener("click", () => {
        currentAudience = chip.dataset.audience;
        root.querySelectorAll(".chip[data-audience]").forEach(c =>
          c.setAttribute("aria-pressed", String(c === chip)));
        const open = cards.find(c => c.getAttribute("aria-expanded") === "true");
        if (open) choose(open.dataset.problem);
      });
    });

    // deep-link: #p-xxx opens that problem
    const hash = location.hash.replace("#", "");
    if (hash && problems.some(p => p.id === hash)) choose(hash);
  }

  // ---- Glossary page -----------------------------------------------------

  async function initGlossary(root) {
    const [gloss, src] = await Promise.all([loadJSON("data/glossary.json"), loadJSON("data/sources.json")]);
    const names = Object.fromEntries(src.sources.map(s => [s.id, s.name]));
    const list = root.querySelector("#glossary-list");
    const toc = root.querySelector("#glossary-toc");

    list.textContent = "";
    toc.textContent = "";

    gloss.entries.forEach(e => {
      toc.appendChild(el("a", { href: "#" + e.id }, [e.term]));
      const where = el("p", { class: "where" }, [
        el("span", { class: "k muted", text: "Where to look → " }),
        ...e.whereToLook.map(id =>
          el("a", { href: ROOT + "directory.html#src-" + id }, [names[id] || id]))
      ]);
      list.appendChild(el("article", { class: "glossary-card", id: e.id }, [
        el("h3", {}, [el("a", { href: "#" + e.id, style: "text-decoration:none;color:inherit" }, [e.term])]),
        el("p", { text: e.body }),
        where
      ]));
    });
  }

  // ---- boot --------------------------------------------------------------

  function fail(root, err) {
    console.error(err);
    root.insertAdjacentHTML("afterbegin",
      '<p class="note warn">Couldn\'t load the data files. If you opened this page directly from disk, run it through a local web server (see the README) — browsers block <code>fetch()</code> on <code>file://</code>.</p>');
  }

  document.addEventListener("DOMContentLoaded", function () {
    const dir = document.getElementById("directory-app");
    const start = document.getElementById("start-app");
    const gloss = document.getElementById("glossary-app");
    if (dir) initDirectory(dir).catch(e => fail(dir, e));
    if (start) initStart(start).catch(e => fail(start, e));
    if (gloss) initGlossary(gloss).catch(e => fail(gloss, e));
  });
})();
