# Product Brief v2 — "NYC Gov 101" (working title)

A curated, encyclopedic web resource that maps NYC government's data landscape, explains how the
system actually works, and shows worked examples of civic data in use — so a new technologist can
contribute in hours, not weeks.

> This file is the spec. Source descriptions in §6 are ground truth and live, structured, in
> `data/sources.json`. The glossary scope (§7) lives in `data/glossary.json`. Playbooks (§8) are
> built as guided-experience pages under `/playbooks/`.

---

## 1. The strategic frame

**Problem.** NYC government is genuinely complex — 50+ agencies, overlapping jurisdictions,
scattered open-data portals, and institutional knowledge that lives in people's heads rather than
any document. For technologists entering this space, the onboarding tax is steep: significant time
spent just learning who owns what, what data actually exists and is usable, and how decisions get
made — before any real work begins.

**Who this affects.** Motivated technologists — developers, data analysts, designers — who arrive
ready to contribute but spend their first hours or days building context. The hypothesis extends
the same gap to new government employees and CBO/nonprofit staff.

**The gap.** There's no structured, trusted, maintained guide to how NYC government actually works
for outsiders. What exists is fragmented: agency websites written for residents, Medium posts,
GitHub READMEs that assume prior knowledge, and tribal wisdom.

**HMW.** How might we give new civic technologists a shared mental model of NYC government — its
agencies, data assets, decision-making structures, and key constraints — so they can contribute
meaningfully within the first hours of a project, not the first weeks?

**Hypothesis.** If we build a curated, encyclopedic web resource that maps NYC government sources,
explains key concepts, and shows concrete worked examples of civic data in use, then newcomers will
orient themselves and begin contributing faster.

## 2. Success signals (the spec for what the product must make possible)

| Success signal | The feature that produces it |
| --- | --- |
| Users can name 3+ relevant data sources for a given civic problem without asking a veteran | A first-class "civic problem → sources" map (see §5, Start here) |
| Hackathon teams spend less time on research setup, more on building | A copyable per-problem source shortlist, ready to drop into a README |
| CBO staff reference the guide independently | Plain-language, self-serve content + a maintainable model that stays trustworthy |

## 3. The riskiest assumption — and how the design hedges it

**Riskiest assumption:** that the barrier is *finding* resources, not *understanding* them. If
comprehension (not discovery) is the real bottleneck, a directory alone won't move the needle.

The product is designed to do comprehension work, not just discovery:

- Every directory entry is **annotated, not just linked** ("what it is / best for / watch out for /
  what the data looks like").
- **Playbooks are the comprehension instrument** — they walk from a real goal through using sources
  together.
- The **glossary builds the mental model** (who owns what, how a decision gets made).
- A built-in **learning loop**: ship the annotated directory + glossary + a few deep playbooks
  first, then watch real newcomers attempt a task. Diagnostic: can they name 3+ sources (discovery)
  and say what they'd do with each (comprehension)?

**v1 is a directory that teaches.** Heavier tutorial machinery only if observation proves discovery
alone isn't enough.

## 4. Design principles

- **Built for builders, not residents.** Every entry answers: what data exists, is it usable, how
  do I access it (API / bulk / scrape / none), how fresh is it, how does the decision get made.
- **Data-landscape first.** Foreground data assets vs. process/knowledge sources; make "has open
  data / API" a primary filter.
- **Comprehension-forward.** Finding is necessary but not sufficient. Annotate everything; show it
  in use.
- **Durable and self-serve.** Survive without its author in the room — plain language,
  content-as-data, community-extendable.
- **Honest about limits.** Mark official vs. independent, what's stale-prone, what each source won't
  tell you.

## 5. Target users & information architecture

Primary audience: technologists, with new gov employees and CBO staff as first-class secondary
users. Resolve the depth tension by making builder-depth **available but never required** —
plain-language summary up top, technical detail one layer down.

Four sections from a calm landing page:

1. **Start here** — lead with "I want to…" civic problems. Each yields a shortlist of 3–5 annotated
   sources + the relevant playbook. A secondary "I am a… (technologist / new gov employee / CBO
   staff)" path tunes tone and depth.
2. **The Lay of the Land** — plain-language glossary; the comprehension backbone. Each entry ends
   with "Where to look →" into the Directory.
3. **The Directory** — the curated source catalog, grouped by category, every entry annotated and
   filterable by data access.
4. **Playbooks** — worked examples that show sources in combination (§8).

Cross-linking is the product: problems → sources → glossary → playbooks.

## 6. The Directory — verified source content

Ground truth. Descriptions are researched and accurate as of **June 2026**. **Verify every URL
loads before shipping; do not invent sources, descriptions, or URLs. Anything unverifiable is a
TODO, not a guess.** The structured, verified copy lives in `data/sources.json`. Entry template:

`Name · URL · Official or independent · What it is · Best for · Watch out for · Data access (API /
bulk / web-only / none) · Update cadence`

Categories: **A. City Council** (Legistar, citymeetings.nyc, intro.nyc, Council Legislative API,
laws.council.nyc.gov [unverified TODO]); **B. Community Boards** (CB websites, Block Party);
**C. NYC Government Operations** (DMMR, NYC Open Data, PASSport, City Record Online, NYC Planning /
ZoLa, Capital Projects Dashboard, 311, ACCESS NYC, Interagency Data-Sharing Agreements);
**D. Spending, rules, records & context** (Checkbook NYC, IBO, OpenRecords/FOIL, NYC Rules,
WeGov.NYC / Databook, BetaNYC, The City, Gotham Gazette [stale-prone], City Limits, Charter &
Administrative Code).

