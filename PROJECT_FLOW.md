# Personal Website Project Flow

This document is the living handoff and build log for Krish Prasad's personal portfolio website. It should be updated throughout the project so that if a new ChatGPT/Codex agent continues later, they can understand the direction, decisions, constraints, and next steps without restarting from zero.

## Owner Profile

- Name: Krish Prasad
- Current role: 3rd year B.Tech Electronics and Communication Engineering student
- Institute: National Institute of Technology Arunachal Pradesh
- Current technical focus: Core ECE, RTL design, digital systems, processor architecture, embedded protocols, robotics
- Leadership:
  - Current General Secretary of Yantronix, Robotics Club of NIT Arunachal Pradesh
  - Additional General Secretary of ECESS, Electronics and Communication Engineering Student Society, NIT Arunachal Pradesh; tenure ending around October 2026

## Important User Constraints

- GitHub repositories may be used only as read-only reference unless Krish explicitly asks for edits.
- The CV PDF is reference only. Do not upload it, link it, copy it into the website, or display it unless Krish explicitly asks later.
- The website should feel like real engineering is happening, not like a generic static student portfolio.
- Prioritize ECE/RTL/embedded/robotics identity over generic software developer branding.
- The design should be top-notch, creative, and conceptually accurate.

## Known GitHub Access

GitHub connector is authenticated as `krishprasad63`.
The GitHub app installation is selected-repository access and currently exposes:

- `krishprasad63/personal_website`

Public GitHub page reference provided by Krish:

- `https://github.com/krishprasad63?tab=repositories`

Public repositories observed for reference include:

- `personal_website`
- `riscv-rv32i-processor-mk2`
- `rtl-image-processing-lab`
- `from-logic-to-systems`
- `UART`
- `SPI`
- `I2C`
- `Advanced_Smart_Parking_System`
- `CPP`
- `Traffic_Light_Controller`
- `MIPS32`
- `RISCV`
- `Verilog-Experiments`
- `PythonTask`
- `backend-project`
- `Digital_Electronics__verilog`
- `krishprasad63`

## Reference CV Notes

CV file provided only for reference:

- `C:\Users\krish\Downloads\CV_Krish_Prasad (2).pdf`

Observed notes:

- CV appears outdated because it says sophomore, while Krish says he is now 3rd year.
- CV confirms core direction: VLSI, RTL, semiconductor physics, Verilog, Vivado, digital systems.
- Main listed projects: UART, SPI, instruction-driven multi-stage I2C, RISC-V processor, MIPS32 processor, digital electronics modules, traffic controller, smart parking system.

## Core Website Concept

Working concept: `Krish Lab: Live Digital Systems Portfolio`

The website should feel like an interactive engineering lab or digital systems console. It should demonstrate actual hardware behavior through visual and interactive modules instead of only listing projects.

The visual language should be:

- Engineering lab, signal console, RTL systems dashboard
- Dark but readable, with graphite/off-white base
- Electric cyan, signal green, and amber accents
- Subtle grids, circuit traces, waveforms, timing diagrams
- No generic neon hacker theme
- No plain resume-template feeling

Possible tagline directions:

- `ECE undergrad building processors, protocols, and robotics systems.`
- `Designing digital systems across processors, protocols, and robotics.`
- `From logic gates to live digital systems.`
- `Building RTL systems that move bits with intent.`

## High-Impact Sections

1. Hero / Live Console
   - First impression should show active signals or a mini system panel.
   - Introduce Krish as an ECE undergrad at NIT Arunachal Pradesh.
   - Emphasize processors, protocols, RTL, and robotics.

2. Featured Build: RISC-V RV32I Processor
   - This should be the crown jewel.
   - Use a 5-stage pipeline visual: IF, ID, EX, MEM, WB.
   - Show instructions flowing through stages.
   - Show NOP/bubble concept, hazards, forwarding paths, and maybe bubble sort execution later.
   - Reference repo: `riscv-rv32i-processor-mk2`.
   - README says it has modular Verilog stages, pipeline registers, ALU, shift-add multiplier, control unit, instruction memory, and many testbenches.

3. Protocol Lab
   - The user explicitly wants this style.
   - For I2C: animate SCL and SDA with START, address bits, ACK, data, STOP.
   - For UART: type or select a byte and see idle, start bit, data bits, stop bit.
   - For SPI: show SCLK, CS, MOSI, MISO, and shifting master/slave registers.
   - These should teach real timing behavior, not be decorative.

4. RTL Gallery
   - Include image processing RTL, MIPS32, traffic controller, digital electronics, Verilog experiments.
   - Present as hardware modules, not generic project cards.

