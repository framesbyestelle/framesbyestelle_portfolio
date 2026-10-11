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
    ├── home/               ← Home page hero photo (3 sizes) and door thumbnails
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

The Previous / Next event links at the bottom of every event page read their order from the cards in `portfolio.html`, so step 4 also places the new event in that sequence. Reorder the cards there to reorder the links.

## Showing YouTube again

YouTube is currently kept to a one-line link at the bottom of the Video page, and the "Latest Videos" block is hidden on the home page. Both are controlled by one attribute on `<main>`:

- `film.html`: `data-youtube="end"` (link at the bottom) or `data-youtube="front"` (full player and grid, shown first)
- `index.html`: `data-youtube="off"` (hidden) or `data-youtube="on"` (Latest Videos shown)

The video list itself lives in `js/youtube.js`.

## Home page hero

The home page opens on a full-screen photo with the name, a one-line description and two "doors" (Photography, Video). It is plain HTML in `index.html` (the `.home-hero` section); there are no entrance animations, so it is readable as soon as it loads.

- **Photo:** `images/home/hero-800.jpg`, `hero-1400.jpg` and `hero-1920.jpg` are three sizes of the same photo; the browser picks one. To change the photo, export a landscape image at those three widths (about 78% JPEG quality keeps them light) and keep the file names, or update the `srcset` and the `<link rel="preload">` in `index.html`. The photo is darkened in `css/style.css` (`.home-hero-bg` brightness and the `.home-hero::after` gradient) so the text stays readable.
- **Headline and line under it:** `.home-hero-title` and `.home-hero-sub` in `index.html`. The "framesbyestelle" name above them is beige (`--accent`) via `.home-hero-brand`.
- **Doors:** `.home-door` links in `index.html`. Their small thumbnails are `images/home/door-1.jpg`, `door-2.jpg`, `door-3.jpg` and `door-video.jpg` (about 160px wide, so they load instantly).

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
