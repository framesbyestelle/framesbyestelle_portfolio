# framesbyestelle — Portfolio Website

Static portfolio site for Estelle Huy. No build step required — open `index.html` directly, or drag the folder into Netlify to deploy.

## Tech stack

- Vanilla HTML · CSS · JavaScript
- Google Fonts: Cormorant Garamond + DM Sans
- Netlify Forms (contact form, zero backend)

## Folder structure

```
framesbyestelle-portfolio/
├── index.html              ← Home
├── portfolio.html          ← Full portfolio grid (18 events)
├── about.html              ← About page
├── contact.html            ← Contact + Netlify form
├── thankyou.html           ← Post-form submission redirect
├── netlify.toml            ← Netlify publish config
│
├── css/
│   └── style.css           ← All styles (shared across every page)
│
├── js/
│   ├── main.js             ← Navbar, lightbox, gallery builder, filters
│   └── youtube.js          ← YouTube video list + player (home + film pages)
│
├── events/
│   ├── redbird-kiki-gala.html
│   ├── iron-ring-ceremony.html
│   ├── plumbers-ball.html
│   ├── engineering-frosh.html
│   ├── civil-wedding.html
│   ├── photoshop-compositions.html
│   ├── powe-networking.html
│   ├── western-farewell.html
│   ├── mcgill-tech-fair.html
│   ├── street-photography.html
│   ├── arts-frosh-poaching.html
│   ├── arts-frosh-night.html
│   ├── scientista.html
│   ├── eus-headshots.html
│   ├── bioblues.html
│   ├── uperrez-igem-headshots.html
│   ├── bengali-new-year.html
│   └── parmentine-dinner.html
│
└── images/
    ├── hero.jpg            ← Full-viewport hero background on home page
    ├── profile.jpg         ← Your photo on the About page
    ├── redbird-kiki-gala/
    │   ├── cover.jpg       ← Thumbnail shown on portfolio grid
    │   ├── 01.jpg
    │   └── ...
    └── [event-slug]/       ← One subfolder per event
```

## How to add photos to an event

1. Drop your image files into `images/[event-slug]/`
   - Name the portfolio thumbnail **`cover.jpg`**
   - Name gallery images **`01.jpg`, `02.jpg`, `03.jpg`, ...** (or any filename)

2. Open `events/[event-slug].html` in a text editor

3. Find the `EVENT_IMAGES` array near the bottom and update it:

```javascript
const EVENT_IMAGES = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  // add more lines as needed
];
```

4. Save and reload — the gallery renders automatically. No other HTML editing needed.

## Adding a new event

1. Create a new file in `events/` (copy any existing event page as a template)
2. Update `EVENT_SLUG`, `EVENT_IMAGES`, the `<title>`, the `<h1>`, and the year/description
3. Create `images/[new-slug]/` and add photos
4. Add a card to `portfolio.html` following the existing pattern

## Hero image

Place a landscape photo at `images/hero.jpg`. Aim for at least 1920×1080px. Export it cropped tight to the photo itself — no white border or matte around it (an Instagram-style framed export will show up as grey bars down the sides of the hero). The hero is lightly darkened in `css/style.css` (`.hero-bg` brightness) so the title stays readable.

## Adding a YouTube video

The Latest Videos section on the home page and the YouTube section on the Film page both read from one list at the top of `js/youtube.js`. To add a video, paste a new line at the **top** of the `VIDEOS` list (newest first):

```javascript
{ id: 'VIDEO_ID', title: 'video title', date: '2026-10-01' },
```

`VIDEO_ID` is the part after `v=` in the video's URL. Nothing else needs to change. The home page shows the newest 4; the Film page shows the newest 12.

## Deploying to Netlify

**Option A — Drag and drop**
1. Go to [app.netlify.com](https://app.netlify.com) → Sites → drag the `framesbyestelle-portfolio` folder onto the drop zone

**Option B — Git**
1. Push this folder to a GitHub repo
2. Connect the repo in Netlify → Build settings: publish directory = `.` (dot), no build command

The contact form will start working automatically once deployed to Netlify (Netlify Forms is activated by the `netlify` attribute on the `<form>` tag).

## Customisation reference

| What | Where |
|------|-------|
| Colours / fonts | `css/style.css` — `:root` custom properties at the top |
| Navbar links | Every HTML file — the `<nav class="navbar">` block |
| Footer links | Every HTML file — the `<footer>` block |
| Featured events on home | `index.html` — the `.featured-strip` section |
| Social link URLs | `js/main.js` is not needed — edit directly in HTML |
| About bio text | `about.html` |
| Stats (78+ events, etc.) | `about.html` — the `.stats-row` section |
