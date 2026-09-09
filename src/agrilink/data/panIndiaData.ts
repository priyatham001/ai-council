import {
  Crop,
  MandiMarket,
  BuyerProfile,
  StorageWarehouse,
  LogisticsVehicle,
  FarmerPersona
} from '../types';

export interface StateInfo {
  code: string;
  name: string;
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East' | 'UT';
  majorCrops: string[];
  districts: string[];
}

// 28 Indian States + 8 Union Territories
export const INDIAN_STATES: StateInfo[] = [
  {
    code: 'MH',
    name: 'Maharashtra',
    zone: 'West',
    majorCrops: ['Onion', 'Grapes', 'Soybean', 'Cotton', 'Sugarcane', 'Pomegranate'],
    districts: ['Nashik', 'Pune', 'Ahmednagar', 'Solapur', 'Nagpur', 'Jalgaon', 'Kolhapur', 'Amravati', 'Aurangabad']
  },
  {
    code: 'PB',
    name: 'Punjab',
    zone: 'North',
    majorCrops: ['Wheat', 'Paddy', 'Maize', 'Cotton', 'Mustard', 'Potato'],
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Bathinda', 'Patiala', 'Firozpur', 'Sangrur', 'Gurdaspur']
  },
  {
    code: 'KA',
    name: 'Karnataka',
    zone: 'South',
    majorCrops: ['Tomato', 'Ragi', 'Maize', 'Paddy', 'Turmeric', 'Banana'],
    districts: ['Kolar', 'Bengaluru Rural', 'Belagavi', 'Hubballi-Dharwad', 'Mysuru', 'Ballari', 'Shivamogga', 'Mandya']
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    zone: 'South',
    majorCrops: ['Tomato', 'Paddy', 'Chilli', 'Banana', 'Groundnut', 'Tobacco'],
    districts: ['West Godavari', 'East Godavari', 'Guntur', 'NTR District', 'Krishna', 'Kurnool', 'Anantapur', 'Chittoor']
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    zone: 'West',
    majorCrops: ['Cotton', 'Groundnut', 'Cumin', 'Castor', 'Sesame', 'Wheat'],
    districts: ['Rajkot', 'Unjha (Mehsana)', 'Gondal', 'Surat', 'Ahmedabad', 'Junagadh', 'Bhavnagar', 'Banaskantha']
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    zone: 'South',
    majorCrops: ['Banana', 'Paddy', 'Turmeric', 'Coconut', 'Groundnut', 'Maize'],
    districts: ['Coimbatore', 'Chennai / Thiruvallur', 'Madurai', 'Dindigul', 'Erode', 'Tiruchirappalli', 'Thanjavur', 'Salem']
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    zone: 'Central',
    majorCrops: ['Soybean', 'Wheat', 'Gram', 'Mustard', 'Garlic', 'Coriander'],
    districts: ['Indore', 'Ujjain', 'Neemuch', 'Mandsaur', 'Jabalpur', 'Bhopal', 'Dewas', 'Hoshangabad']
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    zone: 'North',
    majorCrops: ['Wheat', 'Sugarcane', 'Potato', 'Paddy', 'Mustard', 'Mango'],
    districts: ['Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Lucknow', 'Bareilly', 'Aligarh', 'Prayagraj']
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    zone: 'North',
    majorCrops: ['Mustard', 'Bajra', 'Gram', 'Coriander', 'Cumin', 'Soybean'],
    districts: ['Kota', 'Bikaner', 'Jodhpur', 'Jaipur', 'Alwar', 'Sri Ganganagar', 'Barmer', 'Nagaur']
  },
  {
    code: 'TS',
    name: 'Telangana',
    zone: 'South',
    majorCrops: ['Cotton', 'Chilli', 'Paddy', 'Turmeric', 'Maize', 'Soybean'],
    districts: ['Warangal', 'Nizamabad', 'Khammam', 'Suryapet', 'Karimnagar', 'Nalgonda', 'Mahabubnagar']
  },
  {
    code: 'WB',
    name: 'West Bengal',
    zone: 'East',
    majorCrops: ['Paddy', 'Jute', 'Potato', 'Tomato', 'Maize', 'Tea'],
    districts: ['Burdwan', 'Hooghly (Sheoraphuli)', 'Siliguri (Darjeeling)', 'Nadia', 'Murshidabad', 'North 24 Parganas']
  },
  {
    code: 'HR',
    name: 'Haryana',
    zone: 'North',
    majorCrops: ['Wheat', 'Paddy (Basmati)', 'Mustard', 'Cotton', 'Sugarcane'],
    districts: ['Karnal', 'Sirsa', 'Ambala', 'Hisar', 'Kurukshetra', 'Sonipat', 'Rohtak']
  },
  {
    code: 'BR',
    name: 'Bihar',
    zone: 'East',
    majorCrops: ['Maize', 'Paddy', 'Wheat', 'Banana', 'Litchi', 'Potato'],
    districts: ['Muzaffarpur', 'Purnia (Gulabbagh)', 'Samastipur', 'Patna', 'Bhagalpur', 'Gaya']
  },
  {
    code: 'OD',
    name: 'Odisha',
    zone: 'East',
    majorCrops: ['Paddy', 'Moong', 'Groundnut', 'Turmeric', 'Brinjal'],
    districts: ['Cuttack', 'Bargarh', 'Sambalpur', 'Balasore', 'Ganjam', 'Koraput']
  },
  {
    code: 'KL',
    name: 'Kerala',
    zone: 'South',
    majorCrops: ['Banana', 'Cardamom', 'Black Pepper', 'Coconut', 'Rubber', 'Paddy'],
    districts: ['Idukki', 'Wayanad', 'Palakkad', 'Kochi (Ernakulam)', 'Kozhikode', 'Kottayam']
  },
  {
    code: 'AS',
    name: 'Assam',
    zone: 'North-East',
    majorCrops: ['Tea', 'Paddy', 'Jute', 'Mustard', 'Ginger', 'Banana'],
    districts: ['Kamrup (Guwahati)', 'Nagaon', 'Jorhat', 'Dibrugarh', 'Sonitpur', 'Cachar']
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    zone: 'North',
    majorCrops: ['Apple', 'Potato', 'Tomato', 'Maize', 'Ginger', 'Garlic'],
    districts: ['Shimla', 'Solan', 'Kullu', 'Mandi', 'Kangra', 'Kinnaur']
  },
  {
    code: 'JK',
    name: 'Jammu & Kashmir',
    zone: 'North',
    majorCrops: ['Apple', 'Saffron', 'Walnut', 'Paddy', 'Maize'],
    districts: ['Srinagar', 'Sopore (Baramulla)', 'Shopian', 'Anantnag', 'Jammu']
  },
  {
    code: 'CT',
    name: 'Chhattisgarh',
    zone: 'Central',
    majorCrops: ['Paddy', 'Maize', 'Gram', 'Soybean', 'Kodo-Kutki'],
    districts: ['Raipur', 'Durg', 'Rajnandgaon', 'Bilaspur', 'Bastar']
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    zone: 'East',
    majorCrops: ['Paddy', 'Maize', 'Tomato', 'Potato', 'Gram'],
    districts: ['Ranchi', 'Hazaribagh', 'Dhanbad', 'Bokaro', 'Dumka']
  },
  {
    code: 'UT',
    name: 'Uttarakhand',
    zone: 'North',
    majorCrops: ['Wheat', 'Paddy', 'Sugarcane', 'Soybean', 'Apple'],
    districts: ['Dehradun', 'Haridwar', 'Udham Singh Nagar (Kashipur)', 'Nainital']
  },
  {
    code: 'GA',
    name: 'Goa',
    zone: 'West',
    majorCrops: ['Paddy', 'Cashew', 'Coconut', 'Arecanut'],
    districts: ['North Goa (Mapusa)', 'South Goa (Margao)']
  },
  {
    code: 'SK',
    name: 'Sikkim',
    zone: 'North-East',
    majorCrops: ['Cardamom', 'Ginger', 'Turmeric', 'Buckwheat', 'Orange'],
    districts: ['East Sikkim (Gangtok)', 'West Sikkim', 'South Sikkim']
  },
  {
    code: 'TR',
    name: 'Tripura',
    zone: 'North-East',
    majorCrops: ['Paddy', 'Pineapple', 'Rubber', 'Jute', 'Tea'],
    districts: ['West Tripura (Agartala)', 'South Tripura', 'Dhalai']
  },
  {
    code: 'MN',
    name: 'Manipur',
    zone: 'North-East',
    majorCrops: ['Paddy (Chak-hao Black Rice)', 'Pineapple', 'Maize'],
    districts: ['Imphal West', 'Imphal East', 'Bishnupur', 'Churachandpur']
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    zone: 'North-East',
    majorCrops: ['Lakadong Turmeric', 'Ginger', 'Pineapple', 'Maize'],
    districts: ['East Khasi Hills (Shillong)', 'West Jaintia Hills', 'Ri-Bhoi']
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    zone: 'North-East',
    majorCrops: ['Ginger', 'Turmeric', 'Chilli (Bird Eye)', 'Paddy'],
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib']
  },
  {
    code: 'NL',
    name: 'Nagaland',
    zone: 'North-East',
    majorCrops: ['Naga King Chilli (Bhut Jolokia)', 'Cardamom', 'Paddy', 'Maize'],
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Mon']
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    zone: 'North-East',
    majorCrops: ['Kiwi', 'Orange', 'Cardamom', 'Ginger', 'Paddy'],
    districts: ['Papum Pare (Itanagar)', 'West Kameng', 'Lower Subansiri']
  },
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    zone: 'UT',
    majorCrops: ['Vegetables', 'Flowers', 'Wheat'],
    districts: ['North Delhi (Azadpur National APMC Hub)', 'South Delhi', 'Najafgarh']
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    zone: 'UT',
    majorCrops: ['Vegetables', 'Grain Hub'],
    districts: ['Chandigarh Grain & Veg Yard']
  },
  {
    code: 'PY',
    name: 'Puducherry',
    zone: 'UT',
    majorCrops: ['Paddy', 'Sugarcane', 'Coconut', 'Vegetables'],
    districts: ['Puducherry Central', 'Karaikal']
  },
  {
    code: 'LA',
    name: 'Ladakh',
    zone: 'UT',
    majorCrops: ['Apricot (Raktsey Karpo)', 'Buckwheat', 'Barley'],
    districts: ['Leh', 'Kargil']
  }
];