5. Robotics and Leadership
   - Yantronix Robotics Club: current General Secretary.
   - ECESS: Additional General Secretary.
   - Needs more user-provided details later: events, workshops, team size, initiatives, achievements.

6. Build Logs / Notes
   - Krish posts continuously on LinkedIn about projects.
   - Add a section for engineering logs, especially RISC-V pipeline progress.
   - Later, ask for LinkedIn post links or screenshots if needed.

7. Contact / Links
   - GitHub, LinkedIn, email, possibly resume only if Krish asks.

## Repository Initialization Status

Local folder:

- `C:\Users\krish\Desktop\personal_website`

Status:

- Git repository initialized on branch `main`.
- Remote set to `https://github.com/krishprasad63/personal_website.git`.
- No commits yet at the time this document was created.

## Recommended Build Approach

Preferred implementation direction:

- Build a modern frontend app, likely Vite + React, unless a simpler static implementation is chosen later.
- Use responsive design from the beginning.
- Use custom CSS/canvas/SVG for signal and timing animations where appropriate.
- Use lucide icons if adding React and icons.
- Keep website fast and deployable to GitHub Pages.

Potential route structure:

- `/` home with live hero, featured systems, protocol lab preview, leadership summary
- `/projects/riscv` deep-dive page
- `/projects/i2c` deep-dive page
- `/projects/uart` deep-dive page
- `/projects/spi` deep-dive page
- `/lab-notes` optional future page

If keeping single-page initially, implement section anchors first and expand later.

## Interaction Ideas

RISC-V:

- Animated instruction cards pass through IF, ID, EX, MEM, WB.
- Dependent instructions trigger a visible hazard marker.
- Forwarding path lights up when enabled in the story/visual.
- NOP bubbles appear as pale/empty instruction slots.

I2C:

- SCL pulses continuously during transfer.
- SDA changes while SCL is low, except START/STOP.
- START: SDA falls while SCL is high.
- STOP: SDA rises while SCL is high.
- Show address bits, R/W bit, ACK bit, data byte.

UART:

- Idle high line.
- Start bit low.
- 8 data bits displayed LSB-first.
- Stop bit high.
- Optional user input later: choose ASCII char.

SPI:

- CS low begins transaction.
- SCLK pulses.
- MOSI and MISO shift bits each clock.
- Master and slave shift registers visually update.

## Questions To Ask Krish Later

Ask these when needed, not all at once:

- Which name should appear prominently: `Krish Prasad`, `Krish Lab`, or another identity?
- Preferred tagline?
- LinkedIn URL and whether to embed or link posts.
- Specific RISC-V version details: current hazard/forwarding status, bubble sort result, least NOP count, screenshots/waveforms.
- Yantronix details: events led, workshops, projects, team, achievements.
- ECESS details: responsibilities, events, impact.
- Any preferred photo/avatar? If no, use abstract engineering visuals.
- Whether resume/CV should be downloadable later. Current instruction: do not include it.

## Current Next Step

The next agent should continue by drafting the site architecture and then implementing the first version in `C:\Users\krish\Desktop\personal_website`.

Before implementation, inspect local files and package status. Since this folder is outside the default workspace roots, filesystem writes there may require permission escalation.

## Update Protocol For Future Agents

Every time meaningful work is done, update this document with:

- What changed
- Why it changed
- Files touched
- Decisions made
- Pending questions
- Current next step

Do not let this document become a vague changelog. It should explain enough reasoning that a future agent can continue with confidence.

## Build Log

### 2026-10-06 - Project flow document created

- Created this living project flow document.
- Purpose: preserve project memory and make future continuation easy if chat limits or context loss occur.
- No website code has been implemented yet.
- User wants this document updated throughout the website build.

### 2026-10-06 - GitHub Education / Pro context added

- Krish mentioned he has access to GitHub Education / GitHub Pro for Education.
- This may matter later for private repositories, GitHub Pages, Actions minutes, Codespaces, domain/hosting workflows, and student developer tools.
- Do not assume specific benefits without checking current GitHub Education details when needed, because program benefits can change.

### 2026-10-06 - Hosting independence decision

- Krish clarified GitHub Pro/Education access may last only around 1.5 more years, until B.Tech completion.
- Website architecture must not directly depend on GitHub Pro-only features or temporary student benefits.
- Treat GitHub Education/Pro as optional convenience during development, not as a requirement for the website to keep working.
- Prefer durable, portable deployment options: public GitHub Pages, static hosting, Vercel/Netlify free tiers, or any standard static host.
- Avoid features that require private Pro-only hosting, paid Actions capacity, Codespaces-only workflows, or student-only infrastructure.

