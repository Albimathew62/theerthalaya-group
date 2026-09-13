# Hero video — regeneration prompt (Google Veo)

Use **image-to-video**, seeded with `docs/veo-seed/hero-seed-4k.jpg`
(or `hero-seed-1080.jpg`). Text-to-video invents a new building every run.

## Supply ONE image. Not a storyboard.

This is the most important change from the previous attempt.

The earlier generation was given a first keyframe **and** a six-panel storyboard
including the finished building. Given a start image and an end image, a video
model does the obvious thing: it **interpolates between them**. That is what a
dissolve is. The 1.75–2.50s morph was not the model ignoring "no morphing" — it
was the model doing what the reference images implied.

Describe the finished state in *words only*. Never show it a picture of the
finished building.

## The seed frame

`docs/veo-seed/hero-seed-4k.jpg` is built from the current video's opening frame
and fixes three things the old seed caused:

- **No burned-in typography.** The old seed was a design mockup with
  "BUILT WITH PURPOSE" already on it, so Veo reproduced the type and then let it
  drift over the first 0.79s. This one is clean.
- **Exactly 16:9.** The old seed was 3:2 — the current video's real content
  measures 3240x2160, padded into a 3840x2160 container with 300px black bars
  down both sides. A 16:9 seed gives Veo nothing to pad.
- **Already graded**, so the seed itself communicates the target look: blue sky,
  warm golden light, high contrast.

Regenerate it with the command at the bottom of this file.

---

## Prompt

```
Use the supplied image as the exact first frame. Preserve its composition,
architecture, perspective, framing and lighting precisely.

THE CAMERA IS COMPLETELY LOCKED. It is a tripod shot on a rigid head. There is
zero camera movement of any kind for the entire 8 seconds — no pan, tilt, dolly,
push-in, zoom, orbit, drone move, focal length change, parallax, or handheld
drift, not even slight or subtle movement. The frame is identical in the last
frame and the first frame.

Compress months of real construction of this one building into 8 seconds, as a
locked-off construction timelapse.

The building keeps the same height, floor count, footprint, silhouette, position
in frame and architectural design throughout. Only its state of completion
changes. It is never replaced, redesigned or substituted.

The work progresses SECTION BY SECTION, bottom to top, so different parts of the
building are visibly at different stages at the same moment:

- Structural work completes first: columns, beams, floor slabs, stair cores,
  structural walls.
- Then the envelope, rising floor by floor from the ground up: blockwork infill,
  window openings framed, glazing installed, balcony slabs finished, glass
  balustrades fitted.
- Then finishes, again from the bottom up: white plaster and paint, warm
  teak-toned cladding panels, railings, soffits, lit interiors behind the glass.
- Finally the ground plane: paved forecourt, planted landscaping, material
  stacks cleared, scaffolding struck floor by floor.

While the lower floors are already receiving facade finishes, the upper floors
must still be raw concrete frame with exposed rebar. The finished building
emerges upward out of the existing frame.

Every change happens through visible physical construction — panels lifted and
fitted, glazing set into openings, scaffolding dismantled. Nothing fades in,
dissolves, morphs, warps, or appears fully formed. The building must never look
like it is transforming; it must look like it is being built.

ENVIRONMENT — hold it steady:
- Lighting is constant late-afternoon golden hour from the right for all 8
  seconds. The sun does not move, and shadows do not swing.
- The sky stays deep blue with crisp white cumulus. Clouds may drift very
  slowly.
- No vehicle enters, leaves, or crosses the frame at any point. The parked truck
  at the left stays parked and stationary.
- Workers remain in place doing localised work. Nobody walks across the frame.
- The tower crane holds its position; its hook may move slightly.

FINAL 1.5 SECONDS: the last elements complete, the remaining scaffolding comes
down, and the finished building holds absolutely still and clean for the last
second — a stable, sharp final frame.

Style: photorealistic premium architectural film for a luxury developer.
Contemporary residential architecture. Natural concrete, glass, stone, warm
wood, elegant landscaping. Rich saturated colour, high contrast, crisp detail on
rebar and scaffolding. Deep focus.

ONE BUILDING. ONE LOCKED CAMERA. ONE CONTINUOUS TIMELAPSE.
NO CUTS. NO CAMERA MOVE. NO MORPH. NO DISSOLVE. NO SUDDEN COMPLETION.

Duration: exactly 8 seconds.
```

## Negative prompt

