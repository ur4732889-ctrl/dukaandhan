import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { UI_COPY } from '../i18n/translations';
import type { Language, PageView } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: (next: Language) => void;
  activeView: PageView;
  onNavigate: (view: PageView) => void;
}

export function Navbar({ lang, onToggleLang, activeView, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = UI_COPY[lang];

  const navItems: Array<{ view: PageView; label: string }> = [
    { view: 'home', label: copy.nav.home },
    { view: 'services', label: copy.nav.services },
    { view: 'checklist', label: copy.nav.checklist },
    { view: 'track', label: copy.nav.track },
    { view: 'admin', label: copy.nav.admin },
  ];

  const handleNav = (view: PageView) => {
    onNavigate(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean Brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-lg bg-[#0B1F3A] text-white flex items-center justify-center font-display font-bold text-sm tracking-tight"
          >
            DD
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-[#0B1F3A]">
            {copy.brand}
          </span>
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isActive
                    ? 'border-emerald-600 text-[#0B1F3A] font-semibold'
                    : 'border-transparent text-slate-600 hover:text-[#0B1F3A] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div
            role="group"
            aria-label="Language selection"
            className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200"
          >
            <button
              type="button"
              onClick={() => onToggleLang('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'hi'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'en'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNav('register')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            {copy.nav.cta}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleLang(lang === 'hi' ? 'en' : 'hi')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-[#0B1F3A] whitespace-nowrap shrink-0"
          >
            {lang === 'hi' ? 'EN' : 'हिंदी'}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('register')}
            className="w-full mt-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold text-center"
          >
            {copy.nav.cta}
          </button>
        </div>
      )}
    </header>
  );
}