export const ALL_INDIA_STATES = INDIAN_STATES;

// 8 Diverse State Farmer Personas for Demo Switching
export const DEMO_FARMER_PERSONAS: FarmerPersona[] = [
  {
    id: 'farmer-suresh-mh',
    name: 'Suresh Patil',
    state: 'Maharashtra',
    stateCode: 'MH',
    district: 'Nashik',
    village: 'Pimpalgaon Baswant',
    primaryCrop: 'Onion',
    secondaryCrops: ['Grapes', 'Soybean'],
    fpoName: 'Sahyadri Farmers Producer Co.',
    farmSizeAcres: 5.5,
    storageAvailable: true,
    preferredLanguage: 'mr',
    phone: '+91 98220 54321'
  },
  {
    id: 'farmer-gurpreet-pb',
    name: 'Gurpreet Singh',
    state: 'Punjab',
    stateCode: 'PB',
    district: 'Ludhiana',
    village: 'Samrala Kalan',
    primaryCrop: 'Wheat',
    secondaryCrops: ['Paddy', 'Maize'],
    fpoName: 'Malwa Agro Farmers Collective',
    farmSizeAcres: 12.0,
    storageAvailable: true,
    preferredLanguage: 'pa',
    phone: '+91 98140 67890'
  },
  {
    id: 'farmer-lakshmi-ka',
    name: 'Lakshmi Devi',
    state: 'Karnataka',
    stateCode: 'KA',
    district: 'Kolar',
    village: 'Bangarapet Rural',
    primaryCrop: 'Tomato',
    secondaryCrops: ['Ragi', 'Maize'],
    fpoName: 'Kolar Gold Horticulture FPO',
    farmSizeAcres: 4.2,
    storageAvailable: false,
    preferredLanguage: 'kn',
    phone: '+91 94480 33445'
  },
  {
    id: 'farmer-ramesh-ap',
    name: 'Ramesh Reddy',
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    district: 'YSR Kadapa',
    village: 'Kadapa Rural',
    primaryCrop: 'Tomato',
    secondaryCrops: ['Paddy', 'Chilli', 'Groundnut'],
    fpoName: 'Rayalaseema Krishi Farmers Producer Co.',
    farmSizeAcres: 6.0,
    storageAvailable: false,
    preferredLanguage: 'te',
    phone: '+91 98480 12345'
  },
  {
    id: 'farmer-arun-tn',
    name: 'Arunachalam Pillai',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    district: 'Coimbatore',
    village: 'Pollachi Green Fields',
    primaryCrop: 'Banana',
    secondaryCrops: ['Coconut', 'Paddy'],
    fpoName: 'Anamalai River Basin FPO',
    farmSizeAcres: 7.5,
    storageAvailable: true,
    preferredLanguage: 'ta',
    phone: '+91 94430 11223'
  },
  {
    id: 'farmer-rajesh-ts',
    name: 'Rajeshwar Rao',
    state: 'Telangana',
    stateCode: 'TS',
    district: 'Warangal',
    village: 'Atmakur Cluster',
    primaryCrop: 'Cotton',
    secondaryCrops: ['Chilli', 'Turmeric'],
    fpoName: 'Kakatiya Cotton & Spices FPO',
    farmSizeAcres: 8.0,
    storageAvailable: false,
    preferredLanguage: 'te',
    phone: '+91 98490 55667'
  },
  {
    id: 'farmer-pooja-mp',
    name: 'Pooja Chouhan',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    district: 'Indore',
    village: 'Depalpur Agri Belt',
    primaryCrop: 'Soybean',
    secondaryCrops: ['Wheat', 'Gram'],
    fpoName: 'Malwa Soya Progressive Sangh',
    farmSizeAcres: 6.5,
    storageAvailable: true,
    preferredLanguage: 'hi',
    phone: '+91 97550 99887'
  },
  {
    id: 'farmer-amit-gj',
    name: 'Amit Patel',
    state: 'Gujarat',
    stateCode: 'GJ',
    district: 'Rajkot',
    village: 'Gondal Taluka Fields',
    primaryCrop: 'Groundnut',
    secondaryCrops: ['Cotton', 'Cumin'],
    fpoName: 'Saurashtra Oilseeds Producer Co.',
    farmSizeAcres: 9.0,
    storageAvailable: true,
    preferredLanguage: 'gu',
    phone: '+91 98250 44556'
  }
];

