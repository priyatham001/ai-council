import { Language } from '../types';

export interface TranslationDict {
  appTitle: string;
  appSubtitle: string;
  sihBadge: string;
  demoModeNotice: string;
  demoModeSub: string;
  
  // First screen & Onboarding
  welcomeTitle: string;
  welcomeSubtitle: string;
  chooseLanguage: string;
  changeLanguageLater: string;
  continueBtn: string;
  onboardingTitle: string;
  onboardingSubtitle: string;
  farmerNameOptional: string;
  selectLocationTitle: string;
  startExploringBtn: string;

  // Navigation
  navHome: string;
  navFindMarket: string;
  navPrices: string;
  navBuyers: string;
  navTransport: string;
  navTrends: string;
  navAIInsights: string;
  navHistory: string;
  navAdmin: string;
  navHelp: string;
  
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  btnFindBestMarket: string;
  btnExplorePrices: string;
  btnDemoScenario: string;
  
  // Farmer Location Card
  yourLocation: string;
  detectGps: string;
  locationPlaceholder: string;
  stateLabel: string;
  districtLabel: string;
  villageLabel: string;
  gpsDetected: string;
  
  // Crop & Quantity
  selectCrop: string;
  searchCropPlaceholder: string;
  customCropPlaceholder: string;
  quantity: string;
  unit: string;
  convertedQuintals: string;
  
  // Quality & Grade
  cropQualityTitle: string;
  cropGrade: string;
  gradeA: string;
  gradeB: string;
  gradeC: string;
  gradeCustom: string;
  moisturePercent: string;
  uploadCropPhoto: string;
  photoAnalysisNotice: string;
  packagingType: string;
  
  // Transport parameters
  transportSettings: string;
  vehicleType: string;
  ratePerKm: string;
  roundTrip: string;
  loadingCharges: string;
  findTransportBtn: string;
  
  // Actions
  btnCalculate: string;
  btnCalculating: string;
  
  // Core results
  recommendedBadge: string;
  bestNetReturn: string;
  marketPrice: string;
  grossRevenue: string;
  transportCost: string;
  otherCharges: string;
  netReturn: string;
  distance: string;
  whyThisMarket: string;
  alternativeOption: string;
  viewDetails: string;
  contactBuyer: string;
  getDirections: string;
  compareAll: string;
  compareAgain: string;
  sendOfferTitle: string;
  
  // Ranking Rule
  ruleNoticeTitle: string;
  ruleNoticeText: string;
  
  // Freshness
  freshnessFresh: string;
  freshnessAging: string;
  freshnessStale: string;
  
  // AI Section
  aiExplanationTitle: string;
  aiFacts: string;
  aiCalculations: string;
  aiEstimates: string;
  aiInsights: string;
  aiRisks: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  
  // Table columns
  colRank: string;
  colMarket: string;
  colPrice: string;
  colDistance: string;
  colGross: string;
  colTransport: string;
  colCharges: string;
  colNetReturn: string;
  colPayment: string;
  colAction: string;
  
  // Price trends
  trend7d: string;
  trend30d: string;
  trend90d: string;
  avgPrice: string;
  highestPrice: string;
  lowestPrice: string;
  volatility: string;
  forecastTitle: string;
  forecastDisclaimer: string;
  
  // Common
  rupeeSymbol: string;
  perQuintal: string;
  quintals: string;
  kg: string;
  tonne: string;
  disclaimerFooter: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    appTitle: 'KrishiSetu',
    appSubtitle: 'Know Your Market. Compare Your Options. Sell Smarter.',
    sihBadge: 'Technology prototype for SIH26132 • Govt of Maharashtra',
    demoModeNotice: 'DEMO DATA — NOT LIVE GOVERNMENT MARKET PRICES',
    demoModeSub: 'Sample records calibrated for SIH demonstration. Actual APMC mandi rates vary daily.',
    
    welcomeTitle: '🌾 Welcome to KrishiSetu',
    welcomeSubtitle: 'Strengthening market linkages & price discovery for farmers',
    chooseLanguage: 'Choose your preferred language',
    changeLanguageLater: 'You can change this anytime from the top bar or settings.',
    continueBtn: 'Continue',
    onboardingTitle: 'Farmer Profile Setup',
    onboardingSubtitle: 'Set your primary farm location to instantly compare realistic mandi transport costs.',
    farmerNameOptional: 'Farmer Name (Optional)',
    selectLocationTitle: 'Farm Location',
    startExploringBtn: 'Start Finding Best Market',

