import { Language } from '../types/krishi';

export interface Translations {
  appName: string;
  tagline: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  stepIndicator: string;

  // Onboarding & Theme
  welcomeTitle: string;
  chooseLanguage: string;
  themeLight: string;
  themeDark: string;
  continueButton: string;

  // Location & Step 1
  locationPrompt: string;
  useCurrentLocation: string;
  detectMyLocation: string;
  enterLocationManually: string;
  gettingLocation: string;
  findingLocation: string;
  locationDetectionFailed: string;
  searchLocationPrompt: string;
  searchLocationPlaceholder: string;
  manualLocationTitle: string;
  yourLocation: string;
  confirmLocation: string;
  selectState: string;
  selectDistrict: string;
  enterTownVillage: string;
  changeLocation: string;
  gpsAccuracy: string;
  demoModeNotice: string;
  demoModeBadge: string;

  // Role Selection
  roleSelectionTitle: string;
  roleSelectionSubtitle: string;
  roleFarmerTitle: string;
  roleFarmerTagline: string;
  roleFarmerFeature1: string;
  roleFarmerFeature2: string;
  roleFarmerFeature3: string;
  roleBuyerTitle: string;
  roleBuyerTagline: string;
  roleBuyerFeature1: string;
  roleBuyerFeature2: string;
  roleBuyerFeature3: string;
  enterAsFarmer: string;
  enterAsBuyer: string;
  switchRole: string;

  // Digital Farmer Guide
  guideCrop: string;
  guideDetails: string;
  guidePhotos: string;
  guideQuality: string;
  guideMarkets: string;
  guideContact: string;
  guidePublish: string;

  // Crop Details & Step 2
  whatSelling: string;
  chooseCategory: string;
  allCrops: string;
  cereals: string;
  pulses: string;
  vegetables: string;
  fruits: string;
  commercial: string;
  otherCrop: string;
  enterCustomCropName: string;
  customCropPlaceholder: string;
  searchCropsPlaceholder: string;
  noCropsFound: string;
  tryAnotherName: string;

  // Quantity
  howMuchSelling: string;
  quantityPlaceholder: string;
  kg: string;
  quintal: string;
  tonne: string;
  standardizedKg: string;

  // Crop Photos Step
  uploadCropPhotos: string;
  uploadCropPhotosDesc: string;
  takePhoto: string;
  uploadDevice: string;
  clickToUpload: string;
  retakePhoto: string;
  usePhoto: string;
  switchCamera: string;
  cameraGuidance: string;
  cameraOverlayTip: string;

  // Quality & Grades
  whatQuality: string;
  farmerDeclaredQuality: string;
  farmerDeclaredNote: string;
  qualityOptionManual: string;
  qualityOptionAI: string;
  gradeA: string;
  gradeADesc: string;
  gradeAPremium: string;
  gradeB: string;
  gradeBDesc: string;
  gradeBStandard: string;
  gradeC: string;
  gradeCDesc: string;
  gradeCBasic: string;
  customGrade: string;
  customGradeDesc: string;

  // Validation & Errors
  pleaseSelectCrop: string;
  pleaseEnterQuantity: string;
  pleaseSelectQuality: string;
  pleaseConfirmAiResult: string;
  pleaseEnterCropName: string;
  missingFieldsAlert: string;

  // Flow Navigation
  continueToMarket: string;
  backToCrops: string;
  backToLocation: string;
  finishSummary: string;

  // Markets & Comparisons
  bestMarketsNearYou: string;
  recommendedForYou: string;
  recommendedBadge: string;
  nearestMarkets: string;
  bestPriceMarkets: string;
  priceComparison: string;
  bestOverallChoice: string;
  viewOnMap: string;
  listView: string;
  bestOptionBadge: string;
  netReturn: string;
  modalMarketPrice: string;
  estimatedTransport: string;
  marketFee: string;
  unloadingCharge: string;
  distanceRoad: string;
  distanceApprox: string;
  travelTime: string;
  verifiedBuyer: string;
  sameDayPayment: string;
  getDirections: string;
  mapView: string;
  mapUnavailable: string;
  demoLocationWarning: string;

  // Contact Details Step
  farmerContactDetails: string;
  farmerName: string;
  farmerMobile: string;
  contactMethod: string;
  phoneCall: string;
  whatsApp: string;
  privacyNote: string;

  // Publish & Confirmation
  reviewPublish: string;
  publishMyCrop: string;
  listingPublishedSuccess: string;
  viewInBuyerMarketplace: string;
  myListings: string;
  anotherCrop: string;

  // Buyer Marketplace
  findFreshProduce: string;
  allGrades: string;
  allDistances: string;
  filterCrop: string;
  viewDetails: string;
  contactFarmer: string;
  makeOffer: string;
  sendInterest: string;
  farmerLocation: string;
  distanceFromYou: string;
  expectedPrice: string;
  harvestDate: string;

  // Fallback / AI Camera legacy keys
  checkCropQuality: string;
  analyzingCrop: string;
  analyzingSubtext: string;
  qualityAssessment: string;
  suggestedGrade: string;
  confidence: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  whyThisGrade: string;
  whatWeObserved: string;
  cropDoesNotMatch: string;
  cropMismatchDesc: string;
  photoIsUnclear: string;
  photoUnclearDesc: string;
  chooseManually: string;
  changeCrop: string;
  aiVisualEstimate: string;
  notLaboratoryTest: string;
  useGradeA: string;
  useGradeB: string;
  useGradeC: string;
  demoAiResult: string;
  cameraAccessDenied: string;
  cameraDeniedDesc: string;
  uploadFromComputer: string;
}

// 1. ENGLISH TRANSLATIONS
export const EN_TRANSLATIONS: Translations = {
  appName: 'Kisan Setu',
  tagline: 'Smart Market Linkage & Price Discovery Platform',
  step1Title: 'Select Location',
  step2Title: 'Crop Details',
  step3Title: 'Market Comparison',
  step4Title: 'Deal Summary',
  stepIndicator: 'Step',

  welcomeTitle: 'Welcome to Kisan Setu',
  chooseLanguage: 'Choose your preferred language',
  themeLight: 'Light Theme',
  themeDark: 'Dark Theme',
  continueButton: 'Continue',

  locationPrompt: 'Where is your produce located?',
  useCurrentLocation: 'Use GPS Location',
  detectMyLocation: 'Detect My Location',
  enterLocationManually: 'Enter Location Manually',
  gettingLocation: 'Accessing GPS...',
  findingLocation: 'Finding your location...',
  locationDetectionFailed: "We couldn't detect your location. Please enter it manually.",
  searchLocationPrompt: 'Search village, town, city, district, or pin code...',
  searchLocationPlaceholder: 'Search village, mandal, district (e.g. Kadapa, Warangal, Nashik)...',
  manualLocationTitle: 'Or select State & District manually',
  yourLocation: 'Your Location',
  confirmLocation: 'Confirm Location',
  selectState: 'Select State',
  selectDistrict: 'Select District',
  enterTownVillage: 'Town or Village name',
  changeLocation: 'Change Location',
  gpsAccuracy: 'Farm-level accuracy',
  demoModeNotice: 'Demo mode active - Simulated data',
  demoModeBadge: 'Demo Mode',

  roleSelectionTitle: 'How would you like to use Kisan Setu?',
  roleSelectionSubtitle: 'Connect directly with verified buyers or find fresh farm produce',
  roleFarmerTitle: 'FARMER',
  roleFarmerTagline: 'Sell smarter. Find better prices. Reach more buyers.',
  roleFarmerFeature1: 'Upload crop photos & declare quality',
  roleFarmerFeature2: 'Discover best nearby APMC markets & net prices',
  roleFarmerFeature3: 'Connect directly with verified buyers & millers',
  roleBuyerTitle: 'BUYER',
  roleBuyerTagline: 'Discover fresh produce directly from farmers.',
  roleBuyerFeature1: 'Search verified farm produce with photos',
  roleBuyerFeature2: 'Calculate real distance to nearby farmers',
  roleBuyerFeature3: 'Direct call & instant deal offers with farmers',
  enterAsFarmer: 'Continue as Farmer',
  enterAsBuyer: 'Continue as Buyer',
  switchRole: 'Switch Role',

  guideCrop: "👋 Welcome! I'll help you find the best market for your crops. First, let's choose the crop you want to sell.",
  guideDetails: "📋 Enter your crop harvest details, variety, and quantity.",
  guidePhotos: "📸 Upload clear photos of your crop so buyers can see it clearly.",
  guideQuality: "⭐ Declare your expected quality grade (Grade A, B, or C).",
  guideMarkets: "📍 Compare nearby markets with real distance & transport costs.",
  guideContact: "📱 Add your contact details so interested buyers can reach you.",
  guidePublish: "🚀 Review your details and publish your listing to buyers.",

  whatSelling: 'What crop do you want to sell?',
  chooseCategory: 'Filter by Crop Category',
  allCrops: 'All Crops',
  cereals: 'Cereals & Grains',
  pulses: 'Pulses & Lentils',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  commercial: 'Commercial & Cash Crops',
  otherCrop: '+ Other Crop',
  enterCustomCropName: 'Enter crop name:',
  customCropPlaceholder: 'e.g. Mustard, Cluster Beans...',
  searchCropsPlaceholder: 'Search crop name (Rice, Tomato, Cotton, Chilli, Maize)...',
  noCropsFound: 'No crops found matching your search',
  tryAnotherName: 'Try searching with a different name or browse categories.',

  howMuchSelling: 'How much quantity are you selling?',
  quantityPlaceholder: 'Enter quantity (e.g. 50)',
  kg: 'Kilograms (kg)',
  quintal: 'Quintal (100 kg)',
  tonne: 'Tonne (1,000 kg)',
  standardizedKg: 'Standardized weight',

  uploadCropPhotos: 'Upload Photos of Your Crop',
  uploadCropPhotosDesc: 'Your crop photos help buyers understand the quality and condition of your produce.',
  takePhoto: 'Take Photo',
  uploadDevice: 'Upload from Device',
  clickToUpload: 'Click to upload or drag & drop crop photos',
  retakePhoto: 'Retake Photo',
  usePhoto: 'Use this Photo',
  switchCamera: 'Switch Camera',
  cameraGuidance: 'Place the harvested crop in the center frame with good lighting.',
  cameraOverlayTip: 'Ensure crop is clear • Avoid dark shadows',

  whatQuality: 'Crop Quality Grade',
  farmerDeclaredQuality: 'Farmer-declared quality',
  farmerDeclaredNote: 'Declare the quality grade based on your harvest condition. This will be clearly shown to buyers.',
  qualityOptionManual: 'Choose grade manually',
  qualityOptionAI: '📷 Check crop photos',
  gradeA: 'Grade A (Premium quality)',
  gradeADesc: 'Clean luster, uniform size, zero pest damage (+5% price advantage)',
  gradeAPremium: 'Grade A (Premium quality)',
  gradeB: 'Grade B (Standard FAQ quality)',
  gradeBDesc: 'Normal harvest condition, clean grain/produce, standard mandi price',
  gradeBStandard: 'Grade B (Standard quality)',
  gradeC: 'Grade C (Basic quality)',
  gradeCDesc: 'Slightly discolored, small grain or mixed sizes (-5% price discount)',
  gradeCBasic: 'Grade C (Basic quality)',
  customGrade: 'Custom / Spot Inspection',
  customGradeDesc: 'Final price determined upon physical inspection by the buyer',

  pleaseSelectCrop: 'Please select a crop to sell.',
  pleaseEnterQuantity: 'Please enter a valid quantity greater than 0.',
  pleaseSelectQuality: 'Please select a quality grade.',
  pleaseConfirmAiResult: 'Please confirm your quality grade.',
  pleaseEnterCropName: 'Please enter the crop name.',
  missingFieldsAlert: 'Please fill in the required fields highlighted in red.',

  continueToMarket: 'Compare Nearby Markets →',
  backToCrops: '← Back to Crop Details',
  backToLocation: '← Back to Location',
  finishSummary: 'Review & Publish Listing',

  bestMarketsNearYou: 'Best Markets Near You',
  recommendedForYou: 'Recommended for You',
  recommendedBadge: 'Best Price & Distance',
  nearestMarkets: 'Nearest Markets',
  bestPriceMarkets: 'Best Price',
  priceComparison: 'Price & Net Profit Comparison',
  bestOverallChoice: '🏆 Best Overall Choice',
  viewOnMap: 'Interactive Map',
  listView: 'List View',
  bestOptionBadge: '⭐ Highest Net Realization',
  netReturn: 'Estimated Net Take-Home Return (After Freight & Charges)',
  modalMarketPrice: 'Mandi Price',
  estimatedTransport: 'Estimated Freight Cost',
  marketFee: 'Mandi Cess / User Fee',
  unloadingCharge: 'Hamali / Unloading',
  distanceRoad: 'Road Distance',
  distanceApprox: 'Approx Distance',
  travelTime: 'Travel Time',
  verifiedBuyer: 'Verified APMC Yard / Buyer',
  sameDayPayment: 'Instant same-day payment on weighbridge clearance',
  getDirections: '🗺️ Get Directions in Google Maps',
  mapView: 'Map View',
  mapUnavailable: 'Map view temporarily offline. Calculations remain active.',
  demoLocationWarning: 'Demo location active. Use GPS to pinpoint your village.',

  farmerContactDetails: 'Farmer Contact Details',
  farmerName: 'Farmer Full Name',
  farmerMobile: 'Mobile Number (10 digits)',
  contactMethod: 'Preferred Contact Method',
  phoneCall: 'Phone Call',
  whatsApp: 'WhatsApp Message',
  privacyNote: 'Your contact details will only be visible to interested buyers according to platform privacy settings.',

  reviewPublish: 'Review & Publish Listing',
  publishMyCrop: '🚀 Publish My Crop',
  listingPublishedSuccess: 'Your crop is now visible to potential buyers!',
  viewInBuyerMarketplace: 'View in Buyer Marketplace',
  myListings: 'My Published Listings',
  anotherCrop: '+ Sell Another Crop',

  findFreshProduce: 'Find Fresh Produce Near You 🌾',
  allGrades: 'All Grades',
  allDistances: 'All Distances',
  filterCrop: 'Filter by Crop',
  viewDetails: 'View Details',
  contactFarmer: 'Contact Farmer',
  makeOffer: 'Make Offer',
  sendInterest: 'Send Interest',
  farmerLocation: 'Farmer Location',
  distanceFromYou: 'Distance from you',
  expectedPrice: 'Expected Price',
  harvestDate: 'Harvest Date',

  checkCropQuality: 'Check Crop Quality',
  analyzingCrop: 'Analyzing crop details...',
  analyzingSubtext: 'Reviewing uniformity and traits...',
  qualityAssessment: 'Quality Assessment',
  suggestedGrade: 'Suggested Grade',
  confidence: 'Confidence',
  confidenceHigh: 'High Confidence',
  confidenceMedium: 'Medium Confidence',
  confidenceLow: 'Low Confidence',
  whyThisGrade: 'Assessment Details',
  whatWeObserved: 'Observed traits:',
  cropDoesNotMatch: 'Crop Mismatch',
  cropMismatchDesc: 'Uploaded photo does not seem to match the selected crop.',
  photoIsUnclear: 'Photo is Unclear',
  photoUnclearDesc: 'Please take a clearer, well-lit photo of your produce.',
  chooseManually: 'Choose Grade Manually',
  changeCrop: 'Change Crop',
  aiVisualEstimate: 'Visual appraisal estimate',
  notLaboratoryTest: 'Note: Visual estimates cannot replace lab moisture meter readings.',
  useGradeA: 'Select Grade A',
  useGradeB: 'Select Grade B',
  useGradeC: 'Select Grade C',
  demoAiResult: 'Demo Assessment Result',
  cameraAccessDenied: 'Camera Access Denied',
  cameraDeniedDesc: 'Camera permission was not granted. Please upload from device or select grade manually.',
  uploadFromComputer: 'Upload from Device',
};

