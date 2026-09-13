# Theerthalaya Group — corporate site

Marketing site for Theerthalaya Group of Companies, a diversified group of ten
divisions. Vite + React + Tailwind + Framer Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Structure

All copy, imagery and figures live in `src/data/content.js` — edit there rather
than in components. Reusable scroll/motion primitives (`FadeIn`, `Stagger`,
`Parallax`, `ParallaxImage`, `RevealText`, `Marquee`, `ScrollZoom`) are in
`src/components/ui/Animations.jsx`; every one of them respects
`prefers-reduced-motion`.

Design tokens are in `tailwind.config.js`: `ink` / `paper` / `paper-2` / `line` /
`muted` plus a single slate-blue accent (`slate`, aliased as `brass`). Display
face is Bricolage Grotesque, body is Inter.

## Hero

`src/components/Hero.jsx` is a scroll-scrubbed construction sequence: a tall
track with a pinned viewport-height stage, mapping scroll progress onto a frame
time. The mapping is linear apart from a `LEAD_IN` hold that parks the opening
frame for the first slice of the track. Reduced-motion users get a still instead.

It draws a **decoded image sequence to a canvas — not a scrubbed `<video>`**.
Video was tried and has to be avoided here: seeking a decoder ~60x a second
flushes its pipeline on every assignment, and any CSS filter on a full-screen
video drops it off the hardware-overlay path onto a per-frame GPU shader.
Together those pinned the GPU hard enough to hang a machine. The frame sequence
has no decoder in the loop, and only redraws when the frame index actually
changes, so most animation ticks cost nothing.

Frames live in `public/hero-frames/{d,m}/` — 61 WebP frames each, 1920x1080
desktop (13MB) and 900x900 mobile (6.6MB), beside a `manifest.json` giving the
source timestamp of each frame.

## Hero source: hero-v2.mp4, and only part of it

The active source is **`hero-v2.mp4`**, and only the window **t=2.6s to t=8.7s**
is used. It is a Veo regeneration (prompt and seed in
`docs/hero-video-prompt.md`) and it fixed the two container defects of the
original `hero.mp4`: no pillarbox (`cropdetect` reports a clean
`3840:2160:0:0`) and no burned-in typography. Both of those previously forced a
crop and a composite workaround.

It did **not** fix the morph. Measured on the full clip, edge energy dips 39 ->
33.5 around t=1.2–2.3 and recovers to 48.7, and the building emerges from it
taller, redesigned and closer to camera — two different shots blended. The clip
came back at **10 seconds when 8 were requested**, which is longer than Veo's
native single generation, so the morph is very likely the seam between two
stitched segments. If it is ever regenerated, ask for exactly 8 seconds and no
extend/continue option.

That leaves one clean window, and it is a good one:

- **t < 2.6s** — contains the morph and a different composition.
- **t = 2.6s to 8.7s** — usable. A fixed skyline patch holds 24.1–25.6 edge
  energy for five straight seconds (dead flat, genuinely locked camera), the
  building keeps its height and position, and cladding climbs floor by floor
  with the upper storeys still raw frame. This is the section-by-section
  behaviour the prompt asked for.
- **t > 8.79s** — edge energy collapses 25.6 -> 6.8 and stays there. Dead tail.

Because the frame is a clean 16:9 with no padding, the desktop pass needs **no
crop at all** — a straight 2x downscale from 3840 to 1920, which is as sharp as
this pipeline gets. Mobile still needs its own square crop, centred on the
building (which spans source x 883–2995).

Sampling is **uniform 10fps**. Scene scores across the segment are flat at
0.001–0.02 with no spikes and no static hold, so there is no sparse tier worth
exploiting here (unlike the original source, which held still for its last two
seconds).

The grade is unchanged from the previous source and still needed: this clip
measures **SATAVG ~10** and sky `UAVG 123.6`, i.e. still washed out and still
colour-neutral, despite being seeded with a graded frame. Veo re-rendered in its
own hazy look and ignored the seed's grade. Graded output lands at **SATAVG
19.3** with sky `UAVG 130.0` — above the 128 neutral point, so actually blue.
`unsharp` is eased to `3:3:0.50` because this source is genuinely sharp;
over-sharpening it only bloated the WebP.

