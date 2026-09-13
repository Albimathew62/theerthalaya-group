import AnimatedCounter from './ui/AnimatedCounter';
import { FadeIn, ParallaxImage } from './ui/Animations';
import SectionBadge from './ui/SectionBadge';
import { footprint, images } from '../data/content';

export default function Footprint() {
  return (
    <section className="bg-paper py-24 lg:py-28">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <FadeIn className="max-w-2xl mb-12">
          <SectionBadge className="mb-4 block">Our impact</SectionBadge>
          <h2 className="font-display leading-[0.98] tracking-tight" style={{ fontSize: 'clamp(32px,4.6vw,58px)' }}>
            The proof is in<br />the numbers.
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-[0.85fr_1.3fr_0.85fr] gap-6 items-stretch">
          <FadeIn className="hidden lg:block">
            <ParallaxImage src={images.about} alt="A Theerthalaya project" rounded="rounded-[24px]" className="h-full min-h-[420px]" />
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-col gap-4">
            {footprint.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-6 bg-paper-2 rounded-[20px] px-8 py-7">
                <div className="font-display leading-none text-ink tracking-tight" style={{ fontSize: 'clamp(36px,4.4vw,56px)' }}>
                  <AnimatedCounter value={f.value} suffix={f.suffix} />
                </div>
                <div className="text-[12px] tracking-[0.14em] uppercase text-muted text-right max-w-[12ch]">{f.label}</div>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.16} className="hidden lg:block">
            <ParallaxImage src={images.cta} alt="A Theerthalaya project" rounded="rounded-[24px]" className="h-full min-h-[420px]" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
