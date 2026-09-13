import SectionBadge from './ui/SectionBadge';
import { FadeIn, ParallaxImage } from './ui/Animations';
import { certifications, images } from '../data/content';

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        {/* Flagship story — split */}
        <FadeIn>
          <div className="grid lg:grid-cols-2 rounded-[28px] overflow-hidden border border-line mb-24 lg:mb-28">
            <div className="relative min-h-[380px] lg:min-h-[460px]">
              <ParallaxImage src={images.about} alt="A Theerthalaya Group construction project"
                rounded="" className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,24,27,0.5), transparent 55%)' }} />
              <span className="absolute bottom-6 left-6 text-white/85 text-[11px] tracking-[0.16em] uppercase z-10">
                Theerthalaya Constructions · Kerala
              </span>
            </div>
            <div className="bg-paper-2 p-10 lg:p-16 flex flex-col justify-center">
              <SectionBadge className="mb-6 block">The flagship</SectionBadge>
              <h3 className="font-display leading-[1.04] tracking-tight mb-5"
                  style={{ fontSize: 'clamp(28px,3.4vw,44px)' }}>
                It started with concrete, and a promise to never cut a corner.
              </h3>
              <p className="text-muted text-[15.5px] leading-relaxed max-w-[46ch]">
                Theerthalaya Constructions laid the foundation, literally, for everything that followed. It remains the group's anchor: residential, commercial and infrastructure projects delivered with the discipline that earned the Theerthalaya name its trust, and the standard every other venture is held to.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Certifications — light hairline row */}
        <FadeIn>
          <div className="border-t border-line pt-8 flex items-center justify-between flex-wrap gap-6">
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted">Certifications &amp; recognition</span>
            <div className="flex gap-x-10 gap-y-3 flex-wrap items-center">
              {certifications.map((c) => (
                <span key={c} className="font-display text-[15px] tracking-tight text-ink/80">{c}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
