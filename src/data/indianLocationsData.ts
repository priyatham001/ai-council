import { FarmerLocation } from '../types/krishi';

export interface LocationPreset {
  name: string;
  aliases: string[];
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  popular?: boolean;
}

export const ALL_INDIAN_LOCATIONS: LocationPreset[] = [
  // ANDHRA PRADESH - RAYALASEEMA (including Kadapa!)
  {
    name: 'Kadapa (YSR District)',
    aliases: ['kadapa', 'cuddapah', 'ysr kadapa', 'kadapa district', 'kadapa town'],
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    latitude: 14.4673,
    longitude: 78.8242,
    popular: true,
  },
  {
    name: 'Proddatur',
    aliases: ['proddatur', 'proddaturu'],
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    latitude: 14.7527,
    longitude: 78.5524,
  },
  {
    name: 'Pulivendula',
    aliases: ['pulivendula', 'pulivendla'],
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    latitude: 14.4167,
    longitude: 78.2333,
  },
  {
    name: 'Rayachoty',
    aliases: ['rayachoty', 'rayachoti'],
    district: 'Annamayya',
    state: 'Andhra Pradesh',
    latitude: 14.0574,
    longitude: 78.7523,
  },
  {
    name: 'Rajampet',
    aliases: ['rajampet', 'rajampeta'],
    district: 'Annamayya',
    state: 'Andhra Pradesh',
    latitude: 14.1950,
    longitude: 79.1580,
  },
  {
    name: 'Kurnool',
    aliases: ['kurnool', 'kurnool district', 'kurnool mandi'],
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    latitude: 15.8281,
    longitude: 78.0373,
    popular: true,
  },
  {
    name: 'Nandyal',
    aliases: ['nandyal', 'nandyala'],
    district: 'Nandyal',
    state: 'Andhra Pradesh',
    latitude: 15.4854,
    longitude: 78.4833,
  },
  {
    name: 'Anantapur',
    aliases: ['anantapur', 'anantapuramu', 'anantapur district'],
    district: 'Anantapur',
    state: 'Andhra Pradesh',
    latitude: 14.6819,
    longitude: 77.6006,
    popular: true,
  },
  {
    name: 'Tirupati',
    aliases: ['tirupati', 'tirupathi'],
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    latitude: 13.6288,
    longitude: 79.4192,
    popular: true,
  },
  {
    name: 'Chittoor',
    aliases: ['chittoor', 'chittur'],
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.2172,
    longitude: 79.1003,
  },
  {
    name: 'Nellore',
    aliases: ['nellore', 'spsr nellore'],
    district: 'SPSR Nellore',
    state: 'Andhra Pradesh',
    latitude: 14.4426,
    longitude: 79.9865,
    popular: true,
  },

  // ANDHRA PRADESH - COASTAL & DELTA
  {
    name: 'Guntur',
    aliases: ['guntur', 'guntur mirchi yard', 'guntur mandi'],
    district: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    popular: true,
  },
  {
    name: 'Vijayawada',
    aliases: ['vijayawada', 'gollapudi', 'krishna district', 'ntr'],
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    latitude: 16.5417,
    longitude: 80.5962,
    popular: true,
  },
  {
    name: 'Tenali',
    aliases: ['tenali'],
    district: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.2437,
    longitude: 80.6400,
  },
  {
    name: 'Bhimavaram',
    aliases: ['bhimavaram', 'west godavari'],
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.5449,
    longitude: 81.5212,
    popular: true,
  },
  {
    name: 'Tadepalligudem',
    aliases: ['tadepalligudem', 'tadepalligudem mandi'],
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.8123,
    longitude: 81.5273,
  },
  {
    name: 'Eluru',
    aliases: ['eluru'],
    district: 'Eluru',
    state: 'Andhra Pradesh',
    latitude: 16.7107,
    longitude: 81.0952,
  },
  {
    name: 'Rajahmundry',
    aliases: ['rajahmundry', 'rajamahendravaram', 'east godavari'],
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 17.0005,
    longitude: 81.8040,
    popular: true,
  },
  {
    name: 'Ongole',
    aliases: ['ongole', 'prakasam'],
    district: 'Prakasam',
    state: 'Andhra Pradesh',
    latitude: 15.5057,
    longitude: 80.0499,
  },
  {
    name: 'Visakhapatnam (Anakapalle)',
    aliases: ['visakhapatnam', 'vizag', 'anakapalle', 'anakapalli'],
    district: 'Anakapalli / Visakhapatnam',
    state: 'Andhra Pradesh',
    latitude: 17.6913,
    longitude: 83.0039,
    popular: true,
  },
  {
    name: 'Vizianagaram',
    aliases: ['vizianagaram'],
    district: 'Vizianagaram',
    state: 'Andhra Pradesh',
    latitude: 18.1067,
    longitude: 83.3956,
  },
  {
    name: 'Srikakulam',
    aliases: ['srikakulam'],
    district: 'Srikakulam',
    state: 'Andhra Pradesh',
    latitude: 18.2949,
    longitude: 83.8938,
  },

  // TELANGANA
  {
    name: 'Warangal (Enumamula)',
    aliases: ['warangal', 'enumamula', 'hanamkonda', 'warangal urban'],
    district: 'Warangal',
    state: 'Telangana',
    latitude: 17.9689,
    longitude: 79.5941,
    popular: true,
  },
  {
    name: 'Karimnagar',
    aliases: ['karimnagar', 'karimnagar mandi'],
    district: 'Karimnagar',
    state: 'Telangana',
    latitude: 18.4386,
    longitude: 79.1288,
    popular: true,
  },
  {
    name: 'Hyderabad (Bowenpally)',
    aliases: ['hyderabad', 'bowenpally', 'malakpet', 'secunderabad'],
    district: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4728,
    longitude: 78.4871,
    popular: true,
  },
  {
    name: 'Nizamabad',
    aliases: ['nizamabad', 'nizamabad turmeric'],
    district: 'Nizamabad',
    state: 'Telangana',
    latitude: 18.6725,
    longitude: 78.0941,
    popular: true,
  },
  {
    name: 'Khammam',
    aliases: ['khammam', 'khammam mirchi'],
    district: 'Khammam',
    state: 'Telangana',
    latitude: 17.2473,
    longitude: 80.1514,
    popular: true,
  },
  {
    name: 'Jangaon',
    aliases: ['jangaon', 'jangaon mandi'],
    district: 'Jangaon',
    state: 'Telangana',
    latitude: 17.7214,
    longitude: 79.1558,
  },
  {
    name: 'Mahabubabad',
    aliases: ['mahabubabad', 'mahabubabad mandi'],
    district: 'Mahabubabad',
    state: 'Telangana',
    latitude: 17.5982,
    longitude: 80.0038,
  },
  {
    name: 'Siddipet',
    aliases: ['siddipet', 'siddipet mandi'],
    district: 'Siddipet',
    state: 'Telangana',
    latitude: 18.1018,
    longitude: 78.8520,
  },
  {
    name: 'Suryapet',
    aliases: ['suryapet'],
    district: 'Suryapet',
    state: 'Telangana',
    latitude: 17.1439,
    longitude: 79.6236,
  },
  {
    name: 'Nalgonda',
    aliases: ['nalgonda'],
    district: 'Nalgonda',
    state: 'Telangana',
    latitude: 17.0577,
    longitude: 79.2684,
  },
  {
    name: 'Mahbubnagar',
    aliases: ['mahbubnagar', 'palamuru'],
    district: 'Mahbubnagar',
    state: 'Telangana',
    latitude: 16.7488,
    longitude: 77.9856,
  },
  {
    name: 'Adilabad',
    aliases: ['adilabad', 'adilabad cotton'],
    district: 'Adilabad',
    state: 'Telangana',
    latitude: 19.6641,
    longitude: 78.5320,
  },

  // MAHARASHTRA
  {
    name: 'Nashik (Lasalgaon)',
    aliases: ['nashik', 'nasik', 'lasalgaon', 'pimpalgaon', 'lasalgaon mandi'],
    district: 'Nashik',
    state: 'Maharashtra',
    latitude: 20.0059,
    longitude: 73.7917,
    popular: true,
  },
  {
    name: 'Pune (Gultekdi)',
    aliases: ['pune', 'gultekdi', 'pune mandi'],
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.4965,
    longitude: 73.8647,
    popular: true,
  },
  {
    name: 'Nagpur (Kalamna)',
    aliases: ['nagpur', 'kalamna', 'kalamna mandi'],
    district: 'Nagpur',
    state: 'Maharashtra',
    latitude: 21.1685,
    longitude: 79.1368,
    popular: true,
  },
  {
    name: 'Chhatrapati Sambhajinagar (Aurangabad)',
    aliases: ['aurangabad', 'sambhajinagar', 'chhatrapati sambhajinagar'],
    district: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    latitude: 19.8762,
    longitude: 75.3433,
    popular: true,
  },
  {
    name: 'Latur',
    aliases: ['latur', 'latur pulse mandi', 'latur apmc'],
    district: 'Latur',
    state: 'Maharashtra',
    latitude: 18.4088,
    longitude: 76.5604,
    popular: true,
  },
  {
    name: 'Solapur',
    aliases: ['solapur', 'sholapur'],
    district: 'Solapur',
    state: 'Maharashtra',
    latitude: 17.6599,
    longitude: 75.9064,
  },
  {
    name: 'Kolhapur',
    aliases: ['kolhapur', 'shahu market'],
    district: 'Kolhapur',
    state: 'Maharashtra',
    latitude: 16.7050,
    longitude: 74.2433,
    popular: true,
  },
  {
    name: 'Sangli',
    aliases: ['sangli', 'sangli turmeric', 'miraj'],
    district: 'Sangli',
    state: 'Maharashtra',
    latitude: 16.8524,
    longitude: 74.5815,
  },
  {
    name: 'Ahmednagar (Ahilyanagar)',
    aliases: ['ahmednagar', 'ahilyanagar'],
    district: 'Ahilyanagar',
    state: 'Maharashtra',
    latitude: 19.0952,
    longitude: 74.7496,
  },
  {
    name: 'Jalgaon',
    aliases: ['jalgaon', 'jalgaon banana'],
    district: 'Jalgaon',
    state: 'Maharashtra',
    latitude: 21.0077,
    longitude: 75.5626,
  },
  {
    name: 'Dhule',
    aliases: ['dhule'],
    district: 'Dhule',
    state: 'Maharashtra',
    latitude: 20.9042,
    longitude: 74.7749,
  },
  {
    name: 'Amravati',
    aliases: ['amravati'],
    district: 'Amravati',
    state: 'Maharashtra',
    latitude: 20.9320,
    longitude: 77.7523,
  },
  {
    name: 'Akola',
    aliases: ['akola'],
    district: 'Akola',
    state: 'Maharashtra',
    latitude: 20.7002,
    longitude: 77.0082,
  },
  {
    name: 'Nanded',
    aliases: ['nanded'],
    district: 'Nanded',
    state: 'Maharashtra',
    latitude: 19.1383,
    longitude: 77.3210,
  },
  {
    name: 'Mumbai (Vashi Navi Mumbai)',
    aliases: ['mumbai', 'navi mumbai', 'vashi'],
    district: 'Thane / Navi Mumbai',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 73.0070,
  },

  // KARNATAKA
  {
    name: 'Bengaluru (Yeshwanthpur)',
    aliases: ['bengaluru', 'bangalore', 'yeshwanthpur'],
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 13.0238,
    longitude: 77.5529,
    popular: true,
  },
  {
    name: 'Hubli (Amargol)',
    aliases: ['hubli', 'hubballi', 'dharwad', 'amargol'],
    district: 'Dharwad',
    state: 'Karnataka',
    latitude: 15.3942,
    longitude: 75.1102,
    popular: true,
  },
  {
    name: 'Mysuru',
    aliases: ['mysuru', 'mysore', 'bandipalya'],
    district: 'Mysuru',
    state: 'Karnataka',
    latitude: 12.2958,
    longitude: 76.6394,
  },
  {
    name: 'Belagavi',
    aliases: ['belagavi', 'belgaum'],
    district: 'Belagavi',
    state: 'Karnataka',
    latitude: 15.8497,
    longitude: 74.4977,
  },
  {
    name: 'Raichur',
    aliases: ['raichur', 'raichur cotton'],
    district: 'Raichur',
    state: 'Karnataka',
    latitude: 16.2120,
    longitude: 77.3439,
  },

  // TAMIL NADU
  {
    name: 'Coimbatore',
    aliases: ['coimbatore', 'mettupalayam road'],
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    popular: true,
  },
  {
    name: 'Madurai',
    aliases: ['madurai', 'mattuthavani'],
    district: 'Madurai',
    state: 'Tamil Nadu',
    latitude: 9.9252,
    longitude: 78.1198,
    popular: true,
  },
  {
    name: 'Salem',
    aliases: ['salem', 'salem mandi'],
    district: 'Salem',
    state: 'Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
  },
  {
    name: 'Tiruchirappalli',
    aliases: ['trichy', 'tiruchirappalli'],
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    latitude: 10.7905,
    longitude: 78.7047,
  },

  // PUNJAB & HARYANA
  {
    name: 'Ludhiana',
    aliases: ['ludhiana', 'gill road'],
    district: 'Ludhiana',
    state: 'Punjab',
    latitude: 30.8926,
    longitude: 75.8573,
    popular: true,
  },
  {
    name: 'Amritsar (Bhagtanwala)',
    aliases: ['amritsar', 'bhagtanwala'],
    district: 'Amritsar',
    state: 'Punjab',
    latitude: 31.6163,
    longitude: 74.8821,
    popular: true,
  },
  {
    name: 'Khanna',
    aliases: ['khanna', 'khanna mandi', 'asia largest grain market'],
    district: 'Ludhiana',
    state: 'Punjab',
    latitude: 30.7067,
    longitude: 76.2217,
  },
  {
    name: 'Karnal',
    aliases: ['karnal', 'karnal mandi'],
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.6857,
    longitude: 76.9905,
  },

  // MADHYA PRADESH
  {
    name: 'Indore (Chhavani)',
    aliases: ['indore', 'chhavani', 'indore mandi'],
    district: 'Indore',
    state: 'Madhya Pradesh',
    latitude: 22.7196,
    longitude: 75.8577,
    popular: true,
  },
  {
    name: 'Ujjain',
    aliases: ['ujjain', 'ujjain mandi'],
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    latitude: 23.1765,
    longitude: 75.7885,
  },
  {
    name: 'Bhopal (Karond)',
    aliases: ['bhopal', 'karond'],
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    latitude: 23.2599,
    longitude: 77.4126,
  },

  // RAJASTHAN
  {
    name: 'Jaipur (Muhana)',
    aliases: ['jaipur', 'muhana', 'jaipur mandi'],
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.8048,
    longitude: 75.7601,
    popular: true,
  },
  {
    name: 'Kota (Bhamashah)',
    aliases: ['kota', 'bhamashah mandi'],
    district: 'Kota',
    state: 'Rajasthan',
    latitude: 25.2138,
    longitude: 75.8648,
  },

  // GUJARAT
  {
    name: 'Rajkot (Bedi)',
    aliases: ['rajkot', 'bedi yard'],
    district: 'Rajkot',
    state: 'Gujarat',
    latitude: 22.3392,
    longitude: 70.8144,
    popular: true,
  },
  {
    name: 'Unjha',
    aliases: ['unjha', 'unjha mandi', 'spices'],
    district: 'Mehsana',
    state: 'Gujarat',
    latitude: 23.8037,
    longitude: 72.3924,
  },

  // WEST BENGAL
  {
    name: 'Burdwan (Bardhaman)',
    aliases: ['burdwan', 'bardhaman', 'purba bardhaman'],
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    latitude: 23.2324,
    longitude: 87.8615,
    popular: true,
  },

  // UTTAR PRADESH & BIHAR
  {
    name: 'Varanasi (Paharia)',
    aliases: ['varanasi', 'banaras', 'kashi', 'paharia'],
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3524,
    longitude: 82.9912,
    popular: true,
  },
  {
    name: 'Patna (Bazar Samiti)',
    aliases: ['patna', 'bazar samiti'],
    district: 'Patna',
    state: 'Bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    popular: true,
  },
];

