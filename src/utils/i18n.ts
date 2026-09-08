import { Language } from '../types/krishi';

export interface Translations {
  appName: string;
  tagline: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  stepIndicator: string;
  
  // Location & Step 1
  locationPrompt: string;
  useCurrentLocation: string;
  gettingLocation: string;
  searchLocationPlaceholder: string;
  manualLocationTitle: string;
  selectState: string;
  selectDistrict: string;
  enterTownVillage: string;
  changeLocation: string;
  gpsAccuracy: string;
  demoModeNotice: string;
  demoModeBadge: string;
  
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
  
  // Quality
  whatQuality: string;
  qualityOptionManual: string;
  qualityOptionAI: string;
  gradeA: string;
  gradeADesc: string;
  gradeB: string;
  gradeBDesc: string;
  gradeC: string;
  gradeCDesc: string;
  customGrade: string;
  customGradeDesc: string;
  
  // AI Camera
  checkCropQuality: string;
  takePhoto: string;
  retakePhoto: string;
  usePhoto: string;
  switchCamera: string;
  cameraGuidance: string;
  cameraOverlayTip: string;
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
  
  // Hard Gate Validation & Errors
  pleaseSelectCrop: string;
  pleaseEnterQuantity: string;
  pleaseSelectQuality: string;
  pleaseConfirmAiResult: string;
  pleaseEnterCropName: string;
  missingFieldsAlert: string;
  
  // Navigation
  continueToMarket: string;
  backToCrops: string;
  backToLocation: string;
  finishSummary: string;
  
  // Market Comparison & Step 3
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
  listView: string;
  mapUnavailable: string;
  demoLocationWarning: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'KrishiSetu',
    tagline: 'Empowering Kisan • Smart Crop to Market Intelligence',
    step1Title: 'Select Location',
    step2Title: 'Crop Details',
    step3Title: 'Market Comparison',
    step4Title: 'Deal Summary',
    stepIndicator: 'Step',
    
    locationPrompt: 'Where is your farm or produce located?',
    useCurrentLocation: '📍 Use Current GPS Location',
    gettingLocation: 'Detecting your farm location...',
    searchLocationPlaceholder: 'Search village, town, mandal or district in India...',
    manualLocationTitle: 'Or choose manually across India',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    enterTownVillage: 'Town, Mandal or Village Name',
    changeLocation: 'Change Location',
    gpsAccuracy: 'Accurate to field level',
    demoModeNotice: 'DEMO MODE — SAMPLE DATA FOR PROTOTYPING',
    demoModeBadge: 'DEMO MODE',
    
    whatSelling: 'What crop are you selling?',
    chooseCategory: 'Crop Category',
    allCrops: 'All',
    cereals: 'Cereals',
    pulses: 'Pulses',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    commercial: 'Commercial',
    otherCrop: '+ Other Crop',
    enterCustomCropName: 'Enter your crop name:',
    customCropPlaceholder: 'e.g., Mustard Variety Pusa, Cluster Beans...',
    searchCropsPlaceholder: 'Search crop (e.g., Paddy, Tomato, Gehun, Mirchi)...',
    noCropsFound: 'No crops found matching your search',
    tryAnotherName: 'Try another crop name or choose "All" category.',
    
    howMuchSelling: 'How much do you want to sell?',
    quantityPlaceholder: 'Enter quantity (e.g. 10)',
    kg: 'kg',
    quintal: 'Quintal (100 kg)',
    tonne: 'Tonne (1,000 kg)',
    standardizedKg: 'Standardized weight',
    
    whatQuality: 'What is the quality of your harvest?',
    qualityOptionManual: 'Select Quality Manually',
    qualityOptionAI: '📷 Check Crop Quality (AI Camera)',
    gradeA: 'Grade A (Superior)',
    gradeADesc: 'High luster, bold uniform size, zero pest defects (+5% price premium)',
    gradeB: 'Grade B (Standard / FAQ)',
    gradeBDesc: 'Fair average quality, clean harvest, standard market modal rate',
    gradeC: 'Grade C (Secondary / Mixed)',
    gradeCDesc: 'Minor discoloration, variable size, requires grading (-5% discount)',
    customGrade: 'Custom / Unspecified',
    customGradeDesc: 'Negotiated spot rate upon physical buyer inspection',
    
