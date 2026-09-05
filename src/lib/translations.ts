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
  continueAsFarmer: string;

  // Navigation
  navHome: string;
  navDashboard: string;
  navFindMarket: string;
  navMarkets: string;
  navPrices: string;
  navBuyers: string;
  navTransport: string;
  navTrends: string;
  navAIInsights: string;
  navHistory: string;
  navAdmin: string;
  navHelp: string;
  navSettings: string;
  
  // Hero & CTAs
  heroTitle: string;
  heroSubtitle: string;
  btnFindBestMarket: string;
  btnExplorePrices: string;
  btnDemoScenario: string;
  startDemoBtn: string;
  
  // Location
  yourLocation: string;
  detectGps: string;
  useCurrentLocationBtn: string;
  enterManuallyBtn: string;
  selectOnMapBtn: string;
  changeLocationBtn: string;
  locationPlaceholder: string;
  searchLocationPlaceholder: string;
  countryLabel: string;
  stateLabel: string;
  districtLabel: string;
  cityTownLabel: string;
  townLabel: string;
  villageLabel: string;
  locationLabel: string;
  farmerNameLabel: string;
  gpsDetected: string;
  locationPermissionDenied: string;
  locationAutoUnavailable: string;
  locationDetectTimeout: string;
  mapProviderNotConfigured: string;
  
  // Crop & Quantity
  selectCrop: string;
  cropLabel: string;
  searchCropPlaceholder: string;
  customCropPlaceholder: string;
  quantity: string;
  quantityLabel: string;
  unit: string;
  unitLabel: string;
  convertedQuintals: string;
  howMuchCropPrompt: string;
  
  // Quality & Grade
  cropQualityTitle: string;
  cropGrade: string;
  gradeLabel: string;
  qualityLabel: string;
  gradeA: string;
  gradeB: string;
  gradeC: string;
  gradeCustom: string;
  moisturePercent: string;
  uploadCropPhoto: string;
  uploadPhotoBtn: string;
  takePhotoBtn: string;
  photoAnalysisNotice: string;
  packagingType: string;
  
  // Transport parameters
  transportSettings: string;
  vehicleType: string;
  ratePerKm: string;
  roundTrip: string;
  loadingCharges: string;
  findTransportBtn: string;
  requestTransportBtn: string;
  transportCostLabel: string;
  otherCostsLabel: string;
  paymentTermsLabel: string;
  
  // Action Buttons
  btnCalculate: string;
  btnCalculating: string;
  nextBtn: string;
  backBtn: string;
  saveBtn: string;
  searchBtn: string;
  selectBtn: string;
  compareBtn: string;
  tryAgainBtn: string;
  deleteBtn: string;
  confirmBtn: string;
  
  // Core results & Market Information
  recommendedBadge: string;
  bestNetReturn: string;
  marketPrice: string;
  priceLabel: string;
  currentPriceLabel: string;
  minPriceLabel: string;
  maxPriceLabel: string;
  modalPriceLabel: string;
  grossRevenue: string;
  transportCost: string;
  otherCharges: string;
  netReturn: string;
  distance: string;
  distanceLabel: string;
  marketNameLabel: string;
  lastUpdatedLabel: string;
  dataSourceLabel: string;
  estimatedTransportLabel: string;
  estimatedNetReturnLabel: string;
  whyThisMarket: string;
  whyThisIsBestLabel: string;
  alternativeOption: string;
  alternativeLabel: string;
  viewDetails: string;
  contactBuyer: string;
  getDirections: string;
  compareAll: string;
  compareAgain: string;
  sendOfferTitle: string;
  buyerLabel: string;
  
  // Ranking Invariant
  ruleNoticeTitle: string;
  ruleNoticeText: string;
  highestPriceNotHighestReturnNotice: string;
  
  // Freshness
  freshnessFresh: string;
  freshnessAging: string;
  freshnessStale: string;
  dataFreshnessLabel: string;
  
  // AI Section
  aiExplanationTitle: string;
  aiAnalysisLabel: string;
  recommendationLabel: string;
  aiFacts: string;
  aiCalculations: string;
  aiEstimates: string;
  aiInsights: string;
  aiRisks: string;
  risksLabel: string;
  limitationsLabel: string;
  confidenceLabel: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  aiUnavailableNotice: string;
  
  // Error Messages
  errLocationUnavailable: string;
  errUnableToDetectLocation: string;
  errNoMarketsFound: string;
  errNoPriceData: string;
  errNetworkUnavailable: string;
  errSomethingWentWrong: string;
  errPleaseTryAgain: string;
  errInsufficientData: string;
  
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
  
  // Demo Mode
  demoModeLabel: string;
  sampleDataLabel: string;
  demoScenarioLabel: string;
  notLiveMarketPricesLabel: string;
  
  // Settings
  settingsLanguage: string;
  settingsLocation: string;
  settingsNotifications: string;
  settingsAccessibility: string;
  settingsTheme: string;
  settingsReducedMotion: string;
  
  // Common Units & Symbols
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
    sihBadge: 'Technology Prototype for SIH26132 • Agriculture, FoodTech & Rural Development',
    demoModeNotice: 'DEMO DATA — SAMPLE VALUES',
    demoModeSub: 'Sample records calibrated for SIH demonstration. Actual APMC mandi rates vary daily.',
    
    welcomeTitle: '🌾 Welcome to KrishiSetu',
    welcomeSubtitle: 'Strengthening market linkages & price discovery for farmers',
    chooseLanguage: 'Choose your preferred language',
    changeLanguageLater: 'You can change this anytime from the top bar or settings.',
    continueBtn: 'Continue',
    onboardingTitle: 'Farmer Profile Setup',
    onboardingSubtitle: 'Set your farm location to instantly compare realistic mandi transport costs.',
    farmerNameOptional: 'Farmer Name (Optional)',
    selectLocationTitle: 'Farm Location',
    startExploringBtn: 'Start Finding Best Market',
    continueAsFarmer: 'Continue as Farmer',

    navHome: 'Home',
    navDashboard: 'Dashboard',
    navFindMarket: 'Find Best Market',
    navMarkets: 'Markets',
    navPrices: 'Market Prices',
    navBuyers: 'Nearby Buyers',
    navTransport: 'Find Transport',
    navTrends: 'Price Trends',
    navAIInsights: 'AI Insights',
    navHistory: 'History',
    navAdmin: 'Admin Panel',
    navHelp: 'How It Works',
    navSettings: 'Settings',
    
    heroTitle: 'Sell Smarter. Earn Better.',
    heroSubtitle: 'Discover better markets for your crop by comparing prices, transport costs, buyer requirements and estimated net returns.',
    btnFindBestMarket: 'Find Best Market',
    btnExplorePrices: 'Explore Market Prices',
    btnDemoScenario: 'Load Demo Scenario (Paddy 10 Quintals)',
    startDemoBtn: 'START DEMO',
    
    yourLocation: 'Your Farm Location',
    detectGps: 'Use Current Location',
    useCurrentLocationBtn: 'Use Current Location',
    enterManuallyBtn: 'Enter Location Manually',
    selectOnMapBtn: 'Select on Map',
    changeLocationBtn: 'Change Location',
    locationPlaceholder: 'Search village, town, or district...',
    searchLocationPlaceholder: 'Search location (e.g. Bhimavaram, Tanuku, Pune)...',
    countryLabel: 'Country',
    stateLabel: 'State',
    districtLabel: 'District',
    cityTownLabel: 'Town / City',
    townLabel: 'Town / City',
    villageLabel: 'Village (Optional)',
    locationLabel: 'Location',
    farmerNameLabel: 'Farmer Name',
    gpsDetected: 'GPS Coordinates Applied',
    locationPermissionDenied: 'Location permission was not granted. Please select your location manually.',
    locationAutoUnavailable: 'Automatic location is unavailable on this device.',
    locationDetectTimeout: 'Unable to detect your location. You can select it manually.',
    mapProviderNotConfigured: 'Map selection requires a configured map provider.',
    
    selectCrop: 'Select Crop',
    cropLabel: 'Crop',
    searchCropPlaceholder: 'Search crop (e.g. Paddy, Tomato, Cotton)...',
    customCropPlaceholder: 'Or type custom crop name...',
    quantity: 'Harvest Quantity',
    quantityLabel: 'Quantity',
    unit: 'Unit',
    unitLabel: 'Unit',
    convertedQuintals: 'Equivalent in Quintals',
    howMuchCropPrompt: 'How much crop do you want to sell?',
    
    cropQualityTitle: 'Crop Quality & Grade',
    cropGrade: 'Quality Grade',
    gradeLabel: 'Grade',
    qualityLabel: 'Quality',
    gradeA: 'Grade A (Premium)',
    gradeB: 'Grade B (Standard)',
    gradeC: 'Grade C (Fair Average)',
    gradeCustom: 'Custom Specification',
    moisturePercent: 'Moisture Percentage (%)',
    uploadCropPhoto: 'Upload Crop Photo',
    uploadPhotoBtn: 'Upload Photo',
    takePhotoBtn: 'Take Photo',
    photoAnalysisNotice: 'AI-assisted quality estimate — not an official certification.',
    packagingType: 'Packaging Type',
    
    transportSettings: 'Transportation & Vehicle Settings',
    vehicleType: 'Transport Vehicle',
    ratePerKm: 'Transport Rate (₹/km)',
    roundTrip: 'Calculate for round trip (Two-way travel)',
    loadingCharges: 'Loading / Unloading per quintal',
    findTransportBtn: 'Explore Transport Directory',
    requestTransportBtn: 'Request Transport',
    transportCostLabel: 'Transport Cost',
    otherCostsLabel: 'Other Costs',
    paymentTermsLabel: 'Payment Terms',
    
    btnCalculate: 'Find Best Market & Net Return',
    btnCalculating: 'Calculating Net Returns & Inquiring AI...',
    nextBtn: 'Next',
    backBtn: 'Back',
    saveBtn: 'Save',
    searchBtn: 'Search',
    selectBtn: 'Select',
    compareBtn: 'Compare',
    tryAgainBtn: 'Try Again',
    deleteBtn: 'Delete',
    confirmBtn: 'Confirm',
    
    recommendedBadge: '⭐ BEST ESTIMATED OPTION',
    bestNetReturn: 'Highest Estimated Net Return',
    marketPrice: 'Market Price',
    priceLabel: 'Price',
    currentPriceLabel: 'Current Price',
    minPriceLabel: 'Minimum Price',
    maxPriceLabel: 'Maximum Price',
    modalPriceLabel: 'Modal Price',
    grossRevenue: 'Gross Revenue',
    transportCost: 'Estimated Transport Cost',
    otherCharges: 'Mandi & Loading Charges',
    netReturn: 'Estimated Net Return',
    distance: 'Distance',
    distanceLabel: 'Distance',
    marketNameLabel: 'Market Name',
    lastUpdatedLabel: 'Last Updated',
    dataSourceLabel: 'Data Source',
    estimatedTransportLabel: 'Estimated Transport',
    estimatedNetReturnLabel: 'Estimated Net Return',
    whyThisMarket: 'Why this market is recommended',
    whyThisIsBestLabel: 'Why this is the best option',
    alternativeOption: 'Alternative Market Option',
    alternativeLabel: 'Alternative Option',
    viewDetails: 'View Details',
    contactBuyer: 'Contact Buyer',
    getDirections: 'Get Directions',
    compareAll: 'Compare All Markets',
    compareAgain: 'Calculate Again',
    sendOfferTitle: 'Send Crop Offer to Buyer',
    buyerLabel: 'Buyer',
    
    ruleNoticeTitle: 'Net Return Optimization Invariant',
    ruleNoticeText: 'We optimize strictly for net earnings in your pocket, not simply the highest market board price. A distant market with high board rates is rejected if transportation costs erode your profit.',
    highestPriceNotHighestReturnNotice: 'Highest Market Price ≠ Highest Net Return',
    
    freshnessFresh: 'Fresh (< 6 hrs ago)',
    freshnessAging: 'Aging (6-24 hrs ago)',
    freshnessStale: 'Stale (> 24 hrs ago)',
    dataFreshnessLabel: 'Data Freshness',
    
    aiExplanationTitle: 'AI Multi-Model Deliberation',
    aiAnalysisLabel: 'AI Analysis',
    recommendationLabel: 'Recommendation',
    aiFacts: 'Verified Facts',
    aiCalculations: 'Deterministic Calculations',
    aiEstimates: 'Estimated Costs',
    aiInsights: 'Strategic Insights',
    aiRisks: 'Key Risks & Precautions',
    risksLabel: 'Risks',
    limitationsLabel: 'Limitations',
    confidenceLabel: 'Confidence',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence',
    aiUnavailableNotice: 'AI analysis is temporarily unavailable. Deterministic comparison remains fully operational.',
    
    errLocationUnavailable: 'Location unavailable.',
    errUnableToDetectLocation: 'Unable to detect location.',
    errNoMarketsFound: 'No markets found for this region and crop.',
    errNoPriceData: 'No market price data is currently available for this crop and location.',
    errNetworkUnavailable: 'Network unavailable.',
    errSomethingWentWrong: 'Something went wrong.',
    errPleaseTryAgain: 'Please try again.',
    errInsufficientData: 'Insufficient data.',
    
    colRank: 'Rank',
    colMarket: 'Market / Mandi',
    colPrice: 'Price (₹/qtl)',
    colDistance: 'Distance',
    colGross: 'Gross Revenue',
    colTransport: 'Transport',
    colCharges: 'Mandi Fee',
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
    forecastTitle: 'Price Trend & Forecast',
    forecastDisclaimer: 'Historical price observations. Future spot auctions depend on arrivals and weather.',
    
    demoModeLabel: 'DEMO MODE — SAMPLE DATA',
    sampleDataLabel: 'Sample Data',
    demoScenarioLabel: 'Demo Scenario — Bhimavaram',
    notLiveMarketPricesLabel: 'Not Live Market Prices',
    
    settingsLanguage: 'Language',
    settingsLocation: 'Location',
    settingsNotifications: 'Notifications',
    settingsAccessibility: 'Accessibility',
    settingsTheme: 'Theme',
    settingsReducedMotion: 'Reduced Motion',
    
    rupeeSymbol: '₹',
    perQuintal: '/ quintal',
    quintals: 'quintals',
    kg: 'kg',
    tonne: 'tonne',
    disclaimerFooter: 'Estimates are based on calibrated regional APMC feeds and standard rural freight formulas. Final auction bids may vary.'
  },

  te: {
    appTitle: 'కృషిసేతు',
    appSubtitle: 'మీ మార్కెట్ తెలుసుకోండి. పోల్చండి. తెలివిగా అమ్మండి.',
    sihBadge: 'SIH26132 సాంకేతిక నమూనా • వ్యవసాయం, ఫుడ్‌టెక్ & గ్రామీణాభివృద్ధి',
    demoModeNotice: 'డెమో మోడ్ — నమూనా డేటా',
    demoModeSub: 'SIH ప్రదర్శన కొరకు సిద్ధం చేసిన నమూనా డేటా. వాస్తవ మార్కెట్ రేట్లు ప్రతిరోజూ మారతాయి.',
    
    welcomeTitle: '🌾 కృషిసేతుకు స్వాగతం',
    welcomeSubtitle: 'రైతులకు మార్కెట్ అనుసంధానం మరియు నికర రాబడి పరిశీలన వేదిక',
    chooseLanguage: 'మీ ప్రాధాన్యత భాషను ఎంచుకోండి',
    changeLanguageLater: 'మీరు దీన్ని తర్వాత ఎప్పుడైనా సెట్టింగ్స్ లేదా పైన ఉన్న బటన్ ద్వారా మార్చుకోవచ్చు.',
    continueBtn: 'కొనసాగించండి',
    onboardingTitle: 'రైతు ప్రొఫైల్ వివరాలు',
    onboardingSubtitle: 'వాస్తవ రవాణా ఖర్చులను లెక్కించేందుకు మీ పొలం ఉన్న ప్రాంతాన్ని ఎంచుకోండి.',
    farmerNameOptional: 'రైతు పేరు (ఐచ్ఛికం)',
    selectLocationTitle: 'మీ ప్రాంతాన్ని ఎంచుకోండి',
    startExploringBtn: 'ఉత్తమ మార్కెట్‌ను కనుగొనండి',
    continueAsFarmer: 'రైతుగా కొనసాగండి',

    navHome: 'హోమ్',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navFindMarket: 'ఉత్తమ మార్కెట్ వెతకండి',
    navMarkets: 'మార్కెట్లు',
    navPrices: 'మార్కెట్ ధరలు',
    navBuyers: 'కొనుగోలుదారులు',
    navTransport: 'రవాణా సౌకర్యం',
    navTrends: 'ధరల సరళి',
    navAIInsights: 'AI సలహాలు',
    navHistory: 'చరిత్ర',
    navAdmin: 'అడ్మిన్ ప్యానెల్',
    navHelp: 'ఇది ఎలా పనిచేస్తుంది',
    navSettings: 'సెట్టింగ్స్',
    
    heroTitle: 'తెలివిగా అమ్మండి. అధిక నికర లాభం పొందండి.',
    heroSubtitle: 'మార్కెట్ ధర, రవాణా ఖర్చులను సరిపోల్చి మీ పంటకు అత్యధిక నికర ఆదాయం ఎక్కడ వస్తుందో ఖచ్చితంగా తెలుసుకోండి.',
    btnFindBestMarket: 'ఉత్తమ మార్కెట్‌ను కనుగొనండి',
    btnExplorePrices: 'మార్కెట్ ధరలు చూడండి',
    btnDemoScenario: 'డెమో దృష్టాంతం (వరి 10 క్వింటాళ్లు)',
    startDemoBtn: 'డెమో ప్రారంభించండి',
    
    yourLocation: 'మీ పొలం ఉన్న ప్రాంతం',
    detectGps: 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    useCurrentLocationBtn: 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    enterManuallyBtn: 'స్థానాన్ని మాన్యువల్గా ఎంచుకోండి',
    selectOnMapBtn: 'మ్యాప్‌లో ఎంచుకోండి',
    changeLocationBtn: 'ప్రాంతాన్ని మార్చండి',
    locationPlaceholder: 'గ్రామం, పట్టణం లేదా జిల్లా వెతకండి...',
    searchLocationPlaceholder: 'స్థానాన్ని వెతకండి (ఉదా: భీమవరం, తణుకు, గుంటూరు)...',
    countryLabel: 'దేశం',
    stateLabel: 'రాష్ట్రం',
    districtLabel: 'జిల్లా',
    cityTownLabel: 'పట్టణం / నగరం',
    townLabel: 'పట్టణం',
    villageLabel: 'గ్రామం (ఐచ్ఛికం)',
    locationLabel: 'స్థానం',
    farmerNameLabel: 'రైతు పేరు',
    gpsDetected: 'GPS కోఆర్డినేట్స్ నమోదయ్యాయి',
    locationPermissionDenied: 'లొకేషన్ అనుమతి లభించలేదు. దయచేసి ప్రాంతాన్ని మాన్యువల్‌గా ఎంచుకోండి.',
    locationAutoUnavailable: 'ఈ పరికరంలో ఆటోమేటిక్ లొకేషన్ అందుబాటులో లేదు.',
    locationDetectTimeout: 'మీ లొకేషన్‌ను గుర్తించడం సాధ్యపడలేదు. మీరు మాన్యువల్‌గా ఎంచుకోవచ్చు.',
    mapProviderNotConfigured: 'మ్యాప్ ప్రదర్శనకు మ్యాప్ ప్రొవైడర్ సెటప్ అవసరం.',
    
    selectCrop: 'మీ పంటను ఎంచుకోండి',
    cropLabel: 'పంట',
    searchCropPlaceholder: 'పంట పేరు వెతకండి (ఉదా: వరి, మొక్కజొన్న, పత్తి)...',
    customCropPlaceholder: 'లేదా ఇతర పంట పేరు నమోదు చేయండి...',
    quantity: 'పంట పరిమాణం',
    quantityLabel: 'పరిమాణం',
    unit: 'కొలత ప్రమాణం',
    unitLabel: 'ప్రమాణం',
    convertedQuintals: 'క్వింటాళ్లలో సమానం',
    howMuchCropPrompt: 'మీరు ఎంత పంటను అమ్మాలనుకుంటున్నారు?',
    
    cropQualityTitle: 'పంట నాణ్యత మరియు గ్రేడ్',
    cropGrade: 'నాణ్యత గ్రేడ్',
    gradeLabel: 'గ్రేడ్',
    qualityLabel: 'నాణ్యత',
    gradeA: 'గ్రేడ్ A (ఉత్తమ ప్రీమియం)',
    gradeB: 'గ్రేడ్ B (ప్రామాణికం)',
    gradeC: 'గ్రేడ్ C (సాధారణ సగటు)',
    gradeCustom: 'కస్టమ్ నిర్దేశం',
    moisturePercent: 'తేమ శాతం (%)',
    uploadCropPhoto: 'పంట ఫోటో అప్‌లోడ్ చేయండి',
    uploadPhotoBtn: 'ఫోటో అప్‌లోడ్',
    takePhotoBtn: 'ఫోటో తీయండి',
    photoAnalysisNotice: 'AI ఆధారిత నాణ్యత అంచనా — ఇది అధికారిక సర్టిఫికేట్ కాదు.',
    packagingType: 'ప్యాకింగ్ రకం',
    
    transportSettings: 'రవాణా వాహన వివరాలు',
    vehicleType: 'రవాణా వాహనం',
    ratePerKm: 'రవాణా రేటు (₹/కి.మీ)',
    roundTrip: 'రాను-పోను రెండింటికీ లెక్కించండి',
    loadingCharges: 'కూలీ / లోడింగ్ ఛార్జీలు (క్వింటాలుకు)',
    findTransportBtn: 'రవాణాదారుల డైరెక్టరీ చూడండి',
    requestTransportBtn: 'రవాణా బుక్ చేసుకోండి',
    transportCostLabel: 'రవాణా ఖర్చు',
    otherCostsLabel: 'ఇతర ఖర్చులు',
    paymentTermsLabel: 'చెల్లింపు నిబంధనలు',
    
    btnCalculate: 'ఉత్తమ మార్కెట్ మరియు నికర లాభం లెక్కించండి',
    btnCalculating: 'నికర ఆదాయాన్ని లెక్కిస్తున్నాము...',
    nextBtn: 'తదుపరి',
    backBtn: 'వెనుకకు',
    saveBtn: 'భద్రపరచు',
    searchBtn: 'వెతకండి',
    selectBtn: 'ఎంచుకోండి',
    compareBtn: 'పోల్చండి',
    tryAgainBtn: 'మళ్లీ ప్రయత్నించండి',
    deleteBtn: 'తొలగించు',
    confirmBtn: 'ధృవీకరించండి',
    
    recommendedBadge: '⭐ ఉత్తమ సిఫార్సు మార్కెట్',
    bestNetReturn: 'అత్యధిక అంచనా నికర ఆదాయం',
    marketPrice: 'మార్కెట్ అమ్మకం ధర',
    priceLabel: 'ధర',
    currentPriceLabel: 'ప్రస్తుత ధర',
    minPriceLabel: 'కనిష్ట ధర',
    maxPriceLabel: 'గరిష్ట ధర',
    modalPriceLabel: 'సగటు మార్కెట్ ధర',
    grossRevenue: 'మొత్తం అమ్మకం విలువ',
    transportCost: 'అంచనా వేసిన రవాణా ఖర్చు',
    otherCharges: 'మండి రుసుము & లోడింగ్ ఖర్చులు',
    netReturn: 'అంచనా నికర ఆదాయం',
    distance: 'దూరం',
    distanceLabel: 'దూరం',
    marketNameLabel: 'మార్కెట్ పేరు',
    lastUpdatedLabel: 'డేటా చివరిసారిగా నవీకరించబడింది',
    dataSourceLabel: 'డేటా మూలం',
    estimatedTransportLabel: 'అంచనా రవాణా ఖర్చు',
    estimatedNetReturnLabel: 'అంచనా నికర ఆదాయం',
    whyThisMarket: 'ఈ మార్కెట్‌ను ఎందుకు ఎంచుకున్నాము',
    whyThisIsBestLabel: 'ఇది ఎందుకు ఉత్తమ ఎంపిక?',
    alternativeOption: 'ప్రత్యామ్నాయ మార్కెట్ ఎంపిక',
    alternativeLabel: 'ప్రత్యామ్నాయ ఎంపిక',
    viewDetails: 'వివరాలు చూడండి',
    contactBuyer: 'కొనుగోలుదారుని సంప్రదించండి',
    getDirections: 'దారి తెలుసుకోండి',
    compareAll: 'మార్కెట్లను పోల్చండి',
    compareAgain: 'మళ్ళీ లెక్కించండి',
    sendOfferTitle: 'కొనుగోలుదారునికి ఆఫర్ పంపండి',
    buyerLabel: 'కొనుగోలుదారు',
    
    ruleNoticeTitle: 'నికర లాభ ఆప్టిమైజేషన్ సూత్రం',
    ruleNoticeText: 'కేవలం మార్కెట్ బోర్డు మీద ఉన్న ఎక్కువ ధరను చూసి కాకుండా, రవాణా మరియు ఇతర ఖర్చులు తీసివేసిన తర్వాత రైతు జేబులోకి వచ్చే అసలైన నికర లాభాన్ని మాత్రమే మేము సిఫార్సు చేస్తాము.',
    highestPriceNotHighestReturnNotice: 'అత్యధిక బోర్డు ధర = అత్యధిక నికర లాభం కాదు',
    
    freshnessFresh: 'తాజా (< 6 గంటల క్రితం)',
    freshnessAging: 'మధ్యస్థం (6-24 గంటల క్రితం)',
    freshnessStale: 'పాతది (> 24 గంటల క్రితం)',
    dataFreshnessLabel: 'డేటా తాజాదనం',
    
    aiExplanationTitle: 'AI విశ్లేషణ & వివరణ',
    aiAnalysisLabel: 'AI విశ్లేషణ',
    recommendationLabel: 'సిఫార్సు',
    aiFacts: 'ధృవీకరించబడిన వాస్తవాలు',
    aiCalculations: 'గణిత సంబంధిత లెక్కింపులు',
    aiEstimates: 'అంచనా వేసిన ఖర్చులు',
    aiInsights: 'వ్యూహాత్మక సలహాలు',
    aiRisks: 'ప్రధాన నష్టభయాలు & జాగ్రత్తలు',
    risksLabel: 'నష్టభయాలు',
    limitationsLabel: 'పరిమితులు',
    confidenceLabel: 'విశ్వసనీయత',
    confidenceHigh: 'అధిక విశ్వసనీయత',
    confidenceMedium: 'మధ్యమ విశ్వసనీయత',
    confidenceLow: 'తక్కువ విశ్వసనీయత',
    aiUnavailableNotice: 'AI విశ్లేషణ ప్రస్తుతం అందుబాటులో లేదు. ప్రామాణిక మార్కెట్ మరియు నికర లాభ గణనలు పూర్తిగా పనిచేస్తున్నాయి.',
    
    errLocationUnavailable: 'లొకేషన్ సమాచారం అందుబాటులో లేదు.',
    errUnableToDetectLocation: 'లొకేషన్‌ను గుర్తించడం సాధ్యపడలేదు.',
    errNoMarketsFound: 'ఈ ప్రాంతం మరియు పంటకు ఎటువంటి మార్కెట్లు లభించలేదు.',
    errNoPriceData: 'ఈ పంట మరియు ప్రాంతానికి ప్రస్తుతం మార్కెట్ ధరల సమాచారం అందుబాటులో లేదు.',
    errNetworkUnavailable: 'ఇంటర్నెట్ నెట్‌వర్క్ అందుబాటులో లేదు.',
    errSomethingWentWrong: 'ఏదో పొరపాటు జరిగింది.',
    errPleaseTryAgain: 'దయచేసి మళ్లీ ప్రయత్నించండి.',
    errInsufficientData: 'తగినంత సమాచారం లేదు.',
    
    colRank: 'ర్యాంక్',
    colMarket: 'మార్కెట్ / మండి',
    colPrice: 'ధర (₹/క్విం)',
    colDistance: 'దూరం',
    colGross: 'మొత్తం రాబడి',
    colTransport: 'రవాణా ఖర్చు',
    colCharges: 'మండి రుసుము',
    colNetReturn: 'నికర ఆదాయం',
    colPayment: 'చెల్లింపు నిబంధనలు',
    colAction: 'చర్య',
    
    trend7d: '7-రోజుల సరళి',
    trend30d: '30-రోజుల సరళి',
    trend90d: '90-రోజుల సరళి',
    avgPrice: 'సగటు ధర',
    highestPrice: 'అత్యధిక ధర',
    lowestPrice: 'అత్యల్ప ధర',
    volatility: 'ధరల హెచ్చుతగ్గులు',
    forecastTitle: 'ధరల సరళి మరియు అంచనా',
    forecastDisclaimer: 'చారిత్రక మార్కెట్ గణాంకాల ఆధారంగా రూపొందించిన సూచిక. వాస్తవ వేలం ధరలు మార్కెట్ రాకలపై ఆధారపడి ఉంటాయి.',
    
    demoModeLabel: 'డెమో మోడ్ — నమూనా డేటా',
    sampleDataLabel: 'నమూనా డేటా',
    demoScenarioLabel: 'డెమో దృష్టాంతం — భీమవరం',
    notLiveMarketPricesLabel: 'ప్రత్యక్ష మార్కెట్ ధరలు కావు',
    
    settingsLanguage: 'భాష',
    settingsLocation: 'ప్రాంతం',
    settingsNotifications: 'నోటిఫికేషన్లు',
    settingsAccessibility: 'సౌలభ్యం (Accessibility)',
    settingsTheme: 'థీమ్',
    settingsReducedMotion: 'తక్కువ కదలికలు (Reduced Motion)',
    
    rupeeSymbol: '₹',
    perQuintal: '/ క్వింటాలు',
    quintals: 'క్వింటాళ్లు',
    kg: 'కిలోలు',
    tonne: 'టన్ను',
    disclaimerFooter: 'సిఫార్సులు అందుబాటులో ఉన్న మార్కెట్ డేటా మరియు రవాణా రేట్లపై ఆధారపడి ఉంటాయి. వాస్తవ మార్కెట్లలో ధరలు బేరసారాలపై మారవచ్చు.'
  },

  hi: {
    appTitle: 'कृषिसेतु',
    appSubtitle: 'अपना बाज़ार जानें। विकल्पों की तुलना करें। समझदारी से बेचें।',
    sihBadge: 'SIH26132 तकनीकी प्रोटोटाइप • कृषि एवं ग्रामीण विकास',
    demoModeNotice: 'डेमो मोड — नमूना डेटा',
    demoModeSub: 'SIH प्रदर्शन हेतु अंशांकित नमूना डेटा। वास्तविक मंडी दरें दैनिक रूप से भिन्न होती हैं।',
    
    welcomeTitle: '🌾 कृषिसेतु में आपका स्वागत है',
    welcomeSubtitle: 'किसानों के लिए बाज़ार संपर्क और शुद्ध आय का पारदर्शी साधन',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
    changeLanguageLater: 'आप इसे शीर्ष बार या सेटिंग्स से कभी भी बदल सकते हैं।',
    continueBtn: 'आगे बढ़ें',
    onboardingTitle: 'किसान प्रोफ़ाइल सेटअप',
    onboardingSubtitle: 'यथार्थवादी मंडी परिवहन लागत की तुलना करने के लिए अपना खेत का स्थान चुनें।',
    farmerNameOptional: 'किसान का नाम (वैकल्पिक)',
    selectLocationTitle: 'खेत का स्थान चुनें',
    startExploringBtn: 'सर्वोत्तम बाज़ार खोजें',
    continueAsFarmer: 'किसान के रूप में जारी रखें',

    navHome: 'होम',
    navDashboard: 'डैशबोर्ड',
    navFindMarket: 'बाज़ार खोजें',
    navMarkets: 'मंडियाँ',
    navPrices: 'मंडी भाव',
    navBuyers: 'निकटतम खरीदार',
    navTransport: 'परिवहन खोजें',
    navTrends: 'मूल्य रुझान',
    navAIInsights: 'AI सलाह',
    navHistory: 'इतिहास',
    navAdmin: 'एडमिन पैनल',
    navHelp: 'यह कैसे काम करता है',
    navSettings: 'सेटिंग्स',
    
    heroTitle: 'समझदारी से बेचें। अधिक लाभ कमाएं।',
    heroSubtitle: 'मंडी भाव और मालभाड़ा खर्च की तुलना कर जानें कि आपकी फसल पर अधिकतम शुद्ध मुनाफा कहाँ मिलेगा।',
    btnFindBestMarket: 'सर्वोत्तम बाज़ार खोजें',
    btnExplorePrices: 'मंडी भाव देखें',
    btnDemoScenario: 'डेमो परिदृश्य (धान 10 क्विंटल)',
    startDemoBtn: 'डेमो शुरू करें',
    
    yourLocation: 'आपके खेत का स्थान',
    detectGps: 'वर्तमान स्थान का उपयोग करें',
    useCurrentLocationBtn: 'वर्तमान स्थान का उपयोग करें',
    enterManuallyBtn: 'स्थान मैन्युअल रूप से दर्ज करें',
    selectOnMapBtn: 'मानचित्र पर चुनें',
    changeLocationBtn: 'स्थान बदलें',
    locationPlaceholder: 'गाँव, कस्बा या ज़िला खोजें...',
    searchLocationPlaceholder: 'स्थान खोजें (उदा. भीमावरम, नासिक, पुणे)...',
    countryLabel: 'देश',
    stateLabel: 'राज्य',
    districtLabel: 'ज़िला',
    cityTownLabel: 'शहर / कस्बा',
    townLabel: 'कस्बा',
    villageLabel: 'गाँव (वैकल्पिक)',
    locationLabel: 'स्थान',
    farmerNameLabel: 'किसान का नाम',
    gpsDetected: 'GPS निर्देशांक लागू किए गए',
    locationPermissionDenied: 'स्थान अनुमति नहीं मिली। कृपया मैन्युअल रूप से अपना स्थान चुनें।',
    locationAutoUnavailable: 'इस उपकरण पर स्वचालित स्थान पहचान उपलब्ध नहीं है।',
    locationDetectTimeout: 'स्थान का पता लगाने में असमर्थ। आप इसे मैन्युअल रूप से चुन सकते हैं।',
    mapProviderNotConfigured: 'मानचित्र प्रदर्शन हेतु मानचित्र सेवा विन्यास आवश्यक है।',
    
    selectCrop: 'फसल का चयन करें',
    cropLabel: 'फसल',
    searchCropPlaceholder: 'फसल का नाम खोजें (उदा. धान, गेहूँ, टमाटर)...',
    customCropPlaceholder: 'या अन्य फसल का नाम लिखें...',
    quantity: 'फसल मात्रा',
    quantityLabel: 'मात्रा',
    unit: 'इकाई',
    unitLabel: 'इकाई',
    convertedQuintals: 'क्विंटल में समतुल्य',
    howMuchCropPrompt: 'आप कितनी फसल बेचना चाहते हैं?',
    
    cropQualityTitle: 'फसल गुणवत्ता एवं ग्रेड',
    cropGrade: 'गुणवत्ता ग्रेड',
    gradeLabel: 'ग्रेड',
    qualityLabel: 'गुणवत्ता',
    gradeA: 'ग्रेड A (प्रीमियम)',
    gradeB: 'ग्रेड B (मानक)',
    gradeC: 'ग्रेड C (औसत)',
    gradeCustom: 'कस्टम विनिर्देश',
    moisturePercent: 'नमी प्रतिशत (%)',
    uploadCropPhoto: 'फसल की तस्वीर अपलोड करें',
    uploadPhotoBtn: 'फोटो अपलोड करें',
    takePhotoBtn: 'फोटो खींचे',
    photoAnalysisNotice: 'AI-सहायता प्राप्त गुणवत्ता अनुमान — यह आधिकारिक प्रमाण पत्र नहीं है।',
    packagingType: 'पैकेजिंग प्रकार',
    
    transportSettings: 'परिवहन एवं वाहन सेटिंग्स',
    vehicleType: 'परिवहन वाहन',
    ratePerKm: 'भाड़ा दर (₹/किमी)',
    roundTrip: 'आने-जाने दोनों का भाड़ा जोड़ें',
    loadingCharges: 'हम्बाली / लोडिंग चार्ज प्रति क्विंटल',
    findTransportBtn: 'ट्रांसपोर्टर डायरेक्टरी देखें',
    requestTransportBtn: 'परिवहन बुक करें',
    transportCostLabel: 'परिवहन लागत',
    otherCostsLabel: 'अन्य खर्च',
    paymentTermsLabel: 'भुगतान की शर्तें',
    
    btnCalculate: 'सर्वोत्तम बाज़ार एवं शुद्ध आय की गणना करें',
    btnCalculating: 'शुद्ध आय की गणना की जा रही है...',
    nextBtn: 'आगे',
    backBtn: 'पीछे',
    saveBtn: 'सहेजें',
    searchBtn: 'खोजें',
    selectBtn: 'चुनें',
    compareBtn: 'तुलना करें',
    tryAgainBtn: 'पुनः प्रयास करें',
    deleteBtn: 'हटाएं',
    confirmBtn: 'पुष्टि करें',
    
    recommendedBadge: '⭐ सर्वोत्तम अनुशंसित विकल्प',
    bestNetReturn: 'उच्चतम अनुमानित शुद्ध आय',
    marketPrice: 'मंडी भाव',
    priceLabel: 'भाव',
    currentPriceLabel: 'वर्तमान भाव',
    minPriceLabel: 'न्यूनतम भाव',
    maxPriceLabel: 'अधिकतम भाव',
    modalPriceLabel: 'मॉडल भाव',
    grossRevenue: 'कुल बिक्री मूल्य',
    transportCost: 'अनुमानित परिवहन लागत',
    otherCharges: 'मंडी शुल्क व लोडिंग खर्च',
    netReturn: 'अनुमानित शुद्ध आय',
    distance: 'दूरी',
    distanceLabel: 'दूरी',
    marketNameLabel: 'मंडी का नाम',
    lastUpdatedLabel: 'अंतिम अपडेट',
    dataSourceLabel: 'डेटा स्रोत',
    estimatedTransportLabel: 'अनुमानित परिवहन',
    estimatedNetReturnLabel: 'अनुमानित शुद्ध आय',
    whyThisMarket: 'यह मंडी क्यों अनुशंसित है',
    whyThisIsBestLabel: 'यह सबसे अच्छा विकल्प क्यों है?',
    alternativeOption: 'वैकल्पिक मंडी विकल्प',
    alternativeLabel: 'वैकल्पिक विकल्प',
    viewDetails: 'विवरण देखें',
    contactBuyer: 'खरीदार से संपर्क करें',
    getDirections: 'रास्ता देखें',
    compareAll: 'सभी मंडियों की तुलना करें',
    compareAgain: 'पुनः गणना करें',
    sendOfferTitle: 'खरीदार को फसल का प्रस्ताव भेजें',
    buyerLabel: 'खरीदार',
    
    ruleNoticeTitle: 'शुद्ध आय अनुकूलन सिद्धांत',
    ruleNoticeText: 'हम केवल बोर्ड के सबसे ऊंचे भाव की बजाय मालभाड़ा और अन्य खर्च घटाकर आपकी जेब में आने वाले वास्तविक शुद्ध मुनाफे को प्राथमिकता देते हैं।',
    highestPriceNotHighestReturnNotice: 'उच्चतम मंडी भाव ≠ उच्चतम शुद्ध आय',
    
    freshnessFresh: 'ताज़ा (< 6 घंटे पूर्व)',
    freshnessAging: 'मध्यम (6-24 घंटे पूर्व)',
    freshnessStale: 'पुराना (> 24 घंटे पूर्व)',
    dataFreshnessLabel: 'डेटा ताजगी',
    
    aiExplanationTitle: 'AI बहु-मॉडल विश्लेषण',
    aiAnalysisLabel: 'AI विश्लेषण',
    recommendationLabel: 'सिफारिश',
    aiFacts: 'सत्यापित तथ्य',
    aiCalculations: 'गणितीय गणनाएं',
    aiEstimates: 'अनुमानित लागत',
    aiInsights: 'रणनीतिक सुझाव',
    aiRisks: 'मुख्य जोखिम एवं सावधानियां',
    risksLabel: 'जोखिम',
    limitationsLabel: 'सीमाएं',
    confidenceLabel: 'विश्वसनीयता',
    confidenceHigh: 'उच्च विश्वसनीयता',
    confidenceMedium: 'मध्यम विश्वसनीयता',
    confidenceLow: 'कम विश्वसनीयता',
    aiUnavailableNotice: 'AI विश्लेषण अस्थायी रूप से अनुपलब्ध है। गणितीय तुलना और शुद्ध लाभ गणना पूरी तरह चालू है।',
    
    errLocationUnavailable: 'स्थान उपलब्ध नहीं है।',
    errUnableToDetectLocation: 'स्थान की पहचान करने में असमर्थ।',
    errNoMarketsFound: 'इस क्षेत्र और फसल के लिए कोई मंडी नहीं मिली।',
    errNoPriceData: 'इस फसल और स्थान के लिए कोई मंडी भाव उपलब्ध नहीं है।',
    errNetworkUnavailable: 'इंटरनेट नेटवर्क अनुपलब्ध है।',
    errSomethingWentWrong: 'कुछ गड़बड़ हो गई।',
    errPleaseTryAgain: 'कृपया पुनः प्रयास करें।',
    errInsufficientData: 'अपर्याप्त डेटा।',
    
    colRank: 'रैंक',
    colMarket: 'मंडी / बाज़ार',
    colPrice: 'भाव (₹/क्विंटल)',
    colDistance: 'दूरी',
    colGross: 'कुल मूल्य',
    colTransport: 'परिवहन भाड़ा',
    colCharges: 'मंडी शुल्क',
    colNetReturn: 'शुद्ध लाभ',
    colPayment: 'भुगतान शर्तें',
    colAction: 'कार्य',
    
    trend7d: '7-दिन का रुझान',
    trend30d: '30-दिन का रुझान',
    trend90d: '90-दिन का रुझान',
    avgPrice: 'औसत भाव',
    highestPrice: 'उच्चतम भाव',
    lowestPrice: 'न्यूनतम भाव',
    volatility: 'उतार-चढ़ाव',
    forecastTitle: 'मूल्य रुझान व सांख्यिकीय पूर्वानुमान',
    forecastDisclaimer: 'उपलब्ध ऐतिहासिक आंकड़ों पर आधारित। वास्तविक नीलामी दरें आवक और मांग पर निर्भर करती हैं।',
    
    demoModeLabel: 'डेमो मोड — नमूना डेटा',
    sampleDataLabel: 'नमूना डेटा',
    demoScenarioLabel: 'डेमो परिदृश्य — भीमावरम',
    notLiveMarketPricesLabel: 'प्रत्यक्ष मंडी भाव नहीं',
    
    settingsLanguage: 'भाषा',
    settingsLocation: 'स्थान',
    settingsNotifications: 'सूचनाएं',
    settingsAccessibility: 'सुलभता (Accessibility)',
    settingsTheme: 'थीम',
    settingsReducedMotion: 'कम गति (Reduced Motion)',
    
    rupeeSymbol: '₹',
    perQuintal: '/ क्विंटल',
    quintals: 'क्विंटल',
    kg: 'किलो',
    tonne: 'टन',
    disclaimerFooter: 'अनुशंसाएं उपलब्ध मंडी डेटा और सामान्य मालभाड़ा दरों पर आधारित हैं।'
  },

  mr: {
    appTitle: 'कृषीसेतू',
    appSubtitle: 'आपला बाजार ओळखा. पर्यायांची तुलना करा. हुशारीने विक्री करा.',
    sihBadge: 'SIH26132 तांत्रिक नमुना • महाराष्ट्र शासन कृषी उपक्रम',
    demoModeNotice: 'डेमो मोड — नमुना डेटा',
    demoModeSub: 'SIH सादरीकरणासाठी कॅलिब्रेट केलेला डेटा. प्रत्यक्षात रोजच्या लिलावानुसार दर बदलतात.',
    
    welcomeTitle: '🌾 कृषीसेतू मध्ये आपले स्वागत आहे',
    welcomeSubtitle: 'शेतकऱ्यांसाठी थेट बाजारपेठ आणि निव्वळ नफा पडताळणीचे व्यासपीठ',
    chooseLanguage: 'आपली पसंतीची भाषा निवडा',
    changeLanguageLater: 'तुम्ही ही भाषा कधीही बदलू शकता.',
    continueBtn: 'पुढे जा',
    onboardingTitle: 'शेतकरी प्रोफाइल तपशील',
    onboardingSubtitle: 'वास्तविक वाहतूक खर्च काढण्यासाठी आपल्या शेताचे ठिकाण निवडा.',
    farmerNameOptional: 'शेतकऱ्याचे नाव (पर्यायी)',
    selectLocationTitle: 'शेताचे ठिकाण निवडा',
    startExploringBtn: 'सर्वोत्कृष्ट बाजार शोधा',
    continueAsFarmer: 'शेतकरी म्हणून पुढे जा',

    navHome: 'मुख्यपृष्ठ',
    navDashboard: 'डॅशबोर्ड',
    navFindMarket: 'बाजार शोधा',
    navMarkets: 'बाजारपेठा',
    navPrices: 'बाजारभाव',
    navBuyers: 'जवळचे व्यापारी',
    navTransport: 'वाहतूक शोधा',
    navTrends: 'दर ट्रेंड्स',
    navAIInsights: 'AI सल्ला',
    navHistory: 'इतिहास',
    navAdmin: 'प्रशासक पॅनेल',
    navHelp: 'हे कसे कार्य करते',
    navSettings: 'सेटिंग्ज',
    
    heroTitle: 'हुशारीने विक्री करा. जास्त निव्वळ नफा मिळवा.',
    heroSubtitle: 'बाजारभाव आणि वाहतूक खर्चाची तुलना करून आपल्या पिकाला प्रत्यक्ष हातात किती नफा मिळेल ते अचूक जाणून घ्या.',
    btnFindBestMarket: 'सर्वोत्कृष्ट बाजार शोधा',
    btnExplorePrices: 'बाजारभाव तपासा',
    btnDemoScenario: 'डेमो परिस्थिती (भात/धान १० क्विंटल)',
    startDemoBtn: 'डेमो सुरू करा',
    
    yourLocation: 'आपल्या शेताचे ठिकाण',
    detectGps: 'सध्याचे स्थान वापरा',
    useCurrentLocationBtn: 'सध्याचे स्थान वापरा',
    enterManuallyBtn: 'स्थान स्वतः नोंदवा',
    selectOnMapBtn: 'नकाशावर निवडा',
    changeLocationBtn: 'स्थान बदला',
    locationPlaceholder: 'गाव, तालुका किंवा जिल्हा शोधा...',
    searchLocationPlaceholder: 'स्थान शोधा (उदा. लासलगाव, पिंपळगाव, पुणे)...',
    countryLabel: 'देश',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    cityTownLabel: 'शहर / तालुका',
    townLabel: 'तालुका / शहर',
    villageLabel: 'गाव (पर्यायी)',
    locationLabel: 'स्थान',
    farmerNameLabel: 'शेतकऱ्याचे नाव',
    gpsDetected: 'GPS स्थान निश्चित झाले',
    locationPermissionDenied: 'स्थानाची परवानगी मिळाली नाही. कृपया स्वतः स्थान निवडा.',
    locationAutoUnavailable: 'या डिव्हाइसवर स्वयंचलित स्थान उपलब्ध नाही.',
    locationDetectTimeout: 'स्थान शोधता आले नाही. तुम्ही स्वतः नोंदवू शकता.',
    mapProviderNotConfigured: 'नकाशा पाहण्यासाठी मॅप प्रदाता कॉन्फिगरेशन आवश्यक आहे.',
    
    selectCrop: 'पिक निवडा',
    cropLabel: 'पिक',
    searchCropPlaceholder: 'पिकाचे नाव शोधा (उदा. कांदा, सोयाबीन, कापूस)...',
    customCropPlaceholder: 'किंवा इतर पिकाचे नाव टाका...',
    quantity: 'पिकाचे प्रमाण',
    quantityLabel: 'प्रमाण',
    unit: 'एकक',
    unitLabel: 'एकक',
    convertedQuintals: 'क्विंटल मधील समतुल्य',
    howMuchCropPrompt: 'तुम्हाला किती पिक विकायचे आहे?',
    
    cropQualityTitle: 'पिकाची प्रत आणि गुणवत्ता',
    cropGrade: 'गुणवत्ता ग्रेड',
    gradeLabel: 'ग्रेड',
    qualityLabel: 'गुणवत्ता',
    gradeA: 'ग्रेड A (उत्कृष्ट)',
    gradeB: 'ग्रेड B (मध्यम)',
    gradeC: 'ग्रेड C (साधारण)',
    gradeCustom: 'कस्टम तपशील',
    moisturePercent: 'ओलावा प्रमाण (%)',
    uploadCropPhoto: 'पिकाचा फोटो अपलोड करा',
    uploadPhotoBtn: 'फोटो अपलोड करा',
    takePhotoBtn: 'फोटो काढा',
    photoAnalysisNotice: 'AI द्वारे अंदाजित गुणवत्ता — हे अधिकृत प्रमाणपत्र नाही.',
    packagingType: 'पॅकेजिंग प्रकार',
    
    transportSettings: 'वाहतूक व वाहन तपशील',
    vehicleType: 'वाहतूक वाहन',
    ratePerKm: 'भाडे दर (₹/किमी)',
    roundTrip: 'येण्या-जाण्याचे दोन्ही भाडे धरा',
    loadingCharges: 'हमाली व तोलाई प्रति क्विंटल',
    findTransportBtn: 'वाहतूकदार सूची पहा',
    requestTransportBtn: 'वाहतूक बुक करा',
    transportCostLabel: 'वाहतूक खर्च',
    otherCostsLabel: 'इतर खर्च',
    paymentTermsLabel: 'पेमेंट अटी',
    
    btnCalculate: 'सर्वोत्कृष्ट बाजार आणि नफा शोधा',
    btnCalculating: 'निव्वळ नफ्याची मोजणी सुरू आहे...',
    nextBtn: 'पुढील',
    backBtn: 'मागे',
    saveBtn: 'जतन करा',
    searchBtn: 'शोधा',
    selectBtn: 'निवडा',
    compareBtn: 'तुलना करा',
    tryAgainBtn: 'पुन्हा प्रयत्न करा',
    deleteBtn: 'हटवा',
    confirmBtn: 'निश्चित करा',
    
    recommendedBadge: '⭐ सर्वोत्कृष्ट शिफारस केलेला पर्याय',
    bestNetReturn: 'सर्वात जास्त निव्वळ नफा',
    marketPrice: 'बाजारभाव',
    priceLabel: 'भाव',
    currentPriceLabel: 'सध्याचा भाव',
    minPriceLabel: 'किमान भाव',
    maxPriceLabel: 'कमाल भाव',
    modalPriceLabel: 'सरासरी भाव',
    grossRevenue: 'एकूण विक्री मूल्य',
    transportCost: 'अंदाजित वाहतूक खर्च',
    otherCharges: 'बाजार समिती व तोलाई खर्च',
    netReturn: 'हातात येणारा निव्वळ नफा',
    distance: 'अंतर',
    distanceLabel: 'अंतर',
    marketNameLabel: 'बाजार समितीचे नाव',
    lastUpdatedLabel: 'शेवटचे अपडेट',
    dataSourceLabel: 'डेटा स्रोत',
    estimatedTransportLabel: 'अंदाजित वाहतूक',
    estimatedNetReturnLabel: 'अंदाजित निव्वळ नफा',
    whyThisMarket: 'हा बाजार का शिफारस केला आहे',
    whyThisIsBestLabel: 'हा सर्वोत्कृष्ट पर्याय का आहे?',
    alternativeOption: 'पर्यायी बाजार पर्याय',
    alternativeLabel: 'पर्यायी पर्याय',
    viewDetails: 'तपशील पहा',
    contactBuyer: 'व्यापाऱ्याशी संपर्क साधा',
    getDirections: 'रस्ता पहा',
    compareAll: 'सर्व बाजारांची तुलना करा',
    compareAgain: 'पुन्हा हिशोब करा',
    sendOfferTitle: 'व्यापाऱ्याला मालाची ऑफर पाठवा',
    buyerLabel: 'व्यापारी',
    
    ruleNoticeTitle: 'निव्वळ नफा अनुकूलन नियम',
    ruleNoticeText: 'केवळ बोर्डवरील जास्त भावावर न भुलता, वाहतूक व इतर खर्च वजा करून शेतकऱ्याच्या पदरात पडणारा प्रत्यक्ष निव्वळ नफा शोधणे हेच आमचे सूत्र आहे.',
    highestPriceNotHighestReturnNotice: 'जास्त बाजारभाव म्हणजे जास्त निव्वळ नफा नव्हे',
    
    freshnessFresh: 'ताजा (< ६ तास जुना)',
    freshnessAging: 'मध्यम (६-२४ तास जुना)',
    freshnessStale: 'जुना (> २४ तास जुना)',
    dataFreshnessLabel: 'डेटा ताजेपणा',
    
    aiExplanationTitle: 'AI बहु-मॉडेल विश्लेषण',
    aiAnalysisLabel: 'AI विश्लेषण',
    recommendationLabel: 'शिफारस',
    aiFacts: 'सत्यापित तथ्ये',
    aiCalculations: 'गणिती हिशोब',
    aiEstimates: 'अंदाजित खर्च',
    aiInsights: 'व्यावसायिक सल्ले',
    aiRisks: 'महत्त्वाच्या जोखीमी व दक्षता',
    risksLabel: 'जोखीम',
    limitationsLabel: 'मर्यादा',
    confidenceLabel: 'विश्वासार्हता',
    confidenceHigh: 'उच्च विश्वासार्हता',
    confidenceMedium: 'मध्यम विश्वासार्हता',
    confidenceLow: 'कमी विश्वासार्हता',
    aiUnavailableNotice: 'AI विश्लेषण तात्पुरते अनुपलब्ध आहे. गणिती तुलना आणि प्रत्यक्ष नफा मोजणी पूर्णपणे सुरू आहे.',
    
    errLocationUnavailable: 'स्थान उपलब्ध नाही.',
    errUnableToDetectLocation: 'स्थान ओळखता आले नाही.',
    errNoMarketsFound: 'या भागासाठी आणि पिकासाठी कोणतीही बाजारपेठ आढळली नाही.',
    errNoPriceData: 'या पिकासाठी आणि स्थानासाठी सध्या कोणतेही बाजारभाव उपलब्ध नाहीत.',
    errNetworkUnavailable: 'नेटवर्क उपलब्ध नाही.',
    errSomethingWentWrong: 'काहीतरी चूक झाली.',
    errPleaseTryAgain: 'कृपया पुन्हा प्रयत्न करा.',
    errInsufficientData: 'अपुरा डेटा.',
    
    colRank: 'क्रमांक',
    colMarket: 'कृषी उत्पन्न बाजार समिती',
    colPrice: 'भाव (₹/क्विंटल)',
    colDistance: 'अंतर',
    colGross: 'एकूण रक्कम',
    colTransport: 'वाहतूक भाडे',
    colCharges: 'मंडी सेस',
    colNetReturn: 'निव्वळ नफा',
    colPayment: 'पेमेंट अटी',
    colAction: 'कृती',
    
    trend7d: '७-दिवसीय कल',
    trend30d: '३०-दिवसीय कल',
    trend90d: '९०-दिवसीय कल',
    avgPrice: 'सरासरी दर',
    highestPrice: 'कमाल दर',
    lowestPrice: 'किमान दर',
    volatility: 'भावातील चढ-उतार',
    forecastTitle: 'भाव कल आणि अंदाज',
    forecastDisclaimer: 'ऐतिहासिक बाजारातील लिलावावर आधारित. प्रत्यक्ष भाव आवक आणि गुणवत्तेवर अवलंबून असतात.',
    
    demoModeLabel: 'डेमो मोड — नमुना डेटा',
    sampleDataLabel: 'नमुना डेटा',
    demoScenarioLabel: 'डेमो परिस्थिती — भीमावरम',
    notLiveMarketPricesLabel: 'थेट बाजारभाव नाहीत',
    
    settingsLanguage: 'भाषा',
    settingsLocation: 'स्थान',
    settingsNotifications: 'सूचना',
    settingsAccessibility: 'सुलभता',
    settingsTheme: 'थीम',
    settingsReducedMotion: 'कमी हालचाली (Reduced Motion)',
    
    rupeeSymbol: '₹',
    perQuintal: '/ क्विंटल',
    quintals: 'क्विंटल',
    kg: 'किलो',
    tonne: 'टन',
    disclaimerFooter: 'शिफारसी उपलब्ध बाजार समिती आकडेवारी आणि ग्रामीण वाहतूक नियमांवर आधारित आहेत.'
  }
};

export function getTranslation(lang: Language): TranslationDict {
  return translations[lang] || translations.en;
}

// Helper accessor for direct string translation
export function t(key: keyof TranslationDict, lang: Language): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || String(key);
}
