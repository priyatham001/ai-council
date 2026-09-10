import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { te } from './te';
import { ta } from './ta';
import { kn } from './kn';
import { ml } from './ml';
import { TranslationDict } from './types';

export { en, hi, mr, te, ta, kn, ml };
export * from './types';

export const ALL_TRANSLATIONS: Record<string, TranslationDict> = {
  en,
  hi,
  mr,
  te,
  ta,
  kn,
  ml,
};

// Built-in fail-safe translations for common keys so raw keys like "buyer.allGrades" are NEVER displayed
const FALLBACK_DEFAULTS: Record<string, Record<string, string>> = {
  en: {
    'app.name': 'AgriConnect',
    'onboarding.step1': 'Step 1: Personalize Your Experience',
    'onboarding.step2': 'Step 2: Detect Farm Location',
    'onboarding.step3': 'Step 3: Select Your Role',
    'onboarding.roleTitle': 'How Will You Use AgriConnect?',
    'onboarding.roleSubtitle': 'Select your role to access dedicated dashboards, tailored pricing, and direct market linkage.',
    'onboarding.forProducers': 'For Crop Producers',
    'onboarding.farmerTitle': 'Farmer',
    'onboarding.farmerTagline': 'Sell your crops, inspect quality, discover highest-paying mandis, and connect directly with verified buyers.',
    'onboarding.farmerFeature1': 'Clear Quality Inspection (Grade A, B, C)',
    'onboarding.farmerFeature2': 'Smart Mandi Profit Calculator with Transport Freight',
    'onboarding.farmerFeature3': 'Direct Buyer Inquiries & WhatsApp Bids',
    'onboarding.enterFarmer': 'Continue as Farmer',
    'onboarding.forBuyers': 'For Institutional Buyers',
    'onboarding.buyerTitle': 'Buyer',
    'onboarding.buyerTagline': 'Discover available crops from nearby farmers, compare quality and prices, and contact farmers directly for institutional procurement.',
    'onboarding.buyerFeature1': 'Explore verified farmer crop lots on Map & List',
    'onboarding.buyerFeature2': 'Filter by Grade (A/B/C), Distance, and Volume',
    'onboarding.buyerFeature3': 'Direct Bidding & Escrow Protection',
    'onboarding.enterBuyer': 'Continue as Buyer',
    'buyer.marketplace': 'BUYER MARKETPLACE',
    'buyer.buyDirect': 'Buy Directly From Verified Farmers Across India',
    'buyer.home': 'Home',
    'buyer.farmerJourney': 'Farmer Journey',
    'buyer.postDemand': 'Post Procurement Demand',
    'buyer.availableLots': 'Available Crop Lots',
    'buyer.procurementRequests': 'Buyer Procurement Requests',
    'buyer.verifiedFarmers': 'Verified Farmer Network',
    'buyer.mandiBenchmarks': 'Mandi Benchmark Rates',
    'buyer.searchCropPlaceholder': 'Search crop (Paddy, Onion, Tomato, Wheat...)...',
    'buyer.allGrades': 'All Quality Grades',
    'buyer.allStates': 'All States (Pan-India)',
    'buyer.cardsList': 'Cards List',
    'buyer.googleMapView': 'Google Map View',
    'buyer.availableLotsCount': 'available lots',
    'buyer.inspectContact': 'Inspect & Contact',
    'buyer.bid': 'Bid',
    'buyer.farmerAskingPrice': 'Farmer Asking Price',
    'buyer.availableLotSize': 'Available Lot Size',
    'buyer.placeBidTitle': 'Place Your Commercial Bid',
    'buyer.yourOfferPrice': 'Your Offer Price (₹/quintal)',
    'buyer.quantityNeeded': 'Quantity Needed',
    'buyer.submitBid': 'Submit Official Bid',
    'buyer.bidSuccess': 'Bid placed successfully!',
    'guide.start': "Namaste! Welcome to AgriConnect. Let's get started.",
    'guide.inactive': "No problem, take your time. I'll wait here.",
    'guide.location': "Confirm your location so we can find the nearest mandis and buyers for you.",
    'guide.role': "Choose whether you are a Farmer or a Buyer.",
    'guide.selectCrop': "Please select your crop here.",
    'guide.uploadPhoto': "Now click here to upload a clear photo of your crop.",
    'guide.enterQuantity': "Enter how much crop you want to sell. You can choose kg or quintal.",
    'guide.compareMarkets': "These are the nearby markets. Compare the price, distance and transport cost before choosing.",
    'guide.publishListing': "Your details look good. Click here to publish your crop listing.",
    'guide.buyerListings': "You can browse farmer listings here. Click a listing to see its details.",
    'guide.buyerBid': "If you are interested, click here to place your bid.",
  },
  mr: {
    'app.name': 'AgriConnect (ॲग्रीकनेक्ट)',
    'onboarding.step1': 'टप्पा १: आपली भाषा व स्वरूप निवडा',
    'onboarding.step2': 'टप्पा २: शेताचे स्थान निश्चित करा',
    'onboarding.step3': 'टप्पा ३: आपली भूमिका निवडा',
    'onboarding.roleTitle': 'आपण ॲग्रीकनेक्ट कसे वापरणार आहात?',
    'onboarding.roleSubtitle': 'आपल्या गरजेनुसार थेट बाजारपेठ आणि दरांसाठी आपली भूमिका निवडा.',
    'onboarding.forProducers': 'शेतकरी बांधवांसाठी',
    'onboarding.farmerTitle': 'शेतकरी',
    'onboarding.farmerTagline': 'आपले पीक विका, गुणवत्ता तपासा, सर्वाधिक भाव देणाऱ्या मंड्या शोधा आणि थेट खरेदीदारांशी जोडा.',
    'onboarding.farmerFeature1': 'पारदर्शक गुणवत्ता श्रेणी (ग्रेड A, B, C)',
    'onboarding.farmerFeature2': 'वाहतूक खर्चासह निव्वळ नफा मोजणी',
    'onboarding.farmerFeature3': 'थेट खरेदीदार चौकशी व व्हॉट्सॲप बोली',
    'onboarding.enterFarmer': 'शेतकरी म्हणून पुढे जा',
    'onboarding.forBuyers': 'खरेदीदार व व्यापाऱ्यांसाठी',
    'onboarding.buyerTitle': 'खरेदीदार',
    'onboarding.buyerTagline': 'शेतकऱ्यांकडील उपलब्ध पिके शोधा, गुणवत्ता व दर तपासा आणि खरेदीसाठी थेट संपर्क करा.',
    'onboarding.buyerFeature1': 'नकाशा व यादीवर प्रमाणित पिके पहा',
    'onboarding.buyerFeature2': 'ग्रेड, अंतर आणि प्रमाणानुसार फिल्टर करा',
    'onboarding.buyerFeature3': 'थेट बोली व सुरक्षित देयक',
    'onboarding.enterBuyer': 'खरेदीदार म्हणून पुढे जा',
    'buyer.marketplace': 'खरेदीदार बाजारपेठ',
    'buyer.buyDirect': 'भारतातील प्रमाणित शेतकऱ्यांकडून थेट खरेदी करा',
    'buyer.home': 'मुख्यपृष्ठ',
    'buyer.farmerJourney': 'शेतकरी मंच',
    'buyer.postDemand': 'खरेदी मागणी नोंदवा',
    'buyer.availableLots': 'उपलब्ध धान्य लॉट्स',
    'buyer.procurementRequests': 'खरेदीदारांची मागणी',
    'buyer.verifiedFarmers': 'प्रमाणित शेतकरी नेटवर्क',
    'buyer.mandiBenchmarks': 'मंडीचे अधिकृत दर',
    'buyer.searchCropPlaceholder': 'पीक शोधा (उदा. भात, कांदा, टोमॅटो, गहू)...',
    'buyer.allGrades': 'सर्व गुणवत्ता ग्रेड',
    'buyer.allStates': 'सर्व राज्ये (अखिल भारत)',
    'buyer.cardsList': 'यादी दृश्य',
    'buyer.googleMapView': 'नकाशा दृश्य',
    'buyer.availableLotsCount': 'उपलब्ध लॉट्स',
    'buyer.inspectContact': 'तपासा आणि संपर्क साधा',
    'buyer.bid': 'बोली लावा',
    'buyer.farmerAskingPrice': 'शेतकऱ्याचा भाव',
    'buyer.availableLotSize': 'उपलब्ध प्रमाण',
    'buyer.placeBidTitle': 'आपली व्यावसायिक बोली नोंदवा',
    'buyer.yourOfferPrice': 'आपला दर (₹/क्विंटल)',
    'buyer.quantityNeeded': 'हवी असलेली मात्रा',
    'buyer.submitBid': 'बोली सादर करा',
    'buyer.bidSuccess': 'बोली यशस्वीरीत्या नोंदवली गेली!',
    'guide.start': "नमस्ते! ॲग्रीकनेक्टमध्ये आपले स्वागत आहे. चला सुरुवात करूया.",
    'guide.inactive': "काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.",
    'guide.location': "आपले स्थान निश्चित करा जेणेकरून आम्ही आपल्यासाठी जवळच्या मंड्या शोधू शकू.",
    'guide.role': "आपण शेतकरी आहात की खरेदीदार हे निवडा.",
    'guide.selectCrop': "कृपया आपले पीक येथे निवडा.",
    'guide.uploadPhoto': "आता आपल्या पिकाचा स्वच्छ फोटो येथे अपलोड करा.",
    'guide.enterQuantity': "तुम्हाला किती पीक विकायचे आहे ते टाका. तुम्ही किलो किंवा क्विंटल निवडू शकता.",
    'guide.compareMarkets': "ही जवळची बाजारपेठ आहे. निवडण्यापूर्वी भाव, अंतर आणि वाहतूक खर्च तपासा.",
    'guide.publishListing': "सर्व माहिती योग्य दिसत आहे. आपले पीक बाजारात नोंदवण्यासाठी येथे क्लिक करा.",
    'guide.buyerListings': "तुम्ही शेतकऱ्यांचे लॉट येथे पाहू शकता. तपशील पाहण्यासाठी क्लिक करा.",
    'guide.buyerBid': "तुम्हाला खरेदी करायची असल्यास, बोली लावण्यासाठी येथे क्लिक करा.",
  },
  te: {
    'app.name': 'AgriConnect (అగ్రికనెక్ట్)',
    'onboarding.step1': 'దశ 1: మీ భాష & థీమ్‌ను ఎంచుకోండి',
    'onboarding.step2': 'దశ 2: పొలం ప్రదేశాన్ని గుర్తించండి',
    'onboarding.step3': 'దశ 3: మీ పాత్రను ఎంచుకోండి',
    'onboarding.roleTitle': 'మీరు అగ్రికనెక్ట్‌ను ఎలా ఉపయోగిస్తారు?',
    'onboarding.roleSubtitle': 'ప్రత్యేక డ్యాష్‌బోర్డులు, మార్కెట్ ధరలు మరియు నేరుగా కొనుగోలుదారులతో కనెక్ట్ కావడానికి మీ పాత్రను ఎంచుకోండి.',
    'onboarding.forProducers': 'రైతు సోదరుల కోసం',
    'onboarding.farmerTitle': 'రైతు',
    'onboarding.farmerTagline': 'మీ పంటలను అమ్మండి, నాణ్యతను తనిఖీ చేయండి, అత్యధిక ధర ఇచ్చే మండీలను కనుగొనండి మరియు నేరుగా వ్యాపారులతో కనెక్ట్ అవ్వండి.',
    'onboarding.farmerFeature1': 'స్పష్టమైన నాణ్యతా పరిశీలన (గ్రేడ్ A, B, C)',
    'onboarding.farmerFeature2': 'రవాణా ఖర్చుతో కూడిన మండీ లాభ కాలిక్యులేటర్',
    'onboarding.farmerFeature3': 'నేరుగా కొనుగోలుదారు విచారణలు & వాట్సాప్ బిడ్‌లు',
    'onboarding.enterFarmer': 'రైతుగా కొనసాగండి',
    'onboarding.forBuyers': 'సంస్థాగత కొనుగోలుదారుల కోసం',
    'onboarding.buyerTitle': 'కొనుగోలుదారు',
    'onboarding.buyerTagline': 'రైతుల వద్ద అందుబాటులో ఉన్న పంటలను చూడండి, నాణ్యత మరియు ధరలను సరిపోల్చండి మరియు కొనుగోలు కోసం నేరుగా సంప్రదించండి.',
    'onboarding.buyerFeature1': 'మ్యాప్ & జాబితాలో ధృవీకరించబడిన రైతు పంట లాట్లను అన్వేషించండి',
    'onboarding.buyerFeature2': 'గ్రేడ్, దూరం మరియు పరిమాణం ప్రకారం ఫిల్టర్ చేయండి',
    'onboarding.buyerFeature3': 'నేరుగా బిడ్డింగ్ & సురక్షిత చెల్లింపులు',
    'onboarding.enterBuyer': 'కొనుగోలుదారుగా కొనసాగండి',
    'buyer.marketplace': 'కొనుగోలుదారుల మార్కెట్‌ప్లేస్',
    'buyer.buyDirect': 'భారతదేశం అంతటా ధృవీకరించబడిన రైతుల నుండి నేరుగా కొనుగోలు చేయండి',
    'buyer.home': 'హోమ్',
    'buyer.farmerJourney': 'రైతు ప్రయాణం',
    'buyer.postDemand': 'సేకరణ డిమాండ్‌ను పోస్ట్ చేయండి',
    'buyer.availableLots': 'అందుబాటులో ఉన్న పంట లాట్లు',
    'buyer.procurementRequests': 'కొనుగోలుదారు సేకరణ అభ్యర్థనలు',
    'buyer.verifiedFarmers': 'ధృవీకరించిన రైతు నెట్‌వర్క్',
    'buyer.mandiBenchmarks': 'మండీ సూచిక ధరలు',
    'buyer.searchCropPlaceholder': 'పంటను శోధించండి (వరి, ఉల్లి, టమోటా, గోధుమ...)...',
    'buyer.allGrades': 'అన్ని నాణ్యతా గ్రేడులు',
    'buyer.allStates': 'అన్ని రాష్ట్రాలు (పాన్-ఇండియా)',
    'buyer.cardsList': 'కార్డుల జాబితా',
    'buyer.googleMapView': 'గూగుల్ మ్యాప్ వీక్షణ',
    'buyer.availableLotsCount': 'అందుబాటులో ఉన్న లాట్లు',
    'buyer.inspectContact': 'పరిశీలించండి & సంప్రదించండి',
    'buyer.bid': 'బిడ్ వేయండి',
    'buyer.farmerAskingPrice': 'రైతు కోరుతున్న ధర',
    'buyer.availableLotSize': 'అందుబాటులో ఉన్న పరిమాణం',
    'buyer.placeBidTitle': 'మీ వాణిజ్య బిడ్ నమోదు చేయండి',
    'buyer.yourOfferPrice': 'మీ ఆఫర్ ధర (₹/క్వింటాల్)',
    'buyer.quantityNeeded': 'అవసరమైన పరిమాణం',
    'buyer.submitBid': 'అధికారిక బిడ్‌ను సమర్పించండి',
    'buyer.bidSuccess': 'బిడ్ విజయవంతంగా నమోదు చేయబడింది!',
    'guide.start': "నమస్కారం! అగ్రికనెక్ట్‌కు స్వాగతం. ప్రారంభిద్దాం.",
    'guide.inactive': "పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.",
    'guide.location': "మీ సమీపంలోని మార్కెట్లు మరియు కొనుగోలుదారులను కనుగొనడానికి మీ ప్రదేశాన్ని నిర్ధారించండి.",
    'guide.role': "మీరు రైతు లేదా కొనుగోలుదారు అని ఎంచుకోండి.",
    'guide.selectCrop': "దయచేసి మీ పంటను ఇక్కడ ఎంచుకోండి.",
    'guide.uploadPhoto': "ఇప్పుడు మీ పంట యొక్క స్పష్టమైన ఫోటోను ఇక్కడ అప్‌లోడ్ చేయండి.",
    'guide.enterQuantity': "మీరు ఎంత పంటను విక్రయించాలనుకుంటున్నారో నమోదు చేయండి. మీరు కిలో లేదా క్వింటాల్‌ను ఎంచుకోవచ్చు.",
    'guide.compareMarkets': "ఇవి సమీపంలోని మార్కెట్లు. ఎంచుకునే ముందు ధర, దూరం మరియు రవాణా ఖర్చును సరిపోల్చండి.",
    'guide.publishListing': "మీ వివరాలు బాగున్నాయి. మీ పంట జాబితాను ప్రచురించడానికి ఇక్కడ క్లిక్ చేయండి.",
    'guide.buyerListings': "మీరు ఇక్కడ రైతు జాబితాలను బ్రౌజ్ చేయవచ్చు. వివరాలను చూడటానికి క్లిక్ చేయండి.",
    'guide.buyerBid': "మీకు ఆసక్తి ఉంటే, మీ బిడ్ వేయడానికి ఇక్కడ క్లిక్ చేయండి.",
  }
};

export function getLocalizedText(
  key: string,
  lang: string = 'en',
  fallback?: string
): string {
  // 1. Check primary language dictionary
  const dict = ALL_TRANSLATIONS[lang];
  if (dict && dict[key]) {
    return dict[key];
  }

  // 2. Check fallback language table for the current language
  if (FALLBACK_DEFAULTS[lang] && FALLBACK_DEFAULTS[lang][key]) {
    return FALLBACK_DEFAULTS[lang][key];
  }

  // 3. Check English dictionary
  if (ALL_TRANSLATIONS.en && ALL_TRANSLATIONS.en[key]) {
    return ALL_TRANSLATIONS.en[key];
  }

  // 4. Check English fallback table
  if (FALLBACK_DEFAULTS.en && FALLBACK_DEFAULTS.en[key]) {
    return FALLBACK_DEFAULTS.en[key];
  }

  // 5. Provided fallback string
  if (fallback !== undefined && fallback !== null && fallback !== '') {
    return fallback;
  }

  // 6. Clean human fallback instead of raw technical dot key
  if (key.includes('.')) {
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    // Capitalize camelCase or words cleanly
    return lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  return key;
}