// 2. TELUGU TRANSLATIONS (తెలుగు)
export const TE_TRANSLATIONS: Translations = {
  appName: 'కిసాన్ సేతు',
  tagline: 'స్మార్ట్ మార్కెట్ అనుసంధానం మరియు ధర గుర్తింపు వేదిక',
  step1Title: 'లొకేషన్ ఎంపిక',
  step2Title: 'పంట వివరాలు',
  step3Title: 'మార్కెట్ పోలిక',
  step4Title: 'ఒప్పంద సారాంశం',
  stepIndicator: 'దశ',

  welcomeTitle: 'కిసాన్ సేతుకు స్వాగతం 🌾',
  chooseLanguage: 'మీ ప్రాధాన్య భాషను ఎంచుకోండి',
  themeLight: 'లైట్ థీమ్ (వెలుతురు)',
  themeDark: 'డార్క్ థీమ్ (రాత్రి మోడ్)',
  continueButton: 'ముందుకు సాగండి →',

  locationPrompt: 'మీ పంట ఎక్కడ ఉంది?',
  useCurrentLocation: 'GPS లొకేషన్ ఉపయోగించండి',
  detectMyLocation: '📍 నా లొకేషన్ గుర్తించండి',
  enterLocationManually: '🔍 లొకేషన్‌ను నేరుగా నమోదు చేయండి',
  gettingLocation: 'GPS కనెక్ట్ అవుతోంది...',
  findingLocation: 'మీ లొకేషన్ శోధిస్తున్నాము...',
  locationDetectionFailed: 'మీ లొకేషన్ గుర్తించలేకపోయాము. దయచేసి నేరుగా నమోదు చేయండి.',
  searchLocationPrompt: 'గ్రామం, మండలం, పట్టణం, జిల్లా లేదా పిన్ కోడ్ వెతకండి...',
  searchLocationPlaceholder: 'గ్రామం, మండలం, జిల్లా వెతకండి (ఉదా. కడప, ప్రొద్దుటూరు, వరంగల్)...',
  manualLocationTitle: 'లేదా రాష్ట్రం, జిల్లా నేరుగా ఎంచుకోండి',
  yourLocation: 'మీ లొకేషన్',
  confirmLocation: 'లొకేషన్‌ను నిర్ధారించండి',
  selectState: 'రాష్ట్రం ఎంచుకోండి',
  selectDistrict: 'జిల్లా ఎంచుకోండి',
  enterTownVillage: 'గ్రామం లేదా పట్టణం పేరు',
  changeLocation: 'లొకేషన్ మార్చండి',
  gpsAccuracy: 'పొలం స్థాయి ఖచ్చితత్వం',
  demoModeNotice: 'డెమో మోడ్ — నమూనా సమాచారం',
  demoModeBadge: 'డెమో మోడ్',

  roleSelectionTitle: 'మీరు కిసాన్ సేతును ఎలా ఉపయోగించాలనుకుంటున్నారు?',
  roleSelectionSubtitle: 'రైతులు నేరుగా కొనుగోలుదారులతో మాట్లాడవచ్చు లేదా తాజా పంటను పొందవచ్చు',
  roleFarmerTitle: 'రైతు (FARMER)',
  roleFarmerTagline: 'తెలివిగా విక్రయించండి. మంచి ధర పొందండి. ఎక్కువ మంది కొనుగోలుదారులను చేరుకోండి.',
  roleFarmerFeature1: 'పంట ఫోటోలు అప్‌లోడ్ చేయండి & నాణ్యత తెలపండి',
  roleFarmerFeature2: 'సమీపంలోని ఉత్తమ APMC మార్కెట్ ధరలు చూడండి',
  roleFarmerFeature3: 'ధృవీకరించబడిన వ్యాపారులతో నేరుగా సంప్రదించండి',
  roleBuyerTitle: 'కొనుగోలుదారు (BUYER)',
  roleBuyerTagline: 'రైతుల నుండి నేరుగా తాజా పంటలను కొనుగోలు చేయండి.',
  roleBuyerFeature1: 'రైతుల పంటల జాబితాను ఫోటోలతో చూడండి',
  roleBuyerFeature2: 'రైతు వద్దకు ఖచ్చితమైన రోడ్డు దూరం లెక్కించండి',
  roleBuyerFeature3: 'రైతుతో నేరుగా మాట్లాడండి & డీల్ ఆఫర్ ఇవ్వండి',
  enterAsFarmer: 'రైతుగా కొనసాగండి',
  enterAsBuyer: 'కొనుగోలుదారుగా కొనసాగండి',
  switchRole: 'పాత్ర మార్చండి',

  guideCrop: '👋 నమస్కారం! మీ పంటకు అత్యధిక ధర లభించే మార్కెట్‌ను కనుగొనడంలో నేను మీకు సహాయం చేస్తాను. ముందుగా మీరు విక్రయించాలనుకుంటున్న పంటను ఎంచుకోండి.',
  guideDetails: '📋 పంట కోత వివరాలు, రకం మరియు పరిమాణాన్ని నమోదు చేయండి.',
  guidePhotos: '📸 కొనుగోలుదారులు స్పష్టంగా చూడటానికి మీ పంట ఫోటోలను అప్‌లోడ్ చేయండి.',
  guideQuality: '⭐ మీ పంట నాణ్యత గ్రేడ్‌ను ఎంచుకోండి (గ్రేడ్ A, B లేదా C).',
  guideMarkets: '📍 నిజమైన రవాణా ఖర్చులు, రోడ్డు దూరంతో సమీప మార్కెట్లను పోల్చండి.',
  guideContact: '📱 ఆసక్తి ఉన్న వ్యాపారులు మిమ్మల్ని సంప్రదించడానికి మీ ఫోన్ నంబర్ ఇవ్వండి.',
  guidePublish: '🚀 వివరాలు సరిచూసి మీ పంటను విక్రయానికి ప్రచురించండి.',

  whatSelling: 'మీరు ఏ పంటను విక్రయించాలనుకుంటున్నారు?',
  chooseCategory: 'పంట వర్గం (కేటగిరీ)',
  allCrops: 'అన్ని పంటలు',
  cereals: 'తృణధాన్యాలు (వరి, గోధుమ, మొక్కజొన్న)',
  pulses: 'పప్పుధాన్యాలు (కందులు, శనగలు, మినుములు)',
  vegetables: 'కూరగాయలు (టమాటా, ఉల్లి, మిర్చి)',
  fruits: 'పండ్లు (మామిడి, అరటి)',
  commercial: 'వాణిజ్య పంటలు (పత్తి, పసుపు)',
  otherCrop: '+ ఇతర పంట',
  enterCustomCropName: 'మీ పంట పేరు నమోదు చేయండి:',
  customCropPlaceholder: 'ఉదా. ఆవాలు, గోరుచిక్కుడు...',
  searchCropsPlaceholder: 'పంట పేరు వెతకండి (వరి, మిరప, పత్తి, మొక్కజొన్న, టమాటా)...',
  noCropsFound: 'మీరు వెతికిన పంట వివరాలు లభించలేదు',
  tryAnotherName: 'మరొక పేరుతో వెతకండి లేదా "అన్ని పంటలు" ఎంచుకోండి.',

  howMuchSelling: 'మీరు ఎంత పరిమాణం విక్రయిస్తారు?',
  quantityPlaceholder: 'పరిమాణం నమోదు చేయండి (ఉదా. 50)',
  kg: 'కిలోలు (kg)',
  quintal: 'క్వింటాల్ (100 కిలోలు)',
  tonne: 'టన్ను (1,000 కిలోలు)',
  standardizedKg: 'ప్రామాణిక బరువు',

  uploadCropPhotos: 'మీ పంట ఫోటోలను అప్‌లోడ్ చేయండి',
  uploadCropPhotosDesc: 'మీ పంట ఫోటోలు కొనుగోలుదారులకు పంట నాణ్యతను స్పష్టంగా అర్థం చేసుకోవడానికి సహాయపడతాయి.',
  takePhoto: 'ఫోటో తీయండి',
  uploadDevice: 'ఫోన్ / కంప్యూటర్ నుండి అప్‌లోడ్ చేయండి',
  clickToUpload: 'ఫోటోలను ఎంచుకోవడానికి ఇక్కడ క్లిక్ చేయండి',
  retakePhoto: 'మళ్ళీ ఫోటో తీయండి',
  usePhoto: 'ఈ ఫోటోను ఉపయోగించండి',
  switchCamera: 'కెమెరా మార్చండి',
  cameraGuidance: 'మంచి వెలుతురులో పంటను కెమెరా ఫ్రేమ్ మధ్యలో ఉంచండి.',
  cameraOverlayTip: 'పంట స్పష్టంగా కనిపించాలి • నీడలు పడకుండా చూడండి',

  whatQuality: 'పంట నాణ్యత గ్రేడ్',
  farmerDeclaredQuality: 'రైతు స్వయంగా తెలిపిన నాణ్యత (Farmer-declared)',
  farmerDeclaredNote: 'మీ పంట ప్రస్తుత స్థితి ఆధారంగా నాణ్యతను ఎంచుకోండి. ఇది కొనుగోలుదారులకు స్పష్టంగా కనిపిస్తుంది.',
  qualityOptionManual: 'గ్రేడ్‌ను నేరుగా ఎంచుకోండి',
  qualityOptionAI: '📷 ఫోటోలను పరిశీలించండి',
  gradeA: 'గ్రేడ్ A (ఉత్తమ నాణ్యత)',
  gradeADesc: 'మంచి నిగారింపు, సమానమైన పరిమాణం, పురుగుల నష్టం లేని పంట (+5% ఎక్కువ ధర)',
  gradeAPremium: 'గ్రేడ్ A (ఉత్తమ నాణ్యత)',
  gradeB: 'గ్రేడ్ B (సగటు FAQ నాణ్యత)',
  gradeBDesc: 'సాధారణ మంచి నాణ్యత, శుభ్రమైన పంట, ప్రామాణిక మార్కెట్ ధర',
  gradeBStandard: 'గ్రేడ్ B (సగటు నాణ్యత)',
  gradeC: 'గ్రేడ్ C (ద్వితీయ శ్రేణి నాణ్యత)',
  gradeCDesc: 'రంగు కొద్దిగా మారిన లేదా చిన్న గింజలు (-5% తక్కువ ధర)',
  gradeCBasic: 'గ్రేడ్ C (ద్వితీయ శ్రేణి)',
  customGrade: 'ఇతర / స్పాట్ ఇన్స్పెక్షన్',
  customGradeDesc: 'వ్యాపారి పంటను స్వయంగా పరిశీలించిన తర్వాత నిర్ణయించే ధర',

  pleaseSelectCrop: 'దయచేసి పంటను ఎంచుకోండి.',
  pleaseEnterQuantity: 'దయచేసి ఎంత విక్రయిస్తారో నమోదు చేయండి (0 కంటే ఎక్కువ ఉండాలి).',
  pleaseSelectQuality: 'దయచేసి పంట నాణ్యత గ్రేడ్‌ను ఎంచుకోండి.',
  pleaseConfirmAiResult: 'దయచేసి నాణ్యతను నిర్ధారించండి.',
  pleaseEnterCropName: 'దయచేసి మీ పంట పేరు రాయండి.',
  missingFieldsAlert: 'దయచేసి ఎరుపు రంగులో ఉన్న వివరాలన్నీ నమోదు చేయండి.',

  continueToMarket: 'సమీప మార్కెట్లను పోల్చండి →',
  backToCrops: '← పంట వివరాలకు తిరిగి వెళ్ళండి',
  backToLocation: '← లొకేషన్‌కు తిరిగి వెళ్ళండి',
  finishSummary: 'వివరాలు సమీక్షించి ప్రచురించండి',

  bestMarketsNearYou: 'మీ సమీపంలోని ఉత్తమ మార్కెట్లు',
  recommendedForYou: 'మీకు సిఫార్సు చేసిన మార్కెట్',
  recommendedBadge: 'ఉత్తమ ధర & సరైన దూరం',
  nearestMarkets: 'సమీప మార్కెట్లు',
  bestPriceMarkets: 'అత్యధిక ధర గల మార్కెట్లు',
  priceComparison: 'ధర మరియు నికర లాభం పోలిక',
  bestOverallChoice: '🏆 అత్యుత్తమ ఎంపిక',
  viewOnMap: 'మ్యాప్ రూపంలో చూడండి',
  listView: 'జాబితా పోలిక',
  bestOptionBadge: '⭐ అత్యధిక నికర లాభం ఇచ్చే మార్కెట్',
  netReturn: 'రవాణా, ఖర్చులు పోగా చేతికి అందే నికర మొత్తం',
  modalMarketPrice: 'మార్కెట్ ధర (క్వింటాల్‌కు)',
  estimatedTransport: 'అంచనా రవాణా ఖర్చు',
  marketFee: 'మార్కెట్ రుసుము / సెస్',
  unloadingCharge: 'హమాలీ / దించుడు ఖర్చు',
  distanceRoad: 'రోడ్డు దూరం',
  distanceApprox: 'సుమారు దూరం',
  travelTime: 'ప్రయాణ సమయం',
  verifiedBuyer: 'ధృవీకరించబడిన APMC మార్కెట్ / వ్యాపారి',
  sameDayPayment: 'సరుకు అప్పగించగానే తక్షణ నగదు / UPI చెల్లింపు',
  getDirections: '🗺️ గూగుల్ మ్యాప్స్‌లో దారి చూడండి',
  mapView: 'మ్యాప్ వ్యూ',
  mapUnavailable: 'మ్యాప్ తాత్కాలికంగా ఆఫ్‌లైన్‌లో ఉంది. ధరల లెక్కలు పనిచేస్తున్నాయి.',
  demoLocationWarning: 'డెమో లొకేషన్ పనిచేస్తోంది. మీ నిజమైన గ్రామం కోసం GPS వాడండి.',

  farmerContactDetails: 'రైతు సంప్రదింపు వివరాలు',
  farmerName: 'రైతు పూర్తి పేరు',
  farmerMobile: 'మొబైల్ నంబర్ (10 అంకెలు)',
  contactMethod: 'సంప్రదించడానికి ఇష్టపడే మార్గం',
  phoneCall: 'ఫోన్ కాల్',
  whatsApp: 'వాట్సాప్ మెసేజ్',
  privacyNote: 'మీ సంప్రదింపు వివరాలు ఆసక్తి ఉన్న ధృవీకరించబడిన వ్యాపారులకు మాత్రమే కనిపిస్తాయి.',

  reviewPublish: 'సమీక్షించండి & ప్రచురించండి',
  publishMyCrop: '🚀 నా పంటను విక్రయానికి ప్రచురించండి',
  listingPublishedSuccess: 'మీ పంట విజయవంతంగా ప్రచురించబడింది! ఇప్పుడు కొనుగోలుదారులకు కనిపిస్తుంది.',
  viewInBuyerMarketplace: 'కొనుగోలుదారుల మార్కెట్‌లో చూడండి',
  myListings: 'నా పంటల జాబితా',
  anotherCrop: '+ మరొక పంటను అమ్మండి',

  findFreshProduce: 'తాజా పంటలను నేరుగా రైతుల నుండి పొందండి 🌾',
  allGrades: 'అన్ని గ్రేడ్‌లు',
  allDistances: 'అన్ని దూరాలు',
  filterCrop: 'పంట ప్రకారం ఫిల్టర్ చేయండి',
  viewDetails: 'పూర్తి వివరాలు చూడండి',
  contactFarmer: 'రైతుతో మాట్లాడండి',
  makeOffer: 'ఆఫర్ ఇవ్వండి',
  sendInterest: 'ఆసక్తి తెలపండి',
  farmerLocation: 'రైతు లొకేషన్',
  distanceFromYou: 'మీ నుండి దూరం',
  expectedPrice: 'రైతు కోరిన ధర',
  harvestDate: 'కోత తేదీ',

  checkCropQuality: 'పంట నాణ్యతను తనిఖీ చేయండి',
  analyzingCrop: 'పంట వివరాలను పరిశీలిస్తున్నాము...',
  analyzingSubtext: 'నాణ్యత అంశాలను లెక్కిస్తున్నాము...',
  qualityAssessment: 'నాణ్యత నివేదిక',
  suggestedGrade: 'సూచించబడిన నాణ్యత గ్రేడ్',
  confidence: 'ఖచ్చితత్వం',
  confidenceHigh: 'అధిక ఖచ్చితత్వం',
  confidenceMedium: 'మధ్యస్థ ఖచ్చితత్వం',
  confidenceLow: 'సాధారణ ఖచ్చితత్వం',
  whyThisGrade: 'నివేదిక వివరాలు',
  whatWeObserved: 'గమనించిన అంశాలు:',
  cropDoesNotMatch: 'పంట సరిపోలలేదు',
  cropMismatchDesc: 'ఫోటో ఎంచుకున్న పంటతో సరిపోలడం లేదు.',
  photoIsUnclear: 'ఫోటో అస్పష్టంగా ఉంది',
  photoUnclearDesc: 'దయచేసి స్పష్టమైన ఫోటో తీయండి.',
  chooseManually: 'గ్రేడ్‌ను నేరుగా ఎంచుకోండి',
  changeCrop: 'పంటను మార్చండి',
  aiVisualEstimate: 'దృశ్య అంచనా',
  notLaboratoryTest: 'గమనిక: దృశ్య అంచనా ల్యాబ్ తేమ పరీక్షకు ప్రత్యామ్నాయం కాదు.',
  useGradeA: 'గ్రేడ్ A ఎంచుకోండి',
  useGradeB: 'గ్రేడ్ B ఎంచుకోండి',
  useGradeC: 'గ్రేడ్ C ఎంచుకోండి',
  demoAiResult: 'నమూనా విశ్లేషణ ఫలితం',
  cameraAccessDenied: 'కెమెరా అనుమతి లభించలేదు',
  cameraDeniedDesc: 'ఫోన్ నుండి ఫోటో అప్‌లోడ్ చేయండి లేదా గ్రేడ్‌ను మాన్యువల్‌గా ఎంచుకోండి.',
  uploadFromComputer: 'ఫోన్ నుండి ఫోటో అప్‌లోడ్ చేయండి',
};