```bash
GRADE="eq=contrast=1.38:saturation=2.40:brightness=0.045:gamma=1.05,colorbalance=bh=0.20:bm=0.06:rh=-0.07,unsharp=3:3:0.50:3:3:0.0"

# Desktop. No crop — the source is already a clean 16:9.
# `showinfo` + grep pts_time from stderr rebuilds manifest.json.
ffmpeg -y -ss 2.6 -t 6.1 -i hero-v2.mp4   -vf "fps=10,$GRADE,scale=1920:1080:flags=lanczos,showinfo" -fps_mode passthrough   -c:v libwebp -quality 74 public/hero-frames/d/f_%03d.webp

# Mobile. Square crop centred on the building; same fps, so one manifest covers both.
ffmpeg -y -ss 2.6 -t 6.1 -i hero-v2.mp4   -vf "fps=10,crop=2160:2160:860:0,$GRADE,scale=900:900:flags=lanczos" -fps_mode passthrough   -c:v libwebp -quality 74 public/hero-frames/m/f_%03d.webp

# Reduced-motion stills — last frame of each set, already graded.
ffmpeg -y -i "$(ls public/hero-frames/d/*.webp | tail -1)" -q:v 4 public/hero-poster.jpg
ffmpeg -y -i "$(ls public/hero-frames/m/*.webp | tail -1)" -q:v 4 public/hero-poster-m.jpg
```

`manifest.json` carries `duration: 6.1`. The frame count is read from it, so
nothing in `Hero.jsx` changes when the sampling does — but the stage thresholds
in `content.js` are derived from the duration and `LEAD_IN`, so re-derive those
if either moves.

## The original hero.mp4 (superseded)

`hero.mp4` and `hero-sky-patch.png` are kept at the repo root but are **no longer
used**. Its defects, for reference if it is ever revisited:

- **Pillarboxed** — `crop=3240:2160:300:0`, 300px of black down each side,
  costing ~16% of the frame. Any crop starting at `x=0` dragged the bar in.
- **Typography burned into the first ~0.79s**, from a seed keyframe that was a
  design mockup. Worked around by compositing a text-free sky from n=20 onto
  frames n<19 (`hero-sky-patch.png`) — the camera was static across n=0–20, so
  those frames were pixel-aligned.
- **Camera static for only 0.83s.** A sobel probe on the in-shot sign holds
  44–46 through t=0.833, collapses to 5.9 by t=1.0 and only recovers to ~25.
- **A visible morph at 1.75–2.50s.**
- The in-shot brand sign is legible at t=0 but garbles by t=1.25.

**Known:** the source video's 1.75–2.50s beat is a visible AI morph. There is no
runtime treatment for it — it needs fixing in the source, or blurring in at
frame-extraction time so it costs nothing to display.

## Video assets

Masters are kept at the repo root and are **not** shipped:

- **`hero-v2.mp4`** — the 4K source every hero frame is extracted from. Active.
- `hero.mp4`, `hero-sky-patch.png` — the superseded original source and the sky
  composite it needed. Kept for reference only.
- `hero-trimmed-1080.mp4` — leftover intermediate from an earlier approach,
  unused.
- `showcase-4k-master.mp4` — 4K master for `public/showcase.mp4`.

`public/showcase.mp4` is a 1080p re-encode of that master (78MB 4K at 78Mbps →
14MB). It is paused by an IntersectionObserver whenever it is off-screen —
without that it decodes for the whole visit, since it sits inside a 240vh
section.

## Venture imagery

The ten division images are **graded and served locally** from
`public/ventures/<slug>.webp` (1800x1440, ~2.8MB total) rather than hot-linked
from Unsplash. One grade across all ten is what makes them read as a set instead
of ten unrelated stock photos — the colour temperature in the raw sources swings
from teal to gold to saturated blue. Regenerate with:

