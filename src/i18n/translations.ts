import type { ApplicationStatus, BusinessCategory, Language, ServiceRequirement } from '../types';

export const STATUS_LABELS: Record<ApplicationStatus, { hi: string; en: string }> = {
  'Enquiry Received': {
    hi: 'अनुरोध प्राप्त हुआ',
    en: 'Enquiry Received',
  },
  'Contact Pending': {
    hi: 'संपर्क बाकी है',
    en: 'Contact Pending',
  },
  'Customer Contacted': {
    hi: 'ग्राहक से बात हो गई',
    en: 'Customer Contacted',
  },
  'Documents Guidance Provided': {
    hi: 'कागज़ात की जानकारी दी गई',
    en: 'Documents Guidance Provided',
  },
  'Referred to Bank': {
    hi: 'बैंक/पार्टनर को भेजा गया',
    en: 'Referred to Bank',
  },
  'Application Submitted': {
    hi: 'आवेदन जमा हो गया',
    en: 'Application Submitted',
  },
  'Bank Decision Pending': {
    hi: 'बैंक का निर्णय बाकी',
    en: 'Bank Decision Pending',
  },
  Completed: {
    hi: 'प्रक्रिया पूरी हुई',
    en: 'Completed',
  },
  'Not Proceeding': {
    hi: 'आगे नहीं बढ़ाया गया',
    en: 'Not Proceeding',
  },
};

export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, { hi: string; en: string }> = {
  'Kirana Shop': { hi: 'किराना दुकान', en: 'Kirana Shop' },
  'Vegetable/Fruit Vendor': { hi: 'सब्ज़ी / फल विक्रेता', en: 'Vegetable/Fruit Vendor' },
  Tailor: { hi: 'दर्ज़ी / सिलाई दुकान', en: 'Tailor' },
  'Other Small Business': { hi: 'अन्य छोटा व्यापार', en: 'Other Small Business' },
};

export const SERVICE_REQUIREMENT_LABELS: Record<ServiceRequirement, { hi: string; en: string }> = {
  'Business Loan': { hi: 'बिज़नेस लोन', en: 'Business Loan' },
  'Current Account': { hi: 'करेंट अकाउंट', en: 'Current Account' },
  Insurance: { hi: 'बिज़नेस बीमा (Insurance)', en: 'Insurance' },
  'General Banking Guidance': { hi: 'सामान्य बैंकिंग मार्गदर्शन', en: 'General Banking Guidance' },
};

export const WHATSAPP_TEMPLATES = {
  general: 'Namaste DukaanDhan, mujhe apne business ke liye banking assistance chahiye.',
  business_loan: 'Namaste DukaanDhan, mujhe apne business ke liye Business Loan ki jaankari aur sahayata chahiye.',
  current_account: 'Namaste DukaanDhan, mujhe apni dukaan ke liye Current Account khulwane mein madad chahiye.',
  insurance: 'Namaste DukaanDhan, mujhe apni dukaan aur vyapaar ke liye Business Insurance ki jaankari chahiye.',
};

export const UI_COPY: Record<
  Language,
  {
    brand: string;
    nav: {
      home: string;
      services: string;
      checklist: string;
      track: string;
      admin: string;
      cta: string;
    };
    hero: {
      kicker: string;
      taglinePrimary: string;
      taglineSecondary: string;
      headline: string;
      subtitle: string;
      primaryCta: string;
      whatsappCta: string;
      strip: Array<{ title: string; detail: string }>;
    };
    overview: {
      heading: string;
      subheading: string;
      exploreAll: string;
      cards: Array<{
        category: 'business_loan' | 'current_account' | 'insurance';
        index: string;
        title: string;
        summary: string;
        cta: string;
      }>;
    };
    howItWorks: {
      heading: string;
      subheading: string;
      steps: Array<{ step: string; title: string; desc: string }>;
    };
    trust: {
      heading: string;
      subheading: string;
      disclaimerTitle: string;
      disclaimerBody: string;
      principles: Array<{ title: string; desc: string }>;
    };
    testimonials: {
      heading: string;
      subheading: string;
      sampleNotice: string;
      items: Array<{
        name: string;
        shop: string;
        area: string;
        quote: string;
        outcome: string;
      }>;
    };
    ctaBand: {
      heading: string;
      subheading: string;
      button: string;
      trackButton: string;
    };
    footer: {
      markets: string;
      note: string;
      quickLinks: string;
      contactTitle: string;
      whatsappLabel: string;
    };
  }