> Verification note (this build): all URLs checked. `laws.council.nyc.gov` failed to resolve
> (connection refused) → shipped flagged as **Unverified**. `Gotham Gazette` is live but ceased
> regular updates in 2023 → shipped flagged as **Stale-prone**. A handful of official hosts
> (Open Data, NYC Rules, ACCESS NYC, the code library) block automated checks but open in a browser.

## 7. The Lay of the Land — glossary scope

Plain-language entries (3–6 sentences), each ending in "Where to look →", that explicitly teach who
owns what and how decisions get made. Set: Mayoral agencies vs. elected offices · City Council &
Intros · Stated Meeting · Committee hearing · Local Law vs. resolution · Community Board · ULURP ·
Borough President · MMR/PMMR/DMMR · The City Record · Procurement/RFx/contract registration ·
Capital vs. expense budget · FOIL · Open Data & APIs · 311 service request · MOU / interagency data
sharing. Flag time-sensitive items (officeholders, figures) as maintainable, not baked-in.

## 8. Playbooks — guided experiences (the comprehension layer)

Playbooks are **not articles; they're guided experiences.** Each is its own page that walks the
user, step by step, through digging into the sources for one real scenario — visually showing how
you move from a question → to a source → to what you actually find there → to the next move.

Content of each step stays consistent: **the question you're answering → the source to reach for
(linked Directory entry, with its data-access note) → what you'll find / what the data looks like →
the handoff to the next step.** Keep everything concrete but conservative — verify program/agency
names; don't over-claim eligibility rules.

**Design direction.** The experience should feel like following a clear trail through the sources,
with a visible sense of progress and momentum. Patterns to draw from:

- a vertical **step-path / numbered "trail"** the user moves down;
- a small **per-scenario source map** with the path highlighted in the order you'd actually take it;
- compact **annotated source previews** (a stylized representation of each tool with a callout
  pointing at the one thing to click or read — built from accurate descriptions, **not fabricated
  screenshots**);
- **progressive disclosure** so each step reveals the next rather than dumping everything at once.

**Interesting, not gimmicky — guardrails:** no scroll-jacking, no autoplay, no decorative animation
that doesn't carry information, no mascots/novelty. Motion (if any) is subtle and only to signal
progress or reveal a step. Every visual must make the path clearer; if it doesn't, cut it. It must
**degrade gracefully** (readable and followable with no JS / reduced motion / on mobile) and meet
**WCAG 2.1 AA**.

The four scenarios:

1. **Helping an asylum seeker access jobs and benefits** (CBO caseworker) — ACCESS NYC/ACCESS HRA to
   screen, 311 + Open Data to locate centers, intro.nyc/Legistar to track policy, citymeetings.nyc
   to follow budget hearings. Workflow: screen → locate → check recent policy/notice changes →
   escalate via the Council member.
2. **Advocating for street cleaning on your block** (resident/volunteer) — 311 to report; Open Data
   (311 + DSNY) to show the pattern; DMMR for cleanliness performance; CB site + Block Party to see
   if neighbors raised it. Workflow: document with 311 → pull data to prove a pattern → raise at the
   board → escalate.
3. **Getting up to speed on an agency before a meeting** (new gov employee) — DMMR (performance) →
   Checkbook + PASSport (money/contracts) → IBO (independent take) → citymeetings.nyc + Legistar
   (recent hearing testimony) → City Record (what's next).
4. **Tracking a new development near you** (civic hacker / resident / CBO) — ULURP path: CB → CPC →
   Council. ZoLa + Community District Profiles → CB site + Block Party → citymeetings.nyc →
   intro.nyc/Legistar → Capital Projects Dashboard. Workflow: what & where → who decides → what's
   being said → track the vote.

## 9. Build phases (and the learning loop)

- **v1 — the directory that teaches.** Annotated Directory + glossary + Start-here map + the four
  playbooks. Ship to a small cohort.
- **Measure.** Task-based observation with ~5 newcomers per persona; score discovery and
  comprehension separately.
- **v2 — only if comprehension is the wall.** Add guided/interactive walkthroughs. Don't build
  speculatively.

## 10. Tone, design, accessibility, tech

- **Voice:** calm, civic, plain-language. No hype.
- **Design:** content-first, strong typography, obvious cross-links, an "official vs. independent"
  tag and a "has open data/API" badge on each source.
- **Accessibility:** WCAG 2.1 AA — semantic HTML, keyboard navigable, contrast, alt text,
  mobile-first.
- **Tech:** a static site, content in a structured `sources.json` + structured glossary,
  client-side filter/search, GitHub-Pages-deployable, no backend, with a README explaining how to
  add a source via PR.

## 11. Success criteria (build-level)

- A newcomer answers "where do I look for ___?" — naming 3+ sources — in under a minute.
- Every Directory entry has a verified link, an honest "best for / watch out for," and a data-access
  note.
- Each playbook is followable end-to-end by its persona.
- A volunteer can add a source by editing one data file.
