# NYC Gov 101

A curated, encyclopedic web resource that maps **NYC government's data landscape**, explains how the
system actually works, and shows worked examples of civic data in use — so a new technologist can
contribute **in hours, not weeks**.

It's built for **builders, not residents**: every source entry answers a builder's questions — what
data exists, whether it's usable, how to access it (API / bulk / web), and how the decision it
touches gets made.

**Live site:** https://sourabhchakraborty.github.io/government-101/

---

## The four sections

| Section | What it does |
| --- | --- |
| **[Start here](./index.html)** | Pick an "I want to…" civic problem and get a shortlist of 3–5 annotated sources — copyable straight into a hackathon README. A secondary "I am a…" switch tunes the depth. |
| **[The Lay of the Land](./glossary.html)** | A plain-language mental model: who owns what and how a decision moves. Each concept ends with "Where to look →" into the Directory. |
| **[The Directory](./directory.html)** | The curated source catalog. Every entry is annotated and filterable by category, official vs. independent, and data access. |
| **[Playbooks](./playbooks.html)** | Four guided experiences that walk you from a real question through the sources, step by step. |

Cross-linking is the product: **problems → sources → glossary → playbooks**, all wired together.

## Design principles

- **Built for builders, not residents.**
- **Data-landscape first** — "has open data / API" is a primary filter.
- **Comprehension-forward** — annotate everything; show it in use.
- **Durable and self-serve** — plain language, content-as-data, community-extendable.
- **Honest about limits** — official vs. independent, what's stale-prone, what each source won't
  tell you. Unverifiable links are flagged, never guessed.

## How it's built (no backend, no build step)

Plain static **HTML / CSS / JS**, deployable directly to GitHub Pages. Content lives as data and is
rendered client-side:

```
index.html            Start here (problem→sources map + audience switch)
directory.html        The Directory (filter/search)
glossary.html         The Lay of the Land
playbooks.html        Playbooks index
playbooks/
  street-cleaning.html  asylum-seeker.html  agency-prep.html  track-development.html
  playbook.css          playbook.js         (shared, guided-experience styling/enhancement)
data/
  sources.json        the source catalog (the data layer)
  glossary.json       the mental-model entries
css/style.css         the design system (tokens, badges, layout, dark mode, reduced motion)
js/app.js             renders the Directory, Start-here map, and Glossary from the JSON
nyc-gov-guide-brief-v2.md   the product brief / spec
```

Because the pages `fetch()` the JSON, **view the site through a web server, not `file://`**:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

The playbook pages are hand-authored semantic HTML and are fully readable **with JavaScript off**;
the Directory/Start-here/Glossary render from JSON and show a graceful fallback (and a link to the
raw data file) when JS is unavailable.

---

## Contributing — add a source by editing one data file

The whole point: **a volunteer can add a source by editing `data/sources.json`.** Open a PR adding
an object to the `sources` array:

```jsonc
{
  "id": "my-source",                  // unique kebab-case id (used in URLs/anchors)
  "name": "My Source",
  "aka": "who runs it / short subtitle",
  "url": "https://example.gov",       // MUST resolve — verify before submitting
  "category": "operations",           // council | community-boards | operations | additional
  "runBy": "official",                // official | independent
  "owner": "Owning agency or person",
  "whatItIs": "One or two plain-language sentences.",
  "bestFor": "The builder's reason to use it.",
  "watchOutFor": "The honest caveat — gotchas, freshness, scope limits.",
  "dataAccess": "api",                // api | bulk | web | none
  "dataAccessNote": "optional detail about how to get the data",
  "updateCadence": "how fresh the data is, if known",
  "relatedProblems": ["p-311"],       // problem ids from the `problems` array
  "relatedPlaybooks": ["pb-street-cleaning"],
  "verified": true,                   // false → renders with an "Unverified" flag
  "staleWarning": false,              // true → renders with a "Stale-prone" flag
  "extras": [                         // optional sub-links/tools
    { "label": "A related tool", "url": "https://example.gov/tool" }
  ]
}
```

**Rules of the road (non-negotiable, from the brief):**

1. **Don't invent or hallucinate** any source, description, URL, officeholder, statistic, or program
   rule. If you can't verify it, it's a `TODO` (`"verified": false`), not a guess.
2. **Verify every URL resolves** before adding it.
3. **Keep time-sensitive facts out** — officeholders, dollar figures, and bill numbers belong in
   maintainable fields or examples, not baked into prose.
4. **Write for builders** — say what the data looks like and how to access it.

Glossary entries live in `data/glossary.json` (same idea: `term`, a 3–6 sentence plain-language
`body`, and a `whereToLook` array of source ids). Playbooks are hand-authored pages under
`playbooks/` that reuse `playbook.css` / `playbook.js`; copy an existing one as a template.

After editing, run a local server and confirm your source appears in the Directory, in any problem
shortlists you referenced, and that its links work.

## Accessibility

Targets **WCAG 2.1 AA**: semantic HTML, keyboard navigation, visible focus, AA color contrast (with
a dark-mode theme), `prefers-reduced-motion` support, and graceful no-JS degradation.

## Provenance

Source descriptions are ground truth from the product brief (`nyc-gov-guide-brief-v2.md`),
researched and accurate as of **June 2026**. Every external link was checked to resolve before
shipping. Known flags at build time: `laws.council.nyc.gov` did not resolve (marked **Unverified**);
Gotham Gazette is live but ceased regular updates in 2023 (marked **Stale-prone**).
