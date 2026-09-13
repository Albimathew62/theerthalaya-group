import { Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { companyInfo, navigation, subsidiaries, contact } from '../data/content';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-paper/70 pt-20 pb-10" data-nav-theme="dark">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-paper/10 pb-12">
          {/* brand */}
          <div>
            <div className="font-display text-2xl text-paper mb-4">{companyInfo.name}</div>
            <p className="text-[13.5px] leading-relaxed max-w-[34ch]">{companyInfo.description}</p>
            <div className="mt-6 flex gap-3">
              {[{ Icon: Linkedin, label: 'LinkedIn' }, { Icon: Twitter, label: 'Twitter' }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                   className="w-11 h-11 rounded-full bg-paper/10 flex items-center justify-center hover:bg-brass transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* enterprises */}
          <div>
            <h4 className="text-[11px] tracking-[0.18em] uppercase text-brass-light mb-5">Enterprises</h4>
            <ul className="-my-1">
              {subsidiaries.map((s) => (
                <li key={s.id}><a href="#companies" className="block py-1.5 text-[13.5px] hover:text-paper transition-colors">{s.name}</a></li>
              ))}
            </ul>
          </div>

          {/* group */}
          <div>
            <h4 className="text-[11px] tracking-[0.18em] uppercase text-brass-light mb-5">Group</h4>
            <ul className="-my-1">
              {navigation.map((n) => (
                <li key={n.label}><a href={n.href} className="block py-1.5 text-[13.5px] hover:text-paper transition-colors">{n.label}</a></li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-[11px] tracking-[0.18em] uppercase text-brass-light mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" /><span className="text-[13.5px]">{contact.office}</span></li>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5" /><a href={`tel:${contact.phone}`} className="block py-1 text-[13.5px] hover:text-paper">{contact.phone}</a></li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5" /><a href={`mailto:${contact.email}`} className="block py-1 text-[13.5px] hover:text-paper">{contact.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-paper/40">
          <span>© {year} {companyInfo.fullName}. All rights reserved.</span>
          <span>CIN: {companyInfo.cin} · GSTIN: {companyInfo.gstin}</span>
        </div>
      </div>
    </footer>
  );
}