```
text, title, caption, subtitle, watermark, logo, signage, lettering, numbers,
letterbox, pillarbox, black bars, borders, camera movement, camera pan, tilt,
zoom, dolly, push-in, drone shot, orbit, parallax, handheld shake, motion blur,
vehicles driving across frame, people walking across frame, crossfade, dissolve,
morph, warp, ghosting, double exposure, building changing shape or height or
floor count, new building appearing, washed out, hazy, low contrast,
desaturated, grey overcast sky, moving sun, swinging shadows, lens flare, heavy
vignette, film grain, split screen, cuts, scene change
```

## Settings

- **Image-to-video**, seeded with the frame above
- **16:9**, 8 seconds, 24fps if selectable
- Native 4K if genuinely rendered at 4K; if the 4K option only upscales 1080p,
  take 1080p and say so — the extraction crop changes
- No audio needed
- **Generate 2–3 takes.** The morph is the hardest constraint to guarantee;
  picking from options beats fighting one bad run

---

## What went wrong last time, line by line

The previous prompt was detailed and mostly right. These specific lines worked
against it:

| Line in the old prompt | Measured result |
|---|---|
| "Only allow extremely subtle natural camera movement, if any" | Permission taken. A sobel probe on a static object holds 44–46 through t=0.833, then collapses to **5.9** by t=1.0. Everything after ~0.87s is camera-motion blurred |
| "Workers may move quickly" / "equipment may operate naturally" | A truck crosses frame from n=10, heavily motion-blurred, landing in the opening frames |
| "Sunlight and shadows may progress naturally" | Contradicts the same prompt's "no sudden change in lighting" |
| Six-panel storyboard supplied as reference | The morph. Start image + end image = interpolation |
| Seed keyframe was a design mockup | "BUILT WITH PURPOSE" burned into the first 0.79s |
| Seed keyframe was 3:2 | 300px pillarbox down both sides, costing ~16% of the frame |

Also worth knowing: the in-shot "THEERTHALAYA GROUP" sign is legible at t=0 but
degrades into garbled lettering by t=1.25. Video models cannot hold text. The
seed keeps it because it reads correctly at frame one — if it garbles again,
say so and it can be painted out of the seed.

## Checking whatever comes back

The same measurements that caught the current defects:

```bash
# 1. Black bars? Want the full frame, e.g. crop=3840:2160:0:0
ffmpeg -i new.mp4 -vf cropdetect=limit=24:round=2 -frames:v 60 -f null - 2>&1 \
  | grep -o "crop=[0-9:]*" | sort | uniq -c

# 2. Camera truly locked? Crop to a static object; a steady number across all
#    frames means locked. A collapse means it drifted.
ffprobe -v error -f lavfi -i "movie=new.mp4,crop=900:340:2200:1330,sobel,signalstats" \
  -show_entries frame_tags=lavfi.signalstats.YAVG -of csv=p=0 | head -40

# 3. Real colour? Want SATAVG well above 13, sky UAVG clearly above 128.
ffprobe -v error -f lavfi -i "movie=new.mp4,signalstats" \
  -show_entries frame_tags=lavfi.signalstats.YAVG,lavfi.signalstats.UAVG,lavfi.signalstats.SATAVG \
  -of default=noprint_wrappers=1 | head -6

# 4. Eyeball the whole clip for morph and burned-in text.
ffmpeg -y -i new.mp4 -vf "select='not(mod(n,12))',scale=480:-1,tile=4x4" -frames:v 1 sheet.jpg
```

If it comes back clean the pipeline simplifies a lot: no `hero-sky-patch.png`
composite, no `-ss` trim, a full-frame crop instead of
`crop=3240:1822:300:169`, and a far gentler grade than the current
`saturation=2.40` — which should also cut the 12MB frame payload, since most of
that weight is the aggressive grading needed to rescue the current source.

## Regenerating the seed frame

```bash
SEED="eq=contrast=1.30:saturation=2.0:brightness=0.035:gamma=1.04,\
colorbalance=bh=0.14:bm=0.05:rh=-0.05,unsharp=5:5:0.8:5:5:0.0"

ffmpeg -y -i hero.mp4 -i hero-sky-patch.png -filter_complex \
  "[0:v][1:v]overlay=0:0:enable='lt(n\,19)'[p];\
[p]select='eq(n\,0)',crop=3240:1822:300:169,$SEED,scale=3840:2160:flags=lanczos[o]" \
  -map "[o]" -frames:v 1 -q:v 2 docs/veo-seed/hero-seed-4k.jpg
```
