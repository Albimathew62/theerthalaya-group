import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './ui/Animations';
import Button from './ui/Button';
import { contact } from '../data/content';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', message: '', botcheck: '' };

export default function ContactCTA() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          message: form.message,
          botcheck: form.botcheck,
          subject: 'New enquiry: Theerthalaya Group',
          from_name: 'Theerthalaya Group Website',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm(EMPTY);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const field = "w-full px-0 py-3 bg-transparent border-b border-line text-ink placeholder-muted/70 focus:outline-none focus:border-slate transition-colors";
  const label = "block text-[11px] tracking-[0.18em] uppercase text-muted mb-2";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-paper">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="glass relative rounded-[28px] p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div className="absolute rounded-full"
                 style={{ width: 460, height: 460, top: -160, right: -100, filter: 'blur(36px)',
                          background: 'radial-gradient(circle,rgba(91,123,140,0.22),transparent 70%)' }} />

            <div className="relative z-10 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-start">
              {/* left: headline + details */}
              <div>
                <h2 className="font-display leading-[0.96] tracking-tight"
                    style={{ fontSize: 'clamp(40px,6vw,78px)' }}>
                  Let's build<br />something that{' '}
                  <span className="text-slate">lasts.</span>
                </h2>
                <div className="mt-10 flex flex-col gap-6">
                  {[
                    ['Registered office', contact.office],
                    ['Enquiries', `${contact.email} · ${contact.phone}`],
                    ['Investor relations', contact.investorEmail],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[11px] tracking-[0.18em] uppercase text-brass mb-1.5">{k}</div>
                      <div className="text-[15.5px] leading-relaxed">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right: form / feedback */}
              <motion.div
                initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/70 border border-line rounded-2xl p-8">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
                    <div className="text-[18px] font-display font-medium text-ink">Thank you for reaching out.</div>
                    <p className="text-[14.5px] text-muted leading-relaxed">
                      We've received your enquiry and will be in touch shortly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 text-[13px] text-brass underline underline-offset-2 hover:text-ink transition-colors"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit}>
                    {/* Web3Forms honeypot. Hidden from people and from the tab
                        order; bots fill it in and the API then drops the
                        submission. The access key is public by design, so this
                        is the spam defence that matters. */}
                    <input
                      type="text"
                      name="botcheck"
                      value={form.botcheck}
                      onChange={onChange}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute w-px h-px -m-px p-0 overflow-hidden border-0"
                      style={{ clip: 'rect(0 0 0 0)' }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className={label}>First name</label>
                        <input id="firstName" className={field} name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
                      </div>
                      <div>
                        <label htmlFor="lastName" className={label}>Last name</label>
                        <input id="lastName" className={field} name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} required />
                      </div>
                      <div>
                        <label htmlFor="email" className={label}>Email</label>
                        <input id="email" className={field} type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
                      </div>
                      <div>
                        <label htmlFor="phone" className={label}>Phone</label>
                        <input id="phone" className={field} type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className={label}>How can we help?</label>
                        <textarea id="message" className={`${field} resize-none`} name="message" rows={3} placeholder="How can we help?" value={form.message} onChange={onChange} />
                      </div>
                    </div>
                    {status === 'error' && (
                      <p className="mt-4 text-[13px] text-red-500">
                        Something went wrong. Please email us directly at{' '}
                        <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a>
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      withArrow={status !== 'loading'}
                      disabled={status === 'loading'}
                      className="w-full mt-8"
                    >
                      {status === 'loading' ? 'Sending…' : 'Send enquiry'}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
