import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { FadeIn, StaggerContainer, StaggerItem } from './ui/Animations';
import { faqs } from '../data/content';

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-line">
      <button onClick={onClick} className="w-full py-6 flex items-center justify-between text-left group">
        <h3 className="font-display text-[19px] tracking-tight pr-8 group-hover:text-slate transition-colors">{question}</h3>
        <span className="w-8 h-8 rounded-full border border-line flex items-center justify-center flex-shrink-0 group-hover:border-slate transition-colors">
          {isOpen ? <Minus className="w-4 h-4 text-slate" /> : <Plus className="w-4 h-4 text-muted" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-6 text-muted leading-relaxed max-w-[60ch]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
          <FadeIn>
            <SectionBadge className="mb-4 block">Help center</SectionBadge>
            <h2 className="font-display leading-[0.96] tracking-tight"
                style={{ fontSize: 'clamp(30px,4vw,52px)' }}>
              Questions,<br />answered.
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.08}>
            {faqs.map((faq, i) => (
              <StaggerItem key={i}>
                <FAQItem {...faq} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