### 2026-10-06 - Progressive enhancement for GitHub Pro/Education

- Krish clarified the desired model: use GitHub Pro/Education benefits dynamically while available, but never make the website depend on them.
- Architecture principle: progressive enhancement with graceful fallback.
- If a Pro/Education-backed workflow or service is useful later, wrap it so expiration does not affect the public site.
- Examples:
  - Development tooling may use Codespaces if available, but local setup must work normally.
  - CI/CD may use GitHub Actions if convenient, but the site should also build and deploy manually or on another free static host.
  - Private drafts may stay private while Pro is available, but the published website must use public/static assets or another durable storage path.
  - Any dynamic data source should have static fallback data checked into the website.
- Future agents should ask: "What happens if GitHub Pro ends tomorrow?" before adding any GitHub-Pro-dependent feature.

### 2026-10-06 - Initial static website v1 created

Files created:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

What changed:

- Built a dependency-free static first version of the portfolio so it does not rely on npm packages, GitHub Pro, Codespaces, or any temporary student benefits.
- Added a high-end ECE/digital systems themed homepage with a live engineering console aesthetic.
- Implemented a hero canvas with animated signal traces.
- Implemented a RISC-V five-stage pipeline visual with moving instruction tokens, pause/step controls, NOP bubble styling, and forwarding path toggle.
- Implemented a Protocol Lab with tabs for I2C, UART, and SPI. Each protocol has an animated timing diagram and bit window.
- Added RTL systems archive cards referencing RISC-V, I2C, UART/SPI, and image processing RTL.
- Added leadership section for Yantronix and ECESS.

Why:

- Krish wanted the site to feel like actual engineering is happening, not just static project cards.
- Starting static keeps the project portable and durable. It can later be migrated to React/Vite if deeper routing or component complexity becomes worthwhile.

Validation:

- Ran `node --check app.js`; JavaScript syntax passed.

Current next step:

- Start local preview server and inspect the website visually.
- After visual inspection, fix layout/animation issues and then ask Krish what identity/tagline/details should be refined first.

### 2026-10-06 - Local preview started and visually checked

Preview server:

- URL: `http://127.0.0.1:5173/`
- Served from: `C:\Users\krish\Desktop\personal_website`

Visual inspection notes:

- Hero section renders with large identity text, animated signal traces, and a system monitor panel.
- RISC-V pipeline section renders with IF/ID/EX/MEM/WB stage blocks, moving instruction tokens, NOP bubble styling, and forwarding/hazard paths.
- Protocol Lab renders in the page structure with I2C selected by default and tabs for UART/SPI.
- Page is currently a polished v1 foundation, not final content. It still needs Krish-specific details, deeper project pages, final copy, and possibly real waveform/project media.

Current next step:

- Krish should open the local preview and react to the direction.
- Likely next improvements: refine hero wording, improve protocol animations, add real RISC-V bubble-sort/forwarding story, add Yantronix/ECESS details, and decide whether to keep static or migrate to React/Vite later.

### 2026-10-06 - Interactive Portfolio Polish & Skill Matrix Expansion

Files modified:

- `index.html`
- `styles.css`
- `app.js`
- `PROJECT_FLOW.md`

What changed:

- Added dynamic UART Character TX Generator control bar with custom character input and quick-preset buttons ('K', 'R', 'I', 'S', 'H'). Waveforms and bit frame arrays update dynamically in real-time with ASCII hex/binary readouts.
- Created interactive Hardware Spec Modal drawer. Clicking any module card in the RTL Systems Archive populates a detailed hardware specification sheet (architecture, clock domains, interfaces, verification testbenches, direct GitHub repo links).
- Added dedicated Technical Stack & Toolchain Grid section (`#skills`) covering RTL & HW Description, Computer Architecture, Serial Protocols, and EDA Tools & Simulation.
- Added terminal-inspired Contact & Connect section with email one-click copy toast notification, GitHub/LinkedIn links, location (NIT Arunachal Pradesh), and hardware bench status pill.
- Added site Footer with back-to-top navigation link and updated OpenGraph/SEO meta tags + embedded SVG favicon.
- Added ScrollSpy (IntersectionObserver) to auto-highlight active topbar navigation links during scroll.

Why:

- Elevate the portfolio from a standard single-page landing site to a state-of-the-art interactive ECE hardware laboratory environment before committing to GitHub.

Validation:

- Ran `node --check app.js`; JavaScript syntax passed with zero errors.

Current next step:

- Commit all untracked and modified files to git repository `main` branch.

