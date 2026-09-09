import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'te' | 'mr';

export interface LanguageOption {
  code: Language;
  name: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
];

export type TranslationsRecord = Record<string, string>;

export const EN_TRANSLATIONS: TranslationsRecord = {
  // Brand & Header
  'app.name': 'KrishiSetu',
  'app.tagline': 'Connecting Farmers to Better Markets and Better Buyers',
  'app.nationalTagline': "India's Intelligent Agricultural Market-Linkage Platform",
  'nav.home': 'Home',
  'nav.farmer': 'Farmer Portal',
  'nav.buyer': 'Buyer Marketplace',
  'nav.admin': 'Admin Console',
  'nav.login': 'Sign In',
  'nav.logout': 'Sign Out',
  'nav.myCrops': 'My Crops',
  'nav.markets': 'Nearby Mandis',
  'nav.bids': 'Buyer Bids',
  'nav.overview': 'Portal Overview',

  // Onboarding Screen 1: Welcome & Settings
  'onboarding.welcome': 'Welcome to KrishiSetu',
  'onboarding.tagline': 'Connecting Farmers to Better Markets and Better Buyers',
  'onboarding.subtitle': 'Fair crop prices, verified institutional buyers, and transparent mandi intelligence.',
  'onboarding.selectLanguage': 'Select Language',
  'onboarding.selectTheme': 'Choose Visual Theme',
  'onboarding.lightMode': 'Light Mode',
  'onboarding.lightModeDesc': 'Crisp, high-contrast natural daylight view',
  'onboarding.darkMode': 'Dark Mode',
  'onboarding.darkModeDesc': 'Low-strain twilight dark surfaces',
  'onboarding.continueToLocation': 'Continue to Location Detection',

  // Onboarding Screen 2: Location Detection
  'onboarding.findingLocation': 'Finding Your Location',
  'onboarding.detectingGps': 'Detecting your location...',
  'onboarding.connectingServices': 'Connecting to location services...',
  'onboarding.findingMarkets': 'Finding nearby agricultural markets...',
  'onboarding.permissionDenied': "We couldn't access your location. Please enter your location manually.",
  'onboarding.searchLocation': 'Search location or Indian city...',
  'onboarding.youAreHere': 'You are here',
  'onboarding.useDetected': 'Confirm & Continue with this Location',
  'onboarding.retryGps': 'Retry GPS Detection',
  'onboarding.enterManually': 'Enter City / District Manually',
  'onboarding.popularCities': 'Or select popular district:',

  // Onboarding Screen 3: Role Selection
  'onboarding.howToUse': 'How would you like to use the platform?',
  'onboarding.selectRoleDesc': 'Choose your account type to access tailored features and services.',
  'onboarding.iAmFarmer': 'I AM A FARMER',
  'onboarding.farmerDesc': 'List your crops, discover nearby markets, and receive competitive offers directly from buyers.',
  'onboarding.continueFarmer': 'Continue as Farmer',
  'onboarding.iAmBuyer': 'I AM A BUYER',
  'onboarding.buyerDesc': 'Discover verified farmers, browse available crops, and place competitive bids.',
  'onboarding.continueBuyer': 'Continue as Buyer',
  'onboarding.adminAccess': 'Admin Console Login',

  // Auth & OTP
  'auth.farmerLogin': 'Farmer Secure Login',
  'auth.farmerLoginDesc': 'Enter your mobile number to receive a one-time verification code.',
  'auth.buyerLogin': 'Buyer Procurement Login',
  'auth.buyerLoginDesc': 'Access commercial crop procurement and place direct bids.',
  'auth.adminLogin': 'Admin Governance Login',
  'auth.adminLoginDesc': 'Platform oversight, dispute resolution, and KYC management.',
  'auth.mobileNumber': 'Mobile Number',
  'auth.mobilePlaceholder': 'Enter 10-digit mobile number',
  'auth.sendOtp': 'Send OTP',
  'auth.sending': 'Sending...',
  'auth.enterOtp': 'Enter 4-Digit OTP',
  'auth.otpSentTo': 'Verification code sent to +91',
  'auth.demoOtpHint': 'Demo OTP: 5432 (or click Quick Fill)',
  'auth.quickFill': 'Auto-fill 5432',
  'auth.verifyOtp': 'Verify & Enter',
  'auth.verifying': 'Verifying...',
  'auth.welcomeBack': 'Welcome back! 🌾',
  'auth.loginSuccess': 'Authenticated successfully as',
  'auth.invalidOtp': 'Invalid code. Please enter 5432 for demo access.',
  'auth.invalidPhone': 'Please enter a valid 10-digit mobile number.',
  'auth.adminId': 'Admin ID',
  'auth.password': 'Password',
  'auth.adminDemoHint': 'Demo: admin / krishi2026',
  'auth.signIn': 'Sign In',

  // Farmer Guide (Floating Assistant)
  'guide.welcome': "👋 Welcome! Let's help you find the best market for your crop.",
  'guide.letsStart': "Let's Start",
  'guide.cropSelect': '🌾 Search for your crop or choose it from the catalogue below.',
  'guide.quantity': '📦 Enter how much produce you want to sell.',
  'guide.unit': '⚖️ Choose Kilograms (KG) or Quintals.',
  'guide.photos': '📸 Upload clear crop photos so buyers can inspect your produce.',
  'guide.publishing': '🚀 Great! Your listing is ready to reach buyers.',
  'guide.bidsReceived': '💰 You have received new offers! Compare them before choosing.',
  'guide.buyerWelcome': "👋 Welcome! Let's find the right crops near your hub.",
  'guide.buyerSearch': '🔍 Try filtering by crop, distance, and quantity.',
  'guide.buyerBidding': '💡 A competitive offer increases your chance of being selected by the farmer.',
  'guide.dismiss': 'Got it',

  // Farmer Flow - Add Crop
  'farmer.addCrop': 'Add Your Crop',
  'farmer.searchCrop': 'Search crop (e.g. Tomato, Paddy, Onion...)',
  'farmer.browseCatalogue': 'Browse Crop Catalogue',
  'farmer.categories.all': 'All Crops',
  'farmer.categories.cereals': '🌾 Cereals & Grains',
  'farmer.categories.vegetables': '🥬 Vegetables',
  'farmer.categories.fruits': '🍎 Fruits',
  'farmer.categories.spices': '🌶️ Spices',
  'farmer.categories.pulses': '🌱 Pulses & Dal',
  'farmer.categories.other': '🌿 Commercial & Cash Crops',

  // Farmer Flow - Photos
  'farmer.uploadPhotos': 'Upload Crop Photos',
  'farmer.uploadPhotosDesc': 'Add real photos of your harvest. Good lighting attracts faster buyer bids.',
  'farmer.uploadDevice': 'Upload from device',
  'farmer.takePhoto': 'Take photo',
  'farmer.addMore': '+ Add More',
  'farmer.photosCount': 'Photos added',

  // Farmer Flow - Details & Units
  'farmer.cropDetails': 'Crop Details',
  'farmer.selectedCrop': 'Selected Crop',
  'farmer.variety': 'Crop Variety',
  'farmer.varietyPlaceholder': 'e.g. Hybrid, Sona Masuri, Desi...',
  'farmer.quantity': 'Quantity to Sell',
  'farmer.unitSelection': 'Unit of Measurement',
  'farmer.unitKg': 'Kilograms (KG)',
  'farmer.unitQuintal': 'Quintals (100 KG)',
  'farmer.expectedPrice': 'Expected Selling Price',
  'farmer.pricePerKg': '₹ Price per KG',
  'farmer.pricePerQuintal': '₹ Price per Quintal',
  'farmer.harvestDate': 'Harvest Date / Readiness',
  'farmer.location': 'Farm Location',

  // Farmer Flow - Preview & Publish
  'farmer.previewTitle': 'Your Listing Preview',
  'farmer.previewDesc': 'Review your crop listing details before broadcasting to verified buyers.',
  'farmer.edit': 'Edit Details',
  'farmer.publish': 'Publish Listing',
  'farmer.publishing': 'Publishing to Marketplace...',
  'farmer.publishedSuccess': 'Listing Published Successfully!',
  'farmer.publishedNotice': 'Your lot is now broadcasted to nearby buyers and APMC mandi traders.',

  // Farmer Flow - Nearby Markets
  'farmer.bestMarketsNearYou': 'Best Markets Near You',
  'farmer.marketsBasedOn': 'Distances and estimated net realizations calculated from',
  'farmer.bestOpportunity': 'BEST OPPORTUNITY',
  'farmer.bestOpportunityDesc': 'Highest estimated price with reasonable transportation distance.',
  'farmer.filterAll': 'All Markets',
  'farmer.filterBest': '🏆 Best Opportunity',
  'farmer.filterHighestPrice': '💰 Highest Price',
  'farmer.filterNearest': '📍 Nearest Distance',
  'farmer.marketPrice': 'Current Market Price',
  'farmer.priceTrend': 'Price Trend',
  'farmer.trendIncreasing': '📈 Increasing',
  'farmer.trendStable': '➡️ Stable',
  'farmer.trendDecreasing': '📉 Decreasing',
  'farmer.distanceKm': 'Distance',
  'farmer.recommended': '⭐ Recommended',
  'farmer.estNetRealization': 'Estimated Net Realization',

  // Farmer Dashboard & My Crops
  'farmer.dashboardTitle': 'Farmer Dashboard',
  'farmer.myCrops': 'My Crops & Listings',
  'farmer.activeListings': 'Active Listings',
  'farmer.totalQuantity': 'Total Quantity',
  'farmer.buyerBids': 'Buyer Bids Received',
  'farmer.acceptedDeals': 'Accepted Deals',
  'farmer.viewBids': 'View Bids',
  'farmer.noListings': 'No active crop listings yet. Add your first crop to receive bids!',
  'farmer.statusActive': 'Active on Market',
  'farmer.statusAccepted': 'Deal Accepted',
  'farmer.statusClosed': 'Completed',

  // Bid System & Comparison
  'farmer.newBidReceived': '🔔 New Bid Received!',
  'farmer.compareOffers': 'Compare Buyer Offers',
  'farmer.compareDesc': 'You have full control. Review commercial terms, buyer distance, and payout schedules.',
  'farmer.buyerName': 'Buyer',
  'farmer.bidQuantity': 'Quantity Requested',
  'farmer.bidPrice': 'Offered Price',
  'farmer.buyerDistance': 'Distance',
  'farmer.totalOffer': 'Total Sale Value',
  'farmer.paymentTerms': 'Payment Terms',
  'farmer.bestOfferBadge': '🏆 Best Value',
  'farmer.acceptBid': 'Accept Bid',
  'farmer.rejectBid': 'Reject',
  'farmer.contactBuyer': 'Contact Buyer',
  'farmer.contactPlatform': 'Platform Chat / Secure Desk',
  'farmer.contactUnlockedNotice': '✅ Deal Accepted! Direct contact details are now unlocked for this transaction.',
  'farmer.buyerPhone': 'Buyer Phone',
  'farmer.buyerAddress': 'Delivery Hub',
  'farmer.pickupNote': 'Pickup and logistics coordinate directly through this contact.',

  // Buyer Portal
  'buyer.dashboardTitle': 'Available Crops Near You',
  'buyer.dashboardSubtitle': 'Source directly from verified farmers with transparent lot quality and distance metrics.',
  'buyer.searchCrop': 'Search crop by name...',
  'buyer.distanceFilter': 'Max Distance',
  'buyer.priceRange': 'Price Range',
  'buyer.quantityFilter': 'Minimum Quantity',
  'buyer.verifiedOnly': 'Verified Farmers Only',
  'buyer.viewDetails': 'View Details',
  'buyer.makeOffer': 'Make an Offer',
  'buyer.placeBid': 'Place Bid',
  'buyer.bidPrice': 'Your Bid Price',
  'buyer.requestedQuantity': 'Requested Quantity',
  'buyer.optionalMessage': 'Notes / Pickup Terms (Optional)',
  'buyer.submittingBid': 'Broadcasting Bid to Farmer...',
  'buyer.bidSuccess': 'Bid Placed Successfully!',
  'buyer.bidSuccessDesc': 'The farmer has been notified and will review your offer shortly.',
  'buyer.expectedFarmerPrice': "Farmer's Expected Price",
  'buyer.farmerLocation': 'Farm Location',
  'buyer.verifiedBadge': '🛡️ Verified Farmer',

  // Admin Dashboard
  'admin.dashboardTitle': 'Platform Governance & Oversight Console',
  'admin.overview': 'Analytics Overview',
  'admin.farmersTab': 'Farmers Directory',
  'admin.buyersTab': 'Buyers Directory',
  'admin.listingsTab': 'Crop Listings',
  'admin.bidsTab': 'Bids & Audit Trail',
  'admin.totalFarmers': 'Total Farmers',
  'admin.totalBuyers': 'Total Buyers',
  'admin.activeListings': 'Active Listings',
  'admin.totalBids': 'Total Bids Placed',
  'admin.activeRegion': 'Most Active Region',
  'admin.popularCrop': 'Most Popular Crop',
  'admin.verify': 'Verify',
  'admin.flag': 'Flag Suspicious',
  'admin.suspend': 'Suspend Account',
  'admin.remove': 'Remove',
  'admin.confirmRemove': 'Are you sure you want to remove this record? This action cannot be undone.',
  'admin.statusVerified': 'Verified',
  'admin.statusSuspicious': 'Flagged',
  'admin.statusSuspended': 'Suspended',
  'admin.statusActive': 'Active',

  // General Actions & Common
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.loading': 'Loading...',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.viewAll': 'View All',
  'common.rupees': '₹',
  'common.km': 'KM',
  'common.quintal': 'Quintal',
  'common.quintals': 'Quintals',
  'common.kg': 'KG',
};

