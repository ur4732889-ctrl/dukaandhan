import { CheckCircle2, Copy, Lock, MessageCircle, SearchCheck, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  BUSINESS_CATEGORY_LABELS,
  SERVICE_REQUIREMENT_LABELS,
  WHATSAPP_TEMPLATES,
} from '../i18n/translations';
import {
  buildWhatsAppLink,
  submitCustomerEnquiry,
  type CreateEnquiryResponse,
} from '../services/api';
import type {
  BusinessCategory,
  ContactMethod,
  Language,
  ServiceRequirement,
} from '../types';

interface RegisterViewProps {
  lang: Language;
  whatsappNumber: string;
  initialService?: ServiceRequirement;
  initialProductName?: string;
  onTrackCreated: (enquiryId: string, mobile: string) => void;
}

const DEHRADUN_AREAS = [
  'Paltan Bazaar, Dehradun',
  'Clock Tower (Ghanta Ghar), Dehradun',
  'Patel Nagar / Saharanpur Road, Dehradun',
  'Rajpur Road, Dehradun',
  'Chakrata Road, Dehradun',
  'Clement Town, Dehradun',
  'Prem Nagar, Dehradun',
  'Raipur / Nehru Colony, Dehradun',
  'Other Dehradun Market',
];

const INCOME_RANGES = [
  '< ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹60,000',
  '₹60,000 – ₹1,00,000',
  '> ₹1,00,000',
];

