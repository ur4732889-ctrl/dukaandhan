import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useState } from 'react';
import { UI_COPY, WHATSAPP_TEMPLATES } from '../i18n/translations';
import { buildWhatsAppLink } from '../services/api';
import type { Language, PageView, ServiceCategory } from '../types';

interface HomeViewProps {
  lang: Language;
  whatsappNumber: string;
  onNavigate: (view: PageView) => void;
  onSelectServiceCategory: (category: ServiceCategory) => void;
}

const SERVICE_IMAGES: Record<ServiceCategory, string> = {
  business_loan: '/src/assets/images/service_business_loan_1795115583066.jpg',
  current_account: '/src/assets/images/service_current_account_1795115582861.jpg',
  insurance: '/src/assets/images/service_shop_insurance_1795115583454.jpg',
};

const HERO_IMAGE = '/src/assets/images/hero_dehradun_market_1795115582657.jpg';

export function HomeView({
  lang,
  whatsappNumber,
  onNavigate,
  onSelectServiceCategory,
}: HomeViewProps) {
  const copy = UI_COPY[lang];
  const [heroImgError, setHeroImgError] = useState(false);
  const [cardImgErrors, setCardImgErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="bg-[#0B1F3A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-medium text-emerald-300 tracking-wide mb-3">
                {copy.hero.kicker}
              </p>

              <p className="text-sm font-semibold text-slate-200 mb-2">
                {copy.hero.taglinePrimary}
                <span aria-hidden="true" className="mx-2 text-slate-500">·</span>
                <span className="text-slate-300 font-normal">{copy.hero.taglineSecondary}</span>
              </p>

              <h1
                style={{ textWrap: 'balance' }}
                className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.1rem] leading-[1.12] tracking-tight text-white mb-4"
              >
                {copy.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
                {copy.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <span>{copy.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={buildWhatsAppLink(whatsappNumber, WHATSAPP_TEMPLATES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{copy.hero.whatsappCta}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-white/15 bg-[#122B4E] relative">
                {!heroImgError ? (
                  <img
                    src={HERO_IMAGE}
                    alt={
                      lang === 'hi'
                        ? 'देहरादून के किराना दुकानदार काउंटर पर स्मार्टफोन देखते हुए'
                        : 'Dehradun kirana shopkeeper using smartphone at his store counter'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#122B4E] to-[#0B1F3A]">
                    <Store className="w-12 h-12 text-emerald-400 mb-3" />
                    <p className="font-display font-semibold text-lg text-white">DukaanDhan Dehradun</p>
                    <p className="text-sm text-slate-300 mt-1">{copy.hero.taglinePrimary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-column Summary Strip below hero */}
          <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.hero.strip.map((item) => (
              <div key={item.title} className="space-y-1">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs sm:text-sm text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A] tracking-tight"
            >
              {copy.overview.heading}
            </h2>
            <p className="mt-2 text-slate-600 text-base leading-relaxed">
              {copy.overview.subheading}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>{copy.overview.exploreAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.overview.cards.map((card) => {
            const imgFailed = cardImgErrors[card.category];
            return (
              <div
                key={card.category}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                  {!imgFailed ? (
                    <img
                      src={SERVICE_IMAGES[card.category]}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setCardImgErrors((prev) => ({ ...prev, [card.category]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-mono font-medium text-emerald-700 mb-2">
                    {card.index} · DukaanDhan Guidance
                  </p>
                  <h3 className="font-display font-bold text-xl text-[#0B1F3A] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-6">
                    {card.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectServiceCategory(card.category)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#0B1F3A] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How DukaanDhan Works */}
      <section className="bg-white border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A] tracking-tight"
            >
              {copy.howItWorks.heading}
            </h2>
            <p className="mt-2 text-slate-600 text-base leading-relaxed">
              {copy.howItWorks.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.howItWorks.steps.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col"
              >
                <span className="font-mono text-sm font-semibold text-emerald-700 mb-3">
                  {lang === 'hi' ? `कदम ${item.step}` : `Step ${item.step}`}
                </span>
                <h3 className="font-display font-bold text-lg text-[#0B1F3A] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A] tracking-tight"
            >
              {copy.trust.heading}
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              {copy.trust.subheading}
            </p>

            <div className="mt-6 p-6 rounded-2xl bg-[#0B1F3A] text-white border border-slate-800">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-base text-white">
                    {copy.trust.disclaimerTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                    {copy.trust.disclaimerBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {copy.trust.principles.map((p) => (
              <div
                key={p.title}
                className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-sm sm:text-base text-[#0B1F3A]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Customer Testimonials */}
      <section className="bg-white border-t border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A] tracking-tight"
            >
              {copy.testimonials.heading}
            </h2>
            <p className="mt-2 text-slate-600 text-base">{copy.testimonials.subheading}</p>
            <p className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
              {copy.testimonials.sampleNotice}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {copy.testimonials.items.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-slate-500 mb-3">
                    {item.shop} · {item.area}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">“{item.quote}”</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-[#0B1F3A]">{item.name}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{item.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <section className="bg-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {copy.ctaBand.heading}
            </h2>
            <p className="mt-2 text-emerald-50 text-sm sm:text-base">{copy.ctaBand.subheading}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="px-6 py-3 rounded-xl bg-white text-[#0B1F3A] hover:bg-slate-100 font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {copy.ctaBand.button}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('track')}
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 border border-emerald-500 text-white font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {copy.ctaBand.trackButton}
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            <div className="md:col-span-5">
              <p className="font-display font-bold text-lg text-white">DukaanDhan</p>
              <p className="mt-1 text-sm text-emerald-300">
                {copy.hero.taglinePrimary} · {copy.hero.taglineSecondary}
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">{copy.footer.markets}</p>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">{copy.footer.note}</p>
            </div>

            <div className="md:col-span-3">
              <p className="text-sm font-semibold text-white mb-3">{copy.footer.quickLinks}</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="hover:text-white transition-colors"
                  >
                    {copy.nav.services}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('checklist')}
                    className="hover:text-white transition-colors"
                  >
                    {copy.nav.checklist}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="hover:text-white transition-colors"
                  >
                    {copy.nav.cta}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('track')}
                    className="hover:text-white transition-colors"
                  >
                    {copy.nav.track}
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="text-sm font-semibold text-white mb-3">{copy.footer.contactTitle}</p>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono tabular-nums">+{whatsappNumber}</span>
              </p>
              <a
                href={buildWhatsAppLink(whatsappNumber, WHATSAPP_TEMPLATES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{copy.footer.whatsappLabel}</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} DukaanDhan · Dehradun, Uttarakhand</p>
            <p>
              {lang === 'hi'
                ? 'मुफ़्त ग्राहक मार्गदर्शन · कोई छिपा शुल्क नहीं · अंतिम निर्णय बैंक का'
                : 'Free customer guidance · Zero hidden fees · Bank approval subject to eligibility'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