// Helper to find location match from query text
export function searchIndianLocations(query: string): FarmerLocation[] {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return ALL_INDIAN_LOCATIONS.filter((l) => l.popular).map((loc) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      country: 'India',
      state: loc.state,
      district: loc.district,
      city: loc.name.split(' (')[0],
      town: loc.name.split(' (')[0],
      formattedAddress: `${loc.name}, ${loc.state}, India`,
      source: 'search',
    }));
  }

  // Exact or partial match
  const matches = ALL_INDIAN_LOCATIONS.filter((loc) => {
    if (loc.name.toLowerCase().includes(clean)) return true;
    if (loc.district.toLowerCase().includes(clean)) return true;
    if (loc.state.toLowerCase().includes(clean)) return true;
    return loc.aliases.some((alias) => alias.includes(clean) || clean.includes(alias));
  });

  return matches.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
    country: 'India',
    state: loc.state,
    district: loc.district,
    city: loc.name.split(' (')[0],
    town: loc.name.split(' (')[0],
    formattedAddress: `${loc.name}, ${loc.state}, India`,
    source: 'search',
  }));
}

// Find closest Indian preset to coordinates (used for reverse geocoding GPS coordinates)
export function findClosestIndianLocation(lat: number, lng: number): LocationPreset {
  let closest = ALL_INDIAN_LOCATIONS[0];
  let minDistance = Number.MAX_VALUE;

  for (const loc of ALL_INDIAN_LOCATIONS) {
    const dLat = loc.latitude - lat;
    const dLng = loc.longitude - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = loc;
    }
  }

  return closest;
}