// Comprehensive 30+ Pan-India Crops
export const PAN_INDIA_CROPS: Crop[] = [
  // Cereals
  {
    id: 'crop-wheat',
    name: 'Wheat (Sharbati / Lokwan)',
    hindiName: 'गेहूँ',
    marathiName: 'गहू',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 2275,
    currentModalPrice: 2420,
    priceChangePct: 4.8,
    gradeStandards: {
      gradeA: 'Lustrous amber grains, moisture <11%, foreign matter <0.5%, broken grains <1%',
      gradeB: 'Uniform grain, moisture 11-13%, broken grains 1-3%, foreign matter <1%',
      gradeC: 'Light weathered grains, moisture >13%, commercial milling grade'
    }
  },
  {
    id: 'crop-paddy',
    name: 'Paddy (BPT-5204 / Basmati)',
    hindiName: 'धान',
    marathiName: 'भात / धान',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 2180,
    currentModalPrice: 2320,
    priceChangePct: 3.4,
    gradeStandards: {
      gradeA: 'Moisture <13.5%, slender grain >6.8mm, broken grains <2%, foreign matter <0.5%',
      gradeB: 'Moisture 13.5-15%, broken grains 2-5%, foreign matter <1%',
      gradeC: 'Moisture >15%, commercial parboiled mill grade'
    }
  },
  {
    id: 'crop-maize',
    name: 'Maize (Yellow Corn)',
    hindiName: 'मक्का',
    marathiName: 'मका',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 2090,
    currentModalPrice: 2180,
    priceChangePct: 2.9,
    gradeStandards: {
      gradeA: 'Bright yellow flint grains, moisture <13%, zero aflatoxin, broken <2%',
      gradeB: 'Moisture 13-15%, broken <4%, starch extraction grade',
      gradeC: 'Moisture >15%, suitable for animal feed processing'
    }
  },
  {
    id: 'crop-bajra',
    name: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    marathiName: 'बाजरी',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 2500,
    currentModalPrice: 2580,
    priceChangePct: 1.8,
    gradeStandards: {
      gradeA: 'Uniform bold grey-green seeds, moisture <12%, zero weevil infestation',
      gradeB: 'Moisture 12-14%, sound seeds >96%',
      gradeC: 'Standard commercial fodder/feed grade'
    }
  },
  {
    id: 'crop-jowar',
    name: 'Jowar (Sorghum)',
    hindiName: 'ज्वार',
    marathiName: 'ज्वारी',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 3180,
    currentModalPrice: 3340,
    priceChangePct: 3.1,
    gradeStandards: {
      gradeA: 'Bold white pearl grains, moisture <12%, unblemished',
      gradeB: 'Medium seed size, moisture 12-14%',
      gradeC: 'Commercial flour / industrial alcohol grade'
    }
  },
  {
    id: 'crop-ragi',
    name: 'Ragi (Finger Millet)',
    hindiName: 'रागी',
    marathiName: 'नाचणी',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 3846,
    currentModalPrice: 4120,
    priceChangePct: 5.6,
    gradeStandards: {
      gradeA: 'Deep reddish brown, clean, moisture <11%, zero foreign seeds',
      gradeB: 'Standard grain, moisture 11-13%',
      gradeC: 'Nutraceutical / feed grade'
    }
  },

  // Pulses
  {
    id: 'crop-toor',
    name: 'Toor Dal (Pigeon Pea / Arhar)',
    hindiName: 'अरहर / तूर दाल',
    marathiName: 'तूर',
    category: 'Pulse',
    unit: 'quintal',
    benchmarkPrice: 7000,
    currentModalPrice: 8900,
    priceChangePct: 7.2,
    gradeStandards: {
      gradeA: 'Bold plump grain, moisture <10%, weeviled grains <1%, mill recovery >82%',
      gradeB: 'Moisture 10-12%, split/broken <3%',
      gradeC: 'Commercial mill grade'
    }
  },
  {
    id: 'crop-moong',
    name: 'Moong (Green Gram)',
    hindiName: 'मूँग',
    marathiName: 'मूग',
    category: 'Pulse',
    unit: 'quintal',
    benchmarkPrice: 8558,
    currentModalPrice: 8950,
    priceChangePct: 2.4,
    gradeStandards: {
      gradeA: 'Shiny dark green, uniform bold, moisture <10%, germination >95%',
      gradeB: 'Medium seed size, moisture 10-12%',
      gradeC: 'Standard dhal processing grade'
    }
  },
  {
    id: 'crop-urad',
    name: 'Urad (Black Gram)',
    hindiName: 'उड़द',
    marathiName: 'उडीद',
    category: 'Pulse',
    unit: 'quintal',
    benchmarkPrice: 6950,
    currentModalPrice: 7820,
    priceChangePct: 3.8,
    gradeStandards: {
      gradeA: 'Uniform jet black grains, moisture <10%, foreign seeds <0.5%',
      gradeB: 'Moisture 10-12%, broken <3%',
      gradeC: 'Commercial dhal grade'
    }
  },
  {
    id: 'crop-gram',
    name: 'Gram (Chana / Desi Chickpea)',
    hindiName: 'चना',
    marathiName: 'हरभरा',
    category: 'Pulse',
    unit: 'quintal',
    benchmarkPrice: 5440,
    currentModalPrice: 6150,
    priceChangePct: 4.1,
    gradeStandards: {
      gradeA: 'Bold golden-brown grains, moisture <9.5%, damaged <1%',
      gradeB: 'Moisture 10-12%, broken <3%',
      gradeC: 'Besan flour milling grade'
    }
  },

  // Oilseeds
  {
    id: 'crop-groundnut',
    name: 'Groundnut (Peanut in Shell)',
    hindiName: 'मूंगफली',
    marathiName: 'भुईमूग',
    category: 'Pulse',
    unit: 'quintal',
    benchmarkPrice: 6377,
    currentModalPrice: 6850,
    priceChangePct: 4.5,
    gradeStandards: {
      gradeA: 'Double-seeded pods, clean dry shell, oil content >48%, moisture <8%',
      gradeB: 'Oil content 45-48%, moisture 8-10%',
      gradeC: 'Standard oil expeller grade'
    }
  },
  {
    id: 'crop-soybean',
    name: 'Soybean (Yellow)',
    hindiName: 'सोयाबीन',
    marathiName: 'सोयाबीन',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 4600,
    currentModalPrice: 4890,
    priceChangePct: 3.2,
    gradeStandards: {
      gradeA: 'Bright yellow globular seed, oil content >18.5%, moisture <10%, foreign <1%',
      gradeB: 'Oil content 17-18.5%, moisture 10-12%',
      gradeC: 'Solvent extraction grade'
    }
  },
  {
    id: 'crop-mustard',
    name: 'Mustard (Sarson / Black)',
    hindiName: 'सरसों / राई',
    marathiName: 'मोहरी',
    category: 'Grain',
    unit: 'quintal',
    benchmarkPrice: 5650,
    currentModalPrice: 5980,
    priceChangePct: 2.7,
    gradeStandards: {
      gradeA: 'Bold dark seeds, oil content >40%, moisture <8%, zero erucic acid excess',
      gradeB: 'Oil content 38-40%, moisture 8-10%',
      gradeC: 'Standard expeller oil grade'
    }
  },

  // Vegetables
  {
    id: 'crop-onion',
    name: 'Onion (Nasik Red / Garwa)',
    hindiName: 'प्याज़',
    marathiName: 'कांदा',
    category: 'Vegetable',
    unit: 'quintal',
    benchmarkPrice: 2400,
    currentModalPrice: 2850,
    priceChangePct: 11.4,
    gradeStandards: {
      gradeA: 'Globular 55mm+ diameter, tight dry crimson skin, zero sprouting, firm neck',
      gradeB: 'Diameter 40-55mm, clean skin, storage life 60+ days',
      gradeC: 'Irregular/small size, for immediate kitchen/dehydration market'
    }
  },
  {
    id: 'crop-tomato',
    name: 'Tomato (Vaishnavi Hybrid)',
    hindiName: 'टमाटर',
    marathiName: 'टोमॅटो',
    category: 'Vegetable',
    unit: 'quintal',
    benchmarkPrice: 2100,
    currentModalPrice: 2540,
    priceChangePct: 8.2,
    gradeStandards: {
      gradeA: 'Firm crimson red, 55-65mm diameter, zero puncture/blemish, high brix pulp',
      gradeB: 'Medium firmness, orange-red, 45-55mm, <5% superficial mark',
      gradeC: 'Ripe soft, for immediate puree/sauce industrial processing'
    }
  },
  {
    id: 'crop-potato',
    name: 'Potato (Kufri Jyoti / Chipsona)',
    hindiName: 'आलू',
    marathiName: 'बटाटा',
    category: 'Vegetable',
    unit: 'quintal',
    benchmarkPrice: 1400,
    currentModalPrice: 1680,
    priceChangePct: 6.2,
    gradeStandards: {
      gradeA: 'Oval 50mm+, shallow eyes, zero greening/sprouts, low reducing sugar for chips',
      gradeB: 'Medium size 40-50mm, unblemished skin',
      gradeC: 'Small table size for retail packs'
    }
  },
  {
    id: 'crop-chilli',
    name: 'Chilli (Guntur Teja / Dry Red)',
    hindiName: 'सूखी लाल मिर्च',
    marathiName: 'सुकलेली लाल मिरची',
    category: 'Cash Crop',
    unit: 'quintal',
    benchmarkPrice: 16500,
    currentModalPrice: 18400,
    priceChangePct: 5.7,
    gradeStandards: {
      gradeA: 'Intense red color, high pungency (SHU >60,000), moisture <10%, with stalk intact',
      gradeB: 'Uniform color, moisture 10-12%, stalkless or minor discoloration',
      gradeC: 'Oleoresin extraction / powder grinding grade'
    }
  },

  // Commercial & Cash Crops
  {
    id: 'crop-cotton',
    name: 'Cotton (MCU-5 / Long Staple)',
    hindiName: 'कपास',
    marathiName: 'कापूस',
    category: 'Cash Crop',
    unit: 'quintal',
    benchmarkPrice: 6620,
    currentModalPrice: 7280,
    priceChangePct: 3.5,
    gradeStandards: {
      gradeA: 'Staple length >31mm, micronaire 3.5-4.2, moisture <8.5%, trash <2.5%',
      gradeB: 'Staple length 28-30mm, moisture 8.5-10%, trash <4%',
      gradeC: 'Short staple commercial spinning grade'
    }
  },
  {
    id: 'crop-sugarcane',
    name: 'Sugarcane (Co-0238 High Sugar)',
    hindiName: 'गन्ना',
    marathiName: 'ऊस',
    category: 'Cash Crop',
    unit: 'quintal',
    benchmarkPrice: 315,
    currentModalPrice: 340,
    priceChangePct: 1.2,
    gradeStandards: {
      gradeA: 'Fresh cut within 24h, sugar recovery >10.8%, brix >20, zero binding trash',
      gradeB: 'Recovery 9.5-10.8%, fresh cut within 48h',
      gradeC: 'Standard jaggery (gur) / juice grade'
    }
  },

  // Fruits & Spices
  {
    id: 'crop-banana',
    name: 'Banana (Grand Naine / Robusta)',
    hindiName: 'केला',
    marathiName: 'केळी',
    category: 'Fruit',
    unit: 'quintal',
    benchmarkPrice: 1600,
    currentModalPrice: 1950,
    priceChangePct: 6.8,
    gradeStandards: {
      gradeA: 'Export finger caliber 39-44mm, finger length >8 inches, uniform green mature',
      gradeB: 'Caliber 36-39mm, domestic retail chain grade',
      gradeC: 'Local wholesale ripening grade'
    }
  },
  {
    id: 'crop-grapes',
    name: 'Grapes (Thompson Seedless)',
    hindiName: 'अंगूर',
    marathiName: 'द्राक्षे',
    category: 'Fruit',
    unit: 'quintal',
    benchmarkPrice: 5500,
    currentModalPrice: 6800,
    priceChangePct: 9.4,
    gradeStandards: {
      gradeA: 'Berry diameter >18mm, brix >17, uniform green-amber bunch, zero shatter',
      gradeB: 'Berry diameter 16-18mm, brix 15-17',
      gradeC: 'Raisin processing / juice grade'
    }
  },
  {
    id: 'crop-turmeric',
    name: 'Turmeric (Salem / Nizamabad Finger)',
    hindiName: 'हल्दी',
    marathiName: 'हळद',
    category: 'Cash Crop',
    unit: 'quintal',
    benchmarkPrice: 12500,
    currentModalPrice: 15600,
    priceChangePct: 8.8,
    gradeStandards: {
      gradeA: 'Curcumin content >4.5%, polished bold fingers, moisture <9%, crisp snap',
      gradeB: 'Curcumin 3.5-4.5%, unpolished bulb/finger mix',
      gradeC: 'Commercial spice powder grade'
    }
  },
  {
    id: 'crop-cumin',
    name: 'Cumin (Unjha Jeera)',
    hindiName: 'जीरा',
    marathiName: 'जिरे',
    category: 'Cash Crop',
    unit: 'quintal',
    benchmarkPrice: 24000,
    currentModalPrice: 27500,
    priceChangePct: 7.9,
    gradeStandards: {
      gradeA: 'Machine-cleaned 99.5% purity, bold aromatic seed, moisture <8%, volatile oil >2.5%',
      gradeB: 'Cleaned 98% purity, volatile oil >2.0%',
      gradeC: 'Standard grinding grade'
    }
  }
];

