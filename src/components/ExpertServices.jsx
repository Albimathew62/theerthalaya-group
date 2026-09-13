import { useState } from 'react';
import SectionBadge from './ui/SectionBadge';
import { FadeIn } from './ui/Animations';
import { services } from '../data/content';

export default function ExpertServices() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 lg:py-32 bg-paper-2">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-end flex-wrap gap-8 mb-12">
          <FadeIn className="max-w-2xl">
            <SectionBadge className="mb-4 block">What holds it together</SectionBadge>
            <h2 className="font-display leading-[0.96] tracking-tight" style={{ fontSize: 'clamp(34px,5vw,64px)' }}>
              Quality, trust,<br />sustainable growth.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-[340px] text-muted text-[15px] leading-relaxed">
              One standard runs through every venture in the group, from the construction site to the dinner table.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="flex flex-col md:flex-row gap-5 md:h-[540px]">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <article
                  key={s.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  tabIndex={0}
                  className={`relative overflow-hidden rounded-[24px] p-8 flex flex-col cursor-pointer transition-all duration-500 ease-out outline-none
                    ${on ? 'md:flex-[2.1] bg-ink text-white' : 'md:flex-[1] bg-white text-ink border border-line'}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[11px] uppercase tracking-[0.18em] ${on ? 'text-white/70' : 'text-muted'}`}>{s.label}</span>
                    <span className={`font-display leading-none tracking-tight ${on ? 'text-white' : 'text-line'}`}
                          style={{ fontSize: 'clamp(40px,4.4vw,68px)' }}>
                      .{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className={`font-display tracking-tight leading-tight ${on ? 'text-[26px]' : 'text-[20px]'} max-w-[18ch]`}>
                      {s.title}
                    </h3>
                    {on && (
                      <p className="text-white/70 text-[14.5px] leading-relaxed mt-3 max-w-[44ch]">{s.description}</p>
                    )}
                  </div>

                  {on && (
                    <div className="mt-6 rounded-2xl overflow-hidden h-44 md:h-auto md:flex-1 md:max-h-[220px]">
                      <img src={s.image} alt={s.label} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