```bash
GRADE="eq=contrast=1.07:saturation=0.78:brightness=0.006,colortemperature=temperature=7400:mix=0.45,unsharp=3:3:0.30:3:3:0.0"

curl -s -o raw.jpg "https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1800&q=85"
ffmpeg -y -i raw.jpg -vf "scale=1800:1440:force_original_aspect_ratio=increase,crop=1800:1440,$GRADE" -c:v libwebp -quality 74 public/ventures/<slug>.webp
```

**Sized 1800x1440 (5:4), and the aspect is deliberate.** The showcase image slot
fills the available height while taking a fixed share of the width, so its aspect
swings from about 1.01 on a 1080-tall screen to 1.43 on a 768-tall one. A 4:3
source lost 24% of its width at the tall end. 5:4 sits mid-range, so worst-case
crop is ~15-19% either way and subjects stay centred. 1800px wide puts a 1080-tall
desktop at roughly 1:1 pixel parity at DPR 2.

`ramagiri-estate` is the one heavy file (~780KB) because rows of tea bushes are
almost pure high-frequency detail. Dropping quality to 60 and removing `unsharp`
barely moved it, so it is left at 72. It lazy-loads like the rest.

Drop real photography in at the same paths and sizes and nothing else needs to
change — the grade is the only step.

Subjects are curated per division and deliberately local: an Indian concrete
build with safety netting for `shikha-builders`, a paddy farmer for
`ramagiri-green-farms`, Kerala backwater cottages for `gowriramam-retreat`,
misty Munnar hills for `ramagiri-estate`, brick stacking for
`shikha-buildmart-and-metals`. `tlm-finance` shows a craftsman at work rather
than the hands-signing-a-contract stock cliché. Eight of the ten are
recognisably Indian or Keralan — a local visitor will read them as home.

To find replacements: Unsplash has no keyless search API, and as of late 2025 its
search *pages* are behind an Anubis proof-of-work bot check, so a plain `curl` of
`unsplash.com/s/photos/<query>` now 401s instead of returning HTML — a JS-capable
fetcher is needed to get the photo ids from a search page. `images.unsplash.com`
hotlinks (the actual CDN, used for `raw.jpg` below) are unaffected and still a
plain 200. Skip `plus.unsplash.com` / `premium_photo-*` results — those are paid
Unsplash+ licences. Always download and look before committing to one; alt text
is not enough.

Real photography of the actual sites still beats any stock set, and the pipeline
above makes swapping it in a one-command job.

## Services-section imagery

The three "Quality / Trust / Sustainable growth" cards (`services` in
`content.js`, rendered by `ExpertServices.jsx`) are graded and served locally
from `public/services/*.webp` (1600x900, 16:9) for the same reason as the
venture images above — a raw Unsplash hot-link reads as a mismatched stock photo
next to the rest of the graded site. Same grade as the ventures set. This
environment had no `ffmpeg`; `scripts` below use Pillow as a drop-in, but the
`ffmpeg` one-liner from the Venture imagery section works identically at 16:9:

```bash
ffmpeg -y -i raw.jpg -vf "scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,$GRADE" -c:v libwebp -quality 74 public/services/<name>.webp
```

`quality-control.webp` and `lasting-trust.webp` deliberately dodge the two
clichés this file already warns about: the quality card is workers measuring a
block wall rather than a magnifying glass over a checklist, and the trust card
is a handshake rather than hands signing a contract. `sustainable-growth.webp`
is rice being transplanted at sunset — literal growth, and Indian like most of
the venture set.

## Header

`src/components/Header.jsx` reads which section is under it and flips between a
light and dark variant. To mark a section as dark, add `data-nav-theme="dark"`
to it — no changes to the header needed.

## Still placeholder

Founding year, all figures in `stats` / `footprint`, leadership names and
photos, testimonials, certifications and contact details are placeholders,
flagged in `content.js`. Division names are proposals. Imagery is Unsplash
pending brand photography.
