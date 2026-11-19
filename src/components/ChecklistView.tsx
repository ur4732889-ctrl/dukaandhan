import { AlertTriangle, ArrowRight, CheckSquare, FileCheck2, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Language, PageView } from '../types';

interface ChecklistViewProps {
  lang: Language;
  onNavigate: (view: PageView) => void;
}

interface DocumentItem {
  id: string;
  titleHi: string;
  titleEn: string;
  purposeHi: string;
  purposeEn: string;
  examplesHi: string;
  examplesEn: string;
  noteHi: string;
  noteEn: string;
}

const DOCUMENT_ITEMS: DocumentItem[] = [
  {
    id: 'aadhaar',
    titleHi: 'आधार कार्ड (Aadhaar Card)',
    titleEn: 'Aadhaar Card',
    purposeHi: 'पहचान और वर्तमान पते के सत्यापन (KYC) के लिए।',
    purposeEn: 'Primary identity and KYC verification.',
    examplesHi: 'मूल आधार कार्ड या डिजिटल ई-आधार (मोबाइल नंबर लिंक होने पर केवाईसी तेज़ होती है)।',
    examplesEn: 'Original Aadhaar card or e-Aadhaar (linked mobile number speeds up bank KYC).',
    noteHi: 'कृपया आधार नंबर केवल अधिकृत बैंक शाखा या सत्यापित प्रक्रिया में ही दिखाएं।',
    noteEn: 'Share Aadhaar numbers only directly with the authorized bank branch or verified KYC desk.',
  },
  {
    id: 'pan',
    titleHi: 'पैन कार्ड (PAN Card)',
    titleEn: 'PAN Card',
    purposeHi: 'कर और वित्तीय खाता/लोन रिकॉर्ड सत्यापन के लिए।',
    purposeEn: 'Tax and formal financial record verification.',
    examplesHi: 'व्यक्तिगत पैन कार्ड (दुकान के नाम से करेंट अकाउंट या लोन के लिए अक्सर आवश्यक)।',
    examplesEn: 'Individual PAN card (generally required for business loans and current accounts).',
    noteHi: 'यदि पैन कार्ड में नाम आधार से अलग है, तो बैंक सुधार मांग सकता है।',
    noteEn: 'Name should match your Aadhaar card to avoid bank verification delays.',
  },
  {
    id: 'business_proof',
    titleHi: 'व्यापार / दुकान का प्रमाण (Business Proof — जहाँ लागू हो)',
    titleEn: 'Business Proof (Where Applicable)',
    purposeHi: 'यह दिखाने के लिए कि आपकी दुकान या व्यापार सक्रिय रूप से चल रहा है।',
    purposeEn: 'Shows your shop or enterprise is actively operating.',
    examplesHi:
      'उद्यम (Udyam) रजिस्ट्रेशन, दुकान एवं स्थापना (Gumasta / Shop Act), नगर निगम वेंडर प्रमाण पत्र, जीएसटी, या दुकान का किरायानामा/बिल।',
    examplesEn:
      'Udyam registration, Shop Act / Gumasta license, Municipal vendor certificate, GST certificate, or shop rent agreement/bills.',
    noteHi: 'अलग-अलग बैंक और योजना में अलग प्रमाण मान्य होते हैं।',
    noteEn: 'Accepted business proofs vary significantly by bank and loan scheme.',
  },
  {
    id: 'bank_statement',
    titleHi: 'बैंक स्टेटमेंट (Bank Statements — जहाँ आवश्यक हो)',
    titleEn: 'Bank Statements (Where Required)',
    purposeHi: 'दुकान की नियमित आमदनी और लेन-देन समझने के लिए।',
    purposeEn: 'Helps banks review regular cash/UPI flow and turnover.',
    examplesHi: 'पिछले 6 से 12 महीने का बचत या करेंट अकाउंट स्टेटमेंट या अपडेटेड पासबुक।',
    examplesEn: 'Last 6–12 months bank account statement or updated passbook.',
    noteHi: 'छोटे माइक्रो-लोन में कुछ बैंक कम अवधि का स्टेटमेंट भी देख सकते हैं।',
    noteEn: 'Requirement depends on the loan amount and specific bank policy.',
  },
  {
    id: 'address_proof',
    titleHi: 'पते का प्रमाण (Address Proof — दुकान और घर)',
    titleEn: 'Address Proof (Shop & Residence)',
    purposeHi: 'दुकान और निवास के सही पते की पुष्टि के लिए।',
    purposeEn: 'Confirms both residential and shop premises address.',
    examplesHi: 'बिजली बिल, पानी बिल, राशन कार्ड, वोटर आईडी, या वैध किराया अनुबंध।',
    examplesEn: 'Electricity/water utility bill, ration card, voter ID, or valid rent agreement.',
    noteHi: 'किराए की दुकान होने पर मकान मालिक का बिजली बिल व किरायानामा काम आता है।',
    noteEn: 'For rented shops, a recent utility bill plus rent agreement is commonly requested.',
  },
  {
    id: 'photos',
    titleHi: 'पासपोर्ट साइज फोटो (Photographs — जहाँ आवश्यक हो)',
    titleEn: 'Passport-Size Photographs (Where Required)',
    purposeHi: 'बैंक आवेदन फॉर्म और खाता खोलने की फाइल के लिए।',
    purposeEn: 'Needed for physical bank account or loan application forms.',
    examplesHi: '2 से 4 हाल की साफ पासपोर्ट साइज रंगीन फोटो।',
    examplesEn: '2 to 4 recent clear color passport-size photographs.',
    noteHi: 'कुछ डिजिटल बैंक शाखाएं मौके पर ही लाइव फोटो लेती हैं।',
    noteEn: 'Some branches capture live photos at the desk instead of physical prints.',
  },
];