// 3. HINDI TRANSLATIONS (हिन्दी)
export const HI_TRANSLATIONS: Translations = {
  appName: 'किसान सेतु',
  tagline: 'स्मार्ट मार्केट लिंकेज और मूल्य खोज मंच',
  step1Title: 'स्थान चुनें',
  step2Title: 'फसल विवरण',
  step3Title: 'मंडी तुलना',
  step4Title: 'सौदा सारांश',
  stepIndicator: 'चरण',

  welcomeTitle: 'किसान सेतु में आपका स्वागत है 🌾',
  chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
  themeLight: 'लाइट थीम (दिन का मोड)',
  themeDark: 'डार्क थीम (रात का मोड)',
  continueButton: 'आगे बढ़ें →',

  locationPrompt: 'आपकी उपज कहाँ स्थित है?',
  useCurrentLocation: 'GPS स्थान का उपयोग करें',
  detectMyLocation: '📍 मेरा स्थान पहचानें',
  enterLocationManually: '🔍 स्थान मैन्युअल दर्ज करें',
  gettingLocation: 'GPS से जुड़ रहे हैं...',
  findingLocation: 'आपका स्थान खोज रहे हैं...',
  locationDetectionFailed: 'हम आपके स्थान का पता नहीं लगा सके। कृपया मैन्युअल रूप से दर्ज करें।',
  searchLocationPrompt: 'गाँव, कस्बा, शहर, जिला या पिन कोड खोजें...',
  searchLocationPlaceholder: 'गाँव, तहसील, जिला खोजें (उदा. कड़ापा, नासिक, इंदौर)...',
  manualLocationTitle: 'या राज्य और जिला सीधे चुनें',
  yourLocation: 'आपका स्थान',
  confirmLocation: 'स्थान की पुष्टि करें',
  selectState: 'राज्य चुनें',
  selectDistrict: 'ज़िला चुनें',
  enterTownVillage: 'गाँव या शहर का नाम',
  changeLocation: 'स्थान बदलें',
  gpsAccuracy: 'खेत स्तर की सटीकता',
  demoModeNotice: 'डेमो मोड सक्रिय',
  demoModeBadge: 'डेमो मोड',

  roleSelectionTitle: 'आप किसान सेतु का उपयोग कैसे करना चाहते हैं?',
  roleSelectionSubtitle: 'किसानों और खरीदारों के बीच सीधा संपर्क',
  roleFarmerTitle: 'किसान (FARMER)',
  roleFarmerTagline: 'बेहतर दाम पाएं। नई मंडियों से जुड़ें। अधिक खरीदारों तक पहुंचें।',
  roleFarmerFeature1: 'फसल की फोटो अपलोड करें और गुणवत्ता घोषित करें',
  roleFarmerFeature2: 'नजदीकी मंडियों के वास्तविक भाव और दूरी तुलना',
  roleFarmerFeature3: 'सत्यापित खरीदारों से सीधा संपर्क व सौदा',
  roleBuyerTitle: 'खरीदार (BUYER)',
  roleBuyerTagline: 'किसानों से सीधे ताज़ा कृषि उत्पाद खरीदें।',
  roleBuyerFeature1: 'फोटो के साथ वास्तविक फसलों की सूची देखें',
  roleBuyerFeature2: 'किसान से अपनी दूरी का सटीक अनुमान लगाएं',
  roleBuyerFeature3: 'किसान को सीधे कॉल करें और तुरंत बोली लगाएं',
  enterAsFarmer: 'किसान के रूप में जारी रखें',
  enterAsBuyer: 'खरीदार के रूप में जारी रखें',
  switchRole: 'भूमिका बदलें',

  guideCrop: '👋 नमस्ते! आपकी फसल का सर्वोत्तम मूल्य पाने में मैं आपकी सहायता करूँगा। सबसे पहले वह फसल चुनें जिसे आप बेचना चाहते हैं।',
  guideDetails: '📋 अपनी फसल की कटाई, किस्म और कुल मात्रा दर्ज करें।',
  guidePhotos: '📸 खरीदारों को स्पष्ट रूप से दिखाने के लिए अपनी फसल की फोटो अपलोड करें।',
  guideQuality: '⭐ अपनी फसल की अपेक्षित गुणवत्ता ग्रेड (ग्रेड A, B या C) चुनें।',
  guideMarkets: '📍 नजदीकी मंडियों की वास्तविक दूरी और परिवहन लागत के साथ तुलना करें।',
  guideContact: '📱 खरीदारों के संपर्क के लिए अपना मोबाइल नंबर दर्ज करें।',
  guidePublish: '🚀 विवरण की समीक्षा करें और अपनी फसल को बाजार में सूचीबद्ध करें।',

  whatSelling: 'आप कौन सी फसल बेचना चाहते हैं?',
  chooseCategory: 'फसल श्रेणी चुनें',
  allCrops: 'सभी फसलें',
  cereals: 'अनाज (धान, गेहूं, मक्का)',
  pulses: 'दालें (अरहर, चना, मूंग)',
  vegetables: 'सब्जियां (टमाटर, प्याज, मिर्च)',
  fruits: 'फल (आम, केला)',
  commercial: 'व्यावसायिक फसलें (कपास, हल्दी)',
  otherCrop: '+ अन्य फसल',
  enterCustomCropName: 'फसल का नाम लिखें:',
  customCropPlaceholder: 'उदा. सरसों, ग्वार...',
  searchCropsPlaceholder: 'फसल का नाम खोजें (गेहूं, धान, टमाटर, प्याज, कपास)...',
  noCropsFound: 'कोई फसल नहीं मिली',
  tryAnotherName: 'किसी अन्य नाम से खोजें या श्रेणियां देखें।',

  howMuchSelling: 'आप कितनी मात्रा बेचना चाहते हैं?',
  quantityPlaceholder: 'मात्रा दर्ज करें (उदा. 50)',
  kg: 'किलोग्राम (kg)',
  quintal: 'क्विंटल (100 किग्रा)',
  tonne: 'टन (1,000 किग्रा)',
  standardizedKg: 'मानक भार',

  uploadCropPhotos: 'अपनी फसल की फोटो अपलोड करें',
  uploadCropPhotosDesc: 'आपकी फसल की फोटो खरीदारों को गुणवत्ता और स्थिति समझने में मदद करती है।',
  takePhoto: 'फोटो खींचें',
  uploadDevice: 'डिवाइस से अपलोड करें',
  clickToUpload: 'फोटो अपलोड करने के लिए क्लिक करें',
  retakePhoto: 'दोबारा फोटो लें',
  usePhoto: 'इस फोटो का उपयोग करें',
  switchCamera: 'कैमरा बदलें',
  cameraGuidance: 'अच्छी रोशनी में फसल को फ्रेम के बीच में रखें।',
  cameraOverlayTip: 'फसल स्पष्ट दिखे • परछाई से बचें',

  whatQuality: 'फसल गुणवत्ता ग्रेड',
  farmerDeclaredQuality: 'किसान द्वारा घोषित गुणवत्ता (Farmer-declared)',
  farmerDeclaredNote: 'अपनी फसल की स्थिति के अनुसार ग्रेड चुनें। यह खरीदारों को स्पष्ट रूप से दिखाई देगा।',
  qualityOptionManual: 'मैन्युअल ग्रेड चुनें',
  qualityOptionAI: '📷 फोटो देखें',
  gradeA: 'ग्रेड A (प्रीमियम गुणवत्ता)',
  gradeADesc: 'चमकदार दाना, एकसमान आकार, कोई कीट क्षति नहीं (+5% अधिक मूल्य)',
  gradeAPremium: 'ग्रेड A (प्रीमियम गुणवत्ता)',
  gradeB: 'ग्रेड B (मानक FAQ गुणवत्ता)',
  gradeBDesc: 'सामान्य अच्छी गुणवत्ता, साफ माल, मानक मंडी भाव',
  gradeBStandard: 'ग्रेड B (मानक गुणवत्ता)',
  gradeC: 'ग्रेड C (बुनियादी गुणवत्ता)',
  gradeCDesc: 'हल्का फीका रंग या छोटा दाना (-5% कम मूल्य)',
  gradeCBasic: 'ग्रेड C (बुनियादी गुणवत्ता)',
  customGrade: 'कस्टम / मौके पर निरीक्षण',
  customGradeDesc: 'खरीदार द्वारा प्रत्यक्ष निरीक्षण के बाद तय किया जाने वाला मूल्य',

  pleaseSelectCrop: 'कृपया बेचने के लिए फसल चुनें।',
  pleaseEnterQuantity: 'कृपया 0 से अधिक मात्रा दर्ज करें।',
  pleaseSelectQuality: 'कृपया गुणवत्ता ग्रेड चुनें।',
  pleaseConfirmAiResult: 'कृपया गुणवत्ता की पुष्टि करें।',
  pleaseEnterCropName: 'कृपया फसल का नाम दर्ज करें।',
  missingFieldsAlert: 'कृपया लाल रंग में चिह्नित विवरण भरें।',

  continueToMarket: 'नजदीकी मंडियों की तुलना करें →',
  backToCrops: '← फसल विवरण पर वापस जाएं',
  backToLocation: '← स्थान पर वापस जाएं',
  finishSummary: 'समीक्षा करें और प्रकाशित करें',

  bestMarketsNearYou: 'आपके नजदीकी सर्वोत्तम मंडियां',
  recommendedForYou: 'आपके लिए अनुशंसित मंडी',
  recommendedBadge: 'सर्वोत्तम भाव और दूरी',
  nearestMarkets: 'निकटतम मंडियां',
  bestPriceMarkets: 'सर्वोच्च मूल्य वाली मंडियां',
  priceComparison: 'मूल्य और शुद्ध लाभ की तुलना',
  bestOverallChoice: '🏆 सर्वश्रेष्ठ समग्र विकल्प',
  viewOnMap: 'नक्शे पर देखें',
  listView: 'सूची दृश्य',
  bestOptionBadge: '⭐ सर्वाधिक शुद्ध मुनाफा देने वाली मंडी',
  netReturn: 'परिवहन और अन्य खर्च काटकर हाथ में आने वाली शुद्ध रकम',
  modalMarketPrice: 'मंडी भाव (प्रति क्विंटल)',
  estimatedTransport: 'अनुमानित परिवहन खर्च',
  marketFee: 'मंडी शुल्क / सेस',
  unloadingCharge: 'हम्माली / उतराई खर्च',
  distanceRoad: 'सड़क दूरी',
  distanceApprox: 'लगभग दूरी',
  travelTime: 'यात्रा का समय',
  verifiedBuyer: 'सत्यापित APMC यार्ड / खरीदार',
  sameDayPayment: 'कांटा पर्ची कटते ही उसी दिन तुरंत भुगतान',
  getDirections: '🗺️ गूगल मैप्स पर रास्ता देखें',
  mapView: 'मानचित्र दृश्य',
  mapUnavailable: 'मानचित्र अस्थायी रूप से अनुपलब्ध है। मूल्य गणनाएं सक्रिय हैं।',
  demoLocationWarning: 'डेमो स्थान सक्रिय है। वास्तविक गाँव के लिए GPS का उपयोग करें।',

  farmerContactDetails: 'किसान संपर्क विवरण',
  farmerName: 'किसान का पूरा नाम',
  farmerMobile: 'मोबाइल नंबर (10 अंक)',
  contactMethod: 'संपर्क का पसंदीदा माध्यम',
  phoneCall: 'फ़ोन कॉल',
  whatsApp: 'व्हाट्सएप संदेश',
  privacyNote: 'आपका संपर्क विवरण केवल इच्छुक खरीदारों को ही सुरक्षित रूप से दिखाया जाएगा।',

  reviewPublish: 'समीक्षा और प्रकाशन',
  publishMyCrop: '🚀 मेरी फसल को बाजार में प्रकाशित करें',
  listingPublishedSuccess: 'आपकी फसल सफलतापूर्वक प्रकाशित हो गई है! अब यह खरीदारों को दिखाई देगी।',
  viewInBuyerMarketplace: 'खरीदार बाजार में देखें',
  myListings: 'मेरी प्रकाशित फसलें',
  anotherCrop: '+ एक और फसल बेचें',

  findFreshProduce: 'सीधे किसानों से ताज़ा उपज खोजें 🌾',
  allGrades: 'सभी ग्रेड',
  allDistances: 'सभी दूरियां',
  filterCrop: 'फसल के अनुसार फ़िल्टर करें',
  viewDetails: 'पूरा विवरण देखें',
  contactFarmer: 'किसान से संपर्क करें',
  makeOffer: 'बोली लगाएं',
  sendInterest: 'रुचि व्यक्त करें',
  farmerLocation: 'किसान का स्थान',
  distanceFromYou: 'आपसे दूरी',
  expectedPrice: 'मांगा गया भाव',
  harvestDate: 'कटाई की तारीख',

  checkCropQuality: 'फसल गुणवत्ता जांचें',
  analyzingCrop: 'फसल का विश्लेषण कर रहे हैं...',
  analyzingSubtext: 'गुणवत्ता मानकों की समीक्षा...',
  qualityAssessment: 'गुणवत्ता रिपोर्ट',
  suggestedGrade: 'सुझाया गया ग्रेड',
  confidence: 'सटीकता',
  confidenceHigh: 'उच्च सटीकता',
  confidenceMedium: 'मध्यम सटीकता',
  confidenceLow: 'सामान्य सटीकता',
  whyThisGrade: 'रिपोर्ट विवरण',
  whatWeObserved: 'अवलोकन:',
  cropDoesNotMatch: 'फसल बेमेल',
  cropMismatchDesc: 'अपलोड की गई फोटो चुनी गई फसल से मेल नहीं खाती।',
  photoIsUnclear: 'फोटो अस्पष्ट है',
  photoUnclearDesc: 'कृपया साफ और अच्छी रोशनी वाली फोटो लें।',
  chooseManually: 'मैन्युअल ग्रेड चुनें',
  changeCrop: 'फसल बदलें',
  aiVisualEstimate: 'दृश्य अनुमान',
  notLaboratoryTest: 'नोट: दृश्य अनुमान प्रयोगशाला परीक्षण का विकल्प नहीं है।',
  useGradeA: 'ग्रेड A चुनें',
  useGradeB: 'ग्रेड B चुनें',
  useGradeC: 'ग्रेड C चुनें',
  demoAiResult: 'डेमो विश्लेषण परिणाम',
  cameraAccessDenied: 'कैमरा अनुमति अस्वीकृत',
  cameraDeniedDesc: 'डिवाइस से फोटो अपलोड करें या मैन्युअल रूप से ग्रेड चुनें।',
  uploadFromComputer: 'डिवाइस से फोटो अपलोड करें',
};

