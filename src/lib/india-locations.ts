export interface LocationOption {
  country: string;
  state: string;
  district: string;
  townOrCity: string;
  lat: number;
  lng: number;
  isPopularHub?: boolean;
}

export const INDIAN_STATES_DISTRICTS: Record<string, Record<string, string[]>> = {
  'Andhra Pradesh': {
    'West Godavari': ['Bhimavaram', 'Tanuku', 'Palakollu', 'Narasapur', 'Tadepalligudem', 'Akividu', 'Undi'],
    'Eluru': ['Eluru', 'Jangareddygudem', 'Kaikalur', 'Chintalapudi'],
    'East Godavari': ['Rajahmundry', 'Kakinada', 'Mandapeta', 'Amalapuram', 'Ramachandrapuram'],
    'Krishna': ['Machilipatnam', 'Gudivada', 'Vuyyuru', 'Nuzvid'],
    'NTR': ['Vijayawada', 'Jaggayyapeta', 'Tiruvuru', 'Nandigama'],
    'Guntur': ['Guntur', 'Tenali', 'Mangalagiri', 'Ponnur', 'Bapatla'],
    'Prakasam': ['Ongole', 'Chirala', 'Markapur', 'Kandukur'],
    'Kurnool': ['Kurnool', 'Adoni', 'Yemmiganur', 'Nandyal'],
    'Anantapur': ['Anantapur', 'Dharmavaram', 'Hindupur', 'Kadiri']
  },
  'Telangana': {
    'Hyderabad': ['Bowenpally', 'Malakpet', 'Gudimalkapur', 'Charminar'],
    'Warangal': ['Warangal', 'Hanamkonda', 'Narsampet', 'Jangaon'],
    'Khammam': ['Khammam', 'Madhira', 'Sathupalli', 'Wyra'],
    'Nizamabad': ['Nizamabad', 'Bodhan', 'Armoor', 'Kamareddy'],
    'Karimnagar': ['Karimnagar', 'Huzurabad', 'Jagtial', 'Siricilla'],
    'Nalgonda': ['Nalgonda', 'Miryalaguda', 'Suryapet', 'Devarakonda']
  },
  'Maharashtra': {
    'Nashik': ['Lasalgaon', 'Pimpalgaon Baswant', 'Nashik City', 'Sinnar', 'Yeola', 'Malegaon', 'Niphad'],
    'Pune': ['Pune Gultekdi', 'Haveli', 'Baramati', 'Junnar', 'Shirur', 'Manchar', 'Daund'],
    'Nagpur': ['Kalamna (Nagpur)', 'Katol', 'Saoner', 'Umred', 'Ramtek'],
    'Solapur': ['Solapur Yard', 'Pandharpur', 'Barshi', 'Akkalkot', 'Karmala'],
    'Latur': ['Latur Mandi', 'Ausa', 'Udgir', 'Nilanga', 'Ahmedpur'],
    'Akola': ['Akola Yard', 'Murtizapur', 'Balapur', 'Patur', 'Telhara'],
    'Ahmednagar': ['Ahmednagar', 'Rahata (Shirdi)', 'Sangamner', 'Kopargaon', 'Shrirampur'],
    'Kolhapur': ['Kolhapur Yard', 'Shirol', 'Gadhinglaj', 'Jaysingpur'],
    'Sangli': ['Sangli Turmeric Yard', 'Miraj', 'Tasgaon', 'Vita', 'Islampur'],
    'Amravati': ['Amravati Cotton Yard', 'Achalpur', 'Morshi', 'Warud']
  },
  'Karnataka': {
    'Bangalore Rural': ['Yeshwanthpur', 'Doddaballapur', 'Hosakote', 'Devanahalli'],
    'Belgaum': ['Belgaum Yard', 'Bailhongal', 'Gokak', 'Chikkodi'],
    'Mysore': ['Bandipalya (Mysore)', 'Nanjangud', 'Hunsur', 'T. Narasipura'],
    'Gulbarga (Kalaburagi)': ['Kalaburagi Dal Hub', 'Sedam', 'Chincholi', 'Aland'],
    'Kolar': ['Kolar Tomato Market', 'Malur', 'Bangarapet', 'Srinivaspur']
  },
  'Madhya Pradesh': {
    'Indore': ['Choithram Mandi (Indore)', 'Mhow', 'Sanwer', 'Depalpur'],
    'Ujjain': ['Ujjain Yard', 'Nagda', 'Khachrod', 'Tarana'],
    'Bhopal': ['Karond Mandi (Bhopal)', 'Berasia']
  }
};