    checkCropQuality: '📷 Check Crop Quality',
    takePhoto: 'Capture Photo',
    retakePhoto: 'Retake Photo',
    usePhoto: 'Use This Photo',
    switchCamera: 'Switch Camera',
    cameraGuidance: 'Place the crop clearly in the frame with good natural lighting.',
    cameraOverlayTip: 'Keep crop visible • Avoid heavy shadows',
    analyzingCrop: 'AI is inspecting your crop sample...',
    analyzingSubtext: 'Evaluating grain fullness, discoloration, uniformity & visible defects...',
    qualityAssessment: 'Crop Quality Assessment',
    suggestedGrade: 'Suggested Quality Grade',
    confidence: 'AI Confidence',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence',
    whyThisGrade: 'Why was this grade suggested?',
    whatWeObserved: 'What our vision model observed:',
    cropDoesNotMatch: '⚠️ Photo does not match selected crop',
    cropMismatchDesc: 'The captured image looks different from the crop selected above. Please retake the photo or change the selected crop.',
    photoIsUnclear: '⚠️ Photo is too blurry or unclear',
    photoUnclearDesc: 'The lighting or focus was not clear enough for a reliable assessment. You can retake the photo or choose the grade manually.',
    chooseManually: 'Choose Grade Manually',
    changeCrop: 'Change Selected Crop',
    aiVisualEstimate: 'AI visual estimate from photo surface',
    notLaboratoryTest: '⚠️ Not a laboratory test. Exact moisture %, oil content, or chemical residues require physical instruments and cannot be confirmed from photos alone.',
    useGradeA: 'Accept & Use Grade A',
    useGradeB: 'Accept & Use Grade B',
    useGradeC: 'Accept & Use Grade C',
    demoAiResult: 'DEMO AI RESULT — SAMPLE ANALYSIS',
    cameraAccessDenied: 'Camera access is unavailable',
    cameraDeniedDesc: 'Camera permission was not granted or your device does not have an active camera. You can upload a photo or choose quality manually.',
    uploadFromComputer: 'Upload image file from device',
    
    pleaseSelectCrop: 'Please select or enter your crop.',
    pleaseEnterQuantity: 'Please enter how much you want to sell (must be > 0).',
    pleaseSelectQuality: 'Please select the crop quality or complete the AI check.',
    pleaseConfirmAiResult: 'Please confirm or select a grade for the AI quality check.',
    pleaseEnterCropName: 'Please enter the name of your custom crop.',
    missingFieldsAlert: 'Please complete all required crop details highlighted below.',
    
    continueToMarket: 'Continue to Market Comparison →',
    backToCrops: '← Back to Crop Details',
    backToLocation: '← Back to Location',
    finishSummary: 'View Final Deal Slip',
    