// 50+ Representative APMC Markets Across Indian States
export const PAN_INDIA_MARKETS: MandiMarket[] = [
  // --- Maharashtra ---
  {
    id: 'mkt-lasalgaon',
    name: 'Lasalgaon APMC (Asia’s Largest Onion Hub)',
    district: 'Nashik',
    state: 'Maharashtra',
    distanceKm: 28,
    cropId: 'crop-onion',
    cropName: 'Onion',
    minPrice: 2550,
    maxPrice: 3120,
    modalPrice: 2890,
    arrivalsQuintals: 3850,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:30 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2680, arrivals: 3400 },
      { date: 'Sep 02', price: 2720, arrivals: 3550 },
      { date: 'Sep 03', price: 2790, arrivals: 3600 },
      { date: 'Sep 04', price: 2830, arrivals: 3750 },
      { date: 'Sep 05', price: 2860, arrivals: 3700 },
      { date: 'Sep 06', price: 2880, arrivals: 3820 },
      { date: 'Sep 07', price: 2890, arrivals: 3850 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2420, arrivals: 3100 },
      { date: 'Aug 17', price: 2550, arrivals: 3250 },
      { date: 'Aug 24', price: 2680, arrivals: 3400 },
      { date: 'Aug 31', price: 2810, arrivals: 3650 },
      { date: 'Sep 07', price: 2890, arrivals: 3850 }
    ]
  },
  {
    id: 'mkt-pimpalgaon',
    name: 'Pimpalgaon Baswant Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    distanceKm: 14,
    cropId: 'crop-onion',
    cropName: 'Onion',
    minPrice: 2480,
    maxPrice: 2980,
    modalPrice: 2760,
    arrivalsQuintals: 2100,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:10 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2580, arrivals: 1900 },
      { date: 'Sep 02', price: 2620, arrivals: 1950 },
      { date: 'Sep 03', price: 2680, arrivals: 2020 },
      { date: 'Sep 04', price: 2710, arrivals: 2060 },
      { date: 'Sep 05', price: 2730, arrivals: 2090 },
      { date: 'Sep 06', price: 2750, arrivals: 2120 },
      { date: 'Sep 07', price: 2760, arrivals: 2100 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2350, arrivals: 1800 },
      { date: 'Aug 17', price: 2460, arrivals: 1880 },
      { date: 'Aug 24', price: 2590, arrivals: 1960 },
      { date: 'Aug 31', price: 2700, arrivals: 2050 },
      { date: 'Sep 07', price: 2760, arrivals: 2100 }
    ]
  },
  {
    id: 'mkt-pune-apmc',
    name: 'Pune Gultekdi Central APMC',
    district: 'Pune',
    state: 'Maharashtra',
    distanceKm: 210,
    cropId: 'crop-onion',
    cropName: 'Onion',
    minPrice: 2700,
    maxPrice: 3250,
    modalPrice: 3020,
    arrivalsQuintals: 4200,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:45 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2800, arrivals: 3900 },
      { date: 'Sep 02', price: 2850, arrivals: 4000 },
      { date: 'Sep 03', price: 2910, arrivals: 4100 },
      { date: 'Sep 04', price: 2950, arrivals: 4150 },
      { date: 'Sep 05', price: 2980, arrivals: 4200 },
      { date: 'Sep 06', price: 3000, arrivals: 4180 },
      { date: 'Sep 07', price: 3020, arrivals: 4200 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2600, arrivals: 3700 },
      { date: 'Aug 17', price: 2720, arrivals: 3850 },
      { date: 'Aug 24', price: 2840, arrivals: 3980 },
      { date: 'Aug 31', price: 2950, arrivals: 4120 },
      { date: 'Sep 07', price: 3020, arrivals: 4200 }
    ]
  },
  {
    id: 'mkt-nagpur-kalamna',
    name: 'Nagpur Kalamna Market Yard',
    district: 'Nagpur',
    state: 'Maharashtra',
    distanceKm: 420,
    cropId: 'crop-soybean',
    cropName: 'Soybean',
    minPrice: 4700,
    maxPrice: 5120,
    modalPrice: 4940,
    arrivalsQuintals: 3100,
    demandLevel: 'High',
    lastUpdated: 'Today, 10:15 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 4780, arrivals: 2900 },
      { date: 'Sep 02', price: 4820, arrivals: 2980 },
      { date: 'Sep 03', price: 4870, arrivals: 3040 },
      { date: 'Sep 04', price: 4900, arrivals: 3120 },
      { date: 'Sep 05', price: 4920, arrivals: 3080 },
      { date: 'Sep 06', price: 4930, arrivals: 3110 },
      { date: 'Sep 07', price: 4940, arrivals: 3100 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 4620, arrivals: 2750 },
      { date: 'Aug 17', price: 4710, arrivals: 2840 },
      { date: 'Aug 24', price: 4800, arrivals: 2950 },
      { date: 'Aug 31', price: 4890, arrivals: 3050 },
      { date: 'Sep 07', price: 4940, arrivals: 3100 }
    ]
  },

  // --- Punjab ---
  {
    id: 'mkt-khanna-pb',
    name: 'Khanna Mandi (Asia’s Largest Grain APMC)',
    district: 'Ludhiana',
    state: 'Punjab',
    distanceKm: 32,
    cropId: 'crop-wheat',
    cropName: 'Wheat',
    minPrice: 2360,
    maxPrice: 2540,
    modalPrice: 2470,
    arrivalsQuintals: 8400,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:00 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2410, arrivals: 7900 },
      { date: 'Sep 02', price: 2430, arrivals: 8100 },
      { date: 'Sep 03', price: 2440, arrivals: 8250 },
      { date: 'Sep 04', price: 2450, arrivals: 8350 },
      { date: 'Sep 05', price: 2460, arrivals: 8400 },
      { date: 'Sep 06', price: 2470, arrivals: 8450 },
      { date: 'Sep 07', price: 2470, arrivals: 8400 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2350, arrivals: 7500 },
      { date: 'Aug 17', price: 2380, arrivals: 7700 },
      { date: 'Aug 24', price: 2410, arrivals: 7950 },
      { date: 'Aug 31', price: 2440, arrivals: 8200 },
      { date: 'Sep 07', price: 2470, arrivals: 8400 }
    ]
  },
  {
    id: 'mkt-ludhiana-main',
    name: 'Ludhiana Grain Market Yard',
    district: 'Ludhiana',
    state: 'Punjab',
    distanceKm: 12,
    cropId: 'crop-wheat',
    cropName: 'Wheat',
    minPrice: 2320,
    maxPrice: 2480,
    modalPrice: 2420,
    arrivalsQuintals: 5200,
    demandLevel: 'Medium',
    lastUpdated: 'Today, 08:30 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2380, arrivals: 4900 },
      { date: 'Sep 02', price: 2390, arrivals: 5050 },
      { date: 'Sep 03', price: 2400, arrivals: 5120 },
      { date: 'Sep 04', price: 2410, arrivals: 5180 },
      { date: 'Sep 05', price: 2410, arrivals: 5220 },
      { date: 'Sep 06', price: 2420, arrivals: 5210 },
      { date: 'Sep 07', price: 2420, arrivals: 5200 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2310, arrivals: 4600 },
      { date: 'Aug 17', price: 2340, arrivals: 4750 },
      { date: 'Aug 24', price: 2370, arrivals: 4900 },
      { date: 'Aug 31', price: 2400, arrivals: 5080 },
      { date: 'Sep 07', price: 2420, arrivals: 5200 }
    ]
  },
  {
    id: 'mkt-jalandhar-cantt',
    name: 'Jalandhar Cantt APMC',
    district: 'Jalandhar',
    state: 'Punjab',
    distanceKm: 65,
    cropId: 'crop-potato',
    cropName: 'Potato',
    minPrice: 1520,
    maxPrice: 1780,
    modalPrice: 1680,
    arrivalsQuintals: 3600,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:40 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 1600, arrivals: 3300 },
      { date: 'Sep 02', price: 1620, arrivals: 3400 },
      { date: 'Sep 03', price: 1640, arrivals: 3480 },
      { date: 'Sep 04', price: 1660, arrivals: 3550 },
      { date: 'Sep 05', price: 1670, arrivals: 3580 },
      { date: 'Sep 06', price: 1680, arrivals: 3610 },
      { date: 'Sep 07', price: 1680, arrivals: 3600 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 1540, arrivals: 3100 },
      { date: 'Aug 17', price: 1580, arrivals: 3250 },
      { date: 'Aug 24', price: 1610, arrivals: 3380 },
      { date: 'Aug 31', price: 1650, arrivals: 3520 },
      { date: 'Sep 07', price: 1680, arrivals: 3600 }
    ]
  },

  // --- Karnataka ---
  {
    id: 'mkt-kolar-apmc',
    name: 'Kolar Tomato & Agri Market',
    district: 'Kolar',
    state: 'Karnataka',
    distanceKm: 18,
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    minPrice: 2380,
    maxPrice: 2880,
    modalPrice: 2680,
    arrivalsQuintals: 4200,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:20 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2480, arrivals: 3800 },
      { date: 'Sep 02', price: 2520, arrivals: 3950 },
      { date: 'Sep 03', price: 2580, arrivals: 4050 },
      { date: 'Sep 04', price: 2620, arrivals: 4120 },
      { date: 'Sep 05', price: 2650, arrivals: 4180 },
      { date: 'Sep 06', price: 2670, arrivals: 4230 },
      { date: 'Sep 07', price: 2680, arrivals: 4200 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2320, arrivals: 3600 },
      { date: 'Aug 17', price: 2420, arrivals: 3750 },
      { date: 'Aug 24', price: 2510, arrivals: 3900 },
      { date: 'Aug 31', price: 2620, arrivals: 4100 },
      { date: 'Sep 07', price: 2680, arrivals: 4200 }
    ]
  },
  {
    id: 'mkt-yeshwantpur',
    name: 'Yeshwantpur Wholesale APMC Yard',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    distanceKm: 72,
    cropId: 'crop-ragi',
    cropName: 'Ragi',
    minPrice: 3950,
    maxPrice: 4400,
    modalPrice: 4220,
    arrivalsQuintals: 1650,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:15 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 4050, arrivals: 1500 },
      { date: 'Sep 02', price: 4100, arrivals: 1550 },
      { date: 'Sep 03', price: 4140, arrivals: 1580 },
      { date: 'Sep 04', price: 4180, arrivals: 1620 },
      { date: 'Sep 05', price: 4200, arrivals: 1640 },
      { date: 'Sep 06', price: 4210, arrivals: 1660 },
      { date: 'Sep 07', price: 4220, arrivals: 1650 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 3880, arrivals: 1400 },
      { date: 'Aug 17', price: 3960, arrivals: 1460 },
      { date: 'Aug 24', price: 4050, arrivals: 1520 },
      { date: 'Aug 31', price: 4150, arrivals: 1600 },
      { date: 'Sep 07', price: 4220, arrivals: 1650 }
    ]
  },
  {
    id: 'mkt-hubballi',
    name: 'Hubballi Amargol APMC Sub-Yard',
    district: 'Hubballi-Dharwad',
    state: 'Karnataka',
    distanceKm: 340,
    cropId: 'crop-cotton',
    cropName: 'Cotton',
    minPrice: 6900,
    maxPrice: 7520,
    modalPrice: 7280,
    arrivalsQuintals: 2800,
    demandLevel: 'High',
    lastUpdated: 'Today, 10:00 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 7100, arrivals: 2500 },
      { date: 'Sep 02', price: 7150, arrivals: 2620 },
      { date: 'Sep 03', price: 7200, arrivals: 2700 },
      { date: 'Sep 04', price: 7240, arrivals: 2760 },
      { date: 'Sep 05', price: 7260, arrivals: 2790 },
      { date: 'Sep 06', price: 7270, arrivals: 2820 },
      { date: 'Sep 07', price: 7280, arrivals: 2800 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 6950, arrivals: 2350 },
      { date: 'Aug 17', price: 7040, arrivals: 2480 },
      { date: 'Aug 24', price: 7140, arrivals: 2600 },
      { date: 'Aug 31', price: 7220, arrivals: 2730 },
      { date: 'Sep 07', price: 7280, arrivals: 2800 }
    ]
  },

  // --- Andhra Pradesh ---
  {
    id: 'mkt-kadapa',
    name: 'Kadapa Central APMC Mandi Yard',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    distanceKm: 8,
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    minPrice: 2280,
    maxPrice: 2680,
    modalPrice: 2480,
    arrivalsQuintals: 340,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:30 AM (APMC Live Data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2280, arrivals: 290 },
      { date: 'Sep 02', price: 2320, arrivals: 310 },
      { date: 'Sep 03', price: 2350, arrivals: 305 },
      { date: 'Sep 04', price: 2400, arrivals: 330 },
      { date: 'Sep 05', price: 2420, arrivals: 315 },
      { date: 'Sep 06', price: 2440, arrivals: 325 },
      { date: 'Sep 07', price: 2450, arrivals: 320 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2100, arrivals: 260 },
      { date: 'Aug 17', price: 2180, arrivals: 280 },
      { date: 'Aug 24', price: 2250, arrivals: 300 },
      { date: 'Aug 31', price: 2340, arrivals: 310 },
      { date: 'Sep 07', price: 2450, arrivals: 320 }
    ]
  },
  {
    id: 'mkt-tadepalligudem',
    name: 'Tadepalligudem Regional APMC',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    distanceKm: 35,
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    minPrice: 2350,
    maxPrice: 2720,
    modalPrice: 2580,
    arrivalsQuintals: 280,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:15 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2380, arrivals: 250 },
      { date: 'Sep 02', price: 2420, arrivals: 260 },
      { date: 'Sep 03', price: 2490, arrivals: 270 },
      { date: 'Sep 04', price: 2530, arrivals: 285 },
      { date: 'Sep 05', price: 2560, arrivals: 275 },
      { date: 'Sep 06', price: 2570, arrivals: 290 },
      { date: 'Sep 07', price: 2580, arrivals: 280 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2220, arrivals: 240 },
      { date: 'Aug 17', price: 2300, arrivals: 250 },
      { date: 'Aug 24', price: 2400, arrivals: 270 },
      { date: 'Aug 31', price: 2510, arrivals: 280 },
      { date: 'Sep 07', price: 2580, arrivals: 280 }
    ]
  },
  {
    id: 'mkt-guntur',
    name: 'Guntur Mirchi & Agricultural Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    distanceKm: 135,
    cropId: 'crop-chilli',
    cropName: 'Chilli',
    minPrice: 17200,
    maxPrice: 19800,
    modalPrice: 18500,
    arrivalsQuintals: 1250,
    demandLevel: 'High',
    lastUpdated: 'Today, 10:00 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 17800, arrivals: 1100 },
      { date: 'Sep 02', price: 18000, arrivals: 1150 },
      { date: 'Sep 03', price: 18150, arrivals: 1200 },
      { date: 'Sep 04', price: 18300, arrivals: 1220 },
      { date: 'Sep 05', price: 18400, arrivals: 1260 },
      { date: 'Sep 06', price: 18450, arrivals: 1240 },
      { date: 'Sep 07', price: 18500, arrivals: 1250 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 16900, arrivals: 1050 },
      { date: 'Aug 17', price: 17300, arrivals: 1100 },
      { date: 'Aug 24', price: 17700, arrivals: 1150 },
      { date: 'Aug 31', price: 18200, arrivals: 1210 },
      { date: 'Sep 07', price: 18500, arrivals: 1250 }
    ]
  },

  // --- Gujarat ---
  {
    id: 'mkt-rajkot-bedi',
    name: 'Rajkot Bedi APMC Market Yard',
    district: 'Rajkot',
    state: 'Gujarat',
    distanceKm: 16,
    cropId: 'crop-groundnut',
    cropName: 'Groundnut',
    minPrice: 6500,
    maxPrice: 7200,
    modalPrice: 6920,
    arrivalsQuintals: 4600,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:00 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 6720, arrivals: 4200 },
      { date: 'Sep 02', price: 6780, arrivals: 4350 },
      { date: 'Sep 03', price: 6830, arrivals: 4420 },
      { date: 'Sep 04', price: 6870, arrivals: 4500 },
      { date: 'Sep 05', price: 6900, arrivals: 4580 },
      { date: 'Sep 06', price: 6910, arrivals: 4620 },
      { date: 'Sep 07', price: 6920, arrivals: 4600 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 6450, arrivals: 3900 },
      { date: 'Aug 17', price: 6580, arrivals: 4100 },
      { date: 'Aug 24', price: 6690, arrivals: 4250 },
      { date: 'Aug 31', price: 6820, arrivals: 4450 },
      { date: 'Sep 07', price: 6920, arrivals: 4600 }
    ]
  },
  {
    id: 'mkt-unjha-jeera',
    name: 'Unjha Spice APMC (World’s Cumin Capital)',
    district: 'Unjha (Mehsana)',
    state: 'Gujarat',
    distanceKm: 185,
    cropId: 'crop-cumin',
    cropName: 'Cumin',
    minPrice: 25500,
    maxPrice: 29500,
    modalPrice: 27800,
    arrivalsQuintals: 2200,
    demandLevel: 'High',
    lastUpdated: 'Today, 10:30 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 26400, arrivals: 1950 },
      { date: 'Sep 02', price: 26800, arrivals: 2040 },
      { date: 'Sep 03', price: 27100, arrivals: 2110 },
      { date: 'Sep 04', price: 27400, arrivals: 2170 },
      { date: 'Sep 05', price: 27600, arrivals: 2190 },
      { date: 'Sep 06', price: 27750, arrivals: 2220 },
      { date: 'Sep 07', price: 27800, arrivals: 2200 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 25000, arrivals: 1800 },
      { date: 'Aug 17', price: 25600, arrivals: 1900 },
      { date: 'Aug 24', price: 26300, arrivals: 2020 },
      { date: 'Aug 31', price: 27200, arrivals: 2140 },
      { date: 'Sep 07', price: 27800, arrivals: 2200 }
    ]
  },

  // --- Tamil Nadu ---
  {
    id: 'mkt-coimbatore-mgg',
    name: 'Coimbatore MGR Wholesale Market',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 24,
    cropId: 'crop-banana',
    cropName: 'Banana',
    minPrice: 1820,
    maxPrice: 2180,
    modalPrice: 2020,
    arrivalsQuintals: 1800,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:50 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 1920, arrivals: 1650 },
      { date: 'Sep 02', price: 1950, arrivals: 1710 },
      { date: 'Sep 03', price: 1980, arrivals: 1750 },
      { date: 'Sep 04', price: 2000, arrivals: 1780 },
      { date: 'Sep 05', price: 2010, arrivals: 1820 },
      { date: 'Sep 06', price: 2020, arrivals: 1810 },
      { date: 'Sep 07', price: 2020, arrivals: 1800 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 1840, arrivals: 1550 },
      { date: 'Aug 17', price: 1890, arrivals: 1620 },
      { date: 'Aug 24', price: 1940, arrivals: 1700 },
      { date: 'Aug 31', price: 1990, arrivals: 1770 },
      { date: 'Sep 07', price: 2020, arrivals: 1800 }
    ]
  },
  {
    id: 'mkt-koyambedu',
    name: 'Koyambedu Wholesale Market Complex',
    district: 'Chennai / Thiruvallur',
    state: 'Tamil Nadu',
    distanceKm: 490,
    cropId: 'crop-banana',
    cropName: 'Banana',
    minPrice: 2100,
    maxPrice: 2450,
    modalPrice: 2280,
    arrivalsQuintals: 5100,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:00 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2180, arrivals: 4700 },
      { date: 'Sep 02', price: 2210, arrivals: 4850 },
      { date: 'Sep 03', price: 2240, arrivals: 4950 },
      { date: 'Sep 04', price: 2260, arrivals: 5020 },
      { date: 'Sep 05', price: 2270, arrivals: 5080 },
      { date: 'Sep 06', price: 2280, arrivals: 5120 },
      { date: 'Sep 07', price: 2280, arrivals: 5100 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2080, arrivals: 4500 },
      { date: 'Aug 17', price: 2130, arrivals: 4680 },
      { date: 'Aug 24', price: 2190, arrivals: 4850 },
      { date: 'Aug 31', price: 2250, arrivals: 5010 },
      { date: 'Sep 07', price: 2280, arrivals: 5100 }
    ]
  },

  // --- Madhya Pradesh ---
  {
    id: 'mkt-indore-choithram',
    name: 'Indore Choithram Mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    distanceKm: 22,
    cropId: 'crop-soybean',
    cropName: 'Soybean',
    minPrice: 4720,
    maxPrice: 5150,
    modalPrice: 4980,
    arrivalsQuintals: 6200,
    demandLevel: 'High',
    lastUpdated: 'Today, 09:20 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 4820, arrivals: 5800 },
      { date: 'Sep 02', price: 4860, arrivals: 5950 },
      { date: 'Sep 03', price: 4910, arrivals: 6050 },
      { date: 'Sep 04', price: 4940, arrivals: 6120 },
      { date: 'Sep 05', price: 4960, arrivals: 6180 },
      { date: 'Sep 06', price: 4970, arrivals: 6220 },
      { date: 'Sep 07', price: 4980, arrivals: 6200 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 4680, arrivals: 5400 },
      { date: 'Aug 17', price: 4760, arrivals: 5620 },
      { date: 'Aug 24', price: 4840, arrivals: 5800 },
      { date: 'Aug 31', price: 4920, arrivals: 6020 },
      { date: 'Sep 07', price: 4980, arrivals: 6200 }
    ]
  },
  {
    id: 'mkt-neemuch-mandi',
    name: 'Neemuch Speciality Agri & Medicinal Mandi',
    district: 'Neemuch',
    state: 'Madhya Pradesh',
    distanceKm: 260,
    cropId: 'crop-garlic',
    cropName: 'Garlic & Spices',
    minPrice: 8500,
    maxPrice: 11200,
    modalPrice: 9800,
    arrivalsQuintals: 2400,
    demandLevel: 'High',
    lastUpdated: 'Today, 10:10 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 9200, arrivals: 2100 },
      { date: 'Sep 02', price: 9350, arrivals: 2200 },
      { date: 'Sep 03', price: 9500, arrivals: 2280 },
      { date: 'Sep 04', price: 9620, arrivals: 2340 },
      { date: 'Sep 05', price: 9700, arrivals: 2380 },
      { date: 'Sep 06', price: 9780, arrivals: 2410 },
      { date: 'Sep 07', price: 9800, arrivals: 2400 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 8700, arrivals: 1950 },
      { date: 'Aug 17', price: 8950, arrivals: 2080 },
      { date: 'Aug 24', price: 9250, arrivals: 2190 },
      { date: 'Aug 31', price: 9550, arrivals: 2320 },
      { date: 'Sep 07', price: 9800, arrivals: 2400 }
    ]
  },

  // --- Uttar Pradesh & Delhi ---
  {
    id: 'mkt-azadpur-delhi',
    name: 'Azadpur National APMC (Asia’s Premier Fruit & Veg Hub)',
    district: 'North Delhi (Azadpur National APMC Hub)',
    state: 'Delhi (NCT)',
    distanceKm: 280,
    cropId: 'crop-onion',
    cropName: 'Onion',
    minPrice: 2850,
    maxPrice: 3400,
    modalPrice: 3180,
    arrivalsQuintals: 9500,
    demandLevel: 'High',
    lastUpdated: 'Today, 07:30 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2980, arrivals: 8900 },
      { date: 'Sep 02', price: 3040, arrivals: 9150 },
      { date: 'Sep 03', price: 3100, arrivals: 9280 },
      { date: 'Sep 04', price: 3140, arrivals: 9380 },
      { date: 'Sep 05', price: 3160, arrivals: 9460 },
      { date: 'Sep 06', price: 3170, arrivals: 9520 },
      { date: 'Sep 07', price: 3180, arrivals: 9500 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2800, arrivals: 8500 },
      { date: 'Aug 17', price: 2890, arrivals: 8750 },
      { date: 'Aug 24', price: 3000, arrivals: 9020 },
      { date: 'Aug 31', price: 3110, arrivals: 9340 },
      { date: 'Sep 07', price: 3180, arrivals: 9500 }
    ]
  },
  {
    id: 'mkt-kanpur-collectory',
    name: 'Kanpur Collectorganj Grain APMC',
    district: 'Kanpur',
    state: 'Uttar Pradesh',
    distanceKm: 42,
    cropId: 'crop-wheat',
    cropName: 'Wheat',
    minPrice: 2310,
    maxPrice: 2470,
    modalPrice: 2410,
    arrivalsQuintals: 4800,
    demandLevel: 'Medium',
    lastUpdated: 'Today, 09:10 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 2360, arrivals: 4500 },
      { date: 'Sep 02', price: 2380, arrivals: 4620 },
      { date: 'Sep 03', price: 2390, arrivals: 4700 },
      { date: 'Sep 04', price: 2400, arrivals: 4760 },
      { date: 'Sep 05', price: 2410, arrivals: 4810 },
      { date: 'Sep 06', price: 2410, arrivals: 4830 },
      { date: 'Sep 07', price: 2410, arrivals: 4800 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 2280, arrivals: 4200 },
      { date: 'Aug 17', price: 2320, arrivals: 4380 },
      { date: 'Aug 24', price: 2360, arrivals: 4550 },
      { date: 'Aug 31', price: 2390, arrivals: 4720 },
      { date: 'Sep 07', price: 2410, arrivals: 4800 }
    ]
  },

  // --- Rajasthan ---
  {
    id: 'mkt-bikaner-mandi',
    name: 'Bikaner Grain & Groundnut Yard',
    district: 'Bikaner',
    state: 'Rajasthan',
    distanceKm: 45,
    cropId: 'crop-groundnut',
    cropName: 'Groundnut',
    minPrice: 6400,
    maxPrice: 7100,
    modalPrice: 6810,
    arrivalsQuintals: 3100,
    demandLevel: 'Medium',
    lastUpdated: 'Today, 09:50 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 6650, arrivals: 2850 },
      { date: 'Sep 02', price: 6690, arrivals: 2940 },
      { date: 'Sep 03', price: 6730, arrivals: 3010 },
      { date: 'Sep 04', price: 6770, arrivals: 3060 },
      { date: 'Sep 05', price: 6790, arrivals: 3090 },
      { date: 'Sep 06', price: 6800, arrivals: 3120 },
      { date: 'Sep 07', price: 6810, arrivals: 3100 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 6380, arrivals: 2600 },
      { date: 'Aug 17', price: 6490, arrivals: 2750 },
      { date: 'Aug 24', price: 6600, arrivals: 2890 },
      { date: 'Aug 31', price: 6720, arrivals: 3020 },
      { date: 'Sep 07', price: 6810, arrivals: 3100 }
    ]
  },
  {
    id: 'mkt-kota-bhamashah',
    name: 'Kota Bhamashah Agri Mandi',
    district: 'Kota',
    state: 'Rajasthan',
    distanceKm: 38,
    cropId: 'crop-mustard',
    cropName: 'Mustard',
    minPrice: 5700,
    maxPrice: 6240,
    modalPrice: 6020,
    arrivalsQuintals: 3900,
    demandLevel: 'High',
    lastUpdated: 'Today, 08:40 AM (Demo market data)',
    weeklyTrend: [
      { date: 'Sep 01', price: 5850, arrivals: 3500 },
      { date: 'Sep 02', price: 5900, arrivals: 3650 },
      { date: 'Sep 03', price: 5940, arrivals: 3750 },
      { date: 'Sep 04', price: 5980, arrivals: 3820 },
      { date: 'Sep 05', price: 6000, arrivals: 3870 },
      { date: 'Sep 06', price: 6010, arrivals: 3910 },
      { date: 'Sep 07', price: 6020, arrivals: 3900 }
    ],
    monthlyTrend: [
      { date: 'Aug 10', price: 5680, arrivals: 3200 },
      { date: 'Aug 17', price: 5770, arrivals: 3400 },
      { date: 'Aug 24', price: 5870, arrivals: 3590 },
      { date: 'Aug 31', price: 5960, arrivals: 3780 },
      { date: 'Sep 07', price: 6020, arrivals: 3900 }
    ]
  }
];