// 4. TAMIL TRANSLATIONS (தமிழ்)
export const TA_TRANSLATIONS: Translations = {
  ...EN_TRANSLATIONS,
  appName: 'கிசான் சேது',
  tagline: 'ஸ்மார்ட் சந்தை இணைப்பு & விலை கண்டறிதல் தளம்',
  step1Title: 'இருப்பிடம் தேர்வு',
  step2Title: 'பயிர் விவரங்கள்',
  step3Title: 'சந்தை ஒப்பீடு',
  step4Title: 'ஒப்பந்த சுருக்கம்',
  stepIndicator: 'படி',

  welcomeTitle: 'கிசான் சேதுவிற்கு நல்வரவு 🌾',
  chooseLanguage: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்',
  themeLight: 'வெளிச்ச முறை (Light)',
  themeDark: 'இருள் முறை (Dark)',
  continueButton: 'தொடரவும் →',

  locationPrompt: 'உங்கள் விளைபொருள் எங்குள்ளது?',
  useCurrentLocation: 'GPS இருப்பிடத்தைப் பயன்படுத்துங்கள்',
  detectMyLocation: '📍 என் இருப்பிடத்தைக் கண்டறி',
  enterLocationManually: '🔍 இருப்பிடத்தை கைமுறையாக உள்ளிடவும்',
  gettingLocation: 'GPS உடன் இணைகிறது...',
  findingLocation: 'உங்கள் இருப்பிடத்தைத் தேடுகிறது...',
  locationDetectionFailed: 'இருப்பிடத்தைக் கண்டறிய முடியவில்லை. தயவுசெய்து கைமுறையாக உள்ளிடவும்.',
  searchLocationPrompt: 'கிராமம், நகரம், மாவட்டம் அல்லது பின்கோட் தேடவும்...',
  searchLocationPlaceholder: 'கிராமம், வட்டம், மாவட்டம் தேடுங்கள் (உதா. கடப்பா, சேலம்)...',
  manualLocationTitle: 'அல்லது மாநிலம் & மாவட்டத்தை நேரடியாகத் தேர்ந்தெடுக்கவும்',
  yourLocation: 'உங்கள் இருப்பிடம்',
  confirmLocation: 'இருப்பிடத்தை உறுதிப்படுத்துக',
  selectState: 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
  selectDistrict: 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
  enterTownVillage: 'கிராமம் அல்லது நகரத்தின் பெயர்',
  changeLocation: 'இருப்பிடத்தை மாற்றவும்',
  gpsAccuracy: 'துல்லியமான பண்ணை இருப்பிடம்',

  roleSelectionTitle: 'கிசான் சேதுவை எவ்வாறு பயன்படுத்த விரும்புகிறீர்கள்?',
  roleSelectionSubtitle: 'விவசாயிகள் மற்றும் வாங்குபவர்களுக்கான நேரடி இணைப்பு',
  roleFarmerTitle: 'விவசாயி (FARMER)',
  roleFarmerTagline: 'சிறந்த விலையைப் பெறுங்கள். புதிய சந்தைகளை எட்டுங்கள்.',
  roleFarmerFeature1: 'பயிர் புகைப்படங்களை பதிவேற்றி தரம் குறிப்பிடவும்',
  roleFarmerFeature2: 'அருகிலுள்ள சந்தைகளின் நேரடி விலை & தூர ஒப்பீடு',
  roleFarmerFeature3: 'சரிபார்க்கப்பட்ட வாங்குபவர்களுடன் நேரடி தொடர்பு',
  roleBuyerTitle: 'வாங்குபவர் (BUYER)',
  roleBuyerTagline: 'விவசாயிகளிடமிருந்து நேரடியாக புதிய விளைபொருட்களை வாங்குங்கள்.',
  roleBuyerFeature1: 'புகைப்படங்களுடன் உண்மையான பயிர்களைத் தேடுங்கள்',
  roleBuyerFeature2: 'விவசாயிகளுக்கான துல்லியமான சாலை தூரத்தைக் கணக்கிடுங்கள்',
  roleBuyerFeature3: 'நேரடி அழைப்பு மற்றும் உடனடி ஒப்பந்த சலுகைகள்',
  enterAsFarmer: 'விவசாயியாகத் தொடரவும்',
  enterAsBuyer: 'வாங்குபவராகத் தொடரவும்',
  switchRole: 'பங்கை மாற்றவும்',

  guideCrop: '👋 வணக்கம்! உங்கள் பயிருக்கு சிறந்த விலையைப் பெற நான் உங்களுக்கு உதவுவேன். முதலில் நீங்கள் விற்க விரும்பும் பயிரைத் தேர்ந்தெடுக்கவும்.',
  guideDetails: '📋 அறுவடை விவரங்கள், ரகம் மற்றும் அளவை உள்ளிடவும்.',
  guidePhotos: '📸 வாங்குபவர்கள் தெளிவாகப் பார்க்க உங்கள் பயிரின் புகைப்படங்களைப் பதிவேற்றவும்.',
  guideQuality: '⭐ பயிரின் தர வகையை (கிரேடு A, B அல்லது C) குறிப்பிடவும்.',
  guideMarkets: '📍 உண்மையான போக்குவரத்து செலவுகளுடன் அருகிலுள்ள சந்தைகளை ஒப்பிடுங்கள்.',
  guideContact: '📱 வாங்குபவர்கள் உங்களை தொடர்பு கொள்ள உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.',
  guidePublish: '🚀 விவரங்களை மதிப்பாய்வு செய்து உங்கள் பயிரை வெளியிடவும்.',

  whatSelling: 'நீங்கள் என்ன பயிரை விற்க விரும்புகிறீர்கள்?',
  chooseCategory: 'பயிர் வகையைத் தேர்ந்தெடுக்கவும்',
  allCrops: 'அனைத்து பயிர்களும்',
  cereals: 'தானியங்கள் (நெல், சோளம், கோதுமை)',
  pulses: 'பருப்பு வகைகள் (துவரை, உளுந்து, பாசிப்பயறு)',
  vegetables: 'காய்கறிகள் (தக்காளி, வெங்காயம், மிளகாய்)',
  fruits: 'பழங்கள் (மாம்பழம், வாழை)',
  commercial: 'வணிகப் பயிர்கள் (பருத்தி, மஞ்சள்)',
  otherCrop: '+ பிற பயிர்',
  howMuchSelling: 'எவ்வளவு அளவு விற்க விரும்புகிறீர்கள்?',
  quantityPlaceholder: 'அளவை உள்ளிடவும் (உதா. 50)',
  kg: 'கிலோ (kg)',
  quintal: 'குவிண்டால் (100 கிலோ)',
  tonne: 'டன் (1,000 கிலோ)',

  uploadCropPhotos: 'பயிர் புகைப்படங்களைப் பதிவேற்றவும்',
  uploadCropPhotosDesc: 'உங்கள் பயிர் புகைப்படங்கள் வாங்குபவர்களுக்கு தரத்தை தெளிவாகப் புரிந்துகொள்ள உதவுகிறது.',
  takePhoto: 'புகைப்படம் எடுக்கவும்',
  uploadDevice: 'சாதனத்திலிருந்து பதிவேற்றவும்',
  clickToUpload: 'பதிவேற்ற இங்கே கிளிக் செய்யவும்',

  whatQuality: 'பயிர் தர வகை',
  farmerDeclaredQuality: 'விவசாயி அறிவித்த தரம் (Farmer-declared)',
  farmerDeclaredNote: 'உங்கள் அறுவடை நிலையின் அடிப்படையில் தரத்தை தேர்வு செய்யவும். இது வாங்குபவர்களுக்கு தெளிவாகத் தெரியும்.',
  gradeA: 'கிரேடு A (உயர்தர தரம்)',
  gradeADesc: 'நல்ல பளபளப்பு, சீரான அளவு, பூச்சி சேதமில்லை (+5% அதிக விலை)',
  gradeAPremium: 'கிரேடு A (உயர்தரம்)',
  gradeB: 'கிரேடு B (சராசரி தரமான தரம்)',
  gradeBDesc: 'வழக்கமான நல்ல தரம், சுத்தமான பயிர், நிலையான சந்தை விலை',
  gradeBStandard: 'கிரேடு B (சராசரி தரம்)',
  gradeC: 'கிரேடு C (அடிப்படை தரம்)',
  gradeCDesc: 'சிறிய அளவுகள் அல்லது நிற மாறுபாடு (-5% குறைவான விலை)',
  gradeCBasic: 'கிரேடு C (அடிப்படை தரம்)',

  continueToMarket: 'அருகிலுள்ள சந்தைகளை ஒப்பிடுக →',
  backToCrops: '← பயிர் விவரங்களுக்குத் திரும்பு',
  backToLocation: '← இருப்பிடத்திற்குத் திரும்பு',
  finishSummary: 'மதிப்பாய்வு செய்து வெளியிடவும்',

  bestMarketsNearYou: 'உங்களுக்கு அருகிலுள்ள சிறந்த சந்தைகள்',
  recommendedForYou: 'பரிந்துரைக்கப்பட்ட சந்தை',
  recommendedBadge: 'சிறந்த விலை & தூரம்',
  nearestMarkets: 'அருகிலுள்ள சந்தைகள்',
  bestPriceMarkets: 'அதிக விலை கொண்ட சந்தைகள்',
  bestOverallChoice: '🏆 சிறந்த தேர்வு',
  viewOnMap: 'வரைபடத்தில் பார்க்க',
  listView: 'பட்டியல் ஒப்பீடு',
  netReturn: 'போக்குவரத்து மற்றும் கட்டணங்கள் போக நிகர தொகை',
  modalMarketPrice: 'சந்தை விலை',
  estimatedTransport: 'போக்குவரத்து செலவு',
  distanceRoad: 'சாலை தூரம்',

  farmerContactDetails: 'விவசாயி தொடர்பு விவரங்கள்',
  farmerName: 'விவசாயியின் முழு பெயர்',
  farmerMobile: 'மொபைல் எண் (10 இலக்கங்கள்)',
  contactMethod: 'தொடர்பு முறை',
  phoneCall: 'தொலைபேசி அழைப்பு',
  whatsApp: 'வாட்ஸ்அப் செய்தி',
  privacyNote: 'உங்கள் தொடர்பு விவரங்கள் ஆர்வமுள்ள வாங்குபவர்களுக்கு மட்டுமே காட்டப்படும்.',

  reviewPublish: 'மதிப்பாய்வு & வெளியீடு',
  publishMyCrop: '🚀 என் பயிரை விற்பனைக்கு வெளியிடுங்கள்',
  listingPublishedSuccess: 'உங்கள் பயிர் வெற்றிகரமாக வெளியிடப்பட்டது! இப்போது வாங்குபவர்கள் பார்க்கலாம்.',
  viewInBuyerMarketplace: 'வாங்குபவர் சந்தையில் பார்க்கவும்',
  myListings: 'என் பயிர்களின் பட்டியல்',

  findFreshProduce: 'விவசாயிகளிடமிருந்து நேரடியாக புதிய விளைபொருட்கள் 🌾',
  allGrades: 'அனைத்து கிரேடுகளும்',
  allDistances: 'அனைத்து தூரங்களும்',
  filterCrop: 'பயிர் வாரியாக வடிகட்டுங்கள்',
  viewDetails: 'முழு விவரங்கள்',
  contactFarmer: 'விவசாயியை அழைக்கவும்',
  makeOffer: 'விலை சலுகை வழங்கவும்',
  sendInterest: 'ஆர்வம் தெரிவிக்கவும்',
  farmerLocation: 'விவசாயி இருப்பிடம்',
  distanceFromYou: 'உங்களிலிருந்து தூரம்',
  expectedPrice: 'எதிர்பார்க்கப்படும் விலை',
  harvestDate: 'அறுவடை தேதி',
};