    bestOptionBadge: '⭐ HIGHEST NET PROFIT',
    netReturn: 'Estimated Net Take-Home',
    modalMarketPrice: 'Mandi Rate',
    estimatedTransport: 'Estimated Transport Cost',
    marketFee: 'Mandi Cess / User Fee',
    unloadingCharge: 'Hamali / Unloading',
    distanceRoad: 'Road Distance',
    distanceApprox: 'Approx Distance',
    travelTime: 'Est. Travel Time',
    verifiedBuyer: 'Verified Buyer',
    sameDayPayment: 'Instant Payment on Delivery',
    getDirections: '🗺️ Get Google Maps Directions',
    mapView: 'Interactive Map',
    listView: 'List Comparison',
    mapUnavailable: 'Map service is temporarily in fallback mode. All agricultural price discovery calculations remain fully operational.',
    demoLocationWarning: 'Demo coordinates active. Use GPS or Places Search for real-world locations anywhere in India.',
  },

  hi: {
    appName: 'कृषिसेतु',
    tagline: 'किसान सशक्तिकरण • फसल से मंडी तक का भरोसेमंद साथी',
    step1Title: 'स्थान चुनें',
    step2Title: 'फसल का विवरण',
    step3Title: 'मंडी तुलना',
    step4Title: 'सौदा सारांश',
    stepIndicator: 'चरण',
    
    locationPrompt: 'आपका खेत या उपज किस स्थान पर है?',
    useCurrentLocation: '📍 वर्तमान GPS स्थान का उपयोग करें',
    gettingLocation: 'आपके खेत का स्थान खोजा जा रहा है...',
    searchLocationPlaceholder: 'भारत में अपना गाँव, कस्बा, तहसील या जिला खोजें...',
    manualLocationTitle: 'या भारत भर में से स्वयं चुनें',
    selectState: 'राज्य चुनें',
    selectDistrict: 'जिला चुनें',
    enterTownVillage: 'गाँव, ब्लॉक या कस्बा का नाम',
    changeLocation: 'स्थान बदलें',
    gpsAccuracy: 'खेत स्तर तक सटीक',
    demoModeNotice: 'डेमो मोड — प्रोटोटाइप हेतु नमूना डेटा',
    demoModeBadge: 'डेमो मोड',
    
    whatSelling: 'आप कौन सी फसल बेचना चाहते हैं?',
    chooseCategory: 'फसल वर्ग (कैटेगरी)',
    allCrops: 'सभी फसलें',
    cereals: 'अनाज (Cereals)',
    pulses: 'दालें (Pulses)',
    vegetables: 'सब्जियां',
    fruits: 'फल',
    commercial: 'व्यावसायिक (Commercial)',
    otherCrop: '+ अन्य फसल',
    enterCustomCropName: 'अपनी फसल का नाम दर्ज करें:',
    customCropPlaceholder: 'उदा. पूसा सरसों, ग्वार फली...',
    searchCropsPlaceholder: 'फसल खोजें (जैसे धान, गेहूं, टमाटर, मिर्च)...',
    noCropsFound: 'खोज के अनुसार कोई फसल नहीं मिली',
    tryAnotherName: 'कोई दूसरा नाम लिखें या "सभी फसलें" चुनें।',
    
    howMuchSelling: 'आप कितनी मात्रा बेचना चाहते हैं?',
    quantityPlaceholder: 'मात्रा दर्ज करें (उदा. 10)',
    kg: 'किलोग्राम (kg)',
    quintal: 'क्विंटल (100 किलो)',
    tonne: 'टन (1,000 किलो)',
    standardizedKg: 'मानकीकृत वजन',
    
    whatQuality: 'आपकी फसल की गुणवत्ता कैसी है?',
    qualityOptionManual: 'गुणवत्ता स्वयं चुनें',
    qualityOptionAI: '📷 फसल गुणवत्ता जांचें (AI कैमरा)',
    gradeA: 'ग्रेड A (उत्कृष्ट / प्रीमियम)',
    gradeADesc: 'चमकदार, एकसमान दाना, कीट-मुक्त (+5% अधिक भाव)',
    gradeB: 'ग्रेड B (सामान्य / मानक FAQ)',
    gradeBDesc: 'औसत अच्छी गुणवत्ता, साफ फसल, मानक मंडी भाव',
    gradeC: 'ग्रेड C (मध्यम / मिलाजुला)',
    gradeCDesc: 'हल्का रंग फीका या असमान आकार (-5% कम भाव)',
    customGrade: 'कस्टम / अन्य गुणवत्ता',
    customGradeDesc: 'खरीदार द्वारा प्रत्यक्ष मुआयने पर तय भाव',
    
    checkCropQuality: '📷 फसल गुणवत्ता जांचें',
    takePhoto: 'फोटो खींचें',
    retakePhoto: 'दोबारा फोटो लें',
    usePhoto: 'इस फोटो का उपयोग करें',
    switchCamera: 'कैमरा बदलें',
    cameraGuidance: 'फसल को अच्छी रोशनी में फ्रेम के बीच साफ रखें।',
    cameraOverlayTip: 'फसल साफ दिखनी चाहिए • छाया से बचें',
    analyzingCrop: 'AI आपकी फसल की जांच कर रहा है...',
    analyzingSubtext: 'दाने का भराव, रंग, एकरूपता और दृश्य दोषों का विश्लेषण जारी है...',
    qualityAssessment: 'फसल गुणवत्ता रिपोर्ट',
    suggestedGrade: 'सुझाया गया ग्रेड',
    confidence: 'AI सटीकता (कॉन्फिडेंस)',
    confidenceHigh: 'उच्च सटीकता (High)',
    confidenceMedium: 'मध्यम सटीकता (Medium)',
    confidenceLow: 'सामान्य सटीकता (Low)',
    whyThisGrade: 'यह ग्रेड क्यों सुझाया गया?',
    whatWeObserved: 'फोटो में क्या देखा गया:',
    cropDoesNotMatch: '⚠️ फोटो चुनी हुई फसल से मेल नहीं खाती',
    cropMismatchDesc: 'खींची गई फोटो ऊपर चुनी गई फसल जैसी नहीं दिख रही है। कृपया दोबारा फोटो लें या फसल बदलें।',
    photoIsUnclear: '⚠️ फोटो बहुत धुंधली या अस्पष्ट है',
    photoUnclearDesc: 'रोशनी या फोकस सही नहीं था। कृपया दोबारा फोटो लें या गुणवत्ता स्वयं चुनें।',
    chooseManually: 'ग्रेड स्वयं चुनें',
    changeCrop: 'फसल बदलें',
    aiVisualEstimate: 'फोटो की सतह से AI दृश्य अनुमान',
    notLaboratoryTest: '⚠️ यह लैब टेस्ट नहीं है। सटीक नमी %, तेल की मात्रा या रासायनिक अंश फोटो से नहीं नापे जा सकते।',
    useGradeA: 'ग्रेड A स्वीकार करें',
    useGradeB: 'ग्रेड B स्वीकार करें',
    useGradeC: 'ग्रेड C स्वीकार करें',
    demoAiResult: 'डेमो AI परिणाम — नमूना विश्लेषण',
    cameraAccessDenied: 'कैमरा उपलब्ध नहीं है',
    cameraDeniedDesc: 'कैमरा अनुमति नहीं मिली या डिवाइस में कैमरा सक्रिय नहीं है। आप फोटो अपलोड कर सकते हैं या ग्रेड स्वयं चुन सकते हैं।',
    uploadFromComputer: 'डिवाइस से फोटो चुनें',
    
    pleaseSelectCrop: 'कृपया अपनी फसल चुनें या नाम लिखें।',
    pleaseEnterQuantity: 'कृपया बेचने की मात्रा दर्ज करें (0 से अधिक होनी चाहिए)।',
    pleaseSelectQuality: 'कृपया फसल की गुणवत्ता चुनें या AI जांच पूरी करें।',
    pleaseConfirmAiResult: 'कृपया AI द्वारा सुझाए गए ग्रेड की पुष्टि करें।',
    pleaseEnterCropName: 'कृपया अपनी फसल का नाम दर्ज करें।',
    missingFieldsAlert: 'कृपया नीचे छूटी हुई अनिवार्य जानकारी पूरी करें।',
    
    continueToMarket: 'मंडी तुलना पर आगे बढ़ें →',
    backToCrops: '← फसल विवरण पर वापस जाएं',
    backToLocation: '← स्थान पर वापस जाएं',
    finishSummary: 'अंतिम सौदा पर्ची देखें',
    
    bestOptionBadge: '⭐ सबसे अधिक शुद्ध मुनाफा',
    netReturn: 'अनुमानित शुद्ध बचत (खर्चे काटकर)',
    modalMarketPrice: 'मंडी भाव',
    estimatedTransport: 'अनुमानित परिवहन खर्च',
    marketFee: 'मंडी शुल्क / सेस',
    unloadingCharge: 'हमाली / उतराई खर्च',
    distanceRoad: 'सड़क दूरी',
    distanceApprox: 'अनुमानित दूरी',
    travelTime: 'यात्रा समय',
    verifiedBuyer: 'सत्यापित खरीदार',
    sameDayPayment: 'माल देते ही तुरंत भुगतान',
    getDirections: '🗺️ गूगल मैप्स पर रास्ता देखें',
    mapView: 'नक्शा देखें',
    listView: 'सूची तुलना',
    mapUnavailable: 'मानचित्र सेवा बैकअप मोड में है। सभी कृषि मंडी मूल्य गणनाएं पूरी तरह सक्रिय हैं।',
    demoLocationWarning: 'डेमो स्थान सक्रिय है। वास्तविक स्थान के लिए GPS या सर्च का उपयोग करें।',
  },

  mr: {
    appName: 'कृषीसेतू',
    tagline: 'शेतकरी सक्षमीकरण • शेतातून थेट फायदेशीर बाजारपेठेकडे',
    step1Title: 'स्थान निवडा',
    step2Title: 'पिकाचा तपशील',
    step3Title: 'बाजारभाव तुलना',
    step4Title: 'व्यवहार सारांश',
    stepIndicator: 'टप्पा',
    
    locationPrompt: 'आपले शेत किंवा शेतमाल कोठे आहे?',
    useCurrentLocation: '📍 सध्याचे GPS स्थान वापरा',
    gettingLocation: 'आपल्या शेताचे स्थान शोधत आहोत...',
    searchLocationPlaceholder: 'गावं, तालुका किंवा जिल्हा शोधा...',
    manualLocationTitle: 'किंवा स्वतः निवडा',
    selectState: 'राज्य निवडा',
    selectDistrict: 'जिल्हा निवडा',
    enterTownVillage: 'गावाचे किंवा तालुक्याचे नाव',
    changeLocation: 'स्थान बदला',
    gpsAccuracy: 'शेत पातळीपर्यंत अचूक',
    demoModeNotice: 'डेमो मोड — चाचणीसाठी नमुना माहिती',
    demoModeBadge: 'डेमो मोड',
    
    whatSelling: 'तुम्हाला कोणते पीक विकायचे आहे?',
    chooseCategory: 'पिकाचा प्रकार',
    allCrops: 'सर्व पिके',
    cereals: 'धान्य (Cereals)',
    pulses: 'कडधान्य (Pulses)',
    vegetables: 'भाजीपाला',
    fruits: 'फळे',
    commercial: 'व्यापारी पिके (Commercial)',
    otherCrop: '+ इतर पीक',
    enterCustomCropName: 'आपल्या पिकाचे नाव टाका:',
    customCropPlaceholder: 'उदा. मोहरी, गवार...',
    searchCropsPlaceholder: 'पीक शोधा (उदा. कापूस, सोयाबीन, कांदा, टोमॅटो)...',
    noCropsFound: 'शोधलेले पीक सापडले नाही',
    tryAnotherName: 'दुसरे नाव लिहून बघा किंवा "सर्व पिके" निवडा.',
    
    howMuchSelling: 'तुम्हाला किती माल विकायचा आहे?',
    quantityPlaceholder: 'वजन टाका (उदा. 10)',
    kg: 'किलो (kg)',
    quintal: 'क्विंटल (100 किलो)',
    tonne: 'टन (1,000 किलो)',
    standardizedKg: 'प्रमाणित वजन',
    
    whatQuality: 'आपल्या मालाची प्रतवारी (Quality) कशी आहे?',
    qualityOptionManual: 'प्रतवारी स्वतः निवडा',
    qualityOptionAI: '📷 पिकाची प्रत तपासा (AI कॅमेरा)',
    gradeA: 'ग्रेड A (उत्कृष्ट माल)',
    gradeADesc: 'तेजस्वी रंग, एकसारखा मोठा दाणा, कीड-मुक्त (+5% जादा भाव)',
    gradeB: 'ग्रेड B (सर्वसाधारण FAQ)',
    gradeBDesc: 'सरासरी चांगली गुणवत्ता, स्वच्छ माल, प्रमाणित बाजारभाव',
    gradeC: 'ग्रेड C (दुय्यम / मध्यम)',
    gradeCDesc: 'किरकोळ डाग किंवा लहान-मोठा आकार (-5% कमी भाव)',
    customGrade: 'इतर / व्यापारी ग्रेड',
    customGradeDesc: 'प्रत्यक्ष पाहणीनंतर ठरणारा भाव',
    
    checkCropQuality: '📷 पिकाची प्रत तपासा',
    takePhoto: 'फोटो काढा',
    retakePhoto: 'पुन्हा फोटो काढा',
    usePhoto: 'हा फोटो वापरा',
    switchCamera: 'कॅमेरा बदला',
    cameraGuidance: 'चांगल्या प्रकाशात पीक फ्रेमच्या मध्यभागी ठेवा.',
    cameraOverlayTip: 'पीक स्पष्ट दिसू द्या • सावली टाळा',
    analyzingCrop: 'AI पिकाची तपासणी करत आहे...',
    analyzingSubtext: 'दाण्यांचा भरव, रंग आणि दृश्य दोषांचे विश्लेषण सुरू आहे...',
    qualityAssessment: 'पीक गुणवत्ता अहवाल',
    suggestedGrade: 'शिफारस केलेला ग्रेड',
    confidence: 'AI अचूकता',
    confidenceHigh: 'उच्च अचूकता (High)',
    confidenceMedium: 'मध्यम अचूकता (Medium)',
    confidenceLow: 'सर्वसाधारण अचूकता (Low)',
    whyThisGrade: 'हा ग्रेड का सुचवला?',
    whatWeObserved: 'फोटोमध्ये काय दिसले:',
    cropDoesNotMatch: '⚠️ फोटो निवडलेल्या पिकाशी जुळत नाही',
    cropMismatchDesc: 'काढलेला फोटो वर निवडलेल्या पिकासारखा दिसत नाही. कृपया पुन्हा फोटो काढा किंवा पीक बदला.',
    photoIsUnclear: '⚠️ फोटो अस्पष्ट किंवा अंधुक आहे',
    photoUnclearDesc: 'योग्य प्रकाश नव्हता. कृपया पुन्हा फोटो काढा किंवा ग्रेड स्वतः निवडा.',
    chooseManually: 'ग्रेड स्वतः निवडा',
    changeCrop: 'पीक बदला',
    aiVisualEstimate: 'फोटोच्या बाह्य स्वरूपावरून AI अंदाज',
    notLaboratoryTest: '⚠️ ही लॅब चाचणी नाही. पाण्याचा ओलावा % किंवा तेलाचे प्रमाण फोटोवरून ठरवता येत नाही.',
    useGradeA: 'ग्रेड A स्वीकारा',
    useGradeB: 'ग्रेड B स्वीकारा',
    useGradeC: 'ग्रेड C स्वीकारा',
    demoAiResult: 'डेमो AI निकाल — नमुना चाचणी',
    cameraAccessDenied: 'कॅमेरा सुरू करता आला नाही',
    cameraDeniedDesc: 'कॅमेरा परवानगी मिळाली नाही. आपण फोटो अपलोड करू शकता किंवा ग्रेड स्वतः निवडू शकता.',
    uploadFromComputer: 'डिव्हाइसमधून फोटो अपलोड करा',
    
    pleaseSelectCrop: 'कृपया पीक निवडा किंवा पिकाचे नाव लिहा.',
    pleaseEnterQuantity: 'कृपया विक्रीसाठी वजन टाका (0 पेक्षा जास्त असावे).',
    pleaseSelectQuality: 'कृपया पिकाची गुणवत्ता निवडा किंवा AI तपासणी करा.',
    pleaseConfirmAiResult: 'कृपया AI सुचवलेल्या ग्रेडची पुष्टी करा.',
    pleaseEnterCropName: 'कृपया पिकाचे नाव टाका.',
    missingFieldsAlert: 'कृपया खालील आवश्यक माहिती पूर्ण करा.',
    
    continueToMarket: 'बाजारभाव तुलनेकडे पुढे जा →',
    backToCrops: '← पिकाच्या तपशीलावर परत जा',
    backToLocation: '← स्थानावर परत जा',
    finishSummary: 'अंतिम व्यवहाराची पावती पहा',
    
    bestOptionBadge: '⭐ सर्वाधिक नफा देणारा पर्याय',
    netReturn: 'सर्व खर्च वजा जाता हातात येणारी रक्कम',
    modalMarketPrice: 'बाजारभाव',
    estimatedTransport: 'अंदाजे वाहतूक खर्च',
    marketFee: 'बाजार समिती उपकर / फी',
    unloadingCharge: 'हमाली / उतराई खर्च',
    distanceRoad: 'रस्त्याचे अंतर',
    distanceApprox: 'अंदाजे अंतर',
    travelTime: 'लागणारा वेळ',
    verifiedBuyer: 'खात्रीशीर खरेदीदार',
    sameDayPayment: 'माल दिल्यावर लगेच रोख/बँक खात्यात पैसे',
    getDirections: '🗺️ गुगल मॅप्सवर रस्ता पहा',
    mapView: 'नकाशा पहा',
    listView: 'यादी पहा',
    mapUnavailable: 'नकाशा सेवा तात्पुरती पर्यायी स्थितीत आहे. सर्व बाजारभाव अचूक मोजले जात आहेत.',
    demoLocationWarning: 'डेमो स्थान सुरू आहे. स्वतःच्या गावासाठी शोध किंवा GPS वापरा.',
  },

  te: {
    appName: 'కృషిసేతు',
    tagline: 'రైతు సంక్షేమం • పంటకు గరిష్ట గిట్టుబాటు ధర',
    step1Title: 'స్థలాన్ని ఎంచుకోండి',
    step2Title: 'పంట వివరాలు',
    step3Title: 'మార్కెట్ పోలిక',
    step4Title: 'లావాదేవీ సారాంశం',
    stepIndicator: 'దశ',
    
    locationPrompt: 'మీ పొలం లేదా పంట ఏ ప్రాంతంలో ఉంది?',
    useCurrentLocation: '📍 ప్రస్తుత GPS లొకేషన్ ఉపయోగించండి',
    gettingLocation: 'మీ పొలం లొకేషన్ గుర్తిస్తున్నాం...',
    searchLocationPlaceholder: 'భారతదేశంలో మీ గ్రామం, మండలం, పట్టణం లేదా జిల్లా వెతకండి...',
    manualLocationTitle: 'లేదా రాష్ట్రం, జిల్లా నేరుగా ఎంచుకోండి',
    selectState: 'రాష్ట్రం ఎంచుకోండి',
    selectDistrict: 'జిల్లా ఎంచుకోండి',
    enterTownVillage: 'గ్రామం లేదా పట్టణం పేరు',
    changeLocation: 'లొకేషన్ మార్చండి',
    gpsAccuracy: 'పొలం స్థాయి ఖచ్చితత్వం',
    demoModeNotice: 'డెమో మోడ్ — నమూనా సమాచారం',
    demoModeBadge: 'డెమో మోడ్',
    
    whatSelling: 'మీరు ఏ పంటను విక్రయించాలనుకుంటున్నారు?',
    chooseCategory: 'పంట వర్గం (కేటగిరీ)',
    allCrops: 'అన్ని పంటలు',
    cereals: 'తృణధాన్యాలు (Cereals)',
    pulses: 'పప్పుధాన్యాలు (Pulses)',
    vegetables: 'కూరగాయలు',
    fruits: 'పండ్లు',
    commercial: 'వాణిజ్య పంటలు (Commercial)',
    otherCrop: '+ ఇతర పంట',
    enterCustomCropName: 'మీ పంట పేరు నమోదు చేయండి:',
    customCropPlaceholder: 'ఉదా. ఆవాలు, గోరుచిక్కుడు...',
    searchCropsPlaceholder: 'పంట పేరు వెతకండి (వరి, మిరప, పత్తి, మొక్కజొన్న, టమాటా)...',
    noCropsFound: 'మీరు వెతికిన పంట వివరాలు లభించలేదు',
    tryAnotherName: 'మరొక పేరుతో వెతకండి లేదా "అన్ని పంటలు" ఎంచుకోండి.',
    
    howMuchSelling: 'మీరు ఎంత పరిమాణం విక్రయిస్తారు?',
    quantityPlaceholder: 'పరిమాణం నమోదు చేయండి (ఉదా. 10)',
    kg: 'కిలోలు (kg)',
    quintal: 'క్వింటాల్ (100 కిలోలు)',
    tonne: 'టన్ను (1,000 కిలోలు)',
    standardizedKg: 'ప్రామాణిక బరువు',
    
    whatQuality: 'మీ పంట నాణ్యత ఎలా ఉంది?',
    qualityOptionManual: 'నాణ్యతను నేరుగా ఎంచుకోండి',
    qualityOptionAI: '📷 పంట నాణ్యతను తనిఖీ చేయండి (AI కెమెరా)',
    gradeA: 'గ్రేడ్ A (ఉత్తమ నాణ్యత)',
    gradeADesc: 'మంచి నిగారింపు, సమానమైన గింజ పరిమాణం, తెగుళ్లు లేని పంట (+5% ఎక్కువ ధర)',
    gradeB: 'గ్రేడ్ B (సగటు FAQ నాణ్యత)',
    gradeBDesc: 'సాధారణ మంచి నాణ్యత, శుభ్రమైన పంట, సాధారణ మార్కెట్ ధర',
    gradeC: 'గ్రేడ్ C (ద్వితీయ శ్రేణి)',
    gradeCDesc: 'రంగు కొద్దిగా మారిన లేదా చిన్న గింజలు (-5% తక్కువ ధర)',
    customGrade: 'ఇతర / కస్టమ్ గ్రేడ్',
    customGradeDesc: 'వ్యాపారి నేరుగా పరిశీలించిన తర్వాత నిర్ణయించే ధర',
    
    checkCropQuality: '📷 పంట నాణ్యతను తనిఖీ చేయండి',
    takePhoto: 'ఫోటో తీయండి',
    retakePhoto: 'మళ్ళీ ఫోటో తీయండి',
    usePhoto: 'ఈ ఫోటోను ఉపయోగించండి',
    switchCamera: 'కెమెరా మార్చండి',
    cameraGuidance: 'మంచి వెలుతురులో పంటను కెమెరా ఫ్రేమ్ మధ్యలో ఉంచండి.',
    cameraOverlayTip: 'పంట స్పష్టంగా కనిపించాలి • నీడలు పడకుండా చూడండి',
    analyzingCrop: 'AI మీ పంట నాణ్యతను పరిశీలిస్తోంది...',
    analyzingSubtext: 'గింజల పరిమాణం, రంగు, ఏకరూపత మరియు లోపాలను లెక్కిస్తున్నాము...',
    qualityAssessment: 'పంట నాణ్యత నివేదిక',
    suggestedGrade: 'సూచించబడిన నాణ్యత గ్రేడ్',
    confidence: 'AI ఖచ్చితత్వం (Confidence)',
    confidenceHigh: 'అధిక ఖచ్చితత్వం (High)',
    confidenceMedium: 'మధ్యస్థ ఖచ్చితత్వం (Medium)',
    confidenceLow: 'సాధారణ ఖచ్చితత్వం (Low)',
    whyThisGrade: 'ఈ గ్రేడ్ ఎందుకు సూచించబడింది?',
    whatWeObserved: 'చిత్రంలో గమనించిన అంశాలు:',
    cropDoesNotMatch: '⚠️ ఫోటో ఎంచుకున్న పంటతో సరిపోలడం లేదు',
    cropMismatchDesc: 'తీసిన ఫోటో పైన ఎంచుకున్న పంటలా కనిపించడం లేదు. దయచేసి మళ్ళీ ఫోటో తీయండి లేదా పంటను మార్చండి.',
    photoIsUnclear: '⚠️ ఫోటో అస్పష్టంగా లేదా మసకగా ఉంది',
    photoUnclearDesc: 'వెలుతురు లేదా ఫోకస్ సరిగ్గా లేదు. దయచేసి మళ్ళీ స్పష్టమైన ఫోటో తీయండి లేదా నాణ్యతను మాన్యువల్‌గా ఎంచుకోండి.',
    chooseManually: 'గ్రేడ్‌ను నేరుగా ఎంచుకోండి',
    changeCrop: 'పంటను మార్చండి',
    aiVisualEstimate: 'ఫోటో ఉపరితలం ఆధారంగా AI దృశ్య అంచనా',
    notLaboratoryTest: '⚠️ ఇది ప్రయోగశాల పరీక్ష కాదు. ఖచ్చితమైన తేమ శాతం (Moisture %), నూనె శాతాన్ని ఫోటో ద్వారా మాత్రమే నిర్ధారించలేము.',
    useGradeA: 'గ్రేడ్ A అంగీకరించు',
    useGradeB: 'గ్రేడ్ B అంగీకరించు',
    useGradeC: 'గ్రేడ్ C అంగీకరించు',
    demoAiResult: 'డెమో AI ఫలితం — నమూనా విశ్లేషణ',
    cameraAccessDenied: 'కెమెరా అందుబాటులో లేదు',
    cameraDeniedDesc: 'కెమెరా అనుమతి లభించలేదు. మీరు ఫోటో అప్‌లోడ్ చేయవచ్చు లేదా గ్రేడ్‌ను మాన్యువల్‌గా ఎంచుకోవచ్చు.',
    uploadFromComputer: 'ఫోన్ / కంప్యూటర్ నుండి ఫోటో అప్‌లోడ్ చేయండి',
    
    pleaseSelectCrop: 'దయచేసి పంటను ఎంచుకోండి లేదా పేరు నమోదు చేయండి.',
    pleaseEnterQuantity: 'దయచేసి ఎంత విక్రయిస్తారో నమోదు చేయండి (0 కంటే ఎక్కువ ఉండాలి).',
    pleaseSelectQuality: 'దయచేసి పంట నాణ్యతను ఎంచుకోండి లేదా AI తనిఖీని పూర్తి చేయండి.',
    pleaseConfirmAiResult: 'దయచేసి AI సూచించిన గ్రేడ్‌ను నిర్ధారించండి.',
    pleaseEnterCropName: 'దయచేసి మీ పంట పేరు రాయండి.',
    missingFieldsAlert: 'దయచేసి క్రింద ఎరుపు రంగులో ఉన్న వివరాలన్నీ నమోదు చేయండి.',
    
    continueToMarket: 'మార్కెట్ పోలికకు వెళ్ళండి →',
    backToCrops: '← పంట వివరాలకు తిరిగి వెళ్ళండి',
    backToLocation: '← లొకేషన్‌కు తిరిగి వెళ్ళండి',
    finishSummary: 'తుది ఒప్పంద పత్రం చూడండి',
    
    bestOptionBadge: '⭐ అత్యధిక నికర లాభం ఇచ్చే మార్కెట్',
    netReturn: 'రవాణా, ఖర్చులు పోగా చేతికి అందే నికర మొత్తం',
    modalMarketPrice: 'మార్కెట్ ధర',
    estimatedTransport: 'అంచనా రవాణా ఖర్చు',
    marketFee: 'మార్కెట్ రుసుము / సెస్',
    unloadingCharge: 'హమాలీ / దించుడు ఖర్చు',
    distanceRoad: 'రోడ్డు దూరం',
    distanceApprox: 'సుమారు దూరం',
    travelTime: 'ప్రయాణ సమయం',
    verifiedBuyer: 'ధృవీకరించబడిన వ్యాపారి',
    sameDayPayment: 'సరుకు అప్పగించగానే తక్షణ నగదు / UPI చెల్లింపు',
    getDirections: '🗺️ గూగుల్ మ్యాప్స్‌లో దారి చూడండి',
    mapView: 'మ్యాప్ రూపంలో చూడండి',
    listView: 'జాబితా పోలిక',
    mapUnavailable: 'మ్యాప్ సేవ తాత్కాలికంగా ఆఫ్‌లైన్‌లో ఉంది. అన్ని పంట ధరల లెక్కలు యధావిధిగా పనిచేస్తున్నాయి.',
    demoLocationWarning: 'డెమో లొకేషన్ పనిచేస్తోంది. మీ నిజమైన గ్రామం కోసం GPS లేదా సెర్చ్ వాడండి.',
  },
};