> = {
  hi: {
    brand: 'DukaanDhan',
    nav: {
      home: 'होम',
      services: 'सेवाएं',
      checklist: 'कागज़ात सूची',
      track: 'स्टेटस ट्रैक',
      admin: 'एडमिन',
      cta: 'मुफ़्त सहायता',
    },
    hero: {
      kicker: 'देहरादून · पलटन बाज़ार, घंटाघर और आसपास के बाज़ार',
      taglinePrimary: 'Chhote Vyapaar Ki Badi Udaan',
      taglineSecondary: 'Banking Ab Har Dukandaar Ke Liye Aasaan',
      headline: 'Aapke Business Ke Liye Sahi Banking Solution',
      subtitle: 'Loan, Current Account aur Insurance ki jaankari ab simple Hindi mein.',
      primaryCta: 'Get Free Assistance',
      whatsappCta: 'WhatsApp पर बात करें',
      strip: [
        { title: 'मुफ़्त मार्गदर्शन', detail: 'ग्राहक से ₹0 शुल्क' },
        { title: 'आसान हिंदी भाषा', detail: 'बिना कठिन बैंकिंग शब्दों के' },
        { title: 'देहरादून स्थानीय मदद', detail: 'पलटन बाज़ार व घंटाघर क्षेत्र' },
        { title: 'पारदर्शी प्रक्रिया', detail: 'अंतिम निर्णय बैंक का' },
      ],
    },
    overview: {
      heading: 'दुकानदारों के लिए 3 मुख्य बैंकिंग सेवाएं',
      subheading: 'किराना स्टोर, सब्ज़ी-फल विक्रेता, दर्ज़ी और छोटे व्यापारियों की ज़रूरतों के अनुसार सरल जानकारी।',
      exploreAll: 'सभी सेवाएं और शर्तें देखें',
      cards: [
        {
          category: 'business_loan',
          index: '01',
          title: 'बिज़नेस लोन (Business Loans)',
          summary: 'दुकान बढ़ाने, सामान भरने (वर्किंग कैपिटल) या मरम्मत के लिए बैंक व सरकारी योजनाओं की सही जानकारी।',
          cta: 'लोन विकल्प देखें',
        },
        {
          category: 'current_account',
          index: '02',
          title: 'करेंट अकाउंट (Current Accounts)',
          summary: 'दुकान के रोज़ाना लेन-देन, QR पेमेंट, कम न्यूनतम बैलेंस और आसान कैश जमा वाले खातों का मार्गदर्शन।',
          cta: 'अकाउंट विकल्प देखें',
        },
        {
          category: 'insurance',
          index: '03',
          title: 'बिज़नेस और दुकान बीमा (Insurance)',
          summary: 'आग, चोरी या नुकसान से दुकान की सुरक्षा और परिवार के लिए उपयोगी स्वास्थ्य बीमा विकल्पों की समझ।',
          cta: 'बीमा विकल्प देखें',
        },
      ],
    },
    howItWorks: {
      heading: 'DukaanDhan कैसे काम करता है',
      subheading: 'चार आसान कदमों में अपने व्यापार के लिए सही बैंकिंग साथी चुनें।',
      steps: [
        {
          step: '01',
          title: 'ग्राहक DukaanDhan से संपर्क करता है',
          desc: 'वेबसाइट फॉर्म या WhatsApp के ज़रिए अपना नाम, दुकान और ज़रूरत बताएं। कोई कठिन कागज़ अभी नहीं चाहिए।',
        },
        {
          step: '02',
          title: 'हम आपके व्यापार की ज़रूरत समझते हैं',
          desc: 'हमारी टीम आपकी दुकान के प्रकार, मासिक काम और सुविधा के अनुसार आपसे आसान हिंदी में बात करती है।',
        },
        {
          step: '03',
          title: 'हिंदी में सही विकल्प और कागज़ात समझाते हैं',
          desc: 'कौन-सा लोन, खाता या बीमा आपके लिए ठीक रहेगा और कौन से कागज़ लगेंगे, यह साफ-साफ बताया जाता है।',
        },
        {
          step: '04',
          title: 'अधिकृत बैंक/पार्टनर से जोड़कर फॉलो-अप करते हैं',
          desc: 'हम आपकी जानकारी सही अधिकृत बैंक या वित्तीय पार्टनर तक पहुंचाते हैं और स्टेटस ट्रैक करने में मदद करते हैं।',
        },
      ],
    },
    trust: {
      heading: 'भरोसा और पारदर्शिता के हमारे नियम',
      subheading: 'छोटे व्यापारियों के साथ ईमानदारी ही हमारी पहचान है। कोई छिपी शर्त या झूठा वादा नहीं।',
      disclaimerTitle: 'ज़रूरी सूचना: DukaanDhan बैंक या NBFC नहीं है',
      disclaimerBody:
        'DukaanDhan केवल एक वित्तीय मार्गदर्शन और सहायता मंच है। हम लोन, खाता या बीमा पास करने की गारंटी नहीं देते। अंतिम स्वीकृति, ब्याज दर और शर्तें पूरी तरह संबंधित बैंक या अधिकृत संस्थान के नियमों पर निर्भर करती हैं।',
      principles: [
        {
          title: 'शुरुआती मार्गदर्शन पूरी तरह मुफ़्त',
          desc: 'ग्राहकों से सलाह या आवेदन मदद के लिए कोई फीस नहीं ली जाती।',
        },
        {
          title: 'लोन पास होने की झूठी गारंटी नहीं',
          desc: 'लोन या खाता देना या न देना पूरी तरह बैंक के नियमों और पात्रता पर निर्भर है।',
        },
        {
          title: 'कोई छिपा शुल्क (Hidden Charges) नहीं',
          desc: 'DukaanDhan अपने ग्राहकों से कभी भी कोई गुप्त या अतिरिक्त कमीशन नहीं लेता।',
        },
        {
          title: 'जानकारी की पूरी सुरक्षा',
          desc: 'शुरुआती फॉर्म में हम आधार नंबर, पैन नंबर, बैंक पासवर्ड या OTP कभी नहीं मांगते।',
        },
        {
          title: 'रेफरल मॉडल की साफ जानकारी',
          desc: 'सफल प्रक्रिया पूरी होने पर हमें अधिकृत बैंक/पार्टनर से तय रेफरल शुल्क मिलता है, ग्राहक से नहीं।',
        },
        {
          title: 'बैंक की शर्तें सर्वोपरि',
          desc: 'सभी उत्पाद और योजनाएं संबंधित बैंक की पात्रता और नियम-शर्तों के अधीन होती हैं।',
        },
      ],
    },
    testimonials: {
      heading: 'दुकानदारों के अनुभव',
      subheading: 'देहरादून के छोटे व्यापारियों की जरूरतों को ध्यान में रखकर तैयार किए गए उदाहरण।',
      sampleNotice: 'उदाहरण प्रशंसापत्र (Sample Testimonials) — वास्तविक ग्राहक समीक्षाएं जुड़ने तक यह केवल प्रदर्शन हेतु हैं।',
      items: [
        {
          name: 'रमेश चंद्र जोशी (उदाहरण)',
          shop: 'किराना एवं जनरल स्टोर',
          area: 'पलटन बाज़ार, देहरादून',
          quote:
            'पहले बैंक जाकर अलग-अलग फॉर्म और शर्तें समझने में पूरा दिन खराब होता था। यहाँ हिंदी में साफ पता चला कि कौन से कागज़ तैयार रखने हैं।',
          outcome: 'उदाहरण: कागज़ात की स्पष्ट सूची और करेंट अकाउंट मार्गदर्शन',
        },
        {
          name: 'सलमा अंसारी (उदाहरण)',
          shop: 'लेडीज़ टेलरिंग बुटीक',
          area: 'घंटाघर के पास, देहरादून',
          quote:
            'सिलाई मशीन बढ़ाने के लिए लोन की जानकारी चाहिए थी। बिना किसी फीस के सही विकल्प और शर्तों की पूरी बात समझाई गई।',
          outcome: 'उदाहरण: वर्किंग कैपिटल विकल्प की तुलना और बैंक रेफरल',
        },
        {
          name: 'सुनील थापा (उदाहरण)',
          shop: 'ताज़ा सब्ज़ी एवं फल विक्रेता',
          area: 'पटेल नगर / सहारनपुर रोड, देहरादून',
          quote:
            'WhatsApp पर ही सहायता मिल गई और मैंने अपने मोबाइल नंबर व Enquiry ID से पूरा स्टेटस खुद चेक किया।',
          outcome: 'उदाहरण: डिजिटल पेमेंट के लिए व्यापार खाता मार्गदर्शन',
        },
      ],
    },
    ctaBand: {
      heading: 'अपनी दुकान के लिए सही बैंकिंग सलाह अभी पाएं',
      subheading: 'सिर्फ 2 मिनट में अनुरोध दर्ज करें। कोई आधार, पैन या बैंक पासवर्ड अभी नहीं लगेगा।',
      button: 'मुफ़्त सहायता फॉर्म भरें',
      trackButton: 'अपना स्टेटस ट्रैक करें',
    },
    footer: {
      markets: 'प्रारंभिक सेवा क्षेत्र: पलटन बाज़ार, घंटाघर, राजपुर रोड, चकराता रोड, पटेल नगर, देहरादून (उत्तराखंड)',
      note: 'DukaanDhan एक स्वतंत्र बैंकिंग मार्गदर्शन मंच है। यह कोई बैंक, NBFC, बीमा कंपनी या सरकारी एजेंसी नहीं है।',
      quickLinks: 'त्वरित लिंक',
      contactTitle: 'संपर्क और सहायता',
      whatsappLabel: 'WhatsApp पर सहायता पाएं',
    },
  },
  en: {
    brand: 'DukaanDhan',
    nav: {
      home: 'Home',
      services: 'Services',
      checklist: 'Documents',
      track: 'Track Status',
      admin: 'Admin',
      cta: 'Get Free Help',
    },
    hero: {
      kicker: 'Dehradun · Paltan Bazaar, Clock Tower & Nearby Markets',
      taglinePrimary: 'Chhote Vyapaar Ki Badi Udaan',
      taglineSecondary: 'Banking Ab Har Dukandaar Ke Liye Aasaan',
      headline: 'Aapke Business Ke Liye Sahi Banking Solution',
      subtitle: 'Loan, Current Account aur Insurance ki jaankari ab simple Hindi mein.',
      primaryCta: 'Get Free Assistance',
      whatsappCta: 'Chat on WhatsApp',
      strip: [
        { title: 'Free Guidance', detail: '₹0 fee for customers' },
        { title: 'Simple Hindi First', detail: 'Plain everyday explanations' },
        { title: 'Dehradun Local Focus', detail: 'Paltan Bazaar & Clock Tower' },
        { title: 'Bank-Led Decisions', detail: 'No false approval promises' },
      ],
    },
    overview: {
      heading: 'Three Core Financial Services for Shopkeepers',
      subheading: 'Clear guidance tailored for kirana stores, vegetable & fruit vendors, tailors, and small merchants.',
      exploreAll: 'Explore All Products & Terms',
      cards: [
        {
          category: 'business_loan',
          index: '01',
          title: 'Business Loans',
          summary: 'Guidance on small business loans, working capital, shop improvement, and verified government-backed schemes.',
          cta: 'View Loan Options',
        },
        {
          category: 'current_account',
          index: '02',
          title: 'Current Accounts',
          summary: 'Compare minimum balance rules, daily cash deposit benefits, and QR/UPI transaction accounts for your shop.',
          cta: 'View Account Options',
        },
        {
          category: 'insurance',
          index: '03',
          title: 'Business Insurance',
          summary: 'Understand shop protection against fire and theft, plus practical health coverage options in plain language.',
          cta: 'View Insurance Options',
        },
      ],
    },
    howItWorks: {
      heading: 'How DukaanDhan Works',
      subheading: 'Four straightforward steps from your first enquiry to bank follow-up.',
      steps: [
        {
          step: '01',
          title: 'Customer contacts DukaanDhan',
          desc: 'Submit your shop details online or message us on WhatsApp. No sensitive KYC documents needed upfront.',
        },
        {
          step: '02',
          title: 'We understand business requirements',
          desc: 'Our local advisor speaks with you in Hindi or English to understand your shop type, cash flow, and goals.',
        },
        {
          step: '03',
          title: 'We explain options & documents in Hindi',
          desc: 'We break down suitable banking products, eligibility criteria, and paperwork requirements clearly.',
        },
        {
          step: '04',
          title: 'We connect to authorized partners & follow up',
          desc: 'We introduce you to the right authorized bank or financial partner and help you track application progress.',
        },
      ],
    },
    trust: {
      heading: 'Trust & Transparency Principles',
      subheading: 'Built to protect small shopkeepers from confusion, hidden fees, and misleading promises.',
      disclaimerTitle: 'Important Disclosure: DukaanDhan is NOT a Bank or NBFC',
      disclaimerBody:
        'DukaanDhan is a financial guidance and referral assistance platform. We do not lend money, underwrite insurance, or guarantee loan approval. All final credit and product decisions are made solely by the authorized bank or financial institution.',
      principles: [
        {
          title: 'Free Initial Guidance',
          desc: 'Shopkeepers pay nothing for guidance, document explanations, or partner introductions.',
        },
        {
          title: 'No Guaranteed Loan Approval',
          desc: 'We never promise guaranteed approval. Eligibility depends strictly on bank verification.',
        },
        {
          title: 'Zero Hidden Charges',
          desc: 'Customers are never billed hidden processing or consultation fees by DukaanDhan.',
        },
        {
          title: 'Privacy-First Enquiry',
          desc: 'We never collect Aadhaar numbers, PAN numbers, passwords, or OTPs on our enquiry form.',
        },
        {
          title: 'Transparent Referral Model',
          desc: 'Our revenue comes from disclosed partner referral commissions upon successful completion—never from you.',
        },
        {
          title: 'Partner Terms Govern Products',
          desc: 'Rates, balances, and coverage remain subject to the official terms of each bank or insurer.',
        },
      ],
    },
    testimonials: {
      heading: 'Shopkeeper Stories',
      subheading: 'Representative examples illustrating how Dehradun merchants use our guidance.',
      sampleNotice: 'Sample Testimonials — Clearly marked placeholder stories until verified customer reviews are published.',
      items: [
        {
          name: 'Ramesh Chandra Joshi (Sample)',
          shop: 'Kirana & General Store',
          area: 'Paltan Bazaar, Dehradun',
          quote:
            'Earlier I used to lose a full business day visiting bank branches just to learn which paperwork was required. Getting a clear Hindi checklist saved time.',
          outcome: 'Sample Outcome: Document checklist & current account guidance',
        },
        {
          name: 'Salma Ansari (Sample)',
          shop: 'Tailoring & Boutique Shop',
          area: 'Near Clock Tower, Dehradun',
          quote:
            'I needed working capital options to add two sewing machines. Everything was explained honestly without pressure or hidden fees.',
          outcome: 'Sample Outcome: Working capital comparison & partner referral',
        },
        {
          name: 'Sunil Thapa (Sample)',
          shop: 'Fresh Vegetable & Fruit Stall',
          area: 'Patel Nagar / Saharanpur Road, Dehradun',
          quote:
            'I contacted them on WhatsApp and could check every step of my enquiry using my mobile number and Enquiry ID.',
          outcome: 'Sample Outcome: QR-ready merchant account orientation',
        },
      ],
    },
    ctaBand: {
      heading: 'Get Clear Banking Guidance for Your Shop Today',
      subheading: 'Takes under 2 minutes. Never asks for Aadhaar, PAN, bank passwords, or OTPs.',
      button: 'Request Free Assistance',
      trackButton: 'Track Existing Enquiry',
    },
    footer: {
      markets: 'Initial Service Area: Paltan Bazaar, Clock Tower, Rajpur Road, Chakrata Road, Patel Nagar — Dehradun, Uttarakhand',
      note: 'DukaanDhan is an independent banking guidance platform. It is not a bank, NBFC, insurer, or government agency.',
      quickLinks: 'Quick Links',
      contactTitle: 'Assistance & Support',
      whatsappLabel: 'WhatsApp Guidance',
    },
  },
};
