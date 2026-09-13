import { useEffect, useRef, useState } from 'react';
import { ScrollZoom, Marquee } from './ui/Animations';
import { images, marqueeWords } from '../data/content';

export default function ShowcaseMarquee() {
  const videoRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);

  /* The clip is ~14MB. That is a fine trade on a desktop connection for a
     full-bleed brand moment, and a bad one on a phone plan — mobile gets the
     poster, which is the same frame the video opens on. Decided once at mount
     so a resize can never trigger a 14MB fetch. */
  useEffect(() => {
    if (!images.showcaseVideo) return;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const conn = navigator.connection;
    const cheap = !conn || (!conn.saveData && !/2g/.test(conn.effectiveType || ''));
    setUseVideo(wide && cheap);
  }, []);

  /* The video lives inside a 240vh section, so it is off-screen for most of the
     page. Browsers do not reliably stop decoding it there — an observer does.
     Without this it decodes continuously for the whole visit. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const played = v.play();
          if (played && played.catch) played.catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: '200px' },
    );

    io.observe(v);
    return () => io.disconnect();
  }, [useVideo]);

  return (
    // overflow-x-clip contains the marquee horizontally WITHOUT breaking the
    // inner sticky pin (overflow-y stays visible).
    <section className="bg-paper-2 overflow-x-clip">
      <ScrollZoom
        minHeight="240vh"
        from={0.42}
        to={1}
        behind={
          <Marquee
            items={marqueeWords}
            speed={38}
            className="w-full font-display font-semibold text-ink/[0.12] leading-none text-[13vw]"
          />
        }
      >
        {/* full-viewport child: at scale 1 it fills the screen edge-to-edge.
            data-nav-theme flips the header to its dark variant once this has
            scaled up far enough to actually sit under the bar. */}
        {/* 100svh, not h-screen: on mobile 100vh is the *large* viewport, so the
            browser chrome pushes the bottom of the frame off-screen. */}
        <div className="w-screen h-[100svh]" data-nav-theme="dark">
          {useVideo ? (
            <video
              ref={videoRef}
              src={images.showcaseVideo}
              poster={images.showcase}
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={images.showcase}
              alt="Theerthalaya Group, diverse ventures, one vision"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </ScrollZoom>
    </section>
  );
}