// 5. KANNADA TRANSLATIONS (ಕನ್ನಡ)
export const KN_TRANSLATIONS: Translations = {
  ...EN_TRANSLATIONS,
  appName: 'ಕಿಸಾನ್ ಸೇತು',
  tagline: 'ಸ್ಮಾರ್ಟ್ ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ ಮತ್ತು ಬೆಲೆ ಪತ್ತೆ ವೇದಿಕೆ',
  step1Title: 'ಸ್ಥಳ ಆಯ್ಕೆ',
  step2Title: 'ಬೆಳೆ ವಿವರಗಳು',
  step3Title: 'ಮಾರುಕಟ್ಟೆ ಹೋಲಿಕೆ',
  step4Title: 'ಒಪ್ಪಂದ ಸಾರಾಂಶ',
  stepIndicator: 'ಹಂತ',

  welcomeTitle: 'ಕಿಸಾನ್ ಸೇತುಗೆ ಸುಸ್ವಾಗತ 🌾',
  chooseLanguage: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  themeLight: 'ಬೆಳಕಿನ ಥೀಮ್ (Light)',
  themeDark: 'ಡಾರ್ಕ್ ಥೀಮ್ (Dark)',
  continueButton: 'ಮುಂದುವರಿಯಿರಿ →',

  locationPrompt: 'ನಿಮ್ಮ ಬೆಳೆ ಎಲ್ಲಿದೆ?',
  useCurrentLocation: 'GPS ಸ್ಥಳವನ್ನು ಬಳಸಿ',
  detectMyLocation: '📍 ನನ್ನ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ',
  enterLocationManually: '🔍 ಸ್ಥಳವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ',
  gettingLocation: 'GPS ಸಂಪರ್ಕಗೊಳ್ಳುತ್ತಿದೆ...',
  findingLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
  locationDetectionFailed: 'ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ನಮೂದಿಸಿ.',
  searchLocationPrompt: 'ಗ್ರಾಮ, ಪಟ್ಟಣ, ಜಿಲ್ಲೆ ಅಥವಾ ಪಿನ್ ಕೋಡ್ ಹುಡುಕಿ...',
  searchLocationPlaceholder: 'ಗ್ರಾಮ, ತಾಲೂಕು, ಜಿಲ್ಲೆ ಹುಡುಕಿ (ಉದಾ. ಕಡಪ, ಬಳ್ಳಾರಿ, ಕೋಲಾರ)...',
  manualLocationTitle: 'ಅಥವಾ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ನೇರವಾಗಿ ಆಯ್ಕೆಮಾಡಿ',
  yourLocation: 'ನಿಮ್ಮ ಸ್ಥಳ',
  confirmLocation: 'ಸ್ಥಳವನ್ನು ಖಚಿತಪಡಿಸಿ',
  selectState: 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  selectDistrict: 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  enterTownVillage: 'ಗ್ರಾಮ ಅಥವಾ ಪಟ್ಟಣದ ಹೆಸರು',
  changeLocation: 'ಸ್ಥಳವನ್ನು ಬದಲಾಯಿಸಿ',
  gpsAccuracy: 'ಕೃಷಿ ಮಟ್ಟದ ನಿಖರತೆ',

  roleSelectionTitle: 'ನೀವು ಕಿಸಾನ್ ಸೇತುವನ್ನು ಹೇಗೆ ಬಳಸಲು ಬಯಸುತ್ತೀರಿ?',
  roleSelectionSubtitle: 'ರೈತರು ಮತ್ತು ಖರೀದಿದಾರರ ನಡುವೆ ನೇರ ಸಂಪರ್ಕ',
  roleFarmerTitle: 'ರೈತ (FARMER)',
  roleFarmerTagline: 'ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ. ಹೊಸ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ತಲುಪಿ.',
  roleFarmerFeature1: 'ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಗುಣಮಟ್ಟ ಘೋಷಿಸಿ',
  roleFarmerFeature2: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳ ಲೈವ್ ದರ ಮತ್ತು ದೂರ ಹೋಲಿಕೆ',
  roleFarmerFeature3: 'ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ',
  roleBuyerTitle: 'ಖರೀದಿದಾರ (BUYER)',
  roleBuyerTagline: 'ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ.',
  roleBuyerFeature1: 'ಫೋಟೋಗಳೊಂದಿಗೆ ನೈಜ ಬೆಳೆಗಳ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ',
  roleBuyerFeature2: 'ರೈತರಿಗೆ ನಿಖರವಾದ ರಸ್ತೆ ದೂರ ಲೆಕ್ಕಾಚಾರ',
  roleBuyerFeature3: 'ರೈತರಿಗೆ ನೇರ ಕರೆ ಮತ್ತು ತ್ವರಿತ ಡೀಲ್ ಆಫರ್',
  enterAsFarmer: 'ರೈತರಾಗಿ ಮುಂದುವರಿಯಿರಿ',
  enterAsBuyer: 'ಖರೀದಿದಾರರಾಗಿ ಮುಂದುವರಿಯಿರಿ',
  switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',

  guideCrop: '👋 ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬೆಳೆಗೆ ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ದರ ಹುಡುಕಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಮೊದಲು ನೀವು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುವ ಬೆಳೆಯನ್ನು ಆರಿಸಿ.',
  guideDetails: '📋 ಕೊಯ್ಲು ವಿವರಗಳು, ತಳಿ ಮತ್ತು ಪ್ರಮಾಣವನ್ನು ನಮೂದಿಸಿ.',
  guidePhotos: '📸 ಖರೀದಿದಾರರು ಸ್ಪಷ್ಟವಾಗಿ ನೋಡಲು ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
  guideQuality: '⭐ ಬೆಳೆಯ ನಿರೀಕ್ಷಿತ ಗುಣಮಟ್ಟ ಶ್ರೇಣಿ (ಗ್ರೇಡ್ A, B ಅಥವಾ C) ಆಯ್ಕೆಮಾಡಿ.',
  guideMarkets: '📍 ನೈಜ ಸಾರಿಗೆ ವೆಚ್ಚದೊಂದಿಗೆ ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ.',
  guideContact: '📱 ಖರೀದಿದಾರರು ಸಂಪರ್ಕಿಸಲು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
  guidePublish: '🚀 ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಪ್ರಕಟಿಸಿ.',

  whatSelling: 'ನೀವು ಯಾವ ಬೆಳೆಯನ್ನು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?',
  chooseCategory: 'ಬೆಳೆ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  allCrops: 'ಎಲ್ಲಾ ಬೆಳೆಗಳು',
  cereals: 'ಧಾನ್ಯಗಳು (ಭತ್ತ, ಜೋಳ, ರಾಗಿ, ಗೋಧಿ)',
  pulses: 'ಬೇಳೆಕಾಳುಗಳು (ತೊಗರಿ, ಕಡಲೆ)',
  vegetables: 'ತರಕಾರಿಗಳು (ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಮೆಣಸಿನಕಾಯಿ)',
  fruits: 'ಹಣ್ಣುಗಳು (ಮಾವಿನಹಣ್ಣು, ಬಾಳೆಹಣ್ಣು)',
  commercial: 'ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು (ಹತ್ತಿ, ಅರಿಶಿನ)',
  otherCrop: '+ ಇತರೆ ಬೆಳೆ',
  howMuchSelling: 'ನೀವು ಎಷ್ಟು ಪ್ರಮಾಣ ಮಾರಾಟ ಮಾಡುತ್ತೀರಿ?',
  quantityPlaceholder: 'ಪ್ರಮಾಣ ನಮೂದಿಸಿ (ಉದಾ. 50)',
  kg: 'ಕಿಲೋಗ್ರಾಂ (kg)',
  quintal: 'ಕ್ವಿಂಟಾಲ್ (100 ಕೆಜಿ)',
  tonne: 'ಟನ್ (1,000 ಕೆಜಿ)',

  uploadCropPhotos: 'ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
  uploadCropPhotosDesc: 'ನಿಮ್ಮ ಬೆಳೆ ಫೋಟೋಗಳು ಖರೀದಿದಾರರಿಗೆ ಗುಣಮಟ್ಟವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
  takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
  uploadDevice: 'ಡಿವೈಸ್‌ನಿಂದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
  clickToUpload: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ',

  whatQuality: 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಗ್ರೇಡ್',
  farmerDeclaredQuality: 'ರೈತರು ಘೋಷಿಸಿದ ಗುಣಮಟ್ಟ (Farmer-declared)',
  farmerDeclaredNote: 'ನಿಮ್ಮ ಬೆಳೆಯ ಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಗುಣಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಇದು ಖರೀದಿದಾರರಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಗೋಚರಿಸುತ್ತದೆ.',
  gradeA: 'ಗ್ರೇಡ್ A (ಉತ್ತಮ ಗುಣಮಟ್ಟ)',
  gradeADesc: 'ಉತ್ತಮ ಹೊಳಪು, ಸಮಾನ ಗಾತ್ರ, ಕೀಟ ಬಾಧೆಯಿಲ್ಲ (+5% ಹೆಚ್ಚು ಬೆಲೆ)',
  gradeAPremium: 'ಗ್ರೇಡ್ A (ಪ್ರೀಮಿಯಂ ಗುಣಮಟ್ಟ)',
  gradeB: 'ಗ್ರೇಡ್ B (ಸಾಧಾರಣ FAQ ಗುಣಮಟ್ಟ)',
  gradeBDesc: 'ಸಾಮಾನ್ಯ ಉತ್ತಮ ಗುಣಮಟ್ಟ, ಸ್ವಚ್ಛ ಬೆಳೆ, ಪ್ರಮಾಣಿತ ಮಾರುಕಟ್ಟೆ ದರ',
  gradeBStandard: 'ಗ್ರೇಡ್ B (ಸಾಧಾರಣ ಗುಣಮಟ್ಟ)',
  gradeC: 'ಗ್ರೇಡ್ C (ಮೂಲ ಗುಣಮಟ್ಟ)',
  gradeCDesc: 'ಸ್ವಲ್ಪ ಬಣ್ಣ ಬದಲಾವಣೆ ಅಥವಾ ಸಣ್ಣ ಕಾಳು (-5% ಕಡಿಮೆ ಬೆಲೆ)',
  gradeCBasic: 'ಗ್ರೇಡ್ C (ಮೂಲ ಗುಣಮಟ್ಟ)',

  continueToMarket: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ →',
  backToCrops: '← ಬೆಳೆ ವಿವರಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
  backToLocation: '← ಸ್ಥಳಕ್ಕೆ ಹಿಂತಿರುಗಿ',
  finishSummary: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪ್ರಕಟಿಸಿ',

  bestMarketsNearYou: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಅತ್ಯುತ್ತಮ ಮಾರುಕಟ್ಟೆಗಳು',
  recommendedForYou: 'ನಿಮಗೆ ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರುಕಟ್ಟೆ',
  recommendedBadge: 'ಉತ್ತಮ ಬೆಲೆ ಮತ್ತು ದೂರ',
  nearestMarkets: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳು',
  bestPriceMarkets: 'ಅತ್ಯಧಿಕ ಬೆಲೆಯ ಮಾರುಕಟ್ಟೆಗಳು',
  bestOverallChoice: '🏆 ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ',
  viewOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ',
  listView: 'ಪಟ್ಟಿ ವೀಕ್ಷಣೆ',
  netReturn: 'ಸಾರಿಗೆ ಮತ್ತು ಶುಲ್ಕಗಳನ್ನು ಕಳೆದ ನಂತರ ಕೈಗೆ ಸಿಗುವ ನಿವ್ವಳ ಹಣ',
  modalMarketPrice: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
  estimatedTransport: 'ಅಂದಾಜು ಸಾರಿಗೆ ವೆಚ್ಚ',
  distanceRoad: 'ರಸ್ತೆ ದೂರ',

  farmerContactDetails: 'ರೈತರ ಸಂಪರ್ಕ ವಿವರಗಳು',
  farmerName: 'ರೈತರ ಪೂರ್ಣ ಹೆಸರು',
  farmerMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕೆಗಳು)',
  contactMethod: 'ಸಂಪರ್ಕಿಸುವ ಆದ್ಯತೆಯ ವಿಧಾನ',
  phoneCall: 'ಫೋನ್ ಕರೆ',
  whatsApp: 'ವಾಟ್ಸಾಪ್ ಸಂದೇಶ',
  privacyNote: 'ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳು ಆಸಕ್ತ ಖರೀದಿದಾರರಿಗೆ ಮಾತ್ರ ಸುರಕ್ಷಿತವಾಗಿ ತೋರಿಸಲಾಗುತ್ತದೆ.',

  reviewPublish: 'ಪರಿಶೀಲನೆ ಮತ್ತು ಪ್ರಕಟಣೆ',
  publishMyCrop: '🚀 ನನ್ನ ಬೆಳೆಯನ್ನು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಪ್ರಕಟಿಸಿ',
  listingPublishedSuccess: 'ನಿಮ್ಮ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಗೊಂಡಿದೆ! ಈಗ ಖರೀದಿದಾರರಿಗೆ ಗೋಚರಿಸುತ್ತದೆ.',
  viewInBuyerMarketplace: 'ಖರೀದಿದಾರರ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ',
  myListings: 'ನನ್ನ ಪ್ರಕಟಿತ ಬೆಳೆಗಳ ಪಟ್ಟಿ',

  findFreshProduce: 'ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ 🌾',
  allGrades: 'ಎಲ್ಲಾ ಗ್ರೇಡ್‌ಗಳು',
  allDistances: 'ಎಲ್ಲಾ ದೂರಗಳು',
  filterCrop: 'ಬೆಳೆ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ',
  viewDetails: 'ಸಂಪೂರ್ಣ ವಿವರಗಳು',
  contactFarmer: 'ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ',
  makeOffer: 'ಆಫರ್ ನೀಡಿ',
  sendInterest: 'ಆಸಕ್ತಿ ವ್ಯಕ್ತಪಡಿಸಿ',
  farmerLocation: 'ರೈತರ ಸ್ಥಳ',
  distanceFromYou: 'ನಿಮ್ಮಿಂದ ದೂರ',
  expectedPrice: 'ನಿರೀಕ್ಷಿತ ಬೆಲೆ',
  harvestDate: 'ಕೊಯ್ಲು ದಿನಾಂಕ',
};