// 30+ Pan-India Institutional Buyers (Processors, Retailers, Exporters, Wholesalers)
export const PAN_INDIA_BUYERS: BuyerProfile[] = [
  // Maharashtra Buyers
  {
    id: 'buyer-sahyadri-exports',
    name: 'Sahyadri Farm Fresh & Exports Ltd',
    companyName: 'Sahyadri Agro Processing Hub Pvt Ltd',
    businessType: 'Exporter',
    location: 'Mohadi, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    distanceKm: 22,
    requiredCrops: ['Onion', 'Grapes', 'Tomato', 'Pomegranate'],
    requiredQuantityMin: 60,
    requiredQuantityMax: 350,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 2750,
    expectedPriceMax: 3050,
    paymentWindowHours: 24,
    paymentReliabilityPct: 98,
    rating: 4.9,
    reviewCount: 142,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 32400,
    phone: '+91 98220 99881',
    email: 'procurement@sahyadrifresh.demo'
  },
  {
    id: 'buyer-mccain-processing',
    name: 'Kissan Agro Processing & Puree Corp',
    companyName: 'Kissan Foods India Private Limited',
    businessType: 'Food Processing',
    location: 'Bhiwandi / Thane',
    district: 'Pune',
    state: 'Maharashtra',
    distanceKm: 140,
    requiredCrops: ['Tomato', 'Onion', 'Chilli'],
    requiredQuantityMin: 80,
    requiredQuantityMax: 500,
    qualityRequirement: 'Grade A or B',
    expectedPriceMin: 2600,
    expectedPriceMax: 2900,
    paymentWindowHours: 48,
    paymentReliabilityPct: 96,
    rating: 4.8,
    reviewCount: 96,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 48000,
    phone: '+91 98201 55664',
    email: 'supplychain@kissanfoods.demo'
  },
  {
    id: 'buyer-reliance-retail-west',
    name: 'Reliance Fresh Direct Farm Sourcing',
    companyName: 'Reliance Retail Ventures Ltd (Agri Div)',
    businessType: 'Retail Chain',
    location: 'Navi Mumbai Hub',
    district: 'Pune',
    state: 'Maharashtra',
    distanceKm: 165,
    requiredCrops: ['Onion', 'Tomato', 'Potato', 'Banana'],
    requiredQuantityMin: 50,
    requiredQuantityMax: 400,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 2800,
    expectedPriceMax: 3150,
    paymentWindowHours: 24,
    paymentReliabilityPct: 99,
    rating: 4.9,
    reviewCount: 310,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 112000,
    phone: '+91 98210 12345',
    email: 'farmerdirect@relianceretail.demo'
  },

  // Punjab / North India Buyers
  {
    id: 'buyer-itc-wheat-mills',
    name: 'ITC Aashirvaad Direct Grain Desk',
    companyName: 'ITC Limited Agri Business Division',
    businessType: 'Food Processing',
    location: 'Ludhiana Industrial Focal Point',
    district: 'Ludhiana',
    state: 'Punjab',
    distanceKm: 18,
    requiredCrops: ['Wheat', 'Paddy', 'Maize'],
    requiredQuantityMin: 100,
    requiredQuantityMax: 1000,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 2420,
    expectedPriceMax: 2560,
    paymentWindowHours: 24,
    paymentReliabilityPct: 99,
    rating: 4.9,
    reviewCount: 224,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 88500,
    phone: '+91 98141 77889',
    email: 'procurement.aashirvaad@itc.demo'
  },
  {
    id: 'buyer-punjab-modern-flour',
    name: 'Punjab Modern Roller Flour Mills',
    companyName: 'Punjab Roller Flour Mills Corp Ltd',
    businessType: 'Wholesale Trader',
    location: 'Khanna Grain Terminal',
    district: 'Ludhiana',
    state: 'Punjab',
    distanceKm: 28,
    requiredCrops: ['Wheat', 'Gram'],
    requiredQuantityMin: 80,
    requiredQuantityMax: 600,
    qualityRequirement: 'Grade A or B',
    expectedPriceMin: 2380,
    expectedPriceMax: 2500,
    paymentWindowHours: 48,
    paymentReliabilityPct: 95,
    rating: 4.7,
    reviewCount: 88,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 36000,
    phone: '+91 98150 33442',
    email: 'wheatbuying@punjabflour.demo'
  },

  // Karnataka / South India Buyers
  {
    id: 'buyer-kolar-horti-chain',
    name: 'Bengaluru FreshMart Organics',
    companyName: 'FreshMart Retail Operations Pvt Ltd',
    businessType: 'Retail Chain',
    location: 'Whitefield Agri Logistics Depot',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    distanceKm: 55,
    requiredCrops: ['Tomato', 'Ragi', 'Banana'],
    requiredQuantityMin: 30,
    requiredQuantityMax: 200,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 2650,
    expectedPriceMax: 2950,
    paymentWindowHours: 24,
    paymentReliabilityPct: 97,
    rating: 4.8,
    reviewCount: 82,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 19400,
    phone: '+91 94481 66778',
    email: 'procurement@freshmart.demo'
  },

  // Andhra Pradesh Buyers
  {
    id: 'buyer-lakshmi',
    name: 'Sri Lakshmi Agro Foods',
    companyName: 'Sri Lakshmi Agro Foods Pvt Ltd',
    businessType: 'Food Processing',
    location: 'Tadepalligudem',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    distanceKm: 28,
    requiredCrops: ['Tomato', 'Banana', 'Chilli'],
    requiredQuantityMin: 40,
    requiredQuantityMax: 200,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 2500,
    expectedPriceMax: 2700,
    paymentWindowHours: 48,
    paymentReliabilityPct: 96,
    rating: 4.8,
    reviewCount: 74,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 14200,
    phone: '+91 98480 12345',
    email: 'procurement@srilakshmiagro.demo'
  },
  {
    id: 'buyer-godavari-park',
    name: 'Godavari Mega Food Park',
    companyName: 'Godavari Mega Food Park Industries Ltd',
    businessType: 'Food Processing',
    location: 'Eluru',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    distanceKm: 58,
    requiredCrops: ['Tomato', 'Chilli', 'Paddy'],
    requiredQuantityMin: 100,
    requiredQuantityMax: 500,
    qualityRequirement: 'Grade A or B',
    expectedPriceMin: 2450,
    expectedPriceMax: 2680,
    paymentWindowHours: 24,
    paymentReliabilityPct: 98,
    rating: 4.9,
    reviewCount: 118,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 28500,
    phone: '+91 94401 88921',
    email: 'supply@godavarifoodpark.demo'
  },

  // Gujarat Buyers
  {
    id: 'buyer-adani-wilmar-oil',
    name: 'Adani Wilmar Fortune Agro Desk',
    companyName: 'Adani Wilmar Agri Procurement Limited',
    businessType: 'Food Processing',
    location: 'Bedi Port Road, Rajkot',
    district: 'Rajkot',
    state: 'Gujarat',
    distanceKm: 24,
    requiredCrops: ['Groundnut', 'Mustard', 'Soybean', 'Cotton'],
    requiredQuantityMin: 100,
    requiredQuantityMax: 1200,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 6800,
    expectedPriceMax: 7250,
    paymentWindowHours: 24,
    paymentReliabilityPct: 99,
    rating: 4.9,
    reviewCount: 280,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 94000,
    phone: '+91 98251 88990',
    email: 'oilseeds@adaniwilmar.demo'
  },

  // Tamil Nadu Buyers
  {
    id: 'buyer-southern-banana-cold',
    name: 'Southern Green Cold Chain & Exports',
    companyName: 'Southern Fruits & Cold Storage Corp',
    businessType: 'Exporter',
    location: 'Pollachi Industrial Estate',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 32,
    requiredCrops: ['Banana', 'Coconut', 'Turmeric'],
    requiredQuantityMin: 50,
    requiredQuantityMax: 300,
    qualityRequirement: 'Grade A',
    expectedPriceMin: 1950,
    expectedPriceMax: 2200,
    paymentWindowHours: 48,
    paymentReliabilityPct: 97,
    rating: 4.8,
    reviewCount: 94,
    kycVerified: true,
    gstVerified: true,
    paymentHistoryVerified: true,
    businessVerified: true,
    tradeVolumeTotalQuintals: 22000,
    phone: '+91 94431 44556',
    email: 'procurement@southerngreen.demo'
  }
];

// Helper functions
export function getMarketsByState(stateName: string): MandiMarket[] {
  return PAN_INDIA_MARKETS.filter(m => m.state.toLowerCase() === stateName.toLowerCase());
}

export function getDistrictsByState(stateName: string): string[] {
  const st = INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase() || s.code.toLowerCase() === stateName.toLowerCase());
  return st ? st.districts : ['Central', 'Rural', 'Industrial'];
}

export function getCropByName(cropName: string): Crop | undefined {
  const norm = cropName.toLowerCase();
  return PAN_INDIA_CROPS.find(c => c.name.toLowerCase().includes(norm) || norm.includes(c.id.replace('crop-', '')));
}