export const TE_TRANSLATIONS: TranslationsRecord = {
  // Brand & Header
  'app.name': 'కృషిసేతు',
  'app.tagline': 'రైతులకు మెరుగైన మార్కెట్లు మరియు సరైన కొనుగోలుదారులను అనుసంధానిస్తుంది',
  'app.nationalTagline': 'భారతదేశ డిజిటల్ వ్యవసాయ మార్కెట్ అనుసంధాన వేదిక',
  'nav.home': 'హోమ్',
  'nav.farmer': 'రైతు పోర్టల్',
  'nav.buyer': 'కొనుగోలుదారుల మార్కెట్',
  'nav.admin': 'అడ్మిన్ కన్సోల్',
  'nav.login': 'లాగిన్',
  'nav.logout': 'లాగౌట్',
  'nav.myCrops': 'నా పంటలు',
  'nav.markets': 'సమీప మార్కెట్లు',
  'nav.bids': 'కొనుగోలుదారుల బిడ్లు',
  'nav.overview': 'పోర్టల్ అవలోకనం',

  // Onboarding Screen 1: Welcome & Settings
  'onboarding.welcome': 'కృషిసేతుకి స్వాగతం',
  'onboarding.tagline': 'రైతులకు మెరుగైన మార్కెట్లు మరియు సరైన కొనుగోలుదారులను అనుసంధానిస్తుంది',
  'onboarding.subtitle': 'సరసమైన పంట ధరలు, ధృవీకరించబడిన సంస్థాగత కొనుగోలుదారులు మరియు పారదర్శక మండి సమాచారం.',
  'onboarding.selectLanguage': 'భాషను ఎంచుకోండి',
  'onboarding.selectTheme': 'థీమ్ ఎంచుకోండి',
  'onboarding.lightMode': 'లైట్ మోడ్ (పగటి వెలుతురు)',
  'onboarding.lightModeDesc': 'స్పష్టమైన, సహజమైన పగటి దృశ్యం',
  'onboarding.darkMode': 'డార్క్ మోడ్ (రాత్రి మోడ్)',
  'onboarding.darkModeDesc': 'కళ్లకు అనుకూలమైన ముదురు రంగు ఉపరితలాలు',
  'onboarding.continueToLocation': 'లొకేషన్ గుర్తింపుకు కొనసాగండి',

  // Onboarding Screen 2: Location Detection
  'onboarding.findingLocation': 'మీ లొకేషన్‌ను కనుగొంటోంది',
  'onboarding.detectingGps': 'మీ లొకేషన్‌ను గుర్తిస్తోంది...',
  'onboarding.connectingServices': 'లొకేషన్ సేవలతో కనెక్ట్ అవుతోంది...',
  'onboarding.findingMarkets': 'సమీప వ్యవసాయ మార్కెట్లను కనుగొంటోంది...',
  'onboarding.permissionDenied': 'మేము మీ లొకేషన్‌ను గుర్తించలేకపోయాము. దయచేసి మీ ప్రదేశాన్ని మాన్యువల్‌గా నమోదు చేయండి.',
  'onboarding.searchLocation': 'నగరం లేదా జిల్లా పేరును వెతకండి...',
  'onboarding.youAreHere': 'మీరు ఇక్కడ ఉన్నారు',
  'onboarding.useDetected': 'ఈ లొకేషన్‌తో కొనసాగించండి',
  'onboarding.retryGps': 'మళ్లీ GPS ప్రయత్నించండి',
  'onboarding.enterManually': 'మాన్యువల్‌గా నగరాన్ని నమోదు చేయండి',
  'onboarding.popularCities': 'లేదా ప్రముఖ జిల్లాను ఎంచుకోండి:',

  // Onboarding Screen 3: Role Selection
  'onboarding.howToUse': 'మీరు ప్లాట్‌ఫారమ్‌ను ఎలా ఉపయోగించాలనుకుంటున్నారు?',
  'onboarding.selectRoleDesc': 'మీకు సరిపోయే ఖాతా రకాన్ని ఎంచుకోండి.',
  'onboarding.iAmFarmer': 'నేను ఒక రైతును 🌾',
  'onboarding.farmerDesc': 'మీ పంటలను నమోదు చేయండి, సమీప మార్కెట్లను కనుగొనండి మరియు కొనుగోలుదారుల నుండి నేరుగా బిడ్లను పొందండి.',
  'onboarding.continueFarmer': 'రైతుగా కొనసాగండి',
  'onboarding.iAmBuyer': 'నేను ఒక కొనుగోలుదారుడిని 🏢',
  'onboarding.buyerDesc': 'ధృవీకరించబడిన రైతులను కనుగొనండి, అందుబాటులో ఉన్న పంటలను చూడండి మరియు పోటీ బిడ్లను వేయండి.',
  'onboarding.continueBuyer': 'కొనుగోలుదారుగా కొనసాగండి',
  'onboarding.adminAccess': 'అడ్మిన్ లాగిన్',

  // Auth & OTP
  'auth.farmerLogin': 'రైతు సురక్షిత లాగిన్',
  'auth.farmerLoginDesc': 'ఓటీపీని పొందడానికి మీ మొబైల్ నంబర్‌ను నమోదు చేయండి.',
  'auth.buyerLogin': 'కొనుగోలుదారు సేకరణ లాగిన్',
  'auth.buyerLoginDesc': 'వ్యాపార పంట సేకరణను ప్రారంభించండి మరియు బిడ్లు వేయండి.',
  'auth.adminLogin': 'అడ్మిన్ నిర్వహణ లాగిన్',
  'auth.adminLoginDesc': 'ప్లాట్‌ఫారమ్ పర్యవేక్షణ మరియు KYC నిర్వహణ.',
  'auth.mobileNumber': 'మొబైల్ నంబర్',
  'auth.mobilePlaceholder': '10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి',
  'auth.sendOtp': 'OTP పంపండి',
  'auth.sending': 'పంపుతోంది...',
  'auth.enterOtp': '4 అంకెల OTP నమోదు చేయండి',
  'auth.otpSentTo': 'కోడ్ పంపబడింది: +91',
  'auth.demoOtpHint': 'డెమో OTP: 5432 (ఆటో-ఫిల్ క్లిక్ చేయండి)',
  'auth.quickFill': 'ఆటో-ఫిల్ 5432',
  'auth.verifyOtp': 'ధృవీకరించి ప్రవేశించండి',
  'auth.verifying': 'ధృవీకరిస్తోంది...',
  'auth.welcomeBack': 'తిరిగి స్వాగతం! 🌾',
  'auth.loginSuccess': 'విజయవంతంగా లాగిన్ అయ్యారు:',
  'auth.invalidOtp': 'చెల్లని కోడ్. దయచేసి డెమో కోసం 5432 నమోదు చేయండి.',
  'auth.invalidPhone': 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.',
  'auth.adminId': 'అడ్మిన్ ఐడీ',
  'auth.password': 'పాస్‌వర్డ్',
  'auth.adminDemoHint': 'డెమో: admin / krishi2026',
  'auth.signIn': 'ప్రవేశించండి',

  // Farmer Guide (Floating Assistant)
  'guide.welcome': '👋 నమస్కారం! మీ పంటకు ఉత్తమ మార్కెట్‌ను కనుగొనడంలో మేము మీకు సహాయం చేస్తాము.',
  'guide.letsStart': 'ప్రారంభిద్దాం',
  'guide.cropSelect': '🌾 మీ పంటను వెతకండి లేదా జాబితా నుండి ఎంచుకోండి.',
  'guide.quantity': '📦 మీరు అమ్మాలనుకుంటున్న పంట పరిమాణాన్ని నమోదు చేయండి.',
  'guide.unit': '⚖️ కిలోగ్రాములు (KG) లేదా క్వింటాళ్లు ఎంచుకోండి.',
  'guide.photos': '📸 కొనుగోలుదారులు పరిశీలించడానికి స్పష్టమైన పంట ఫోటోలను అప్‌లోడ్ చేయండి.',
  'guide.publishing': '🚀 అద్భుతం! మీ పంట నమోదు కొనుగోలుదారులకు చేరడానికి సిద్ధంగా ఉంది.',
  'guide.bidsReceived': '💰 మీకు కొత్త ఆఫర్లు వచ్చాయి! ఎంపిక చేసుకునే ముందు వాటిని సరిపోల్చండి.',
  'guide.buyerWelcome': '👋 నమస్కారం! మీ వద్ద ఉన్న మంచి నాణ్యమైన పంటలను కనుగొనండి.',
  'guide.buyerSearch': '🔍 పంట పేరు, దూరం మరియు పరిమాణం ప్రకారం ఫిల్టర్ చేయండి.',
  'guide.buyerBidding': '💡 పోటీ ధరను ఇవ్వడం ద్వారా రైతు మిమ్మల్ని ఎంచుకునే అవకాశం పెరుగుతుంది.',
  'guide.dismiss': 'అర్థమైంది',

  // Farmer Flow - Add Crop
  'farmer.addCrop': 'మీ పంటను జోడించండి',
  'farmer.searchCrop': 'పంట పేరు వెతకండి (ఉదా. టమోటా, వరి, ఉల్లి...)',
  'farmer.browseCatalogue': 'పంట కేటలాగ్‌ను చూడండి',
  'farmer.categories.all': 'అన్ని పంటలు',
  'farmer.categories.cereals': '🌾 తృణధాన్యాలు',
  'farmer.categories.vegetables': '🥬 కూరగాయలు',
  'farmer.categories.fruits': '🍎 పండ్లు',
  'farmer.categories.spices': '🌶️ సుగంధ ద్రవ్యాలు',
  'farmer.categories.pulses': '🌱 పప్పుదినుసులు',
  'farmer.categories.other': '🌿 వాణిజ్య పంటలు',

  // Farmer Flow - Photos
  'farmer.uploadPhotos': 'పంట ఫోటోలను అప్‌లోడ్ చేయండి',
  'farmer.uploadPhotosDesc': 'మీ పంట యొక్క నిజమైన ఫోటోలను చేర్చండి. మంచి ఫోటోలు త్వరగా బిడ్లను ఆకర్షిస్తాయి.',
  'farmer.uploadDevice': 'డివైస్ నుండి అప్‌లోడ్ చేయండి',
  'farmer.takePhoto': 'ఫోటో తీయండి',
  'farmer.addMore': '+ మరిన్ని చేర్చండి',
  'farmer.photosCount': 'జోడించిన ఫోటోలు',

  // Farmer Flow - Details & Units
  'farmer.cropDetails': 'పంట వివరాలు',
  'farmer.selectedCrop': 'ఎంచుకున్న పంట',
  'farmer.variety': 'పంట రకం / వెరైటీ',
  'farmer.varietyPlaceholder': 'ఉదా. హైబ్రిడ్, సోనా మసూరి, నాటు...',
  'farmer.quantity': 'అమ్మకపు పరిమాణం',
  'farmer.unitSelection': 'కొలమాన యూనిట్',
  'farmer.unitKg': 'కిలోగ్రాములు (KG)',
  'farmer.unitQuintal': 'క్వింటాళ్లు (100 KG)',
  'farmer.expectedPrice': 'ఆశిస్తున్న అమ్మకపు ధర',
  'farmer.pricePerKg': '₹ ధర / కిలోగ్రాముకు',
  'farmer.pricePerQuintal': '₹ ధర / క్వింటాల్‌కు',
  'farmer.harvestDate': 'కోత తేదీ / లభ్యత',
  'farmer.location': 'పొలం ప్రదేశం',

  // Farmer Flow - Preview & Publish
  'farmer.previewTitle': 'మీ పంట నమోదు సమీక్ష',
  'farmer.previewDesc': 'కొనుగోలుదారులకు పంపే ముందు మీ పంట వివరాలను తనిఖీ చేయండి.',
  'farmer.edit': 'సవరించు',
  'farmer.publish': 'పంటను ప్రచురించు',
  'farmer.publishing': 'మార్కెట్‌లో ప్రచురిస్తోంది...',
  'farmer.publishedSuccess': 'పంట నమోదు విజయవంతంగా ప్రచురించబడింది!',
  'farmer.publishedNotice': 'మీ పంట ఇప్పుడు సమీప కొనుగోలుదారులకు మరియు మండి వ్యాపారులకు అందుబాటులో ఉంది.',

  // Farmer Flow - Nearby Markets
  'farmer.bestMarketsNearYou': 'మీకు సమీపంలోని ఉత్తమ మార్కెట్లు',
  'farmer.marketsBasedOn': 'దూరం మరియు అంచనా నికర రాబడి లెక్కించిన ప్రదేశం:',
  'farmer.bestOpportunity': 'ఉత్తమ అవకాశం 🏆',
  'farmer.bestOpportunityDesc': 'తక్కువ రవాణా దూరంతో అత్యధిక అంచనా ధర.',
  'farmer.filterAll': 'అన్ని మార్కెట్లు',
  'farmer.filterBest': '🏆 ఉత్తమ అవకాశం',
  'farmer.filterHighestPrice': '💰 అత్యధిక ధర',
  'farmer.filterNearest': '📍 సమీప దూరం',
  'farmer.marketPrice': 'ప్రస్తుత మార్కెట్ ధర',
  'farmer.priceTrend': 'ధర ధోరణి',
  'farmer.trendIncreasing': '📈 పెరుగుతోంది',
  'farmer.trendStable': '➡️ స్థిరంగా ఉంది',
  'farmer.trendDecreasing': '📉 తగ్గుతోంది',
  'farmer.distanceKm': 'దూరం',
  'farmer.recommended': '⭐ సిఫార్సు చేయబడింది',
  'farmer.estNetRealization': 'అంచనా నికర రాబడి',

  // Farmer Dashboard & My Crops
  'farmer.dashboardTitle': 'రైతు డాష్‌బోర్డ్',
  'farmer.myCrops': 'నా పంటలు మరియు నమోదిత లాట్లు',
  'farmer.activeListings': 'క్రియాశీల పంటలు',
  'farmer.totalQuantity': 'మొత్తం పరిమాణం',
  'farmer.buyerBids': 'వచ్చిన కొనుగోలుదారుల బిడ్లు',
  'farmer.acceptedDeals': 'అంగీకరించిన ఒప్పందాలు',
  'farmer.viewBids': 'బిడ్లను చూడండి',
  'farmer.noListings': 'ఇంకా ఎటువంటి పంట నమోదులు లేవు. బిడ్లను పొందడానికి మీ మొదటి పంటను జోడించండి!',
  'farmer.statusActive': 'మార్కెట్‌లో ఉంది',
  'farmer.statusAccepted': 'డీల్ అంగీకరించబడింది',
  'farmer.statusClosed': 'పూర్తయింది',

  // Bid System & Comparison
  'farmer.newBidReceived': '🔔 కొత్త బిడ్ వచ్చింది!',
  'farmer.compareOffers': 'కొనుగోలుదారుల ఆఫర్లను సరిపోల్చండి',
  'farmer.compareDesc': 'పూర్తి నియంత్రణ మీదే. కొనుగోలుదారుల దూరం, ధర మరియు చెల్లింపు నిబంధనలను పరిశీలించండి.',
  'farmer.buyerName': 'కొనుగోలుదారు',
  'farmer.bidQuantity': 'కోరిన పరిమాణం',
  'farmer.bidPrice': 'ఆఫర్ చేసిన ధర',
  'farmer.buyerDistance': 'దూరం',
  'farmer.totalOffer': 'మొత్తం అమ్మకపు విలువ',
  'farmer.paymentTerms': 'చెల్లింపు నిబంధనలు',
  'farmer.bestOfferBadge': '🏆 ఉత్తమ విలువ',
  'farmer.acceptBid': 'బిడ్ అంగీకరించు',
  'farmer.rejectBid': 'తిరస్కరించు',
  'farmer.contactBuyer': 'కొనుగోలుదారుని సంప్రదించండి',
  'farmer.contactPlatform': 'ప్లాట్‌ఫారమ్ సంభాషణ',
  'farmer.contactUnlockedNotice': '✅ డీల్ అంగీకరించబడింది! ఈ లావాదేవీ కోసం నేరుగా సంప్రదింపు వివరాలు అన్‌లాక్ చేయబడ్డాయి.',
  'farmer.buyerPhone': 'కొనుగోలుదారు ఫోన్ నంబర్',
  'farmer.buyerAddress': 'డెలివరీ కేంద్రం',
  'farmer.pickupNote': 'రవాణా మరియు పంట సేకరణ కోసం ఈ నంబర్‌కు సంప్రదించండి.',

  // Buyer Portal
  'buyer.dashboardTitle': 'మీ సమీపంలో అందుబాటులో ఉన్న పంటలు',
  'buyer.dashboardSubtitle': 'ధృవీకరించబడిన రైతుల నుండి నాణ్యమైన పంటలను నేరుగా సేకరించండి.',
  'buyer.searchCrop': 'పంట పేరుతో వెతకండి...',
  'buyer.distanceFilter': 'గరిష్ట దూరం',
  'buyer.priceRange': 'ధర పరిధి',
  'buyer.quantityFilter': 'కనీస పరిమాణం',
  'buyer.verifiedOnly': 'ధృవీకరించబడిన రైతులు మాత్రమే',
  'buyer.viewDetails': 'వివరాలు చూడండి',
  'buyer.makeOffer': 'ఆఫర్ ఇవ్వండి',
  'buyer.placeBid': 'బిడ్ వేయండి',
  'buyer.bidPrice': 'మీ బిడ్ ధర',
  'buyer.requestedQuantity': 'కావలసిన పరిమాణం',
  'buyer.optionalMessage': 'సందేశం / నిబంధనలు (ఐచ్ఛికం)',
  'buyer.submittingBid': 'రైతుకు బిడ్ పంపుతోంది...',
  'buyer.bidSuccess': 'బిడ్ విజయవంతంగా వేయబడింది!',
  'buyer.bidSuccessDesc': 'రైతుకు సమాచారం చేరింది, త్వరలోనే మీ ఆఫర్‌ను పరిశీలిస్తారు.',
  'buyer.expectedFarmerPrice': 'రైతు ఆశిస్తున్న ధర',
  'buyer.farmerLocation': 'పొలం ఉన్న ప్రదేశం',
  'buyer.verifiedBadge': '🛡️ ధృవీకరించిన రైతు',

  // Admin Dashboard
  'admin.dashboardTitle': 'ప్లాట్‌ఫారమ్ పాలన మరియు పర్యవేక్షణ కన్సోల్',
  'admin.overview': 'విశ్లేషణల అవలోకనం',
  'admin.farmersTab': 'రైతుల డైరెక్టరీ',
  'admin.buyersTab': 'కొనుగోలుదారుల డైరెక్టరీ',
  'admin.listingsTab': 'పంట నమోదులు',
  'admin.bidsTab': 'బిడ్ల పర్యవేక్షణ',
  'admin.totalFarmers': 'మొత్తం రైతులు',
  'admin.totalBuyers': 'మొత్తం కొనుగోలుదారులు',
  'admin.activeListings': 'క్రియాశీల పంటలు',
  'admin.totalBids': 'వేసిన మొత్తం బిడ్లు',
  'admin.activeRegion': 'అత్యంత చురుకైన ప్రాంతం',
  'admin.popularCrop': 'అత్యంత ప్రజాదరణ పొందిన పంట',
  'admin.verify': 'ధృవీకరించు',
  'admin.flag': 'అనుమానాస్పదంగా గుర్తించు',
  'admin.suspend': 'ఖాతా నిలిపివేయి',
  'admin.remove': 'తొలగించు',
  'admin.confirmRemove': 'మీరు ఖచ్చితంగా ఈ రికార్డును తొలగించాలనుకుంటున్నారా? ఈ చర్యను రద్దు చేయలేరు.',
  'admin.statusVerified': 'ధృవీకరించబడింది',
  'admin.statusSuspicious': 'ఫ్లాగ్ చేయబడింది',
  'admin.statusSuspended': 'నిలిపివేయబడింది',
  'admin.statusActive': 'క్రియాశీలం',

  // General Actions & Common
  'common.save': 'సేవ్ చేయి',
  'common.cancel': 'రద్దు చేయి',
  'common.confirm': 'నిర్ధారించు',
  'common.close': 'మూసివేయి',
  'common.back': 'వెనుకకు',
  'common.next': 'తదుపరి',
  'common.loading': 'లోడ్ అవుతోంది...',
  'common.search': 'వెతుకు',
  'common.filter': 'ఫిల్టర్',
  'common.viewAll': 'అన్నీ చూడండి',
  'common.rupees': '₹',
  'common.km': 'కి.మీ',
  'common.quintal': 'క్వింటాల్',
  'common.quintals': 'క్వింటాళ్లు',
  'common.kg': 'కిలో',
};

