import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import type {
  ApplicationStatus,
  BankPartner,
  BusinessCategory,
  CommissionAssumptions,
  ContactMethod,
  CustomerEnquiry,
  FinancialProduct,
  PublicCatalogResponse,
  PublicSettings,
  PublicTrackResult,
  ServiceCategory,
  ServiceRequirement,
} from './src/types.ts';
import { APPLICATION_STATUSES } from './src/types.ts';

interface DatabaseSchema {
  enquiries: CustomerEnquiry[];
  products: FinancialProduct[];
  partners: BankPartner[];
  commission: CommissionAssumptions;
  settings: PublicSettings;
  teamMembers: string[];
  adminSecret: string;
}

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_PATH = path.join(DATA_DIR, 'dukaandhan-db.json');

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@dukaandhan.in').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DukaanDhan@2026';
const ADMIN_SALT = 'dukaandhan-dehradun-salt-v1';
const ADMIN_PASSWORD_HASH = crypto.scryptSync(ADMIN_PASSWORD, ADMIN_SALT, 64).toString('hex');

function createSeedDatabase(): DatabaseSchema {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

  const partners: BankPartner[] = [
    {
      id: 'partner-psb-1',
      name: 'Public Sector Bank Desk (Sample Slot)',
      type: 'Public Sector Bank',
      verificationStatus: 'Sample / Onboarding',
      contactPerson: 'Branch MSME Officer (Configurable)',
      branchLocation: 'Paltan Bazaar / Rajpur Road, Dehradun',
      supportedCategories: ['business_loan', 'current_account'],
      active: true,
    },
    {
      id: 'partner-sfb-1',
      name: 'Small Finance Bank Partner (Sample Slot)',
      type: 'Small Finance Bank',
      verificationStatus: 'Sample / Onboarding',
      contactPerson: 'Micro-Enterprise Relationship Lead',
      branchLocation: 'Clock Tower Area, Dehradun',
      supportedCategories: ['business_loan', 'current_account'],
      active: true,
    },
    {
      id: 'partner-govt-1',
      name: 'Authorized Govt. Scheme Channel (Sample Slot)',
      type: 'Government Scheme Channel',
      verificationStatus: 'Sample / Onboarding',
      contactPerson: 'Scheme Facilitation Desk',
      branchLocation: 'Dehradun District Nodal Office',
      supportedCategories: ['business_loan'],
      active: true,
    },
    {
      id: 'partner-ins-1',
      name: 'Authorized General & Health Insurer (Sample Slot)',
      type: 'Authorized Insurer',
      verificationStatus: 'Sample / Onboarding',
      contactPerson: 'SME Insurance Coordinator',
      branchLocation: 'Dehradun Regional Desk',
      supportedCategories: ['insurance'],
      active: true,
    },
  ];

  const products: FinancialProduct[] = [
    {
      id: 'prod-loan-wc',
      category: 'business_loan',
      subType: 'Working Capital Loan',
      nameEn: 'Shop Stock & Working Capital Loan (Sample Template)',
      nameHi: 'दुकान सामान व वर्किंग कैपिटल लोन (उदाहरण प्रारूप)',
      partnerId: 'partner-psb-1',
      partnerName: 'Public Sector Bank Desk (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      indicativeRate: '',
      amountOrBalanceLabelEn: '₹50,000 – ₹5,00,000 (Subject to bank assessment)',
      amountOrBalanceLabelHi: '₹50,000 – ₹5,00,000 (बैंक आकलन के अनुसार)',
      featuresEn: [
        'For restocking daily kirana, seasonal inventory, or tailoring supplies',
        'Repayment tenure explained clearly in simple Hindi',
        'Guidance on preparing basic sales & bank statement records',
      ],
      featuresHi: [
        'दुकान में रोज़ाना सामान भरने या सिलाई सामग्री खरीदने के लिए',
        'किस्त (EMI) और समय सीमा की आसान हिंदी में जानकारी',
        'बैंक स्टेटमेंट और बिक्री विवरण तैयार करने में मदद',
      ],
      eligibilityEn: 'Shop operating in Dehradun for 1+ year with regular cash/UPI flow (final bank criteria apply).',
      eligibilityHi: 'देहरादून में कम से कम 1 वर्ष से चल रही दुकान और नियमित लेन-देन (बैंक की अंतिम पात्रता लागू)।',
      documentsEn: ['Aadhaar Card & PAN Card', '6-month Bank Statement', 'Shop Proof / Rent Agreement'],
      documentsHi: ['आधार कार्ड और पैन कार्ड', '6 महीने का बैंक स्टेटमेंट', 'दुकान का प्रमाण या किरायानामा'],
      termsEn: 'Sample placeholder until partner bank rate sheet is verified by administrator. No guaranteed approval.',
      termsHi: 'यह एक उदाहरण प्रारूप है; पार्टनर बैंक से पुष्टि के बाद सटीक ब्याज दर अपडेट की जाएगी। लोन गारंटी नहीं है।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(2),
    },
    {
      id: 'prod-loan-improve',
      category: 'business_loan',
      subType: 'Shop Improvement Financing',
      nameEn: 'Dukaan Renovation & Equipment Loan (Sample Template)',
      nameHi: 'दुकान मरम्मत व मशीन उपकरण लोन (उदाहरण प्रारूप)',
      partnerId: 'partner-sfb-1',
      partnerName: 'Small Finance Bank Partner (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      indicativeRate: '',
      amountOrBalanceLabelEn: '₹25,000 – ₹3,00,000 (Configurable by partner)',
      amountOrBalanceLabelHi: '₹25,000 – ₹3,00,000 (पार्टनर बैंक अनुसार)',
      featuresEn: [
        'Useful for racks, fridge/deep-freezer, sewing machines, or counter upgrade',
        'Step-by-step assistance for quotation and document file',
      ],
      featuresHi: [
        'फ्रीज़र, रैक, सिलाई मशीन या दुकान के फर्नीचर के लिए उपयोगी',
        'कोटेशन और फाइल तैयार करने में व्यक्तिगत सहायता',
      ],
      eligibilityEn: 'Active retail shopkeeper, tailor, or small service business in Dehradun.',
      eligibilityHi: 'देहरादून में सक्रिय किराना दुकानदार, दर्ज़ी या छोटा सेवा व्यापारी।',
      documentsEn: ['KYC Documents', 'Equipment Quotation (if applicable)', 'Address & Shop Proof'],
      documentsHi: ['केवाईसी कागज़ात', 'मशीन/सामान का कोटेशन (यदि लागू हो)', 'पता व दुकान प्रमाण'],
      termsEn: 'Unverified sample product template. Interest rates and processing fees depend on partner bank sanction letter.',
      termsHi: 'असत्यापित उदाहरण विवरण। ब्याज दर और प्रोसेसिंग शुल्क पूरी तरह बैंक के स्वीकृति पत्र पर निर्भर हैं।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(3),
    },
    {
      id: 'prod-loan-govt',
      category: 'business_loan',
      subType: 'Government-Backed Scheme Guidance',
      nameEn: 'Micro-Enterprise & Vendor Scheme Guidance (PM SVANidhi / MUDRA Info)',
      nameHi: 'सरकारी योजना मार्गदर्शन (PM SVANidhi / MUDRA जानकारी)',
      partnerId: 'partner-govt-1',
      partnerName: 'Authorized Govt. Scheme Channel (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      indicativeRate: '',
      amountOrBalanceLabelEn: 'As per official government scheme guidelines',
      amountOrBalanceLabelHi: 'सरकारी योजना के आधिकारिक नियमों के अनुसार',
      featuresEn: [
        'Plain Hindi explanation of official eligibility criteria for street vendors & micro shops',
        'Information on where and how to apply via authorized bank/portal channels',
        'Zero middleman fee — DukaanDhan is not a government agency',
      ],
      featuresHi: [
        'सब्ज़ी-फल विक्रेताओं और छोटे दुकानदारों के लिए सरकारी नियम की सीधी हिंदी जानकारी',
        'अधिकृत बैंक व पोर्टल से आवेदन करने की सही प्रक्रिया समझाना',
        'कोई बिचौलिया शुल्क नहीं — DukaanDhan सरकारी एजेंसी नहीं है',
      ],
      eligibilityEn: 'Subject strictly to official Government of India & participating bank eligibility rules.',
      eligibilityHi: 'केवल भारत सरकार और संबंधित बैंक के आधिकारिक पात्रता नियमों के अधीन।',
      documentsEn: ['Vendor Certificate / Letter of Recommendation (where applicable)', 'Aadhaar & Bank Passbook'],
      documentsHi: ['विक्रेता प्रमाण पत्र / सिफारिश पत्र (जहाँ लागू हो)', 'आधार व बैंक पासबुक'],
      termsEn: 'Informational guidance only. Scheme availability and subsidy terms must be verified on official portals/banks.',
      termsHi: 'केवल मार्गदर्शन हेतु। योजना की उपलब्धता और सब्सिडी की पुष्टि अधिकृत बैंक या सरकारी पोर्टल से होती है।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(1),
    },
    {
      id: 'prod-ca-dukandaar',
      category: 'current_account',
      subType: 'Merchant Current Account',
      nameEn: 'Vyapari Digital Current Account (Sample Template)',
      nameHi: 'व्यापारी डिजिटल करेंट अकाउंट (उदाहरण प्रारूप)',
      partnerId: 'partner-psb-1',
      partnerName: 'Public Sector Bank Desk (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      amountOrBalanceLabelEn: 'Min. Balance: ₹2,500 – ₹5,000 (Sample; varies by bank)',
      amountOrBalanceLabelHi: 'न्यूनतम बैलेंस: ₹2,500 – ₹5,000 (उदाहरण; बैंक अनुसार)',
      featuresEn: [
        'Separate shop transactions from personal savings account',
        'UPI QR soundbox & daily settlement readiness',
        'Free NEFT / IMPS digital transfers & monthly bank statements for loan readiness',
      ],
      featuresHi: [
        'दुकान के लेन-देन को निजी बचत खाते से अलग रखें',
        'UPI QR कोड और रोज़ाना पेमेंट सेटलमेंट की सुविधा',
        'NEFT / IMPS ट्रांसफर व नियमित बैंक स्टेटमेंट से भविष्य में लोन लेने में आसानी',
      ],
      eligibilityEn: 'Proprietorship shopkeepers, kirana owners, vendors, and tailors.',
      eligibilityHi: 'एकल दुकान मालिक, किराना व्यापारी, विक्रेता और दर्ज़ी भाई-बहन।',
      documentsEn: ['Aadhaar & PAN Card', 'Shop Establishment / Gumasta / Utility Bill', '2 Passport Photos'],
      documentsHi: ['आधार व पैन कार्ड', 'दुकान प्रमाण / गुमाश्ता / बिजली बिल', '2 पासपोर्ट साइज फोटो'],
      termsEn: 'Sample account overview. Exact minimum balance charges and free cash deposit limits are governed by bank schedule.',
      termsHi: 'उदाहरण खाता विवरण। सटीक न्यूनतम बैलेंस और कैश जमा सीमा बैंक की आधिकारिक सूची पर निर्भर करती है।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(4),
    },
    {
      id: 'prod-ins-shop',
      category: 'insurance',
      subType: 'Shop Fire & Theft Protection',
      nameEn: 'Dukaan Suraksha — Fire & Theft Insurance (Sample Template)',
      nameHi: 'दुकान सुरक्षा — आग और चोरी बीमा (उदाहरण प्रारूप)',
      partnerId: 'partner-ins-1',
      partnerName: 'Authorized General & Health Insurer (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      amountOrBalanceLabelEn: 'Coverage & premium configured by authorized insurer',
      amountOrBalanceLabelHi: 'कवरेज व प्रीमियम अधिकृत बीमा कंपनी द्वारा तय',
      featuresEn: [
        'Explains protection against fire, short-circuit, natural calamity, and burglary in simple Hindi',
        'Covers shop stock, furniture, and display equipment subject to policy wording',
        'Clear walkthrough of claim steps and exclusions before you decide',
      ],
      featuresHi: [
        'आग, शॉर्ट-सर्किट, प्राकृतिक आपदा और चोरी से दुकान के नुकसान की सुरक्षा की सरल समझ',
        'पॉलिसी नियमों के अनुसार दुकान का सामान और फर्नीचर कवर',
        'बीमा लेने से पहले क्लेम नियम और शर्तें साफ हिंदी में समझना',
      ],
      eligibilityEn: 'Retail shops, godowns, kirana stores, and tailoring units with valid shop address.',
      eligibilityHi: 'वैध पते वाली किराना दुकानें, गोदाम, और सिलाई इकाइयाँ।',
      documentsEn: ['Shop Owner KYC', 'Shop Address Proof', 'Approximate Stock Value Estimate'],
      documentsHi: ['दुकान मालिक का केवाईसी', 'दुकान के पते का प्रमाण', 'दुकान में रखे सामान का अनुमानित मूल्य'],
      termsEn: 'Sample product summary. DukaanDhan is not an insurer; coverage is underwritten solely by licensed insurers.',
      termsHi: 'उदाहरण जानकारी। DukaanDhan बीमा कंपनी नहीं है; बीमा सुरक्षा केवल लाइसेंस प्राप्त कंपनी द्वारा दी जाती है।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(5),
    },
    {
      id: 'prod-ins-health',
      category: 'insurance',
      subType: 'Shopkeeper Health Protection',
      nameEn: 'Parivar & Vyapari Health Cover Guidance (Sample Template)',
      nameHi: 'व्यापारी व परिवार स्वास्थ्य बीमा मार्गदर्शन (उदाहरण प्रारूप)',
      partnerId: 'partner-ins-1',
      partnerName: 'Authorized General & Health Insurer (Sample Slot)',
      isVerifiedPartner: false,
      isVerifiedRate: false,
      amountOrBalanceLabelEn: 'Hospitalization cover options explained by authorized partner',
      amountOrBalanceLabelHi: 'अस्पताल खर्च सुरक्षा विकल्प (अधिकृत पार्टनर अनुसार)',
      featuresEn: [
        'Helps shopkeepers avoid breaking business working capital during medical emergencies',
        'Simple Hindi explanation of waiting periods, cashless hospitals in Dehradun, and renewals',
      ],
      featuresHi: [
        'बीमारी के समय दुकान की जमा-पूंजी खर्च होने से बचाने की सही जानकारी',
        'देहरादून के कैशलेस अस्पताल, वेटिंग पीरियड और नियम आसान हिंदी में समझें',
      ],
      eligibilityEn: 'Self-employed merchants and their immediate family members.',
      eligibilityHi: 'स्व-रोज़गार दुकानदार और उनके परिवार के सदस्य।',
      documentsEn: ['KYC Documents', 'Age & Basic Health Declaration (with insurer directly)'],
      documentsHi: ['केवाईसी दस्तावेज़', 'आयु व स्वास्थ्य विवरण (सीधे बीमा कंपनी के पास)'],
      termsEn: 'Sample guidance slot. Medical underwriting and policy issuance rest strictly with authorized insurer.',
      termsHi: 'उदाहरण मार्गदर्शन विकल्प। पॉलिसी जारी करना और नियम पूरी तरह अधिकृत बीमा कंपनी के अधीन हैं।',
      isSampleTemplate: true,
      active: true,
      updatedAt: daysAgo(6),
    },
  ];

  const enquiries: CustomerEnquiry[] = [
    {
      id: 'enq-sample-1',
      enquiryId: 'DD-DDN-1001',
      fullName: 'Ramesh Chandra Joshi',
      mobile: '9837011001',
      businessName: 'Joshi Kirana & Provision Store',
      businessCategory: 'Kirana Shop',
      businessLocation: 'Paltan Bazaar, Dehradun',
      monthlyIncomeRange: '₹30,000 – ₹60,000',
      serviceRequired: 'Business Loan',
      selectedProductName: 'Shop Stock & Working Capital Loan (Sample Template)',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'Phone Call',
      consentGiven: true,
      status: 'Completed',
      assignedTo: 'Rajesh Rawat',
      referredPartnerId: 'partner-psb-1',
      notes: [
        {
          id: 'n-1',
          text: 'Spoke in Hindi. Customer wants working capital to expand festival stock.',
          author: 'Rajesh Rawat',
          createdAt: daysAgo(18),
          visibleToCustomer: false,
        },
        {
          id: 'n-2',
          text: 'Bank partner confirmed final sanction and disbursement completion.',
          author: 'Rajesh Rawat',
          createdAt: daysAgo(4),
          visibleToCustomer: true,
        },
      ],
      customerVisibleUpdate: 'Sample Demo: Referred to bank partner and process completed.',
      isSample: true,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(4),
    },
    {
      id: 'enq-sample-2',
      enquiryId: 'DD-DDN-1002',
      fullName: 'Salma Ansari',
      mobile: '9837011002',
      businessName: 'Ansari Ladies Tailors & Boutique',
      businessCategory: 'Tailor',
      businessLocation: 'Clock Tower, Dehradun',
      monthlyIncomeRange: '₹15,000 – ₹30,000',
      serviceRequired: 'Business Loan',
      selectedProductName: 'Dukaan Renovation & Equipment Loan (Sample Template)',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'WhatsApp',
      consentGiven: true,
      status: 'Bank Decision Pending',
      assignedTo: 'Priya Bisht',
      referredPartnerId: 'partner-sfb-1',
      notes: [
        {
          id: 'n-3',
          text: 'Explained quotation requirement for 2 sewing machines. Application submitted to partner desk.',
          author: 'Priya Bisht',
          createdAt: daysAgo(5),
          visibleToCustomer: true,
        },
      ],
      customerVisibleUpdate: 'Sample Demo: File submitted to partner bank; final bank decision is awaited.',
      isSample: true,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(3),
    },
    {
      id: 'enq-sample-3',
      enquiryId: 'DD-DDN-1003',
      fullName: 'Sunil Thapa',
      mobile: '9837011003',
      businessName: 'Garhwal Fresh Sabzi Bhandar',
      businessCategory: 'Vegetable/Fruit Vendor',
      businessLocation: 'Patel Nagar, Dehradun',
      monthlyIncomeRange: '₹15,000 – ₹30,000',
      serviceRequired: 'Current Account',
      selectedProductName: 'Vyapari Digital Current Account (Sample Template)',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'WhatsApp',
      consentGiven: true,
      status: 'Completed',
      assignedTo: 'Amit Negi',
      referredPartnerId: 'partner-psb-1',
      notes: [
        {
          id: 'n-4',
          text: 'Guided on KYC + municipal vendor certificate; account activated by bank branch.',
          author: 'Amit Negi',
          createdAt: daysAgo(6),
          visibleToCustomer: true,
        },
      ],
      customerVisibleUpdate: 'Sample Demo: Current account guidance completed with partner branch.',
      isSample: true,
      createdAt: daysAgo(15),
      updatedAt: daysAgo(6),
    },
    {
      id: 'enq-sample-4',
      enquiryId: 'DD-DDN-1004',
      fullName: 'Mahesh Gupta',
      mobile: '9837011004',
      businessName: 'Gupta General & Stationery',
      businessCategory: 'Kirana Shop',
      businessLocation: 'Rajpur Road, Dehradun',
      monthlyIncomeRange: '₹60,000 – ₹1,00,000',
      serviceRequired: 'Insurance',
      selectedProductName: 'Dukaan Suraksha — Fire & Theft Insurance (Sample Template)',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'In-Person Visit (Dehradun)',
      consentGiven: true,
      status: 'Referred to Bank',
      assignedTo: 'Priya Bisht',
      referredPartnerId: 'partner-ins-1',
      notes: [
        {
          id: 'n-5',
          text: 'Explained fire & short-circuit coverage terms. Connected with authorized insurer desk.',
          author: 'Priya Bisht',
          createdAt: daysAgo(2),
          visibleToCustomer: true,
        },
      ],
      customerVisibleUpdate: 'Sample Demo: Connected with authorized insurance coordinator for quote.',
      isSample: true,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
    },
    {
      id: 'enq-sample-5',
      enquiryId: 'DD-DDN-1005',
      fullName: 'Harish Nautiyal',
      mobile: '9837011005',
      businessName: 'Nautiyal Fruit Corner',
      businessCategory: 'Vegetable/Fruit Vendor',
      businessLocation: 'Chakrata Road, Dehradun',
      monthlyIncomeRange: '< ₹15,000',
      serviceRequired: 'General Banking Guidance',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'Phone Call',
      consentGiven: true,
      status: 'Documents Guidance Provided',
      assignedTo: 'Rajesh Rawat',
      notes: [
        {
          id: 'n-6',
          text: 'Shared Hindi document checklist over call and WhatsApp.',
          author: 'Rajesh Rawat',
          createdAt: daysAgo(1),
          visibleToCustomer: true,
        },
      ],
      customerVisibleUpdate: 'Sample Demo: Document checklist explained in Hindi.',
      isSample: true,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(1),
    },
    {
      id: 'enq-sample-6',
      enquiryId: 'DD-DDN-1006',
      fullName: 'Deepak Verma',
      mobile: '9837011006',
      businessName: 'Verma Hardware & Electricals',
      businessCategory: 'Other Small Business',
      businessLocation: 'Clement Town, Dehradun',
      monthlyIncomeRange: '₹30,000 – ₹60,000',
      serviceRequired: 'Current Account',
      preferredLanguage: 'English',
      preferredContactMethod: 'Phone Call',
      consentGiven: true,
      status: 'Customer Contacted',
      assignedTo: 'Amit Negi',
      notes: [],
      customerVisibleUpdate: 'Sample Demo: Advisor called and understood shop requirements.',
      isSample: true,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
    },
    {
      id: 'enq-sample-7',
      enquiryId: 'DD-DDN-1007',
      fullName: 'Kiran Devi',
      mobile: '9837011007',
      businessName: 'Shree Sai Kirana Store',
      businessCategory: 'Kirana Shop',
      businessLocation: 'Paltan Bazaar, Dehradun',
      monthlyIncomeRange: '₹15,000 – ₹30,000',
      serviceRequired: 'Business Loan',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'WhatsApp',
      consentGiven: true,
      status: 'Completed',
      assignedTo: 'Rajesh Rawat',
      referredPartnerId: 'partner-sfb-1',
      notes: [],
      customerVisibleUpdate: 'Sample Demo: Completed via authorized partner.',
      isSample: true,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(2),
    },
    {
      id: 'enq-sample-8',
      enquiryId: 'DD-DDN-1008',
      fullName: 'Mohit Rawat',
      mobile: '9837011008',
      businessName: 'Rawat Tailoring Works',
      businessCategory: 'Tailor',
      businessLocation: 'Prem Nagar, Dehradun',
      monthlyIncomeRange: '₹15,000 – ₹30,000',
      serviceRequired: 'Insurance',
      preferredLanguage: 'Hindi',
      preferredContactMethod: 'Phone Call',
      consentGiven: true,
      status: 'Enquiry Received',
      assignedTo: 'Unassigned',
      notes: [],
      customerVisibleUpdate: 'Sample Demo: Enquiry received. An advisor will contact you soon.',
      isSample: true,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ];

  return {
    enquiries,
    products,
    partners,
    commission: {
      referralCommission: 500,
      variableCostPerReferral: 150,
      monthlyFixedCost: 5000,
      targetCustomersPerMonth: 30,
      updatedAt: daysAgo(1),
    },
    settings: {
      whatsappNumber: '919876543210',
      officeLocation: 'Near Clock Tower & Paltan Bazaar, Dehradun, Uttarakhand 248001',
      supportHours: 'Mon–Sat · 9:30 AM – 7:00 PM IST',
      isDemoMode: true,
    },
    teamMembers: ['Unassigned', 'Rajesh Rawat', 'Priya Bisht', 'Amit Negi'],
    adminSecret: crypto.randomBytes(32).toString('hex'),
  };
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDatabase(db: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_PATH);
}

let db = loadDatabase();

function signAdminToken(email: string): string {
  const payload = {
    email,
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', db.adminSecret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminToken(token: string): { email: string; role: string } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', db.adminSecret).update(encoded).digest('base64url');
  try {
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as {
      email: string;
      role: string;
      exp: number;
    };
    if (!payload.exp || Date.now() > payload.exp) return null;
    return { email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const verified = token ? verifyAdminToken(token) : null;
  if (!verified) {
    res.status(401).json({ error: 'Unauthorized. Please log in as administrator.' });
    return;
  }
  next();
}

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function generateEnquiryId(): string {
  const existingIds = new Set(db.enquiries.map((e) => e.enquiryId));
  for (let i = 0; i < 20; i++) {
    const num = 2000 + Math.floor(Math.random() * 7999);
    const candidate = `DD-DDN-${num}`;
    if (!existingIds.has(candidate)) return candidate;
  }
  return `DD-DDN-${Date.now().toString().slice(-5)}`;
}

function escapeCsvCell(value: string): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // Public Catalog (NEVER exposes commission figures or customer enquiries)
  app.get('/api/public/catalog', (_req: Request, res: Response) => {
    const response: PublicCatalogResponse = {
      products: db.products.filter((p) => p.active),
      partners: db.partners
        .filter((p) => p.active)
        .map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          verificationStatus: p.verificationStatus,
          supportedCategories: p.supportedCategories,
        })),
      settings: db.settings,
    };
    res.json(response);
  });

  // Public Customer Registration / Assistance Request
  app.post('/api/public/enquiries', (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const fullName = String(body.fullName ?? '').trim();
    const mobile = normalizeMobile(String(body.mobile ?? ''));
    const businessName = String(body.businessName ?? '').trim();
    const businessCategory = String(body.businessCategory ?? '') as BusinessCategory;
    const businessLocation = String(body.businessLocation ?? '').trim();
    const monthlyIncomeRange = String(body.monthlyIncomeRange ?? '').trim();
    const serviceRequired = String(body.serviceRequired ?? '') as ServiceRequirement;
    const selectedProductName = body.selectedProductName ? String(body.selectedProductName).trim().slice(0, 140) : undefined;
    const preferredLanguage = body.preferredLanguage === 'English' ? 'English' : 'Hindi';
    const preferredContactMethod = String(body.preferredContactMethod ?? 'Phone Call') as ContactMethod;
    const consentGiven = Boolean(body.consentGiven);

    if (fullName.length < 2 || fullName.length > 80) {
      res.status(400).json({ error: 'Please enter a valid full name (2–80 characters).' });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }
    if (businessName.length < 2 || businessName.length > 100) {
      res.status(400).json({ error: 'Please enter your shop or business name.' });
      return;
    }
    if (businessLocation.length < 2 || businessLocation.length > 120) {
      res.status(400).json({ error: 'Please provide your business location in Dehradun.' });
      return;
    }
    if (!consentGiven) {
      res.status(400).json({ error: 'Customer consent is required before submitting.' });
      return;
    }

    // Safety guard: reject payloads containing sensitive KYC pattern fields
    if ('aadhaar' in body || 'aadhaarNumber' in body || 'pan' in body || 'panNumber' in body || 'otp' in body) {
      res.status(400).json({ error: 'Sensitive KYC numbers (Aadhaar/PAN/OTP) must not be submitted here.' });
      return;
    }

    const validCategories: BusinessCategory[] = [
      'Kirana Shop',
      'Vegetable/Fruit Vendor',
      'Tailor',
      'Other Small Business',
    ];
    const validServices: ServiceRequirement[] = [
      'Business Loan',
      'Current Account',
      'Insurance',
      'General Banking Guidance',
    ];
    const validContacts: ContactMethod[] = ['Phone Call', 'WhatsApp', 'In-Person Visit (Dehradun)'];

    if (!validCategories.includes(businessCategory)) {
      res.status(400).json({ error: 'Invalid business category.' });
      return;
    }
    if (!validServices.includes(serviceRequired)) {
      res.status(400).json({ error: 'Invalid service requirement.' });
      return;
    }
    if (!validContacts.includes(preferredContactMethod)) {
      res.status(400).json({ error: 'Invalid preferred contact method.' });
      return;
    }

    const timestamp = new Date().toISOString();
    const enquiryId = generateEnquiryId();
    const record: CustomerEnquiry = {
      id: `enq-${crypto.randomUUID().slice(0, 8)}`,
      enquiryId,
      fullName,
      mobile,
      businessName,
      businessCategory,
      businessLocation,
      monthlyIncomeRange: monthlyIncomeRange || '₹15,000 – ₹30,000',
      serviceRequired,
      selectedProductName,
      preferredLanguage,
      preferredContactMethod,
      consentGiven: true,
      status: 'Enquiry Received',
      assignedTo: 'Unassigned',
      notes: [],
      customerVisibleUpdate:
        preferredLanguage === 'Hindi'
          ? 'आपका अनुरोध प्राप्त हो गया है। हमारे सलाहकार जल्द ही आपसे संपर्क करेंगे।'
          : 'Your enquiry has been received. A DukaanDhan advisor will reach out shortly.',
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.enquiries.unshift(record);
    saveDatabase(db);

    res.status(201).json({
      enquiryId: record.enquiryId,
      status: record.status,
      createdAt: record.createdAt,
      fullName: record.fullName,
      businessName: record.businessName,
      serviceRequired: record.serviceRequired,
    });
  });

  // Public Application Tracking (verifies BOTH enquiryId AND registered mobile number)
  app.post('/api/public/track', (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const enquiryIdInput = String(body.enquiryId ?? '').trim().toUpperCase();
    const mobileInput = normalizeMobile(String(body.mobile ?? ''));

    if (!enquiryIdInput || !/^\d{10}$/.test(mobileInput)) {
      res.status(400).json({ error: 'Both a valid Enquiry ID and 10-digit registered mobile number are required.' });
      return;
    }

    const match = db.enquiries.find(
      (item) => item.enquiryId.toUpperCase() === enquiryIdInput && normalizeMobile(item.mobile) === mobileInput
    );

    if (!match) {
      res.status(404).json({
        error: 'No matching enquiry found. Please check your Enquiry ID and registered mobile number.',
      });
      return;
    }

    const result: PublicTrackResult = {
      enquiryId: match.enquiryId,
      fullName: match.fullName,
      businessName: match.businessName,
      businessLocation: match.businessLocation,
      serviceRequired: match.serviceRequired,
      status: match.status,
      assignedAdvisor: match.assignedTo === 'Unassigned' ? 'DukaanDhan Guidance Desk' : match.assignedTo,
      customerVisibleUpdate:
        match.customerVisibleUpdate ||
        'Your request is active with our guidance desk. Final product decisions rest solely with the partner bank.',
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      isSample: match.isSample,
    };

    res.json(result);
  });

  // Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const candidateHash = crypto.scryptSync(password, ADMIN_SALT, 64).toString('hex');
    const matchEmail = email === ADMIN_EMAIL;
    const matchPass = crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(ADMIN_PASSWORD_HASH, 'hex')
    );

    if (!matchEmail || !matchPass) {
      res.status(401).json({ error: 'Invalid administrator email or password.' });
      return;
    }

    const token = signAdminToken(email);
    res.json({
      token,
      adminUser: {
        email,
        name: 'DukaanDhan Admin',
        role: 'Administrator',
      },
    });
  });

  app.get('/api/admin/me', requireAdmin, (_req: Request, res: Response) => {
    res.json({
      email: ADMIN_EMAIL,
      name: 'DukaanDhan Admin',
      role: 'Administrator',
    });
  });

  // Admin Full Dashboard Payload
  app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
    res.json({
      enquiries: db.enquiries,
      products: db.products,
      partners: db.partners,
      commission: db.commission,
      settings: db.settings,
      teamMembers: db.teamMembers,
      adminUser: {
        email: ADMIN_EMAIL,
        name: 'DukaanDhan Admin',
        role: 'Administrator',
      },
    });
  });

  // Admin: Update Enquiry (status, assignment, referred partner, interaction notes)
  app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const target = db.enquiries.find((e) => e.id === id);
    if (!target) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    if (typeof body.status === 'string') {
      if (!APPLICATION_STATUSES.includes(body.status as ApplicationStatus)) {
        res.status(400).json({ error: 'Invalid status value.' });
        return;
      }
      target.status = body.status as ApplicationStatus;
    }
    if (typeof body.assignedTo === 'string' && body.assignedTo.trim()) {
      target.assignedTo = body.assignedTo.trim().slice(0, 60);
    }
    if (typeof body.referredPartnerId === 'string') {
      target.referredPartnerId = body.referredPartnerId || undefined;
    }
    if (typeof body.customerVisibleUpdate === 'string') {
      target.customerVisibleUpdate = body.customerVisibleUpdate.trim().slice(0, 300);
    }
    if (typeof body.newNoteText === 'string' && body.newNoteText.trim()) {
      const noteText = body.newNoteText.trim().slice(0, 500);
      const visible = Boolean(body.noteVisibleToCustomer);
      target.notes.unshift({
        id: `note-${crypto.randomUUID().slice(0, 8)}`,
        text: noteText,
        author: 'DukaanDhan Admin',
        createdAt: new Date().toISOString(),
        visibleToCustomer: visible,
      });
      if (visible) {
        target.customerVisibleUpdate = noteText;
      }
    }

    target.updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json(target);
  });

  // Admin: CSV Export
  app.get('/api/admin/enquiries/export.csv', requireAdmin, (req: Request, res: Response) => {
    const serviceFilter = String(req.query.service ?? 'ALL');
    const statusFilter = String(req.query.status ?? 'ALL');
    const q = String(req.query.q ?? '').trim().toLowerCase();

    const filtered = db.enquiries.filter((item) => {
      if (serviceFilter !== 'ALL' && item.serviceRequired !== serviceFilter) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (q) {
        const hay = `${item.enquiryId} ${item.fullName} ${item.mobile} ${item.businessName} ${item.businessLocation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const headers = [
      'Enquiry ID',
      'Full Name',
      'Mobile',
      'Business Name',
      'Business Category',
      'Location',
      'Monthly Income Range',
      'Service Required',
      'Preferred Language',
      'Contact Method',
      'Status',
      'Assigned To',
      'Sample Data',
      'Created At',
      'Updated At',
    ];

    const rows = filtered.map((e) =>
      [
        e.enquiryId,
        e.fullName,
        e.mobile,
        e.businessName,
        e.businessCategory,
        e.businessLocation,
        e.monthlyIncomeRange,
        e.serviceRequired,
        e.preferredLanguage,
        e.preferredContactMethod,
        e.status,
        e.assignedTo,
        e.isSample ? 'Yes' : 'No',
        e.createdAt,
        e.updatedAt,
      ]
        .map(escapeCsvCell)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="dukaandhan-enquiries.csv"');
    res.send(csv);
  });

  // Admin: Products CRUD
  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const b = req.body as Partial<FinancialProduct>;
    const partner = db.partners.find((p) => p.id === b.partnerId);
    const product: FinancialProduct = {
      id: `prod-${crypto.randomUUID().slice(0, 8)}`,
      category: (b.category as ServiceCategory) || 'business_loan',
      subType: String(b.subType || 'Small Business Product').trim(),
      nameEn: String(b.nameEn || 'New Financial Product').trim(),
      nameHi: String(b.nameHi || b.nameEn || 'नया बैंकिंग उत्पाद').trim(),
      partnerId: partner ? partner.id : String(b.partnerId || ''),
      partnerName: partner ? partner.name : String(b.partnerName || 'Partner Verification Pending'),
      isVerifiedPartner: Boolean(b.isVerifiedPartner),
      isVerifiedRate: Boolean(b.isVerifiedRate),
      indicativeRate: b.isVerifiedRate && b.indicativeRate ? String(b.indicativeRate).trim() : '',
      amountOrBalanceLabelEn: String(b.amountOrBalanceLabelEn || 'As per partner bank terms').trim(),
      amountOrBalanceLabelHi: String(b.amountOrBalanceLabelHi || 'बैंक नियमों के अनुसार').trim(),
      featuresEn: Array.isArray(b.featuresEn) ? b.featuresEn.map(String) : [],
      featuresHi: Array.isArray(b.featuresHi) ? b.featuresHi.map(String) : [],
      eligibilityEn: String(b.eligibilityEn || 'Subject to bank eligibility').trim(),
      eligibilityHi: String(b.eligibilityHi || 'बैंक पात्रता नियमों के अधीन').trim(),
      documentsEn: Array.isArray(b.documentsEn) ? b.documentsEn.map(String) : ['Aadhaar Card', 'PAN Card'],
      documentsHi: Array.isArray(b.documentsHi) ? b.documentsHi.map(String) : ['आधार कार्ड', 'पैन कार्ड'],
      termsEn: String(b.termsEn || 'Subject to partner bank terms and conditions.').trim(),
      termsHi: String(b.termsHi || 'संबंधित बैंक की नियम व शर्तों के अधीन।').trim(),
      isSampleTemplate: Boolean(b.isSampleTemplate),
      active: b.active !== false,
      updatedAt: new Date().toISOString(),
    };

    db.products.unshift(product);
    saveDatabase(db);
    res.status(201).json(product);
  });

  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    const existing = db.products[idx];
    const b = req.body as Partial<FinancialProduct>;
    const partner = db.partners.find((p) => p.id === b.partnerId);

    const updated: FinancialProduct = {
      ...existing,
      ...b,
      id: existing.id,
      partnerName: partner ? partner.name : b.partnerName ?? existing.partnerName,
      indicativeRate:
        (b.isVerifiedRate ?? existing.isVerifiedRate) && (b.indicativeRate ?? existing.indicativeRate)
          ? String(b.indicativeRate ?? existing.indicativeRate)
          : '',
      updatedAt: new Date().toISOString(),
    };
    db.products[idx] = updated;
    saveDatabase(db);
    res.json(updated);
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const before = db.products.length;
    db.products = db.products.filter((p) => p.id !== req.params.id);
    if (db.products.length === before) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin: Partners CRUD
  app.post('/api/admin/partners', requireAdmin, (req: Request, res: Response) => {
    const b = req.body as Partial<BankPartner>;
    const partner: BankPartner = {
      id: `partner-${crypto.randomUUID().slice(0, 8)}`,
      name: String(b.name || 'New Financial Partner').trim(),
      type: b.type || 'Public Sector Bank',
      verificationStatus: b.verificationStatus === 'Verified Partner' ? 'Verified Partner' : 'Sample / Onboarding',
      contactPerson: String(b.contactPerson || 'Branch Coordinator').trim(),
      branchLocation: String(b.branchLocation || 'Dehradun').trim(),
      supportedCategories: Array.isArray(b.supportedCategories) && b.supportedCategories.length > 0
        ? b.supportedCategories
        : ['business_loan'],
      active: b.active !== false,
    };
    db.partners.unshift(partner);
    saveDatabase(db);
    res.status(201).json(partner);
  });

  app.put('/api/admin/partners/:id', requireAdmin, (req: Request, res: Response) => {
    const idx = db.partners.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Partner not found.' });
      return;
    }
    const existing = db.partners[idx];
    const b = req.body as Partial<BankPartner>;
    const updated: BankPartner = {
      ...existing,
      ...b,
      id: existing.id,
    };
    db.partners[idx] = updated;

    // Sync partner name & verification flag on linked products
    db.products = db.products.map((prod) =>
      prod.partnerId === updated.id
        ? {
            ...prod,
            partnerName: updated.name,
            isVerifiedPartner: updated.verificationStatus === 'Verified Partner',
          }
        : prod
    );

    saveDatabase(db);
    res.json(updated);
  });

  app.delete('/api/admin/partners/:id', requireAdmin, (req: Request, res: Response) => {
    const before = db.partners.length;
    db.partners = db.partners.filter((p) => p.id !== req.params.id);
    if (db.partners.length === before) {
      res.status(404).json({ error: 'Partner not found.' });
      return;
    }
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin: Commission Assumptions
  app.put('/api/admin/commission', requireAdmin, (req: Request, res: Response) => {
    const b = req.body as Partial<CommissionAssumptions>;
    const referralCommission = Math.max(0, Number(b.referralCommission ?? db.commission.referralCommission));
    const variableCostPerReferral = Math.max(0, Number(b.variableCostPerReferral ?? db.commission.variableCostPerReferral));
    const monthlyFixedCost = Math.max(0, Number(b.monthlyFixedCost ?? db.commission.monthlyFixedCost));
    const targetCustomersPerMonth = Math.max(1, Math.round(Number(b.targetCustomersPerMonth ?? db.commission.targetCustomersPerMonth)));

    db.commission = {
      referralCommission,
      variableCostPerReferral,
      monthlyFixedCost,
      targetCustomersPerMonth,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);
    res.json(db.commission);
  });

  // Admin: Settings (WhatsApp number, office info)
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const b = req.body as Partial<PublicSettings>;
    const cleanPhone = String(b.whatsappNumber ?? db.settings.whatsappNumber).replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      res.status(400).json({ error: 'Please provide a valid WhatsApp number with country code (e.g. 919876543210).' });
      return;
    }
    db.settings = {
      ...db.settings,
      whatsappNumber: cleanPhone,
      officeLocation: String(b.officeLocation ?? db.settings.officeLocation).trim(),
      supportHours: String(b.supportHours ?? db.settings.supportHours).trim(),
    };
    saveDatabase(db);
    res.json(db.settings);
  });

  // Mount Vite middleware in dev, or serve dist in production
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DukaanDhan server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