export function RegisterView({
  lang,
  whatsappNumber,
  initialService,
  initialProductName,
  onTrackCreated,
}: RegisterViewProps) {
  const isHi = lang === 'hi';

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('Kirana Shop');
  const [businessLocation, setBusinessLocation] = useState('Paltan Bazaar, Dehradun');
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('₹15,000 – ₹30,000');
  const [serviceRequired, setServiceRequired] = useState<ServiceRequirement>(
    initialService || 'Business Loan'
  );
  const [preferredLanguage, setPreferredLanguage] = useState<'Hindi' | 'English'>(
    lang === 'hi' ? 'Hindi' : 'English'
  );
  const [preferredContactMethod, setPreferredContactMethod] =
    useState<ContactMethod>('WhatsApp');
  const [consentGiven, setConsentGiven] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateEnquiryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedMobile = mobile.replace(/\D/g, '');
    if (fullName.trim().length < 2) {
      setError(isHi ? 'कृपया अपना पूरा नाम लिखें।' : 'Please enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setError(
        isHi
          ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit Indian mobile number.'
      );
      return;
    }
    if (businessName.trim().length < 2) {
      setError(
        isHi
          ? 'कृपया अपनी दुकान या व्यापार का नाम लिखें।'
          : 'Please enter your shop or business name.'
      );
      return;
    }
    if (!consentGiven) {
      setError(
        isHi
          ? 'आगे बढ़ने के लिए कृपया संपर्क सहमति (Consent) बॉक्स पर टिक करें।'
          : 'Please check the consent box so our advisor can contact you.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitCustomerEnquiry({
        fullName: fullName.trim(),
        mobile: cleanedMobile,
        businessName: businessName.trim(),
        businessCategory,
        businessLocation,
        monthlyIncomeRange,
        serviceRequired,
        selectedProductName: initialProductName,
        preferredLanguage,
        preferredContactMethod,
        consentGiven,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  if (result) {
    const waMessage = `Namaste DukaanDhan, mera Enquiry ID ${result.enquiryId} hai (${result.businessName} - ${result.serviceRequired}). Mujhe guidance chahiye.`;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A]">
            {isHi
              ? 'आपका अनुरोध सफलतापूर्वक दर्ज हो गया है!'
              : 'Your Assistance Request Is Registered!'}
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            {isHi
              ? 'अपना Enquiry ID संभाल कर रखें। आप इससे कभी भी अपना स्टेटस ट्रैक कर सकते हैं।'
              : 'Please save your unique Enquiry ID below. You can use it anytime to track your progress.'}
          </p>

          <div className="mt-6 p-5 rounded-xl bg-[#0B1F3A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-300">
                {isHi ? 'आपका Enquiry ID' : 'Your Enquiry ID'}
              </p>
              <p className="font-mono text-2xl font-bold tracking-wider tabular-nums text-emerald-300 mt-1">
                {result.enquiryId}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyId(result.enquiryId)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? (isHi ? 'कॉपी हुआ' : 'Copied') : isHi ? 'ID कॉपी करें' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="font-display font-semibold text-base text-[#0B1F3A]">
              {isHi ? 'आगे के कदम (Next Steps)' : 'What Happens Next'}
            </h2>
            <ol className="space-y-2.5 text-sm text-slate-700 list-decimal list-inside">
              <li>
                {isHi
                  ? 'DukaanDhan के सलाहकार आपके चुने हुए माध्यम (कॉल / WhatsApp) से आपसे बात करेंगे।'
                  : 'A DukaanDhan advisor will reach out via your preferred contact method.'}
              </li>
              <li>
                {isHi
                  ? 'आपकी दुकान की ज़रूरत के अनुसार उपयुक्त बैंक विकल्प और कागज़ात हिंदी में समझाए जाएंगे।'
                  : 'We will explain suitable banking options and document checklist in plain Hindi or English.'}
              </li>
              <li>
                {isHi
                  ? 'आपकी सहमति के बाद आपको अधिकृत बैंक/पार्टनर से जोड़ा जाएगा। अंतिम निर्णय बैंक का होगा।'
                  : 'With your confirmation, we connect you to an authorized bank partner. Final approval rests with the bank.'}
              </li>
            </ol>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
            <a
              href={buildWhatsAppLink(whatsappNumber, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isHi ? 'WhatsApp पर जुड़ें' : 'Continue on WhatsApp'}</span>
            </a>

            <button
              type="button"
              onClick={() => onTrackCreated(result.enquiryId, mobile.replace(/\D/g, ''))}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-[#0B1F3A] text-white text-sm font-semibold inline-flex items-center gap-2"
            >
              <SearchCheck className="w-4 h-4" />
              <span>{isHi ? 'स्टेटस ट्रैक करें' : 'Track This Application'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-medium text-emerald-700 mb-2">
          {isHi ? 'मुफ़्त पंजीकरण · देहरादून' : 'Free Assistance Registration · Dehradun'}
        </p>
        <h1
          style={{ textWrap: 'balance' }}
          className="font-display font-bold text-3xl text-[#0B1F3A] tracking-tight"
        >
          {isHi
            ? 'मुफ़्त बैंकिंग सहायता के लिए अनुरोध भेजें'
            : 'Request Free Banking Assistance'}
        </h1>
        <p className="mt-2 text-slate-600 text-base">
          {isHi
            ? 'सिर्फ अपनी बुनियादी दुकान जानकारी भरें। हमारी टीम आपसे आसान हिंदी में संपर्क करेगी।'
            : 'Share your basic shop details below. Our local team will guide you with zero customer fees.'}
        </p>
      </div>

      {/* Explicit Safety Warning: NO Aadhaar, PAN, Passwords, OTPs */}
      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-950">
          <p className="font-semibold">
            {isHi
              ? 'सुरक्षा सूचना: कृपया यहाँ आधार नंबर, पैन नंबर, बैंक पासवर्ड या OTP दर्ज न करें।'
              : 'Privacy Safety Notice: Do NOT share Aadhaar numbers, PAN numbers, bank passwords, or OTPs here.'}
          </p>
          <p className="mt-0.5 text-emerald-900">
            {isHi
              ? 'शुरुआती सलाह के लिए केवल नाम, मोबाइल नंबर और दुकान का विवरण पर्याप्त है।'
              : 'Only your contact and shop details are needed for initial free guidance.'}
          </p>
        </div>
      </div>

      {initialProductName && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-800">
          <span className="font-semibold">{isHi ? 'चुना गया विषय: ' : 'Selected Option: '}</span>
          <span>{initialProductName}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
      >
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'पूरा नाम *' : 'Full Name *'}
            </label>
            <input
              id="fullName"
              type="text"
              required
              maxLength={80}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isHi ? 'जैसे: रमेश चंद्र जोशी' : 'e.g. Ramesh Chandra Joshi'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? '10 अंकों का मोबाइल नंबर *' : '10-Digit Mobile Number *'}
            </label>
            <input
              id="mobile"
              type="tel"
              required
              maxLength={13}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="98370XXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'दुकान / व्यापार का नाम *' : 'Shop / Business Name *'}
            </label>
            <input
              id="businessName"
              type="text"
              required
              maxLength={100}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={isHi ? 'जैसे: जोशी किराना स्टोर' : 'e.g. Joshi Kirana Store'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="businessCategory" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'व्यापार की श्रेणी *' : 'Business Category *'}
            </label>
            <select
              id="businessCategory"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value as BusinessCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {(Object.keys(BUSINESS_CATEGORY_LABELS) as BusinessCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {isHi ? BUSINESS_CATEGORY_LABELS[cat].hi : BUSINESS_CATEGORY_LABELS[cat].en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="businessLocation" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'दुकान का स्थान (देहरादून) *' : 'Business Location (Dehradun) *'}
            </label>
            <select
              id="businessLocation"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {DEHRADUN_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="monthlyIncomeRange" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'अनुमानित मासिक आय / काम' : 'Monthly Income Range'}
            </label>
            <select
              id="monthlyIncomeRange"
              value={monthlyIncomeRange}
              onChange={(e) => setMonthlyIncomeRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {INCOME_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serviceRequired" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'आवश्यक वित्तीय सेवा *' : 'Required Financial Service *'}
            </label>
            <select
              id="serviceRequired"
              value={serviceRequired}
              onChange={(e) => setServiceRequired(e.target.value as ServiceRequirement)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {(Object.keys(SERVICE_REQUIREMENT_LABELS) as ServiceRequirement[]).map((srv) => (
                <option key={srv} value={srv}>
                  {isHi ? SERVICE_REQUIREMENT_LABELS[srv].hi : SERVICE_REQUIREMENT_LABELS[srv].en}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
                {isHi ? 'पसंदीदा भाषा' : 'Language'}
              </label>
              <select
                id="preferredLanguage"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as 'Hindi' | 'English')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredContact" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
                {isHi ? 'संपर्क तरीका' : 'Contact Via'}
              </label>
              <select
                id="preferredContact"
                value={preferredContactMethod}
                onChange={(e) => setPreferredContactMethod(e.target.value as ContactMethod)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">{isHi ? 'फ़ोन कॉल' : 'Phone Call'}</option>
                <option value="In-Person Visit (Dehradun)">
                  {isHi ? 'दुकान पर भेंट' : 'In-Person (Dehradun)'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
          />
          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {isHi
              ? 'मैं सहमत हूँ कि DukaanDhan की टीम मेरे इस अनुरोध के संबंध में मुझसे फ़ोन या WhatsApp द्वारा संपर्क कर सकती है और मेरी जानकारी का उपयोग सही बैंकिंग मार्गदर्शन देने के लिए कर सकती है। मुझे पता है कि लोन या खाते की अंतिम स्वीकृति केवल संबंधित बैंक द्वारा दी जाती है।'
              : 'I consent to DukaanDhan contacting me via phone/WhatsApp and processing these details to provide banking guidance. I understand DukaanDhan does not guarantee loan approval and final decisions rest with the partner bank.'}
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isHi ? 'मुफ़्त मार्गदर्शन · ₹0 छिपा शुल्क' : 'Free guidance · ₹0 hidden fees'}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={buildWhatsAppLink(whatsappNumber, WHATSAPP_TEMPLATES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0B1F3A] text-sm font-semibold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'WhatsApp से भेजें' : 'Ask on WhatsApp'}</span>
            </a>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {submitting
                ? isHi
                  ? 'दर्ज हो रहा है...'
                  : 'Submitting...'
                : isHi
                ? 'अनुरोध जमा करें'
                : 'Submit Assistance Request'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