export function ChecklistView({ lang, onNavigate }: ChecklistViewProps) {
  const isHi = lang === 'hi';
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dukaandhan_doc_checklist');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dukaandhan_doc_checklist', JSON.stringify(checkedIds));
    } catch {
      // ignore
    }
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-emerald-700 mb-2">
            {isHi ? 'कागज़ात मार्गदर्शन · हिंदी और English' : 'Document Readiness Guide · Bilingual'}
          </p>
          <h1
            style={{ textWrap: 'balance' }}
            className="font-display font-bold text-3xl sm:text-4xl text-[#0B1F3A] tracking-tight"
          >
            {isHi ? 'बैंकिंग के लिए सामान्य कागज़ात की सूची' : 'Commonly Requested Document Checklist'}
          </h1>
          <p className="mt-2 text-slate-600 text-base">
            {isHi
              ? 'बैंक या पार्टनर से बात करने से पहले जांच लें कि आपके पास कौन से कागज़ तैयार हैं।'
              : 'Use this interactive checklist to see which common documents you already have ready.'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-right shrink-0">
          <p className="text-xs text-slate-500">{isHi ? 'तैयार कागज़ात' : 'Ready Items'}</p>
          <p className="font-mono text-xl font-bold text-[#0B1F3A] tabular-nums">
            {checkedIds.length} / {DOCUMENT_ITEMS.length}
          </p>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-950 leading-relaxed">
          <p className="font-semibold">
            {isHi
              ? 'महत्वपूर्ण सूचना: बैंक और उत्पाद के अनुसार कागज़ात की आवश्यकता बदलती रहती है।'
              : 'Important Note: Document requirements vary by bank, scheme, and product.'}
          </p>
          <p className="mt-0.5">
            {isHi
              ? 'इन कागज़ात का होना लोन या खाता पास होने की गारंटी नहीं देता। अंतिम निर्णय संबंधित बैंक द्वारा पात्रता जांच के बाद लिया जाता है।'
              : 'Having these documents does not guarantee loan approval. Final credit decisions rest solely with the bank.'}
          </p>
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="space-y-4">
        {DOCUMENT_ITEMS.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition-colors ${
                isChecked
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-label={isHi ? `${item.titleHi} चुनें` : `Toggle ${item.titleEn}`}
                  className="mt-0.5 text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                >
                  {isChecked ? (
                    <CheckSquare className="w-6 h-6" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                      {isHi ? item.titleHi : item.titleEn}
                    </h2>
                    <span className="text-xs font-medium text-slate-500">
                      {isChecked
                        ? isHi
                          ? 'तैयार चिह्नित'
                          : 'Marked Ready'
                        : isHi
                        ? 'जांचना बाकी'
                        : 'Pending Check'}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-slate-700">
                    <span className="font-semibold text-[#0B1F3A]">
                      {isHi ? 'क्यों चाहिए: ' : 'Why needed: '}
                    </span>
                    {isHi ? item.purposeHi : item.purposeEn}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {isHi ? 'मान्य विकल्प: ' : 'Examples: '}
                    </span>
                    {isHi ? item.examplesHi : item.examplesEn}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {isHi ? item.noteHi : item.noteEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Guidance Action */}
      <div className="mt-8 p-6 rounded-2xl bg-[#0B1F3A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <FileCheck2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-base">
              {isHi
                ? 'समझ नहीं आ रहा कि कौन-सा कागज़ आपके केस में लगेगा?'
                : 'Not sure which documents apply to your shop?'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {isHi
                ? 'हमारी टीम बिना किसी फीस के आपको आसान हिंदी में सही सूची समझा देगी।'
                : 'Our Dehradun advisors will explain the exact list for your business in plain Hindi.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span>{isHi ? 'मुफ़्त मदद लें' : 'Get Free Guidance'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
