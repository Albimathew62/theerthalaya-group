import SectionBadge from './ui/SectionBadge';
import { FadeIn, StaggerContainer, StaggerItem } from './ui/Animations';
import { testimonials } from '../data/content';

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-paper">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-end flex-wrap gap-8 mb-12">
          <FadeIn>
            <SectionBadge className="mb-4 block">What partners say</SectionBadge>
            <h2 className="font-display leading-[0.98] tracking-tight" style={{ fontSize: 'clamp(32px,4.6vw,58px)' }}>
              Trusted across<br />every venture.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-[340px] text-muted text-[15px] leading-relaxed">
              Relationships built over decades, with partners, banks and the communities the group works in.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" staggerDelay={0.1}>
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <figure className="bg-paper-2 rounded-[20px] p-8 h-full flex flex-col">
                <span className="font-display text-slate text-5xl leading-none mb-4" aria-hidden>&ldquo;</span>
                <blockquote className="text-ink text-[16px] leading-relaxed flex-1">{t.quote}</blockquote>
                <figcaption className="mt-6 text-[13px] text-muted">{t.name}</figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
