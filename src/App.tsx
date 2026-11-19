import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AdminView } from './components/AdminView';
import { ChecklistView } from './components/ChecklistView';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { RegisterView } from './components/RegisterView';
import { ServicesView } from './components/ServicesView';
import { TrackView } from './components/TrackView';
import { fetchPublicCatalog } from './services/api';
import type {
  FinancialProduct,
  Language,
  PageView,
  ServiceCategory,
  ServiceRequirement,
} from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [activeView, setActiveView] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [prefillService, setPrefillService] = useState<ServiceRequirement | undefined>(undefined);
  const [prefillProduct, setPrefillProduct] = useState<string | undefined>(undefined);
  const [trackPrefill, setTrackPrefill] = useState<{ enquiryId?: string; mobile?: string }>({});

  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    try {
      const data = await fetchPublicCatalog();
      setProducts(data.products);
      if (data.settings?.whatsappNumber) {
        setWhatsappNumber(data.settings.whatsappNumber);
      }
    } catch {
      // keep fallback defaults if network temporarily fails
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleNavigate = (view: PageView) => {
    if (view !== 'register') {
      setPrefillService(undefined);
      setPrefillProduct(undefined);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setActiveView('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyProduct = (service: ServiceRequirement, productName: string) => {
    setPrefillService(service);
    setPrefillProduct(productName);
    setActiveView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackCreated = (enquiryId: string, mobile: string) => {
    setTrackPrefill({ enquiryId, mobile });
    setActiveView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        lang={lang}
        onToggleLang={setLang}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === 'home' && (
              <HomeView
                lang={lang}
                whatsappNumber={whatsappNumber}
                onNavigate={handleNavigate}
                onSelectServiceCategory={handleSelectServiceCategory}
              />
            )}

            {activeView === 'services' && (
              <ServicesView
                lang={lang}
                products={products}
                loading={loadingCatalog}
                whatsappNumber={whatsappNumber}
                selectedCategory={selectedCategory}
                onChangeCategory={setSelectedCategory}
                onApplyProduct={handleApplyProduct}
              />
            )}

            {activeView === 'register' && (
              <RegisterView
                lang={lang}
                whatsappNumber={whatsappNumber}
                initialService={prefillService}
                initialProductName={prefillProduct}
                onTrackCreated={handleTrackCreated}
              />
            )}

            {activeView === 'checklist' && (
              <ChecklistView lang={lang} onNavigate={handleNavigate} />
            )}

            {activeView === 'track' && (
              <TrackView
                lang={lang}
                whatsappNumber={whatsappNumber}
                prefillEnquiryId={trackPrefill.enquiryId}
                prefillMobile={trackPrefill.mobile}
              />
            )}

            {activeView === 'admin' && <AdminView onCatalogUpdated={loadCatalog} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