// Flattened indexed locations for quick fuzzy search
export const INDEXED_LOCATIONS: LocationOption[] = [
  // West Godavari, AP
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Bhimavaram', lat: 16.5449, lng: 81.5212, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Tanuku', lat: 16.7570, lng: 81.6820, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Palakollu', lat: 16.5256, lng: 81.7288, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Narasapur', lat: 16.4380, lng: 81.6980 },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Tadepalligudem', lat: 16.8140, lng: 81.5270, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Akividu', lat: 16.5910, lng: 81.3820 },
  
  // Eluru, AP
  { country: 'India', state: 'Andhra Pradesh', district: 'Eluru', townOrCity: 'Eluru', lat: 16.7107, lng: 81.0952, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Eluru', townOrCity: 'Jangareddygudem', lat: 17.1260, lng: 81.2940 },

  // NTR & Krishna, AP
  { country: 'India', state: 'Andhra Pradesh', district: 'NTR', townOrCity: 'Vijayawada', lat: 16.5062, lng: 80.6480, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Krishna', townOrCity: 'Gudivada', lat: 16.4410, lng: 80.9926 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Krishna', townOrCity: 'Machilipatnam', lat: 16.1875, lng: 81.1389 },

  // Guntur, AP
  { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', townOrCity: 'Guntur', lat: 16.3067, lng: 80.4365, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', townOrCity: 'Tenali', lat: 16.2430, lng: 80.6400 },

  // East Godavari, AP
  { country: 'India', state: 'Andhra Pradesh', district: 'East Godavari', townOrCity: 'Rajahmundry', lat: 17.0005, lng: 81.8040, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'East Godavari', townOrCity: 'Kakinada', lat: 16.9891, lng: 82.2475 },

  // Maharashtra Hubs
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Lasalgaon', lat: 20.1466, lng: 74.2263, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Pimpalgaon Baswant', lat: 20.1706, lng: 73.9856, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Nashik City', lat: 19.9975, lng: 73.7898 },
  { country: 'India', state: 'Maharashtra', district: 'Pune', townOrCity: 'Pune Gultekdi', lat: 18.4975, lng: 73.8647, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Pune', townOrCity: 'Baramati', lat: 18.1517, lng: 74.5772, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Nagpur', townOrCity: 'Kalamna (Nagpur)', lat: 21.1764, lng: 79.1384, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Solapur', townOrCity: 'Solapur Yard', lat: 17.6599, lng: 75.9064, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Latur', townOrCity: 'Latur Mandi', lat: 18.4088, lng: 76.5604, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Akola', townOrCity: 'Akola Yard', lat: 20.7002, lng: 77.0082 },
  { country: 'India', state: 'Maharashtra', district: 'Sangli', townOrCity: 'Sangli Turmeric Yard', lat: 16.8524, lng: 74.5815, isPopularHub: true },
  
  // Telangana Hubs
  { country: 'India', state: 'Telangana', district: 'Hyderabad', townOrCity: 'Bowenpally', lat: 17.4720, lng: 78.4900, isPopularHub: true },
  { country: 'India', state: 'Telangana', district: 'Khammam', townOrCity: 'Khammam', lat: 17.2473, lng: 80.1514, isPopularHub: true },
  { country: 'India', state: 'Telangana', district: 'Warangal', townOrCity: 'Warangal', lat: 17.9689, lng: 79.5941, isPopularHub: true },
  { country: 'India', state: 'Telangana', district: 'Nizamabad', townOrCity: 'Nizamabad', lat: 18.6725, lng: 78.0941, isPopularHub: true }
];

export function searchLocations(query: string): LocationOption[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return INDEXED_LOCATIONS.filter(
    (loc) =>
      loc.townOrCity.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q)
  ).slice(0, 8);
}

// Fallback coordinate lookup for manually selected town or district
export function getCoordinatesForLocation(state: string, district: string, town?: string): { lat: number; lng: number } {
  const match = INDEXED_LOCATIONS.find(
    (loc) =>
      loc.state.toLowerCase() === state.toLowerCase() &&
      loc.district.toLowerCase() === district.toLowerCase() &&
      (!town || loc.townOrCity.toLowerCase() === town.toLowerCase())
  );
  if (match) return { lat: match.lat, lng: match.lng };

  const districtMatch = INDEXED_LOCATIONS.find(
    (loc) =>
      loc.state.toLowerCase() === state.toLowerCase() &&
      loc.district.toLowerCase() === district.toLowerCase()
  );
  if (districtMatch) return { lat: districtMatch.lat, lng: districtMatch.lng };

  // Approximate default centers for states
  if (state === 'Maharashtra') return { lat: 19.7515, lng: 75.7139 };
  if (state === 'Telangana') return { lat: 17.8749, lng: 78.1008 };
  if (state === 'Karnataka') return { lat: 15.3173, lng: 75.7139 };
  return { lat: 16.5449, lng: 81.5212 }; // Default Bhimavaram, AP
}
