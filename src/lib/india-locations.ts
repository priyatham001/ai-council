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
    'West Godavari': ['Bhimavaram', 'Tanuku', 'Palakollu', 'Narasapur', 'Tadepalligudem', 'Akividu', 'Undi', 'Penugonda'],
    'Eluru': ['Eluru', 'Jangareddygudem', 'Kaikalur', 'Chintalapudi', 'Polavaram'],
    'East Godavari': ['Rajahmundry', 'Mandapeta', 'Rajanagaram', 'Korukonda', 'Gokavaram'],
    'Kakinada': ['Kakinada', 'Samalkota', 'Pithapuram', 'Tuni', 'Peddapuram'],
    'Konaseema': ['Amalapuram', 'Ravulapalem', 'Razole', 'Kothapeta', 'Mummidivaram'],
    'Krishna': ['Machilipatnam', 'Gudivada', 'Vuyyuru', 'Avanigadda', 'Gannavaram'],
    'NTR': ['Vijayawada', 'Jaggayyapeta', 'Tiruvuru', 'Nandigama', 'Mylavaram'],
    'Guntur': ['Guntur', 'Tenali', 'Mangalagiri', 'Ponnur', 'Tadikonda', 'Chebrolu'],
    'Palnadu': ['Narasaraopet', 'Piduguralla', 'Vinukonda', 'Sattenapalle', 'Macherla', 'Chilakaluripet'],
    'Bapatla': ['Bapatla', 'Chirala', 'Repalle', 'Vemuru', 'Addanki'],
    'Prakasam': ['Ongole', 'Markapur', 'Kandukur', 'Giddalur', 'Podili', 'Yerragondapalem'],
    'SPSR Nellore': ['Nellore', 'Kavali', 'Gudur', 'Atmakur', 'Venkatagiri', 'Naidupeta'],
    'Kurnool': ['Kurnool', 'Adoni', 'Yemmiganur', 'Dhone', 'Kodumur', 'Pattikonda'],
    'Nandyal': ['Nandyal', 'Allagadda', 'Banaganapalle', 'Nandikotkur', 'Atmakur'],
    'Anantapur': ['Anantapur', 'Guntakal', 'Tadipatri', 'Dharmavaram', 'Uravakonda'],
    'Sri Sathya Sai': ['Hindupur', 'Kadiri', 'Penukonda', 'Puttaparthi', 'Madakasira'],
    'YSR Kadapa': ['Kadapa', 'Proddatur', 'Pulivendula', 'Jammalamadugu', 'Badvel', 'Mydukur'],
    'Annamayya': ['Rayachoti', 'Madanapalle', 'Rajampet', 'Pileru', 'Railway Kodur'],
    'Chittoor': ['Chittoor', 'Punganur', 'Palamaner', 'Nagari', 'Kuppam'],
    'Tirupati': ['Tirupati', 'Srikalahasti', 'Chandragiri', 'Puttur', 'Sullurpeta'],
    'Visakhapatnam': ['Visakhapatnam', 'Bheemunipatnam', 'Gajuwaka', 'Pendurthi'],
    'Anakapalli': ['Anakapalle', 'Chodavaram', 'Yelamanchili', 'Narsipatnam', 'Payakaraopeta'],
    'Vizianagaram': ['Vizianagaram', 'Bobbili', 'Salur', 'Cheepurupalle', 'Gajapathinagaram'],
    'Srikakulam': ['Srikakulam', 'Amadalavalasa', 'Palasa', 'Rajam', 'Ichchapuram']
  },
  'Maharashtra': {
    'Nashik': ['Lasalgaon', 'Pimpalgaon Baswant', 'Nashik City', 'Sinnar', 'Yeola', 'Malegaon', 'Niphad', 'Dindori', 'Chandwad'],
    'Pune': ['Pune Gultekdi', 'Haveli', 'Baramati', 'Junnar', 'Shirur', 'Manchar', 'Daund', 'Indapur', 'Bhor', 'Khed (Chakan)'],
    'Nagpur': ['Kalamna (Nagpur)', 'Katol', 'Saoner', 'Umred', 'Ramtek', 'Kamptee', 'Narkhed'],
    'Solapur': ['Solapur Yard', 'Pandharpur', 'Barshi', 'Akkalkot', 'Karmala', 'Mohol', 'Sangola', 'Mangalwedha'],
    'Latur': ['Latur Mandi', 'Ausa', 'Udgir', 'Nilanga', 'Ahmedpur', 'Chakur', 'Renapur'],
    'Akola': ['Akola Yard', 'Murtizapur', 'Balapur', 'Patur', 'Telhara', 'Barshitakli'],
    'Ahmednagar': ['Ahmednagar', 'Rahata (Shirdi)', 'Sangamner', 'Kopargaon', 'Shrirampur', 'Newasa', 'Parner', 'Jamkhed'],
    'Kolhapur': ['Kolhapur Yard', 'Shirol', 'Gadhinglaj', 'Jaysingpur', 'Hatkanangle', 'Ichalkaranji', 'Radhanagari'],
    'Sangli': ['Sangli Turmeric Yard', 'Miraj', 'Tasgaon', 'Vita', 'Islampur', 'Jath', 'Shirala', 'Atpadi'],
    'Amravati': ['Amravati Cotton Yard', 'Achalpur', 'Morshi', 'Warud', 'Chandur Bazar', 'Daryapur', 'Anjangaon'],
    'Jalgaon': ['Jalgaon Yard', 'Bhusawal', 'Amalner', 'Chalisgaon', 'Chopda', 'Pachora', 'Raver', 'Yawal', 'Jamner'],
    'Chhatrapati Sambhaji Nagar': ['Aurangabad Yard', 'Paithan', 'Vaijapur', 'Gangapur', 'Kannad', 'Sillod', 'Khuldabad'],
    'Jalna': ['Jalna Seed & Steel Yard', 'Partur', 'Ambad', 'Bhokardan', 'Badnapur', 'Jafrabad'],
    'Nanded': ['Nanded Mandi', 'Loha', 'Mukhed', 'Degloor', 'Kinwat', 'Hadgaon', 'Bhokar'],
    'Parbhani': ['Parbhani Yard', 'Gangakhed', 'Jintur', 'Selu', 'Manwath', 'Pathri'],
    'Beed': ['Beed Mandi', 'Majalgaon', 'Georai', 'Parli Vaijnath', 'Kaij', 'Ashti', 'Patoda'],
    'Dharashiv': ['Osmanabad Mandi', 'Tuljapur', 'Omerga', 'Kalamb', 'Paranda', 'Bhoom'],
    'Yavatmal': ['Yavatmal Cotton Mandi', 'Pusad', 'Umarkhed', 'Wani', 'Darwha', 'Ghatanji', 'Digras'],
    'Buldhana': ['Buldhana', 'Khamgaon Yard', 'Malkapur', 'Shegaon', 'Mehkar', 'Chikhli', 'Deulgaon Raja'],
    'Wardha': ['Wardha Yard', 'Hinganghat', 'Arvi', 'Deoli', 'Seloo', 'Pulgaon'],
    'Satara': ['Satara Yard', 'Karad', 'Phaltan', 'Wai', 'Koregaon', 'Patan'],
    'Chandrapur': ['Chandrapur Yard', 'Warora', 'Ballarpur', 'Rajura', 'Bhadrawati', 'Mul']
  }
};