export const MR_TRANSLATIONS: TranslationsRecord = {
  // Brand & Header
  'app.name': 'कृषीसेतू',
  'app.tagline': 'शेतकऱ्यांना उत्तम बाजारपेठ आणि विश्वासू खरेदीदारांशी जोडणारे व्यासपीठ',
  'app.nationalTagline': 'भारताचे डिजिटल कृषी बाजारपेठ व्यासपीठ',
  'nav.home': 'मुख्यपृष्ठ',
  'nav.farmer': 'शेतकरी पोर्टल',
  'nav.buyer': 'खरेदीदार बाजार',
  'nav.admin': 'प्रशासक कक्ष',
  'nav.login': 'लॉगिन करा',
  'nav.logout': 'लॉगआउट',
  'nav.myCrops': 'माझी पिके',
  'nav.markets': 'जवळचे बाजार',
  'nav.bids': 'खरेदीदारांच्या बोली',
  'nav.overview': 'पोर्टल विहंगावलोकन',

  // Onboarding Screen 1: Welcome & Settings
  'onboarding.welcome': 'कृषीसेतूमध्ये आपले स्वागत आहे',
  'onboarding.tagline': 'शेतकऱ्यांना उत्तम बाजारपेठ आणि विश्वासू खरेदीदारांशी जोडणारे व्यासपीठ',
  'onboarding.subtitle': 'वाजवी शेतमाल भाव, प्रमाणित संस्थात्मक खरेदीदार आणि पारदर्शक बाजारभाव माहिती.',
  'onboarding.selectLanguage': 'भाषा निवडा',
  'onboarding.selectTheme': 'रंगसंगती (थीम) निवडा',
  'onboarding.lightMode': 'लाइट मोड (दिवस मोड)',
  'onboarding.lightModeDesc': 'स्वच्छ, उच्च कॉन्ट्रास्ट नैसर्गिक प्रकाश दृश्य',
  'onboarding.darkMode': 'डार्क मोड (रात्र मोड)',
  'onboarding.darkModeDesc': 'डोळ्यांना शांत वाटणारे गडद पृष्ठभाग',
  'onboarding.continueToLocation': 'स्थान शोधण्यासाठी पुढे जा',

  // Onboarding Screen 2: Location Detection
  'onboarding.findingLocation': 'आपले स्थान शोधत आहोत',
  'onboarding.detectingGps': 'आपले स्थान शोधत आहोत...',
  'onboarding.connectingServices': 'स्थान सेवांशी जोडत आहोत...',
  'onboarding.findingMarkets': 'जवळपासच्या कृषी बाजारपेठा शोधत आहोत...',
  'onboarding.permissionDenied': 'आम्हाला आपले स्थान मिळू शकले नाही. कृपया आपले शहर किंवा जिल्हा स्वतः प्रविष्ट करा.',
  'onboarding.searchLocation': 'स्थान किंवा शहर शोधा...',
  'onboarding.youAreHere': 'तुम्ही येथे आहात',
  'onboarding.useDetected': 'या स्थानासह पुढे जा',
  'onboarding.retryGps': 'पुन्हा GPS प्रयत्न करा',
  'onboarding.enterManually': 'स्वतः शहर/जिल्हा प्रविष्ट करा',
  'onboarding.popularCities': 'किंवा लोकप्रिय जिल्हा निवडा:',

  // Onboarding Screen 3: Role Selection
  'onboarding.howToUse': 'आपण या मंचाचा वापर कसा करू इच्छिता?',
  'onboarding.selectRoleDesc': 'आपल्या गरजेनुसार योग्य खाते प्रकार निवडा.',
  'onboarding.iAmFarmer': 'मी शेतकरी आहे 🌾',
  'onboarding.farmerDesc': 'आपल्या पिकांची नोंदणी करा, जवळचे बाजार शोधा आणि खरेदीदारांकडून थेट बोली मिळवा.',
  'onboarding.continueFarmer': 'शेतकरी म्हणून पुढे जा',
  'onboarding.iAmBuyer': 'मी खरेदीदार आहे 🏢',
  'onboarding.buyerDesc': 'प्रमाणित शेतकरी शोधा, उपलब्ध पिके पहा आणि स्पर्धात्मक बोली लावा.',
  'onboarding.continueBuyer': 'खरेदीदार म्हणून पुढे जा',
  'onboarding.adminAccess': 'प्रशासक लॉगिन',

  // Auth & OTP
  'auth.farmerLogin': 'शेतकरी सुरक्षित लॉगिन',
  'auth.farmerLoginDesc': 'ओटीपी मिळवण्यासाठी आपला मोबाईल नंबर प्रविष्ट करा.',
  'auth.buyerLogin': 'खरेदीदार खरेदी लॉगिन',
  'auth.buyerLoginDesc': 'शेतमाल खरेदी आणि थेट बोली प्रक्रिया सुरू करा.',
  'auth.adminLogin': 'प्रशासकीय नियंत्रण लॉगिन',
  'auth.adminLoginDesc': 'व्यासपीठ नियमन आणि केवायसी पडताळणी.',
  'auth.mobileNumber': 'मोबाईल नंबर',
  'auth.mobilePlaceholder': '१० अंकी मोबाईल नंबर प्रविष्ट करा',
  'auth.sendOtp': 'OTP पाठवा',
  'auth.sending': 'पाठवत आहे...',
  'auth.enterOtp': '४ अंकी OTP प्रविष्ट करा',
  'auth.otpSentTo': 'सत्यापन कोड पाठवला: +91',
  'auth.demoOtpHint': 'डेमो OTP: 5432 (किंवा ऑटो-फिल करा)',
  'auth.quickFill': 'ऑटो-फिल 5432',
  'auth.verifyOtp': 'पडताळणी करून प्रवेश करा',
  'auth.verifying': 'पडताळत आहे...',
  'auth.welcomeBack': 'पुन्हा स्वागत आहे! 🌾',
  'auth.loginSuccess': 'यशस्वीरित्या लॉगिन झाले:',
  'auth.invalidOtp': 'अवैध कोड. कृपया डेमोसाठी 5432 प्रविष्ट करा.',
  'auth.invalidPhone': 'कृपया वैध १० अंकी मोबाईल नंबर टाका.',
  'auth.adminId': 'प्रशासक आयडी',
  'auth.password': 'पासवर्ड',
  'auth.adminDemoHint': 'डेमो: admin / krishi2026',
  'auth.signIn': 'साइन इन करा',

  // Farmer Guide (Floating Assistant)
  'guide.welcome': '👋 नमस्कार! आपल्या पिकासाठी सर्वोत्तम बाजारपेठ शोधण्यात आम्ही मदत करू.',
  'guide.letsStart': 'सुरू करूया',
  'guide.cropSelect': '🌾 आपले पीक शोधा किंवा यादीतून निवडा.',
  'guide.quantity': '📦 आपण किती शेतमाल विकू इच्छिता ते प्रमाण प्रविष्ट करा.',
  'guide.unit': '⚖️ किलोग्रॅम (KG) किंवा क्विंटल निवडा.',
  'guide.photos': '📸 खरेदीदारांना दाखवण्यासाठी पिकाचे स्पष्ट फोटो अपलोड करा.',
  'guide.publishing': '🚀 उत्तम! आपली पीक नोंदणी खरेदीदारांपर्यंत पोहोचण्यासाठी तयार आहे.',
  'guide.bidsReceived': '💰 आपल्याला नवीन बोली मिळाल्या आहेत! निवडण्यापूर्वी त्यांची तुलना करा.',
  'guide.buyerWelcome': '👋 नमस्कार! आपल्या केंद्राजवळ उपलब्ध उत्कृष्ट पिके शोधा.',
  'guide.buyerSearch': '🔍 पीक, अंतर आणि प्रमाणानुसार फिल्टर करा.',
  'guide.buyerBidding': '💡 स्पर्धात्मक भाव दिल्यास शेतकरी आपल्याला निवडण्याची शक्यता वाढते.',
  'guide.dismiss': 'समजले',

  // Farmer Flow - Add Crop
  'farmer.addCrop': 'आपले पीक जोडा',
  'farmer.searchCrop': 'पीक शोधा (उदा. टोमॅटो, भात/धान, कांदा...)',
  'farmer.browseCatalogue': 'पीक सूची पहा',
  'farmer.categories.all': 'सर्व पिके',
  'farmer.categories.cereals': '🌾 तृणधान्ये',
  'farmer.categories.vegetables': '🥬 भाजीपाला',
  'farmer.categories.fruits': '🍎 फळे',
  'farmer.categories.spices': '🌶️ मसाले',
  'farmer.categories.pulses': '🌱 कडधान्ये व डाळी',
  'farmer.categories.other': '🌿 नगदी व इतर पिके',

  // Farmer Flow - Photos
  'farmer.uploadPhotos': 'पिकाचे फोटो अपलोड करा',
  'farmer.uploadPhotosDesc': 'आपल्या ताज्या शेतमालाचे अस्सल फोटो टाका. चांगल्या फोटोंमुळे खरेदीदार पटकन आकर्षित होतात.',
  'farmer.uploadDevice': 'डिव्हाइसवरून अपलोड करा',
  'farmer.takePhoto': 'फोटो काढा',
  'farmer.addMore': '+ आणखी जोडा',
  'farmer.photosCount': 'जोडलेले फोटो',

  // Farmer Flow - Details & Units
  'farmer.cropDetails': 'पिकाचा तपशील',
  'farmer.selectedCrop': 'निवडलेले पीक',
  'farmer.variety': 'पिकाची जात / वाण',
  'farmer.varietyPlaceholder': 'उदा. संकरित, बासमती, देशी...',
  'farmer.quantity': 'विक्रीसाठी प्रमाण',
  'farmer.unitSelection': 'मोजमाप एकक',
  'farmer.unitKg': 'किलोग्रॅम (KG)',
  'farmer.unitQuintal': 'क्विंटल (१०० KG)',
  'farmer.expectedPrice': 'अपेक्षित विक्री भाव',
  'farmer.pricePerKg': '₹ भाव / किलोग्रॅम',
  'farmer.pricePerQuintal': '₹ भाव / क्विंटल',
  'farmer.harvestDate': 'कापणी तारीख / उपलब्धता',
  'farmer.location': 'शेताचे स्थान',

  // Farmer Flow - Preview & Publish
  'farmer.previewTitle': 'नोंदणीचे पूर्वावलोकन',
  'farmer.previewDesc': 'खरेदीदारांना पाठवण्यापूर्वी सर्व तपशील तपासून घ्या.',
  'farmer.edit': 'बदल करा',
  'farmer.publish': 'नोंदणी प्रसिद्ध करा',
  'farmer.publishing': 'बाजारपेठेत प्रसिद्ध करत आहे...',
  'farmer.publishedSuccess': 'नोंदणी यशस्वीरित्या प्रसिद्ध झाली!',
  'farmer.publishedNotice': 'आपली नोंदणी आता जवळच्या खरेदीदारांना आणि बाजार समितीतील व्यापाऱ्यांना दिसत आहे.',

  // Farmer Flow - Nearby Markets
  'farmer.bestMarketsNearYou': 'आपल्या जवळील सर्वोत्तम बाजार',
  'farmer.marketsBasedOn': 'अंतर आणि अपेक्षित निव्वळ नफा या स्थानावरून मोजला आहे:',
  'farmer.bestOpportunity': 'सर्वोत्तम संधी 🏆',
  'farmer.bestOpportunityDesc': 'कमी वाहतूक अंतरात सर्वाधिक अंदाजे बाजारभाव.',
  'farmer.filterAll': 'सर्व बाजार',
  'farmer.filterBest': '🏆 सर्वोत्तम संधी',
  'farmer.filterHighestPrice': '💰 सर्वोच्च भाव',
  'farmer.filterNearest': '📍 सर्वात जवळ',
  'farmer.marketPrice': 'चालू बाजारभाव',
  'farmer.priceTrend': 'भावाची दिशा',
  'farmer.trendIncreasing': '📈 वाढत आहे',
  'farmer.trendStable': '➡️ स्थिर आहे',
  'farmer.trendDecreasing': '📉 कमी होत आहे',
  'farmer.distanceKm': 'अंतर',
  'farmer.recommended': '⭐ शिफारस केलेले',
  'farmer.estNetRealization': 'अपेक्षित निव्वळ रक्कम',

  // Farmer Dashboard & My Crops
  'farmer.dashboardTitle': 'शेतकरी डॅशबोर्ड',
  'farmer.myCrops': 'माझी पिके आणि लॉट नोंदणी',
  'farmer.activeListings': 'सक्रिय पिके',
  'farmer.totalQuantity': 'एकूण प्रमाण',
  'farmer.buyerBids': 'प्राप्त खरेदीदार बोली',
  'farmer.acceptedDeals': 'स्वीकारलेले सौदे',
  'farmer.viewBids': 'बोली पहा',
  'farmer.noListings': 'अद्याप कोणतीही पीक नोंदणी नाही. खरेदीदारांच्या बोली मिळवण्यासाठी पहिले पीक जोडा!',
  'farmer.statusActive': 'बाजारात सक्रिय',
  'farmer.statusAccepted': 'सौदा मंजूर',
  'farmer.statusClosed': 'पूर्ण झाले',

  // Bid System & Comparison
  'farmer.newBidReceived': '🔔 नवीन बोली मिळाली!',
  'farmer.compareOffers': 'खरेदीदारांच्या बोलींची तुलना करा',
  'farmer.compareDesc': 'सर्व नियंत्रण आपल्या हातात आहे. अंतर, भाव आणि पैसे मिळण्याच्या अटी तपासा.',
  'farmer.buyerName': 'खरेदीदार',
  'farmer.bidQuantity': 'मागितलेले प्रमाण',
  'farmer.bidPrice': 'दिलेला भाव',
  'farmer.buyerDistance': 'अंतर',
  'farmer.totalOffer': 'एकूण विक्री मूल्य',
  'farmer.paymentTerms': 'पैसे देण्याच्या अटी',
  'farmer.bestOfferBadge': '🏆 सर्वोत्तम मूल्य',
  'farmer.acceptBid': 'बोली स्वीकारा',
  'farmer.rejectBid': 'नाकारा',
  'farmer.contactBuyer': 'खरेदीदाराशी संपर्क साधा',
  'farmer.contactPlatform': 'व्यासपीठ संपर्क कक्ष',
  'farmer.contactUnlockedNotice': '✅ सौदा मंजूर झाला! या व्यवहारासाठी थेट संपर्क तपशील उपलब्ध झाले आहेत.',
  'farmer.buyerPhone': 'खरेदीदाराचा फोन नंबर',
  'farmer.buyerAddress': 'डिलिव्हरी केंद्र',
  'farmer.pickupNote': 'शेतमाल उचल व वाहतुकीसाठी या क्रमांकावर थेट समन्वय साधा.',

  // Buyer Portal
  'buyer.dashboardTitle': 'आपल्या जवळ उपलब्ध शेतमाल',
  'buyer.dashboardSubtitle': 'प्रमाणित शेतकऱ्यांकडून थेट दर्जा आणि अंतर तपासून शेतमाल खरेदी करा.',
  'buyer.searchCrop': 'पिकाच्या नावाने शोधा...',
  'buyer.distanceFilter': 'कमाल अंतर',
  'buyer.priceRange': 'भाव श्रेणी',
  'buyer.quantityFilter': 'किमान प्रमाण',
  'buyer.verifiedOnly': 'केवळ प्रमाणित शेतकरी',
  'buyer.viewDetails': 'तपशील पहा',
  'buyer.makeOffer': 'ऑफर द्या',
  'buyer.placeBid': 'बोली लावा',
  'buyer.bidPrice': 'आपला बोली भाव',
  'buyer.requestedQuantity': 'आवश्यक प्रमाण',
  'buyer.optionalMessage': 'टीप / अटी (पर्यायी)',
  'buyer.submittingBid': 'शेतकऱ्याला बोली पाठवत आहे...',
  'buyer.bidSuccess': 'बोली यशस्वीरित्या लावली गेली!',
  'buyer.bidSuccessDesc': 'शेतकऱ्याला सूचना मिळाली असून ते लवकरच आपल्या बोलीचा विचार करतील.',
  'buyer.expectedFarmerPrice': 'शेतकऱ्याचा अपेक्षित भाव',
  'buyer.farmerLocation': 'शेताचे स्थान',
  'buyer.verifiedBadge': '🛡️ प्रमाणित शेतकरी',

  // Admin Dashboard
  'admin.dashboardTitle': 'व्यासपीठ नियमन व देखरेख कक्ष',
  'admin.overview': 'विश्लेषण विहंगावलोकन',
  'admin.farmersTab': 'शेतकरी यादी',
  'admin.buyersTab': 'खरेदीदार यादी',
  'admin.listingsTab': 'पीक नोंदणी सूची',
  'admin.bidsTab': 'बोली देखरेख',
  'admin.totalFarmers': 'एकूण शेतकरी',
  'admin.totalBuyers': 'एकूण खरेदीदार',
  'admin.activeListings': 'सक्रिय नोंदणी',
  'admin.totalBids': 'एकूण लागलेल्या बोली',
  'admin.activeRegion': 'सर्वात सक्रिय भाग',
  'admin.popularCrop': 'सर्वाधिक लोकप्रिय पीक',
  'admin.verify': 'प्रमाणित करा',
  'admin.flag': 'संशयास्पद चिन्हांकित करा',
  'admin.suspend': 'खाते निलंबित करा',
  'admin.remove': 'हटवा',
  'admin.confirmRemove': 'आपण खात्रीपूर्वक ही नोंद हटवू इच्छिता का? ही कृती परत घेता येणार नाही.',
  'admin.statusVerified': 'प्रमाणित',
  'admin.statusSuspicious': 'चिन्हांकित',
  'admin.statusSuspended': 'निलंबित',
  'admin.statusActive': 'सक्रिय',

  // General Actions & Common
  'common.save': 'जतन करा',
  'common.cancel': 'रद्द करा',
  'common.confirm': 'पुष्टी करा',
  'common.close': 'बंद करा',
  'common.back': 'मागे',
  'common.next': 'पुढे',
  'common.loading': 'लोड होत आहे...',
  'common.search': 'शोधा',
  'common.filter': 'फिल्टर',
  'common.viewAll': 'सर्व पहा',
  'common.rupees': '₹',
  'common.km': 'कि.मी.',
  'common.quintal': 'क्विंटल',
  'common.quintals': 'क्विंटल',
  'common.kg': 'किलो',
};

const ALL_DICTIONARIES: Record<Language, TranslationsRecord> = {
  en: EN_TRANSLATIONS,
  te: TE_TRANSLATIONS,
  mr: MR_TRANSLATIONS,
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_language');
    if (saved === 'te' || saved === 'mr' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_language', lang);
    // Dispatch an event in case any detached listeners need it
    window.dispatchEvent(new CustomEvent('krishi_language_changed', { detail: lang }));
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'krishi_language' && e.newValue) {
        if (e.newValue === 'en' || e.newValue === 'te' || e.newValue === 'mr') {
          setLanguageState(e.newValue as Language);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = (key: string, fallback?: string): string => {
    const dict = ALL_DICTIONARIES[language] || EN_TRANSLATIONS;
    if (dict[key]) {
      return dict[key];
    }
    // Fallback to English dictionary if key missing in current language
    if (EN_TRANSLATIONS[key]) {
      return EN_TRANSLATIONS[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