    navHome: 'Home',
    navFindMarket: 'Find Best Market',
    navPrices: 'Market Prices',
    navBuyers: 'Nearby Buyers',
    navTransport: 'Find Transport',
    navTrends: 'Price Trends',
    navAIInsights: 'AI Insights',
    navHistory: 'History',
    navAdmin: 'Admin Panel',
    navHelp: 'How It Works',
    
    heroTitle: 'Sell Smarter. Earn Better.',
    heroSubtitle: 'Discover better markets for your crop by comparing prices, transport costs, buyer requirements and estimated net returns.',
    btnFindBestMarket: 'Find Best Market',
    btnExplorePrices: 'Explore Market Prices',
    btnDemoScenario: 'Load Demo Scenario (Paddy 10 Quintals)',
    
    yourLocation: 'Your Farm Location',
    detectGps: 'Use Current GPS',
    locationPlaceholder: 'Search village, town, or district...',
    stateLabel: 'State',
    districtLabel: 'District',
    villageLabel: 'Village / Town',
    gpsDetected: 'GPS Coordinates Applied',
    
    selectCrop: 'Select Crop',
    searchCropPlaceholder: 'Search crop (e.g. Paddy, Tomato, Soybean)...',
    customCropPlaceholder: 'Or type custom crop name...',
    quantity: 'Harvest Quantity',
    unit: 'Unit',
    convertedQuintals: 'Equivalent in Quintals',
    
    cropQualityTitle: 'Crop Quality & Grade',
    cropGrade: 'Quality Grade',
    gradeA: 'Grade A (Premium)',
    gradeB: 'Grade B (Standard)',
    gradeC: 'Grade C (Fair Average)',
    gradeCustom: 'Custom Specification',
    moisturePercent: 'Moisture Percentage (%)',
    uploadCropPhoto: '📷 Upload Crop Photo',
    photoAnalysisNotice: 'AI-assisted quality estimate — not an official certification.',
    packagingType: 'Packaging Type',
    
    transportSettings: 'Transportation & Vehicle Settings',
    vehicleType: 'Transport Vehicle',
    ratePerKm: 'Transport Rate (₹/km)',
    roundTrip: 'Calculate for round trip (Two-way travel)',
    loadingCharges: 'Loading / Unloading per quintal',
    findTransportBtn: 'Explore Transport Directory',
    
    btnCalculate: 'Find Best Market & Net Return',
    btnCalculating: 'Calculating Net Returns & Inquiring AI...',
    
    recommendedBadge: '⭐ BEST ESTIMATED OPTION',
    bestNetReturn: 'Highest Estimated Net Return',
    marketPrice: 'Market Selling Price',
    grossRevenue: 'Gross Revenue',
    transportCost: 'Estimated Transport Cost',
    otherCharges: 'Mandi & Loading Charges',
    netReturn: 'Estimated Net Return',
    distance: 'Distance',
    whyThisMarket: 'Why this market is recommended',
    alternativeOption: 'Alternative Market Option',
    viewDetails: 'View Details',
    contactBuyer: 'Connect with Buyer',
    getDirections: 'Get Directions',
    compareAll: 'Compare All Markets',
    compareAgain: 'Calculate Again',
    sendOfferTitle: 'Send Crop Offer to Buyer',
    
    ruleNoticeTitle: 'Net Return Optimization Invariant',
    ruleNoticeText: 'We optimize strictly for net earnings in your pocket, not simply the highest market board price. A distant market with high board rates is rejected if transportation costs erode your profit.',
    
    freshnessFresh: 'Fresh (< 6 hrs ago)',
    freshnessAging: 'Aging (6-24 hrs ago)',
    freshnessStale: 'Stale (> 24 hrs ago)',
    
    aiExplanationTitle: 'AI Multi-Model Deliberation',
    aiFacts: 'Verified Facts',
    aiCalculations: 'Deterministic Calculations',
    aiEstimates: 'Cost Estimates',
    aiInsights: 'Strategic Guidance & Insights',
    aiRisks: 'Key Uncertainties & Caveats',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence',
    
    colRank: 'Rank',
    colMarket: 'Market / Mandi',
    colPrice: 'Price (₹/qtl)',
    colDistance: 'Distance',
    colGross: 'Gross Revenue',
    colTransport: 'Transport Cost',
    colCharges: 'Other Fees',
    colNetReturn: 'Net Return',
    colPayment: 'Payment Terms',
    colAction: 'Action',
    
