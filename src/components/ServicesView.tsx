import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Landmark,
  MessageCircle,
  Shield,
  Wallet,
} from 'lucide-react';
import { WHATSAPP_TEMPLATES } from '../i18n/translations';
import { buildWhatsAppLink } from '../services/api';
import type { FinancialProduct, Language, ServiceCategory, ServiceRequirement } from '../types';

interface ServicesViewProps {
  lang: Language;
  products: FinancialProduct[];
  loading: boolean;
  whatsappNumber: string;
  selectedCategory: ServiceCategory | 'all';
  onChangeCategory: (cat: ServiceCategory | 'all') => void;
  onApplyProduct: (service: ServiceRequirement, productName: string) => void;
}

export function ServicesView({
  lang,
  products,
  loading,
  whatsappNumber,
  selectedCategory,
  onChangeCategory,
  onApplyProduct,
}: ServicesViewProps) {
  const isHi = lang === 'hi';

  const tabs: Array<{ id: ServiceCategory | 'all'; label: string }> = [
    { id: 'all', label: isHi ? 'सभी सेवाएं' : 'All Services' },
    { id: 'business_loan', label: isHi ? 'बिज़नेस लोन' : 'Business Loans' },
    { id: 'current_account', label: isHi ? 'करेंट अकाउंट' : 'Current Accounts' },
    { id: 'insurance', label: isHi ? 'बिज़नेस बीमा' : 'Business Insurance' },
  ];

  const filtered =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const mapCategoryToRequirement = (cat: ServiceCategory): ServiceRequirement => {
    if (cat === 'business_loan') return 'Business Loan';
    if (cat === 'current_account') return 'Current Account';
    return 'Insurance';
  };

  const getCtaLabel = (cat: ServiceCategory): string => {
    if (cat === 'business_loan') return isHi ? 'लोन सहायता के लिए आवेदन करें' : 'Apply for Assistance';
    if (cat === 'current_account') return isHi ? 'अकाउंट सहायता पाएं' : 'Get Account Assistance';
    return isHi ? 'बीमा मार्गदर्शन पाएं' : 'Get Insurance Guidance';
  };

  const getWhatsAppTemplate = (cat: ServiceCategory): string => {
    if (cat === 'business_loan') return WHATSAPP_TEMPLATES.business_loan;
    if (cat === 'current_account') return WHATSAPP_TEMPLATES.current_account;
    return WHATSAPP_TEMPLATES.insurance;
  };

  const getCategoryIcon = (cat: ServiceCategory) => {
    if (cat === 'business_loan') return <Landmark className="w-5 h-5 text-emerald-700" />;
    if (cat === 'current_account') return <Wallet className="w-5 h-5 text-emerald-700" />;
    return <Shield className="w-5 h-5 text-emerald-700" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-medium text-emerald-700 mb-2">
          {isHi ? 'DukaanDhan सेवा सूची · देहरादून' : 'DukaanDhan Financial Catalogue · Dehradun'}
        </p>
        <h1
          style={{ textWrap: 'balance' }}
          className="font-display font-bold text-3xl sm:text-4xl text-[#0B1F3A] tracking-tight"
        >
          {isHi
            ? 'आपके व्यापार के लिए बैंकिंग और बीमा विकल्प'
            : 'Banking & Insurance Guidance for Your Business'}
        </h1>
        <p className="mt-3 text-slate-600 text-base leading-relaxed">
          {isHi
            ? 'हर उत्पाद की पात्रता, ज़रूरी कागज़ात और शर्तें सरल हिंदी में पढ़ें। ध्यान दें: असत्यापित या उदाहरण उत्पाद एडमिन द्वारा पार्टनर पुष्टि के बाद अपडेट किए जाते हैं।'
            : 'Review eligibility, required documents, and terms in plain language. Unverified or sample templates are clearly marked until confirmed by authorized partner banks.'}
        </p>
      </div>

      {/* Transparency Notice */}
      <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-950 leading-relaxed">
          {isHi
            ? 'पारदर्शिता सूचना: DukaanDhan कोई बैंक, NBFC या बीमा कंपनी नहीं है। ब्याज दरें, न्यूनतम बैलेंस और सरकारी योजना की पात्रता संबंधित अधिकृत संस्थान द्वारा सत्यापन के बाद ही अंतिम मानी जाएगी।'
            : 'Transparency Notice: DukaanDhan is not a bank, NBFC, or insurer. Indicative interest rates, minimum balance rules, and scheme eligibility are shown only when verified with authorized partners.'}
        </p>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-fit mb-8">
        {tabs.map((tab) => {
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeCategory(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#0B1F3A] text-white'
                  : 'text-slate-700 hover:text-[#0B1F3A] hover:bg-white/70'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-80 rounded-2xl bg-white border border-slate-200 p-6 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center">
          <p className="text-slate-700 font-medium">
            {isHi ? 'इस श्रेणी में अभी कोई उत्पाद उपलब्ध नहीं है।' : 'No products found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((product) => {
            const name = isHi ? product.nameHi : product.nameEn;
            const amountLabel = isHi ? product.amountOrBalanceLabelHi : product.amountOrBalanceLabelEn;
            const features = isHi ? product.featuresHi : product.featuresEn;
            const eligibility = isHi ? product.eligibilityHi : product.eligibilityEn;
            const docs = isHi ? product.documentsHi : product.documentsEn;
            const terms = isHi ? product.termsHi : product.termsEn;

            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Clean Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#0B1F3A]">
                      {getCategoryIcon(product.category)}
                      <span>{product.subType}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{product.partnerName}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        product.isVerifiedPartner
                          ? 'text-emerald-700 font-semibold'
                          : 'text-amber-700 font-medium'
                      }
                    >
                      {product.isVerifiedPartner
                        ? isHi
                          ? 'सत्यापित पार्टनर'
                          : 'Verified Partner'
                        : isHi
                        ? 'उदाहरण / सत्यापन बाकी'
                        : 'Sample / Verification Pending'}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-xl text-[#0B1F3A] mb-4">
                    {name}
                  </h2>

                  {/* Key Numerical / Terms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
                    <div>
                      <p className="text-xs text-slate-500">
                        {product.category === 'current_account'
                          ? isHi
                            ? 'न्यूनतम बैलेंस आवश्यकता'
                            : 'Minimum Balance'
                          : product.category === 'insurance'
                          ? isHi
                            ? 'कवरेज विवरण'
                            : 'Coverage Info'
                          : isHi
                          ? 'अनुमानित ऋण सीमा'
                          : 'Loan Amount Range'}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0B1F3A] tabular-nums">
                        {amountLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        {product.category === 'business_loan'
                          ? isHi
                            ? 'अनुमानित ब्याज दर'
                            : 'Indicative Interest Rate'
                          : isHi
                          ? 'पार्टनर स्थिति'
                          : 'Partner Verification'}
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                        {product.category === 'business_loan'
                          ? product.isVerifiedRate && product.indicativeRate
                            ? product.indicativeRate
                            : isHi
                            ? 'बैंक पुष्टि पर निर्भर (असत्यापित)'
                            : 'Confirmed by partner bank (Unverified)'
                          : product.isVerifiedPartner
                          ? isHi
                            ? 'अधिकृत पार्टनर'
                            : 'Authorized Partner'
                          : isHi
                          ? 'कॉन्फ़िगरेबल उदाहरण स्लॉट'
                          : 'Configurable Sample Slot'}
                      </p>
                    </div>
                  </div>

                  {/* Features / Benefits */}
                  {features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        {product.category === 'insurance'
                          ? isHi
                            ? 'मुख्य सुरक्षा लाभ'
                            : 'Key Protection Benefits'
                          : isHi
                          ? 'मुख्य विशेषताएं'
                          : 'Key Features'}
                      </p>
                      <ul className="space-y-1.5">
                        {features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Eligibility & Documents */}
                  <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                    <div>
                      <span className="font-semibold text-[#0B1F3A]">
                        {isHi ? 'पात्रता: ' : 'Eligibility: '}
                      </span>
                      <span className="text-slate-600">{eligibility}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#0B1F3A] inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isHi ? 'संभावित कागज़ात: ' : 'Typical Documents: '}</span>
                      </span>
                      <span className="text-slate-600">{docs.join(' · ')}</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="font-semibold text-slate-700">
                        {isHi ? 'नियम व शर्तें: ' : 'Terms: '}
                      </span>
                      {terms}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onApplyProduct(mapCategoryToRequirement(product.category), name)}
                    className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>{getCtaLabel(product.category)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={buildWhatsAppLink(whatsappNumber, getWhatsAppTemplate(product.category))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0B1F3A] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