// 6. MALAYALAM TRANSLATIONS (മലയാളം)
export const ML_TRANSLATIONS: Translations = {
  ...EN_TRANSLATIONS,
  appName: 'കിസാൻ സേതു',
  tagline: 'സ്മാർട്ട് മാർക്കറ്റ് ലിങ്കേജ് & വില കണ്ടെത്തൽ പ്ലാറ്റ്‌ഫോം',
  step1Title: 'സ്ഥലം തിരഞ്ഞെടുക്കുക',
  step2Title: 'വിള വിവരങ്ങൾ',
  step3Title: 'മാർക്കറ്റ് താരതമ്യം',
  step4Title: 'കരാർ സംഗ്രഹം',
  stepIndicator: 'ഘട്ടം',

  welcomeTitle: 'കിസാൻ സേതുവിലേക്ക് സ്വാഗതം 🌾',
  chooseLanguage: 'നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക',
  themeLight: 'ലൈറ്റ് തീം (പകൽ മോഡ്)',
  themeDark: 'ഡാർക്ക് തീം (രാത്രി മോഡ്)',
  continueButton: 'തുടരുക →',

  locationPrompt: 'നിങ്ങളുടെ ഉൽപ്പന്നം എവിടെയാണ് സ്ഥിതി ചെയ്യുന്നത്?',
  useCurrentLocation: 'GPS ലൊക്കേഷൻ ഉപയോഗിക്കുക',
  detectMyLocation: '📍 എൻ്റെ ലൊക്കേഷൻ കണ്ടെത്തുക',
  enterLocationManually: '🔍 ലൊക്കേഷൻ നേരിട്ട് നൽകുക',
  gettingLocation: 'GPS ബന്ധിപ്പിക്കുന്നു...',
  findingLocation: 'നിങ്ങളുടെ ലൊക്കേഷൻ കണ്ടെത്തുന്നു...',
  locationDetectionFailed: 'ലൊക്കേഷൻ കണ്ടെത്താനായില്ല. ദയവായി നേരിട്ട് നൽകുക.',
  searchLocationPrompt: 'ഗ്രാമം, പട്ടണം, ജില്ല അല്ലെങ്കിൽ പിൻകോഡ് തിരയുക...',
  searchLocationPlaceholder: 'ഗ്രാമം, താലൂക്ക്, ജില്ല തിരയുക (ഉദാ. കടപ്പ, പാലക്കാട്)...',
  manualLocationTitle: 'അല്ലെങ്കിൽ സംസ്ഥാനവും ജില്ലയും നേരിട്ട് തിരഞ്ഞെടുക്കുക',
  yourLocation: 'നിങ്ങളുടെ ലൊക്കേഷൻ',
  confirmLocation: 'ലൊക്കേഷൻ സ്ഥിരീകരിക്കുക',
  selectState: 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
  selectDistrict: 'ജില്ല തിരഞ്ഞെടുക്കുക',
  enterTownVillage: 'ഗ്രാമം അല്ലെങ്കിൽ പട്ടണത്തിന്റെ പേര്',
  changeLocation: 'ലൊക്കേഷൻ മാറ്റുക',
  gpsAccuracy: 'കൃഷിയിട ലെവൽ കൃത്യത',

  roleSelectionTitle: 'കിസാൻ സേതു എങ്ങനെ ഉപയോഗിക്കാൻ ആഗ്രഹിക്കുന്നു?',
  roleSelectionSubtitle: 'കർഷകരും വാങ്ങുന്നവരും തമ്മിലുള്ള നേരിട്ടുള്ള ബന്ധം',
  roleFarmerTitle: 'കർഷകൻ (FARMER)',
  roleFarmerTagline: 'മികച്ച വില നേടുക. കൂടുതൽ വിപണികളിലേക്ക് എത്തുക.',
  roleFarmerFeature1: 'വിളയുടെ ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്ത് ഗുണനിലവാരം പ്രഖ്യാപിക്കുക',
  roleFarmerFeature2: 'സമീപത്തെ മാർക്കറ്റുകളിലെ തത്സമയ വിലയും ദൂരവും താരതമ്യം ചെയ്യുക',
  roleFarmerFeature3: 'പരിശോധിച്ചുറപ്പിച്ച വ്യാപാരികളുമായി നേരിട്ട് ഇടപാട് നടത്തുക',
  roleBuyerTitle: 'വാങ്ങുന്നയാൾ (BUYER)',
  roleBuyerTagline: 'കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ കാർഷിക ഉൽപ്പന്നങ്ങൾ വാങ്ങുക.',
  roleBuyerFeature1: 'ഫോട്ടോകൾ സഹിതം യഥാർത്ഥ വിളകളുടെ ലിസ്റ്റ് കാണുക',
  roleBuyerFeature2: 'കർഷകനിലേക്കുള്ള കൃത്യമായ റോഡ് ദൂരം കണക്കാക്കുക',
  roleBuyerFeature3: 'കർഷകരെ നേരിട്ട് വിളിച്ച് തത്സമയ ഓഫർ നൽകുക',
  enterAsFarmer: 'കർഷകനായി തുടരുക',
  enterAsBuyer: 'വാങ്ങുന്നയാളായി തുടരുക',
  switchRole: 'റോൾ മാറ്റുക',

  guideCrop: '👋 നമസ്കാരം! നിങ്ങളുടെ വിളയ്ക്ക് ഏറ്റവും മികച്ച വിപണിയും വിലയും കണ്ടെത്താൻ ഞാൻ സഹായിക്കാം. ആദ്യം നിങ്ങൾ വിൽക്കാൻ ആഗ്രഹിക്കുന്ന വിള തിരഞ്ഞെടുക്കുക.',
  guideDetails: '📋 വിളവെടുപ്പ് വിവരങ്ങൾ, ഇനം, അളവ് എന്നിവ നൽകുക.',
  guidePhotos: '📸 വാങ്ങുന്നവർക്ക് വ്യക്തമായി കാണാൻ നിങ്ങളുടെ വിളയുടെ ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക.',
  guideQuality: '⭐ വിളയുടെ ഗുണനിലവാര ഗ്രേഡ് (ഗ്രേഡ് A, B അല്ലെങ്കിൽ C) തിരഞ്ഞെടുക്കുക.',
  guideMarkets: '📍 യഥാർത്ഥ ഗതാഗത ചെലവുകൾക്കൊപ്പം സമീപത്തെ മാർക്കറ്റുകൾ താരതമ്യം ചെയ്യുക.',
  guideContact: '📱 വ്യാപാരികൾക്ക് ബന്ധപ്പെടാൻ മൊബൈൽ നമ്പർ നൽകുക.',
  guidePublish: '🚀 വിവരങ്ങൾ പരിശോധിച്ച് നിങ്ങളുടെ വിള വിപണിയിൽ ലിസ്റ്റ് ചെയ്യുക.',

  whatSelling: 'ഏത് വിളയാണ് വിൽക്കാൻ ആഗ്രഹിക്കുന്നത്?',
  chooseCategory: 'വിള വിഭാഗം തിരഞ്ഞെടുക്കുക',
  allCrops: 'എല്ലാ വിളകളും',
  cereals: 'ധാന്യങ്ങൾ (നെല്ല്, ചോളം, ഗോതമ്പ്)',
  pulses: 'പയറുവർഗ്ഗങ്ങൾ (തുവര, കടല, പയർ)',
  vegetables: 'പച്ചക്കറികൾ (തക്കാളി, ഉള്ളി, പച്ചമുളക്)',
  fruits: 'പഴങ്ങൾ (മാമ്പഴം, വാഴപ്പഴം)',
  commercial: 'വാണിജ്യ വിളകൾ (കുരുമുളക്, ഏലം, മഞ്ഞൾ, റബ്ബർ)',
  otherCrop: '+ മറ്റ് വിളകൾ',
  howMuchSelling: 'എത്ര അളവാണ് വിൽക്കുന്നത്?',
  quantityPlaceholder: 'അളവ് നൽകുക (ഉദാ. 50)',
  kg: 'കിലോഗ്രാം (kg)',
  quintal: 'ക്വിന്റൽ (100 കിലോ)',
  tonne: 'ടൺ (1,000 കിലോ)',

  uploadCropPhotos: 'വിളയുടെ ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക',
  uploadCropPhotosDesc: 'നിങ്ങളുടെ വിളയുടെ ഫോട്ടോകൾ വാങ്ങുന്നവർക്ക് ഗുണനിലവാരം മനസ്സിലാക്കാൻ സഹായിക്കുന്നു.',
  takePhoto: 'ഫോട്ടോ എടുക്കുക',
  uploadDevice: 'ഡിവൈസിൽ നിന്ന് അപ്‌ലോഡ് ചെയ്യുക',
  clickToUpload: 'അപ്‌ലോഡ് ചെയ്യാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക',

  whatQuality: 'വിള ഗുണനിലവാര ഗ്രേഡ്',
  farmerDeclaredQuality: 'കർഷകൻ പ്രഖ്യാപിച്ച ഗുണനിലവാരം (Farmer-declared)',
  farmerDeclaredNote: 'വിളയുടെ അവസ്ഥയനുസരിച്ച് ഗ്രേഡ് തിരഞ്ഞെടുക്കുക. ഇത് വാങ്ങുന്നവർക്ക് വ്യക്തമായി കാണാനാകും.',
  gradeA: 'ഗ്രേഡ് A (മികച്ച ഗുണനിലവാരം)',
  gradeADesc: 'നല്ല തിളക്കം, ഒരേ വലിപ്പം, കേടുപാടുകൾ ഇല്ലാത്ത വിള (+5% കൂടുതൽ വില)',
  gradeAPremium: 'ഗ്രേഡ് A (പ്രീമിയം ഗുണനിലവാരം)',
  gradeB: 'ഗ്രേഡ് B (സാധാരണ FAQ ഗുണനിലവാരം)',
  gradeBDesc: 'സാധാരണ നല്ല ഗുണനിലവാരം, വൃത്തിയുള്ള വിള, സാധാരണ മാർക്കറ്റ് വില',
  gradeBStandard: 'ഗ്രേഡ് B (സാധാരണ ഗുണനിലവാരം)',
  gradeC: 'ഗ്രേഡ് C (അടിസ്ഥാന ഗുണനിലവാരം)',
  gradeCDesc: 'ചെറിയ നിറവ്യത്യാസമോ ചെറിയ ധാന്യങ്ങളോ (-5% കുറഞ്ഞ വില)',
  gradeCBasic: 'ഗ്രേഡ് C (അടിസ്ഥാന ഗുണനിലവാരം)',

  continueToMarket: 'സമീപത്തെ മാർക്കറ്റുകൾ താരതമ്യം ചെയ്യുക →',
  backToCrops: '← വിള വിവരങ്ങളിലേക്ക് മടങ്ങുക',
  backToLocation: '← ലൊക്കേഷനിലേക്ക് മടങ്ങുക',
  finishSummary: 'പരിശോധിച്ച് പ്രസിദ്ധീകരിക്കുക',

  bestMarketsNearYou: 'നിങ്ങളുടെ അടുത്തുള്ള മികച്ച മാർക്കറ്റുകൾ',
  recommendedForYou: 'നിങ്ങൾക്കായി ശുപാർശ ചെയ്ത മാർക്കറ്റ്',
  recommendedBadge: 'മികച്ച വിലയും ദൂരവും',
  nearestMarkets: 'അടുത്തുള്ള മാർക്കറ്റുകൾ',
  bestPriceMarkets: 'ഏറ്റവും ഉയർന്ന വിലയുള്ള മാർക്കറ്റുകൾ',
  bestOverallChoice: '🏆 ഏറ്റവും മികച്ച തിരഞ്ഞെടുപ്പ്',
  viewOnMap: 'മാപ്പിൽ കാണുക',
  listView: 'ലിസ്റ്റ് കാഴ്ച',
  netReturn: 'ചെലവുകൾ കഴിഞ്ഞ് കൈയ്യിൽ ലഭിക്കുന്ന അറ്റാദായം',
  modalMarketPrice: 'മാർക്കറ്റ് വില',
  estimatedTransport: 'ഗതാഗത ചെലവ്',
  distanceRoad: 'റോഡ് ദൂരം',

  farmerContactDetails: 'കർഷകന്റെ ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ',
  farmerName: 'കർഷകന്റെ പൂർണ്ണ പേര്',
  farmerMobile: 'മൊബൈൽ നമ്പർ (10 അക്കങ്ങൾ)',
  contactMethod: 'ബന്ധപ്പെടാൻ ആഗ്രഹിക്കുന്ന രീതി',
  phoneCall: 'ഫോൺ കോൾ',
  whatsApp: 'വാട്സാപ്പ് സന്ദേശം',
  privacyNote: 'നിങ്ങളുടെ വിവരങ്ങൾ താല്പര്യമുള്ള വ്യാപാരികൾക്ക് മാത്രമേ കാണിക്കൂ.',

  reviewPublish: 'പരിശോധന & പ്രസിദ്ധീകരണം',
  publishMyCrop: '🚀 എന്റെ വിള വിപണിയിൽ ലിസ്റ്റ് ചെയ്യുക',
  listingPublishedSuccess: 'നിങ്ങളുടെ വിള വിജയകരമായി ലിസ്റ്റ് ചെയ്തു! ഇപ്പോൾ വ്യാപാരികൾക്ക് കാണാം.',
  viewInBuyerMarketplace: 'ബയർ മാർക്കറ്റിൽ കാണുക',
  myListings: 'എന്റെ വിളകളുടെ ലിസ്റ്റ്',

  findFreshProduce: 'കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ കാർഷിക ഉൽപ്പന്നങ്ങൾ 🌾',
  allGrades: 'എല്ലാ ഗ്രേഡുകളും',
  allDistances: 'എല്ലാ ദൂരങ്ങളും',
  filterCrop: 'വിളയനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക',
  viewDetails: 'പൂർണ്ണ വിവരങ്ങൾ',
  contactFarmer: 'കർഷകനെ വിളിക്കുക',
  makeOffer: 'ഓഫർ നൽകുക',
  sendInterest: 'താല്പര്യം അറിയിക്കുക',
  farmerLocation: 'കർഷകന്റെ ലൊക്കേഷൻ',
  distanceFromYou: 'നിങ്ങളിൽ നിന്നുള്ള ദൂരം',
  expectedPrice: 'പ്രതീക്ഷിക്കുന്ന വില',
  harvestDate: 'വിളവെടുപ്പ് തീയതി',
};