    trend7d: '7-Day Trend',
    trend30d: '30-Day Trend',
    trend90d: '90-Day Trend',
    avgPrice: 'Average Price',
    highestPrice: 'Highest Price',
    lowestPrice: 'Lowest Price',
    volatility: 'Price Volatility',
    forecastTitle: 'AI & Statistical Price Forecast',
    forecastDisclaimer: 'Forecast is an estimate based on available historical data and is not guaranteed.',
    
    rupeeSymbol: '₹',
    perQuintal: '/ quintal',
    quintals: 'Quintals',
    kg: 'kg',
    tonne: 'Tonne',
    disclaimerFooter: 'Recommendations depend on available market data and estimated logistics costs. Actual mandi auction rates and transport charges may vary by day and bargaining.'
  },

  mr: {
    appTitle: 'कृषीसेतू',
    appSubtitle: 'बाजारपेठ जाणा. पर्याय तपासा. हुशारीने विक्री करा.',
    sihBadge: 'SIH26132 साठी तंत्रज्ञान प्रोटोटाइप • महाराष्ट्र शासन',
    demoModeNotice: 'डेमो डेटा — थेट सरकारी बाजारभाव नाहीत',
    demoModeSub: 'SIH प्रात्यक्षिकासाठी नमुना आकडेवारी. प्रत्यक्ष APMC बाजारभाव दररोज बदलतात.',
    
    welcomeTitle: '🌾 कृषीसेतू मध्ये आपले स्वागत आहे',
    welcomeSubtitle: 'शेतकऱ्यांसाठी थेट बाजारपेठ जोडणी आणि अचूक नफा शोध',
    chooseLanguage: 'आपली पसंतीची भाषा निवडा',
    changeLanguageLater: 'तुम्ही हे नंतर वरच्या मेनूमधून किंवा सेटिंग्जमधून कधीही बदलू शकता.',
    continueBtn: 'पुढे जा',
    onboardingTitle: 'शेतकरी प्रोफाइल माहिती',
    onboardingSubtitle: 'वास्तविक वाहतूक खर्च तपासण्यासाठी आपल्या शेताचे ठिकाण निवडा.',
    farmerNameOptional: 'शेतकऱ्याचे नाव (पर्यायी)',
    selectLocationTitle: 'शेताचे ठिकाण',
    startExploringBtn: 'योग्य बाजार शोधणे सुरू करा',

    navHome: 'मुख्यपृष्ठ',
    navFindMarket: 'योग्य बाजार शोधा',
    navPrices: 'बाजारभाव',
    navBuyers: 'नजीकचे खरेदीदार',
    navTransport: 'वाहतूक शोधा',
    navTrends: 'भाव कल',
    navAIInsights: 'AI सल्ला',
    navHistory: 'इतिहास',
    navAdmin: 'प्रशासक पॅनेल',
    navHelp: 'कसे कार्य करते',
    
    heroTitle: 'हुशारीने विका. अधिक नफा मिळवा.',
    heroSubtitle: 'भाव, वाहतूक खर्च आणि निव्वळ नफ्याची तुलना करून आपल्या पिकासाठी सर्वोत्तम बाजार शोधा.',
    btnFindBestMarket: 'उत्तम बाजार शोधा',
    btnExplorePrices: 'बाजारभाव तपासा',
    btnDemoScenario: 'डेमो परिस्थिती लोड करा (भात १० क्विंटल)',
    
    yourLocation: 'आपल्या शेताचे ठिकाण',
    detectGps: 'सध्याचे GPS वापरा',
    locationPlaceholder: 'गाव, शहर किंवा जिल्हा शोधा...',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    villageLabel: 'गाव / शहर',
    gpsDetected: 'GPS स्थान जोडले',
    
    selectCrop: 'पीक निवडा',
    searchCropPlaceholder: 'पीक शोधा (उदा. सोयाबीन, कांदा, कापूस)...',
    customCropPlaceholder: 'किंवा इतर पिकाचे नाव लिहा...',
    quantity: 'पिकाचे प्रमाण',
    unit: 'एकक',
    convertedQuintals: 'क्विंटलमध्ये समतुल्य',
    
    cropQualityTitle: 'पिकाचा दर्जा आणि प्रतवारी',
    cropGrade: 'गुणवत्ता प्रत',
    gradeA: 'ग्रेड A (उत्कृष्ट प्रत)',
    gradeB: 'ग्रेड B (मध्यम प्रत)',
    gradeC: 'ग्रेड C (साधारण प्रत)',
    gradeCustom: 'सानुकूल गुणवत्ता',
    moisturePercent: 'ओलाव्याचे प्रमाण (%)',
    uploadCropPhoto: '📷 पिकाचा फोटो अपलोड करा',
    photoAnalysisNotice: 'AI-सहाय्यित प्रतवारी अंदाज — हे अधिकृत प्रमाणपत्र नाही.',
    packagingType: 'पॅकिंग प्रकार',
    
    transportSettings: 'वाहतूक व वाहन सेटिंग्ज',
    vehicleType: 'वाहतूक वाहन',
    ratePerKm: 'वाहतूक दर (₹/किमी)',
    roundTrip: 'दोन्ही बाजूंचा प्रवास (येणे-जाणे)',
    loadingCharges: 'हमाली / तोलाई प्रति क्विंटल',
    findTransportBtn: 'वाहतूकदार सूची पहा',
    
    btnCalculate: 'सर्वोत्तम बाजार आणि नफा शोधा',
    btnCalculating: 'निव्वळ नफा मोजत आहे...',
    
    recommendedBadge: '⭐ सर्वोत्तम शिफारस केलेला पर्याय',
    bestNetReturn: 'सर्वात जास्त निव्वळ नफा',
    marketPrice: 'बाजार भाव',
    grossRevenue: 'एकूण उत्पन्न',
    transportCost: 'अंदाजे वाहतूक खर्च',
    otherCharges: 'बाजार व हमाली शुल्क',
    netReturn: 'हातात मिळणारा निव्वळ नफा',
    distance: 'अंतर',
    whyThisMarket: 'हा बाजार का शिफारस केला आहे',
    alternativeOption: 'पर्यायी बाजार पर्याय',
    viewDetails: 'तपशील पहा',
    contactBuyer: 'खरेदीदाराशी संपर्क साधा',
    getDirections: 'रस्ता पहा',
    compareAll: 'सर्व बाजारांची तुलना करा',
    compareAgain: 'पुन्हा गणना करा',
    sendOfferTitle: 'खरेदीदारास पिकाची ऑफर पाठवा',
    
    ruleNoticeTitle: 'निव्वळ नफा नियम',
    ruleNoticeText: 'केवळ पाटीवरील मोठा भाव पाहून न जाता खिशात येणाऱ्या प्रत्यक्ष निव्वळ नफ्याला प्राधान्य दिले जाते.',
    
    freshnessFresh: 'ताजे (< ६ तास आधी)',
    freshnessAging: 'मध्यम (६-२४ तास आधी)',
    freshnessStale: 'जुने (> २४ तास आधी)',
    
    aiExplanationTitle: 'AI बहु-मॉडेल सल्ला',
    aiFacts: 'सत्यापित माहिती',
    aiCalculations: 'थेट गणितीय गणना',
    aiEstimates: 'खर्च अंदाज',
    aiInsights: 'आर्थिक व धोरणात्मक सल्ला',
    aiRisks: 'जोखीम व काळजी',
    confidenceHigh: 'उच्च आत्मविश्वास',
    confidenceMedium: 'मध्यम आत्मविश्वास',
    confidenceLow: 'कमी आत्मविश्वास',
    
    colRank: 'क्रमांक',
    colMarket: 'बाजार / मंडी',
    colPrice: 'भाव (₹/क्विंटल)',
    colDistance: 'अंतर',
    colGross: 'एकूण रक्कम',
    colTransport: 'वाहतूक खर्च',
    colCharges: 'इतर शुल्क',
    colNetReturn: 'निव्वळ नफा',
    colPayment: 'पेमेंट अटी',
    colAction: 'कृती',
    
    trend7d: '७ दिवसांचा कल',
    trend30d: '३० दिवसांचा कल',
    trend90d: '९० दिवसांचा कल',
    avgPrice: 'सरासरी भाव',
    highestPrice: 'कमाल भाव',
    lowestPrice: 'किमान भाव',
    volatility: 'भावातील चढ-उतार',
    forecastTitle: 'AI व सांख्यिकीय भाव अंदाज',
    forecastDisclaimer: 'अंदाज हा उपलब्ध माहितीवर आधारित असून त्याची हमी नाही.',
    
    rupeeSymbol: '₹',
    perQuintal: '/ क्विंटल',
    quintals: 'क्विंटल',
    kg: 'किलो',
    tonne: 'टन',
    disclaimerFooter: 'बाजारभाव व वाहतूक खर्च दररोज बदलू शकतात. सौद्यापूर्वी प्रत्यक्ष खात्री करावी.'
  },

  hi: {
    appTitle: 'कृषिसेतु',
    appSubtitle: 'अपना बाज़ार जानें। विकल्पों की तुलना करें। समझदारी से बेचें।',
    sihBadge: 'SIH26132 के लिए तकनीकी प्रोटोटाइप • महाराष्ट्र सरकार',
    demoModeNotice: 'डेमो डेटा — यह लाइव सरकारी मंडी भाव नहीं है',
    demoModeSub: 'SIH प्रदर्शन के लिए नमूना डेटा। वास्तविक APMC मंडी दरें प्रतिदिन बदलती हैं।',
    
    welcomeTitle: '🌾 कृषिसेतु में आपका स्वागत है',
    welcomeSubtitle: 'किसानों के लिए सीधी बाजार पहुंच और अधिकतम वास्तविक लाभ',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
    changeLanguageLater: 'आप इसे बाद में ऊपर दिए गए मेनू या सेटिंग्स से बदल सकते हैं।',
    continueBtn: 'आगे बढ़ें',
    onboardingTitle: 'किसान प्रोफाइल',
    onboardingSubtitle: 'सही परिवहन खर्च जानने के लिए अपने खेत का स्थान चुनें।',
    farmerNameOptional: 'किसान का नाम (वैकल्पिक)',
    selectLocationTitle: 'खेत का स्थान',
    startExploringBtn: 'सर्वोत्तम बाजार खोजना शुरू करें',

    navHome: 'होम',
    navFindMarket: 'सर्वोत्तम बाजार खोजें',
    navPrices: 'मंडी भाव',
    navBuyers: 'निकटतम खरीदार',
    navTransport: 'परिवहन खोजें',
    navTrends: 'मूल्य रुझान',
    navAIInsights: 'AI सलाह',
    navHistory: 'इतिहास',
    navAdmin: 'व्यवस्थापक पैनल',
    navHelp: 'यह कैसे काम करता है',
    
    heroTitle: 'समझदारी से बेचें। अधिक कमाएं।',
    heroSubtitle: 'मंडी भाव, परिवहन खर्च और कुल शुद्ध लाभ की तुलना करके अपनी फसल के लिए सर्वोत्तम विकल्प खोजें।',
    btnFindBestMarket: 'सर्वोत्तम बाजार खोजें',
    btnExplorePrices: 'मंडी भाव देखें',
    btnDemoScenario: 'डेमो परिदृश्य लोड करें (धान 10 क्विंटल)',
    
    yourLocation: 'आपके खेत का स्थान',
    detectGps: 'वर्तमान GPS का उपयोग करें',
    locationPlaceholder: 'गाँव, कस्बा या जिला खोजें...',
    stateLabel: 'राज्य',
    districtLabel: 'जिला',
    villageLabel: 'गाँव / कस्बा',
    gpsDetected: 'GPS स्थान दर्ज किया गया',
    
    selectCrop: 'फसल चुनें',
    searchCropPlaceholder: 'फसल खोजें (जैसे गेहूं, टमाटर, सोयाबीन)...',
    customCropPlaceholder: 'या अन्य फसल का नाम लिखें...',
    quantity: 'फसल की मात्रा',
    unit: 'इकाई',
    convertedQuintals: 'क्विंटल में बराबर',
    
    cropQualityTitle: 'फसल की गुणवत्ता व ग्रेड',
    cropGrade: 'गुणवत्ता ग्रेड',
    gradeA: 'ग्रेड A (उत्कृष्ट)',
    gradeB: 'ग्रेड B (सामान्य)',
    gradeC: 'ग्रेड C (औसत)',
    gradeCustom: 'कस्टम गुणवत्ता',
    moisturePercent: 'नमी का प्रतिशत (%)',
    uploadCropPhoto: '📷 फसल का फोटो अपलोड करें',
    photoAnalysisNotice: 'AI-सहायता प्राप्त गुणवत्ता अनुमान — यह आधिकारिक प्रमाणन नहीं है।',
    packagingType: 'पैकेजिंग प्रकार',
    
    transportSettings: 'परिवहन और वाहन सेटिंग्स',
    vehicleType: 'परिवहन वाहन',
    ratePerKm: 'भाड़ा दर (₹/किमी)',
    roundTrip: 'आना-जाना दोनों तरफ का भाड़ा जोड़ें',
    loadingCharges: 'पल्लेदारी / तुलाई प्रति क्विंटल',
    findTransportBtn: 'वाहन सूची देखें',
    
    btnCalculate: 'सर्वोत्तम मंडी और शुद्ध लाभ खोजें',
    btnCalculating: 'शुद्ध लाभ की गणना हो रही है...',
    
    recommendedBadge: '⭐ सर्वोत्तम अनुशंसित विकल्प',
    bestNetReturn: 'अधिकतम शुद्ध लाभ',
    marketPrice: 'मंडी भाव',
    grossRevenue: 'कुल बिक्री मूल्य',
    transportCost: 'अनुमानित परिवहन खर्च',
    otherCharges: 'मंडी व लोडिंग शुल्क',
    netReturn: 'हाथ में आने वाला शुद्ध लाभ',
    distance: 'दूरी',
    whyThisMarket: 'यह मंडी क्यों चुनी गई',
    alternativeOption: 'वैकल्पिक मंडी विकल्प',
    viewDetails: 'विवरण देखें',
    contactBuyer: 'खरीदार से संपर्क करें',
    getDirections: 'रास्ता देखें',
    compareAll: 'सभी मंडियों की तुलना करें',
    compareAgain: 'पुनः गणना करें',
    sendOfferTitle: 'खरीदार को फसल का प्रस्ताव भेजें',
    
    ruleNoticeTitle: 'शुद्ध लाभ अनुकूलन नियम',
    ruleNoticeText: 'हम केवल बोर्ड पर लिखे सबसे ऊंचे भाव को नहीं चुनते, बल्कि परिवहन खर्च काटने के बाद किसान की जेब में आने वाले अधिकतम शुद्ध लाभ को प्राथमिकता देते हैं।',
    
    freshnessFresh: 'ताजा (< 6 घंटे पहले)',
    freshnessAging: 'मध्यम (6-24 घंटे पहले)',
    freshnessStale: 'पुराना (> 24 घंटे पहले)',
    
    aiExplanationTitle: 'AI बहु-मॉडल परामर्श',
    aiFacts: 'प्रमाणित तथ्य',
    aiCalculations: 'सटीक गणितीय गणना',
    aiEstimates: 'अनुमानित लागत',
    aiInsights: 'आर्थिक व रणनीतिक सलाह',
    aiRisks: 'मुख्य जोखिम व सावधानियां',
    confidenceHigh: 'उच्च विश्वसनीयता',
    confidenceMedium: 'मध्यम विश्वसनीयता',
    confidenceLow: 'कम विश्वसनीयता',
    
    colRank: 'रैंक',
    colMarket: 'मंडी / बाजार',
    colPrice: 'भाव (₹/क्विंटल)',
    colDistance: 'दूरी',
    colGross: 'सकल बिक्री',
    colTransport: 'परिवहन खर्च',
    colCharges: 'अन्य शुल्क',
    colNetReturn: 'शुद्ध लाभ',
    colPayment: 'भुगतान की शर्तें',
    colAction: 'कार्रवाई',
    
    trend7d: '7-दिन का रुझान',
    trend30d: '30-दिन का रुझान',
    trend90d: '90-दिन का रुझान',
    avgPrice: 'औसत भाव',
    highestPrice: 'उच्चतम भाव',
    lowestPrice: 'न्यूनतम भाव',
    volatility: 'मूल्य उतार-चढ़ाव',
    forecastTitle: 'AI व सांख्यिकीय मूल्य पूर्वानुमान',
    forecastDisclaimer: 'पूर्वानुमान उपलब्ध ऐतिहासिक डेटा पर आधारित एक अनुमान है और इसकी गारंटी नहीं है।',
    
    rupeeSymbol: '₹',
    perQuintal: '/ क्विंटल',
    quintals: 'क्विंटल',
    kg: 'किलो',
    tonne: 'टन',
    disclaimerFooter: 'सिफारिशें उपलब्ध मंडी आंकड़ों और अनुमानित परिवहन दरों पर आधारित हैं। वास्तविक सौदे में मोलभाव और दिन के अनुसार अंतर संभव है।'
  },

  te: {
    appTitle: 'కృషిసేతు',
    appSubtitle: 'మీ మార్కెట్ తెలుసుకోండి. పోల్చండి. తెలివిగా అమ్మండి.',
    sihBadge: 'SIH26132 సాంకేతిక నమూనా • మహారాష్ట్ర ప్రభుత్వం',
    demoModeNotice: 'డెమో డేటా — ఇది ప్రత్యక్ష మార్కెట్ ధరలు కావు',
    demoModeSub: 'SIH ప్రదర్శన కొరకు సిద్ధం చేసిన నమూనా డేటా. వాస్తవ మార్కెట్ రేట్లు ప్రతిరోజూ మారతాయి.',
    
    welcomeTitle: '🌾 కృషిసేతుకు స్వాగతం',
    welcomeSubtitle: 'రైతులకు మార్కెట్ అనుసంధానం మరియు నికర లాభ పరిశీలన వేదిక',
    chooseLanguage: 'మీ ప్రాధాన్యత భాషను ఎంచుకోండి',
    changeLanguageLater: 'మీరు దీన్ని తర్వాత ఎప్పుడైనా సెట్టింగ్స్ లేదా పైన ఉన్న బటన్ ద్వారా మార్చుకోవచ్చు.',
    continueBtn: 'కొనసాగించండి',
    onboardingTitle: 'రైతు వివరాలు',
    onboardingSubtitle: 'వాస్తవ రవాణా ఖర్చులను లెక్కించేందుకు మీ పొలం ఉన్న ప్రాంతాన్ని ఎంచుకోండి.',
    farmerNameOptional: 'రైతు పేరు (ఐచ్ఛికం)',
    selectLocationTitle: 'పొలం ఉన్న ప్రాంతం',
    startExploringBtn: 'ఉత్తమ మార్కెట్‌ను వెతకండి',

    navHome: 'హోమ్',
    navFindMarket: 'సరైన మార్కెట్ వెతకండి',
    navPrices: 'మార్కెట్ ధరలు',
    navBuyers: 'దగ్గరలోని కొనుగోలుదారులు',
    navTransport: 'రవాణా వెతకండి',
    navTrends: 'ధరల సరళి',
    navAIInsights: 'AI సలహాలు',
    navHistory: 'చరిత్ర',
    navAdmin: 'అడ్మిన్ ప్యానెల్',
    navHelp: 'ఇది ఎలా పనిచేస్తుంది',
    
    heroTitle: 'తెలివిగా అమ్మండి. అధిక లాభం పొందండి.',
    heroSubtitle: 'మార్కెట్ ధర, రవాణా ఖర్చులను సరిపోల్చి మీ పంటకు అత్యధిక నికర లాభం ఎక్కడ వస్తుందో తెలుసుకోండి.',
    btnFindBestMarket: 'ఉత్తమ మార్కెట్ కనుగొనండి',
    btnExplorePrices: 'మార్కెట్ ధరలు చూడండి',
    btnDemoScenario: 'డెమో దృష్టాంతం (వరి 10 క్వింటాళ్లు)',
    
    yourLocation: 'మీ పొలం ఉన్న ప్రాంతం',
    detectGps: 'ప్రస్తుత GPS ఉపయోగించండి',
    locationPlaceholder: 'గ్రామం, పట్టణం లేదా జిల్లా వెతకండి...',
    stateLabel: 'రాష్ట్రం',
    districtLabel: 'జిల్లా',
    villageLabel: 'గ్రామం / పట్టణం',
    gpsDetected: 'GPS కోఆర్డినేట్స్ నమోదయ్యాయి',
    
    selectCrop: 'పంటను ఎంచుకోండి',
    searchCropPlaceholder: 'పంట పేరు వెతకండి (ఉదా: వరి, టమోటా, పత్తి)...',
    customCropPlaceholder: 'లేదా ఇతర పంట పేరు టైప్ చేయండి...',
    quantity: 'పంట పరిమాణం',
    unit: 'కొలత ప్రమాణం',
    convertedQuintals: 'క్వింటాళ్లలో సమానం',
    
    cropQualityTitle: 'పంట నాణ్యత మరియు గ్రేడ్',
    cropGrade: 'నాణ్యత గ్రేడ్',
    gradeA: 'గ్రేడ్ A (ఉత్తమ నాణ్యత)',
    gradeB: 'గ్రేడ్ B (మధ్యమ నాణ్యత)',
    gradeC: 'గ్రేడ్ C (సాధారణ నాణ్యత)',
    gradeCustom: 'కస్టమ్ నాణ్యత',
    moisturePercent: 'తేమ శాతం (%)',
    uploadCropPhoto: '📷 పంట ఫోటో అప్‌లోడ్ చేయండి',
    photoAnalysisNotice: 'AI ఆధారిత నాణ్యత అంచనా — ఇది అధికారిక సర్టిఫికేట్ కాదు.',
    packagingType: 'ప్యాకింగ్ రకం',
    
    transportSettings: 'రవాణా వాహన వివరాలు',
    vehicleType: 'రవాణా వాహనం',
    ratePerKm: 'రవాణా రేటు (₹/కి.మీ)',
    roundTrip: 'రాను-పోను రెండింటికీ లెక్కించండి',
    loadingCharges: 'కూలీ / లోడింగ్ ఛార్జీలు (క్వింటాలుకు)',
    findTransportBtn: 'రవాణాదారుల వివరాలు చూడండి',
    
    btnCalculate: 'ఉత్తమ మార్కెట్ మరియు నికర లాభం లెక్కించండి',
    btnCalculating: 'నికర లాభాన్ని లెక్కిస్తున్నాము...',
    
    recommendedBadge: '⭐ ఉత్తమ సిఫార్సు మార్కెట్',
    bestNetReturn: 'అత్యధిక నికర లాభం',
    marketPrice: 'మార్కెట్ అమ్మకం ధర',
    grossRevenue: 'మొత్తం అమ్మకం విలువ',
    transportCost: 'అంచనా వేసిన రవాణా ఖర్చు',
    otherCharges: 'మార్కెట్ & లోడింగ్ ఖర్చులు',
    netReturn: 'చేతికి వచ్చే నికర లాభం',
    distance: 'దూరం',
    whyThisMarket: 'ఈ మార్కెట్‌ను ఎందుకు ఎంచుకున్నాము',
    alternativeOption: 'ప్రత్యామ్నాయ మార్కెట్',
    viewDetails: 'వివరాలు చూడండి',
    contactBuyer: 'కొనుగోలుదారుని సంప్రదించండి',
    getDirections: 'దారి తెలుసుకోండి',
    compareAll: 'అన్ని మార్కెట్లను సరిపోల్చండి',
    compareAgain: 'మళ్ళీ లెక్కించండి',
    sendOfferTitle: 'కొనుగోలుదారునికి ఆఫర్ పంపండి',
    
    ruleNoticeTitle: 'నికర లాభ ఆప్టిమైజేషన్ సూత్రం',
    ruleNoticeText: 'కేవలం బోర్డు మీద ఉన్న ఎక్కువ ధరను చూసి కాకుండా, రవాణా మరియు ఇతర ఖర్చులు తీసివేసిన తర్వాత రైతు జేబులోకి వచ్చే అసలైన నికర లాభాన్ని మాత్రమే మేము సిఫార్సు చేస్తాము.',
    
    freshnessFresh: 'తాజా (< 6 గంటల క్రితం)',
    freshnessAging: 'మధ్యస్థం (6-24 గంటల క్రితం)',
    freshnessStale: 'పాతది (> 24 గంటల క్రితం)',
    
    aiExplanationTitle: 'AI బహుళ-మోడల్ విశ్లేషణ',
    aiFacts: 'ధృవీకరించబడిన వాస్తవాలు',
    aiCalculations: 'గణిత సంబంధిత లెక్కింపులు',
    aiEstimates: 'అంచనా వేసిన ఖర్చులు',
    aiInsights: 'వ్యూహాత్మక సలహాలు',
    aiRisks: 'ప్రధాన నష్టభయాలు & జాగ్రత్తలు',
    confidenceHigh: 'అధిక విశ్వసనీయత',
    confidenceMedium: 'మధ్యమ విశ్వసనీయత',
    confidenceLow: 'తక్కువ విశ్వసనీయత',
    
    colRank: 'ర్యాంక్',
    colMarket: 'మార్కెట్ / మండి',
    colPrice: 'ధర (₹/క్వింటాలు)',
    colDistance: 'దూరం',
    colGross: 'మొత్తం రాబడి',
    colTransport: 'రవాణా ఖర్చు',
    colCharges: 'ఇతర రుసుములు',
    colNetReturn: 'నికర లాభం',
    colPayment: 'చెల్లింపు నిబంధనలు',
    colAction: 'చర్య',
    
    trend7d: '7-రోజుల సరళి',
    trend30d: '30-రోజుల సరళి',
    trend90d: '90-రోజుల సరళి',
    avgPrice: 'సగటు ధర',
    highestPrice: 'అత్యధిక ధర',
    lowestPrice: 'అత్యల్ప ధర',
    volatility: 'ధరల హెచ్చుతగ్గులు',
    forecastTitle: 'AI మరియు గణాంక ధరల అంచనా',
    forecastDisclaimer: 'ఈ అంచనా అందుబాటులో ఉన్న చారిత్రక డేటా ఆధారంగా రూపొందించబడింది మరియు ఇది హామీ కాదు.',
    
    rupeeSymbol: '₹',
    perQuintal: '/ క్వింటాలు',
    quintals: 'క్వింటాళ్లు',
    kg: 'కిలోలు',
    tonne: 'టన్ను',
    disclaimerFooter: 'సిఫార్సులు అందుబాటులో ఉన్న మార్కెట్ డేటా మరియు రవాణా రేట్లపై ఆధారపడి ఉంటాయి. వాస్తవ మార్కెట్లలో ధరలు బేరసారాలపై మారవచ్చు.'
  }
};

export function getTranslation(lang: Language): TranslationDict {
  return translations[lang] || translations.en;
}
