import SectionBadge from './ui/SectionBadge';
import { RevealText } from './ui/Animations';

// Scroll-scrubbed reveal — the accent word in {braces} renders in the slate accent.
const TEXT =
  "Ten ventures, one vision. We don't chase a single market. Instead, we build across many, each rooted in the same belief that {quality compounds}, that {trust is earned} slowly, and that growth is only worth having if it lasts.";

export default function Philosophy() {
  return (
    <section id="group" className="py-32 lg:py-40 bg-paper">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionBadge className="mb-9 block">Who we are</SectionBadge>
        <RevealText
          text={TEXT}
          className="font-display font-medium leading-[1.18] tracking-tight max-w-[20ch] text-ink"
          style={{ fontSize: 'clamp(28px,4vw,56px)' }}
        />
      </div>
    </section>
  );
}