// 7. MARATHI TRANSLATIONS (मराठी)
export const MR_TRANSLATIONS: Translations = {
  ...HI_TRANSLATIONS,
  appName: 'किसान सेतू',
  tagline: 'स्मार्ट कृषी बाजार जोडणी व भाव शोध व्यासपीठ',
  welcomeTitle: 'किसान सेतू मध्ये आपले स्वागत आहे 🌾',
  chooseLanguage: 'आपली पसंतीची भाषा निवडा',
  themeLight: 'लाईट थीम (दिवसाचा मोड)',
  themeDark: 'डार्क थीम (रात्रीचा मोड)',
  continueButton: 'पुढे जा →',
  locationPrompt: 'आपला शेतीमाल कुठे आहे?',
  useCurrentLocation: 'GPS स्थान वापरा',
  detectMyLocation: '📍 माझे स्थान शोधा',
  enterLocationManually: '🔍 स्थान स्वतः टाइप करा',
  yourLocation: 'आपले स्थान',
  confirmLocation: 'स्थान निश्चित करा',
  roleFarmerTitle: 'शेतकरी (FARMER)',
  roleBuyerTitle: 'खरेदीदार (BUYER)',
  enterAsFarmer: 'शेतकरी म्हणून पुढे जा',
  enterAsBuyer: 'खरेदीदार म्हणून पुढे जा',
};
