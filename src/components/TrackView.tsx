import { AlertCircle, CheckCircle2, Clock, MessageCircle, Search, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { STATUS_LABELS, WHATSAPP_TEMPLATES } from '../i18n/translations';
import { buildWhatsAppLink, trackCustomerEnquiry } from '../services/api';
import { ACTIVE_PROGRESS_STATUSES, type Language, type PublicTrackResult } from '../types';

interface TrackViewProps {
  lang: Language;
  whatsappNumber: string;
  prefillEnquiryId?: string;
  prefillMobile?: string;
}

const SAMPLE_DEMO_ACCOUNTS = [
  { enquiryId: 'DD-DDN-1001', mobile: '9837011001', label: 'DD-DDN-1001 · Completed (Sample)' },
  { enquiryId: 'DD-DDN-1002', mobile: '9837011002', label: 'DD-DDN-1002 · Bank Decision Pending (Sample)' },
  { enquiryId: 'DD-DDN-1005', mobile: '9837011005', label: 'DD-DDN-1005 · Docs Guidance (Sample)' },
];

export function TrackView({
  lang,
  whatsappNumber,
  prefillEnquiryId,
  prefillMobile,
}: TrackViewProps) {
  const isHi = lang === 'hi';
  const [enquiryId, setEnquiryId] = useState(prefillEnquiryId || '');
  const [mobile, setMobile] = useState(prefillMobile || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicTrackResult | null>(null);

  const performLookup = async (idToTrack: string, mobileToTrack: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await trackCustomerEnquiry(idToTrack.trim(), mobileToTrack.trim());
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefillEnquiryId && prefillMobile) {
      setEnquiryId(prefillEnquiryId);
      setMobile(prefillMobile);
      performLookup(prefillEnquiryId, prefillMobile);
    }
  }, [prefillEnquiryId, prefillMobile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!enquiryId.trim() || mobile.replace(/\D/g, '').length !== 10) {
      setError(
        isHi
          ? 'कृपया सही Enquiry ID और 10 अंकों का पंजीकृत मोबाइल नंबर दोनों दर्ज करें।'
          : 'Please enter both your Enquiry ID and 10-digit registered mobile number.'
      );
      return;
    }
    performLookup(enquiryId, mobile);
  };

  const activeStepIndex =
    result && result.status !== 'Not Proceeding'
      ? ACTIVE_PROGRESS_STATUSES.indexOf(result.status)
      : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-medium text-emerald-700 mb-2">
          {isHi ? 'सुरक्षित आवेदन जांच · DukaanDhan' : 'Verified Application Tracking · DukaanDhan'}
        </p>
        <h1
          style={{ textWrap: 'balance' }}
          className="font-display font-bold text-3xl text-[#0B1F3A] tracking-tight"
        >
          {isHi ? 'अपने अनुरोध की स्थिति (Status) जांचें' : 'Track Your Enquiry Status'}
        </h1>
        <p className="mt-2 text-slate-600 text-base">
          {isHi
            ? 'सुरक्षा सत्यापन के लिए अपना Enquiry ID और पंजीकृत मोबाइल नंबर दोनों दर्ज करें।'
            : 'Enter both your Enquiry ID and registered mobile number to verify and view progress.'}
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label htmlFor="trackId" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'Enquiry ID *' : 'Enquiry ID *'}
            </label>
            <input
              id="trackId"
              type="text"
              value={enquiryId}
              onChange={(e) => setEnquiryId(e.target.value.toUpperCase())}
              placeholder="DD-DDN-1001"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="trackMobile" className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
              {isHi ? 'पंजीकृत मोबाइल नंबर *' : 'Registered Mobile Number *'}
            </label>
            <input
              id="trackMobile"
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="9837011001"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? '...' : isHi ? 'जांचें' : 'Track'}</span>
            </button>
          </div>
        </div>

        {/* Sample Lookup Shortcuts */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">
            {isHi ? 'डेमो उदाहरण जांचें:' : 'Try sample enquiries:'}
          </span>
          {SAMPLE_DEMO_ACCOUNTS.map((sample) => (
            <button
              key={sample.enquiryId}
              type="button"
              onClick={() => {
                setEnquiryId(sample.enquiryId);
                setMobile(sample.mobile);
                performLookup(sample.enquiryId, sample.mobile);
              }}
              className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Tracking Result */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {result.isSample && (
            <div className="px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
              {isHi
                ? 'उदाहरण डेटा (Sample Demo Record) — यह केवल सिस्टम दिखाने के लिए है।'
                : 'Sample Demo Record — Displayed for demonstration purposes.'}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <p className="text-xs font-mono text-slate-500">
                {result.enquiryId} · {result.serviceRequired}
              </p>
              <h2 className="font-display font-bold text-2xl text-[#0B1F3A] mt-1">
                {result.businessName}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {result.fullName} · {result.businessLocation}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-500">{isHi ? 'वर्तमान स्थिति' : 'Current Status'}</p>
              <p
                className={`mt-1 text-base font-bold ${
                  result.status === 'Not Proceeding'
                    ? 'text-red-700'
                    : result.status === 'Completed'
                    ? 'text-emerald-700'
                    : 'text-[#0B1F3A]'
                }`}
              >
                {isHi ? STATUS_LABELS[result.status].hi : STATUS_LABELS[result.status].en}
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                {isHi ? 'सलाहकार: ' : 'Advisor: '}
                {result.assignedAdvisor}
              </p>
            </div>
          </div>

          {/* Latest Customer Update */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              {isHi ? 'ताज़ा अपडेट' : 'Latest Update'}
            </p>
            <p className="text-sm text-slate-800">{result.customerVisibleUpdate}</p>
            <p className="text-xs text-slate-500 mt-2 font-mono tabular-nums">
              {isHi ? 'अंतिम अपडेट: ' : 'Last updated: '}
              {new Date(result.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Visual Progress Stepper */}
          {result.status === 'Not Proceeding' ? (
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-semibold">
                  {isHi ? 'प्रक्रिया आगे नहीं बढ़ाई गई (Not Proceeding)' : 'Status: Not Proceeding'}
                </p>
                <p className="mt-1">
                  {isHi
                    ? 'यह अनुरोध अभी आगे नहीं बढ़ रहा है। यदि आप अन्य बैंक विकल्प देखना चाहते हैं, तो कृपया हमसे WhatsApp पर बात करें।'
                    : 'This enquiry is currently marked Not Proceeding. Please contact us on WhatsApp if you wish to explore other options.'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-display font-semibold text-sm text-[#0B1F3A] mb-4">
                {isHi ? 'प्रक्रिया के चरण (8 चरण)' : 'Application Guidance Progress'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ACTIVE_PROGRESS_STATUSES.map((stepStatus, idx) => {
                  const completed = idx < activeStepIndex || result.status === 'Completed';
                  const current = idx === activeStepIndex && result.status !== 'Completed';
                  return (
                    <div
                      key={stepStatus}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        completed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : current
                          ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-semibold tabular-nums">
                          0{idx + 1}
                        </span>
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : current ? (
                          <Clock className="w-4 h-4 text-emerald-300" />
                        ) : null}
                      </div>
                      <p className="text-xs font-semibold leading-snug">
                        {isHi ? STATUS_LABELS[stepStatus].hi : STATUS_LABELS[stepStatus].en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bank Decision Transparency Note */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {isHi
                ? 'महत्वपूर्ण: DukaanDhan लोन पास या रद्द नहीं करता। लोन, खाता या बीमा की अंतिम स्वीकृति पूरी तरह संबंधित अधिकृत बैंक या वित्तीय संस्थान के निर्णय पर निर्भर है।'
                : 'Important: DukaanDhan does not approve or reject loans. All final credit and product decisions are made solely by the authorized bank or financial institution.'}
            </p>
          </div>

          <div className="pt-2">
            <a
              href={buildWhatsAppLink(
                whatsappNumber,
                `${WHATSAPP_TEMPLATES.general} (Enquiry ID: ${result.enquiryId})`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isHi ? 'इस आवेदन पर WhatsApp सहायता पाएं' : 'Ask About This Enquiry on WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