// Flattened indexed locations for quick search and auto-complete (Strictly AP and Maharashtra)
export const INDEXED_LOCATIONS: LocationOption[] = [
  // Andhra Pradesh Hubs
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Bhimavaram', lat: 16.5449, lng: 81.5212, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Tanuku', lat: 16.7570, lng: 81.6820, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Palakollu', lat: 16.5256, lng: 81.7288, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Narasapur', lat: 16.4380, lng: 81.6980 },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Tadepalligudem', lat: 16.8140, lng: 81.5270, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'West Godavari', townOrCity: 'Akividu', lat: 16.5910, lng: 81.3820 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Eluru', townOrCity: 'Eluru', lat: 16.7107, lng: 81.0952, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Eluru', townOrCity: 'Jangareddygudem', lat: 17.1260, lng: 81.2940 },
  { country: 'India', state: 'Andhra Pradesh', district: 'NTR', townOrCity: 'Vijayawada', lat: 16.5062, lng: 80.6480, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Krishna', townOrCity: 'Gudivada', lat: 16.4410, lng: 80.9926 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Krishna', townOrCity: 'Machilipatnam', lat: 16.1875, lng: 81.1389 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', townOrCity: 'Guntur', lat: 16.3067, lng: 80.4365, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', townOrCity: 'Tenali', lat: 16.2430, lng: 80.6400 },
  { country: 'India', state: 'Andhra Pradesh', district: 'East Godavari', townOrCity: 'Rajahmundry', lat: 17.0005, lng: 81.8040, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Kakinada', townOrCity: 'Kakinada', lat: 16.9891, lng: 82.2475, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Konaseema', townOrCity: 'Amalapuram', lat: 16.5787, lng: 82.0061 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Prakasam', townOrCity: 'Ongole', lat: 15.5057, lng: 80.0499, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'SPSR Nellore', townOrCity: 'Nellore', lat: 14.4426, lng: 79.9865, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Kurnool', townOrCity: 'Kurnool', lat: 15.8281, lng: 78.0373, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Kurnool', townOrCity: 'Adoni', lat: 15.6322, lng: 77.2728 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Nandyal', townOrCity: 'Nandyal', lat: 15.4785, lng: 78.4836 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Anantapur', townOrCity: 'Anantapur', lat: 14.6819, lng: 77.6006, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Anantapur', townOrCity: 'Guntakal', lat: 15.1667, lng: 77.3667 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Sri Sathya Sai', townOrCity: 'Hindupur', lat: 13.8290, lng: 77.4920 },
  { country: 'India', state: 'Andhra Pradesh', district: 'YSR Kadapa', townOrCity: 'Kadapa', lat: 14.4673, lng: 78.8242, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Tirupati', townOrCity: 'Tirupati', lat: 13.6288, lng: 79.4192, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', townOrCity: 'Chittoor', lat: 13.2172, lng: 79.1003 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Visakhapatnam', townOrCity: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, isPopularHub: true },
  { country: 'India', state: 'Andhra Pradesh', district: 'Anakapalli', townOrCity: 'Anakapalle', lat: 17.6913, lng: 83.0039 },

  // Maharashtra Hubs
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Lasalgaon', lat: 20.1466, lng: 74.2263, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Pimpalgaon Baswant', lat: 20.1706, lng: 73.9856, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Nashik', townOrCity: 'Nashik City', lat: 19.9975, lng: 73.7898, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Pune', townOrCity: 'Pune Gultekdi', lat: 18.4975, lng: 73.8647, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Pune', townOrCity: 'Baramati', lat: 18.1517, lng: 74.5772, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Pune', townOrCity: 'Junnar', lat: 19.2064, lng: 73.8764 },
  { country: 'India', state: 'Maharashtra', district: 'Nagpur', townOrCity: 'Kalamna (Nagpur)', lat: 21.1764, lng: 79.1384, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Solapur', townOrCity: 'Solapur Yard', lat: 17.6599, lng: 75.9064, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Solapur', townOrCity: 'Pandharpur', lat: 17.6775, lng: 75.3275 },
  { country: 'India', state: 'Maharashtra', district: 'Latur', townOrCity: 'Latur Mandi', lat: 18.4088, lng: 76.5604, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Akola', townOrCity: 'Akola Yard', lat: 20.7002, lng: 77.0082, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Ahmednagar', townOrCity: 'Ahmednagar', lat: 19.0952, lng: 74.7480, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Ahmednagar', townOrCity: 'Rahata (Shirdi)', lat: 19.6800, lng: 74.4900 },
  { country: 'India', state: 'Maharashtra', district: 'Kolhapur', townOrCity: 'Kolhapur Yard', lat: 16.7050, lng: 74.2433, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Sangli', townOrCity: 'Sangli Turmeric Yard', lat: 16.8524, lng: 74.5815, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Amravati', townOrCity: 'Amravati Cotton Yard', lat: 20.9374, lng: 77.7796, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Jalgaon', townOrCity: 'Jalgaon Yard', lat: 21.0077, lng: 75.5626, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Chhatrapati Sambhaji Nagar', townOrCity: 'Aurangabad Yard', lat: 19.8762, lng: 75.3433, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Jalna', townOrCity: 'Jalna Seed & Steel Yard', lat: 19.8347, lng: 75.8816, isPopularHub: true },
  { country: 'India', state: 'Maharashtra', district: 'Yavatmal', townOrCity: 'Yavatmal Cotton Mandi', lat: 20.3888, lng: 78.1204 },
  { country: 'India', state: 'Maharashtra', district: 'Satara', townOrCity: 'Satara Yard', lat: 17.6805, lng: 73.9935 }
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

// Coordinate lookup for manually selected town or district (Strictly AP and Maharashtra)
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

  // Centers for the two primary supported states
  if (state === 'Maharashtra') return { lat: 19.7515, lng: 75.7139 };
  return { lat: 16.5449, lng: 81.5212 }; // Default Andhra Pradesh (Bhimavaram, West Godavari)
}
