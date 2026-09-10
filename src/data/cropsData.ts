import { CropItem, CropCategory } from '../types/krishi';
import sorghumImg from '../assets/images/sorghum_grain_harvest_1789055252963.jpg';
import pearlMilletImg from '../assets/images/pearl_millet_bajra_1789055272099.jpg';
import fingerMilletImg from '../assets/images/finger_millet_ragi_1789055288733.jpg';
import toorDalImg from '../assets/images/toor_dal_yellow_1789055308611.jpg';
import moongImg from '../assets/images/moong_green_gram_1789055329559.jpg';
import uradImg from '../assets/images/urad_black_gram_1789055348069.jpg';
import chanaImg from '../assets/images/desi_chana_gram_1789055365095.jpg';
import cabbageImg from '../assets/images/fresh_green_cabbage_1789055390921.jpg';
import groundnutImg from '../assets/images/raw_groundnut_pods_1789055409091.jpg';

export const CROP_DATABASE: CropItem[] = [
  // CEREALS
  {
    id: 'paddy',
    name: 'Paddy (Dhan)',
    localNames: {
      en: 'Paddy (Dhan / Rice)',
      hi: 'धान (चावल)',
      mr: 'भात / धान',
      te: 'వరి (వరి ధాన్యం)',
    },
    category: 'cereals',
    icon: '🌾',
    defaultUnit: 'quintal',
    modalPrice: 2320,
    minPrice: 2183,
    maxPrice: 2500,
    qualityProfile: {
      visualTraits: ['Grain fullness', 'Golden husk color', 'Kernel maturity', 'Absence of foreign matter'],
      defectIndicators: ['Discolored grains', 'Broken husks', 'Black tip mold', 'Visible weed seeds'],
      physicalLimits: ['Exact moisture % (instrument required)', 'Milling turnout %', 'Chalkiness index'],
    },
  },
  {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    localNames: {
      en: 'Wheat (Gehun)',
      hi: 'गेहूं',
      mr: 'गहू',
      te: 'గోధుమలు',
    },
    category: 'cereals',
    icon: '🌾',
    defaultUnit: 'quintal',
    modalPrice: 2450,
    minPrice: 2275,
    maxPrice: 2680,
    qualityProfile: {
      visualTraits: ['Amber luster', 'Bold uniform grains', 'Clean bran coat', 'Plump grain structure'],
      defectIndicators: ['Shrunken grains', 'Weevil-bored grains', 'Sprouted kernels', 'Dirt / chaff mixture'],
      physicalLimits: ['Gluten content %', 'Exact moisture %', 'Sedimentation value'],
    },
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    localNames: {
      en: 'Maize (Corn / Makka)',
      hi: 'मक्का',
      mr: 'मका',
      te: 'మొక్కజొన్న',
    },
    category: 'cereals',
    icon: '🌽',
    defaultUnit: 'quintal',
    modalPrice: 2150,
    minPrice: 1950,
    maxPrice: 2350,
    qualityProfile: {
      visualTraits: ['Bright yellow color', 'Uniform kernel shape', 'Intact pericarp', 'Freedom from insect webs'],
      defectIndicators: ['Fungal cob rot', 'Immature dented kernels', 'Rodent bite marks', 'Discolored germ'],
      physicalLimits: ['Aflatoxin ppb levels', 'Core moisture %', 'Starch extraction ratio'],
    },
  },
  {
    id: 'sorghum',
    name: 'Sorghum (Jowar)',
    localNames: {
      en: 'Sorghum (Jowar / Cholam)',
      hi: 'ज्वार',
      mr: 'ज्वारी',
      te: 'జొన్నలు',
    },
    category: 'cereals',
    icon: '🌾',
    defaultUnit: 'quintal',
    modalPrice: 3280,
    minPrice: 3100,
    maxPrice: 3550,
    qualityProfile: {
      visualTraits: ['Pearly white / cream color', 'Spherical plump grains', 'Absence of dark spots'],
      defectIndicators: ['Head mold staining', 'Grain smut soot', 'Broken fractions'],
      physicalLimits: ['Moisture content', 'Tannin percentage'],
    },
  },
  {
    id: 'pearl_millet',
    name: 'Pearl Millet (Bajra)',
    localNames: {
      en: 'Pearl Millet (Bajra)',
      hi: 'बाजरा',
      mr: 'बाजरी',
      te: 'సజ్జలు',
    },
    category: 'cereals',
    icon: '🌾',
    defaultUnit: 'quintal',
    modalPrice: 2600,
    minPrice: 2500,
    maxPrice: 2850,
    qualityProfile: {
      visualTraits: ['Slate grey / greenish tint', 'Uniform seed size', 'Glossy outer surface'],
      defectIndicators: ['Ergot sclerotia pellets', 'Damp moldy odor', 'Infested hollow grains'],
      physicalLimits: ['Total fat acidity', 'Laboratory moisture test'],
    },
  },
  {
    id: 'finger_millet',
    name: 'Finger Millet (Ragi)',
    localNames: {
      en: 'Finger Millet (Ragi)',
      hi: 'रागी / मडुआ',
      mr: 'नाचणी / रागी',
      te: 'రాగులు (తైదలు)',
    },
    category: 'cereals',
    icon: '🥣',
    defaultUnit: 'quintal',
    modalPrice: 4290,
    minPrice: 3840,
    maxPrice: 4600,
    qualityProfile: {
      visualTraits: ['Brick red / dark brown seeds', 'Dust-free shine', 'Consistent roundness'],
      defectIndicators: ['Presence of sand / stones', 'Webbed clumped seeds', 'Dull fading'],
      physicalLimits: ['Calcium density', 'Moisture level'],
    },
  },

  // PULSES
  {
    id: 'toor_dal',
    name: 'Toor Dal / Arhar / Pigeon Pea',
    localNames: {
      en: 'Toor Dal / Arhar / Pigeon Pea',
      hi: 'अरहर / तूर दाल',
      mr: 'तूर डाळ',
      te: 'కందులు (కంది పప్పు)',
    },
    category: 'pulses',
    icon: '🍲',
    defaultUnit: 'quintal',
    modalPrice: 7550,
    minPrice: 7000,
    maxPrice: 8400,
    qualityProfile: {
      visualTraits: ['Bright golden-reddish seeds', 'Intact seed coats', 'Even grading size', 'No foreign seeds'],
      defectIndicators: ['Pod borer puncture holes', 'Discolored brown kernels', 'Splits and brokens', 'Dust contamination'],
      physicalLimits: ['Milling de-hulling yield', 'Internal moisture', 'Cooking time index'],
    },
  },
  {
    id: 'moong',
    name: 'Moong / Green Gram',
    localNames: {
      en: 'Moong / Green Gram',
      hi: 'मूंग दाल',
      mr: 'मूग डाळ',
      te: 'పెసలు (పెసర పప్పు)',
    },
    category: 'pulses',
    icon: '🌱',
    defaultUnit: 'quintal',
    modalPrice: 8680,
    minPrice: 8100,
    maxPrice: 9200,
    qualityProfile: {
      visualTraits: ['Vibrant emerald green color', 'Smooth unbroken seed coat', 'Uniform medium oval size'],
      defectIndicators: ['Bruche beetle emergence holes', 'Water-logged blackening', 'Immature wrinkled seeds'],
      physicalLimits: ['Laboratory moisture', 'Sprouting percentage'],
    },
  },
  {
    id: 'urad',
    name: 'Urad / Black Gram',
    localNames: {
      en: 'Urad / Black Gram',
      hi: 'उड़द दाल',
      mr: 'उडीद डाळ',
      te: 'మినుములు (మినప పప్పు)',
    },
    category: 'pulses',
    icon: '🥣',
    defaultUnit: 'quintal',
    modalPrice: 7400,
    minPrice: 6950,
    maxPrice: 8100,
    qualityProfile: {
      visualTraits: ['Jet black shiny luster', 'Firm whole seeds', 'No insect debris'],
      defectIndicators: ['Brownish faded seeds', 'Weevil perforations', 'Stones and soil balls'],
      physicalLimits: ['Protein percentage', 'Moisture meter reading'],
    },
  },
  {
    id: 'chana',
    name: 'Chana / Bengal Gram',
    localNames: {
      en: 'Chana / Bengal Gram',
      hi: 'चना (चना दाल)',
      mr: 'हरभरा / चणा',
      te: 'శనగలు (శనగ పప్పు)',
    },
    category: 'pulses',
    icon: '🫘',
    defaultUnit: 'quintal',
    modalPrice: 5650,
    minPrice: 5440,
    maxPrice: 6200,
    qualityProfile: {
      visualTraits: ['Bright yellowish brown / Desi hue', 'Well-filled angular seeds', 'Clean sample surface'],
      defectIndicators: ['Bored grains with frass', 'Blackened fungal seeds', 'Cracked seed skins'],
      physicalLimits: ['Besan yield', 'Exact moisture %'],
    },
  },

  // VEGETABLES
  {
    id: 'onion',
    name: 'Onion',
    localNames: {
      en: 'Onion',
      hi: 'प्याज (कांदा)',
      mr: 'कांदा',
      te: 'ఉల్లిపాయలు',
    },
    category: 'vegetables',
    icon: '🧅',
    defaultUnit: 'quintal',
    modalPrice: 2200,
    minPrice: 1600,
    maxPrice: 2900,
    qualityProfile: {
      visualTraits: ['Dry papery outer skin', 'Firm compact neck', 'Consistent 45-60mm size', 'Rich pinkish-red color'],
      defectIndicators: ['Sprouting tips', 'Basal plate fungal rot', 'Soft neck softness', 'Thrips skin scarring'],
      physicalLimits: ['Pungency pyruvic acid test', 'Internal dry matter %', 'Shelf-life test'],
    },
  },
  {
    id: 'tomato',
    name: 'Tomato',
    localNames: {
      en: 'Tomato',
      hi: 'टमाटर',
      mr: 'टोमॅटो',
      te: 'టమాటాలు',
    },
    category: 'vegetables',
    icon: '🍅',
    defaultUnit: 'quintal',
    modalPrice: 1850,
    minPrice: 1200,
    maxPrice: 2600,
    qualityProfile: {
      visualTraits: ['Firm glossy skin', 'Uniform breaker/turning red color', 'Calyx freshness', 'Even round/oval shape'],
      defectIndicators: ['Blossom end rot', 'Sunscald whitening', 'Cracking / radial splits', 'Bruising / water-soaked lesions'],
      physicalLimits: ['Brix sugar content', 'Total titratable acidity', 'Internal firmness penetrometer score'],
    },
  },
  {
    id: 'potato',
    name: 'Potato',
    localNames: {
      en: 'Potato',
      hi: 'आलू',
      mr: 'बटाटा',
      te: 'బంగాళాదుంపలు',
    },
    category: 'vegetables',
    icon: '🥔',
    defaultUnit: 'quintal',
    modalPrice: 1750,
    minPrice: 1300,
    maxPrice: 2200,
    qualityProfile: {
      visualTraits: ['Smooth clean skin', 'Shallow eyes', 'Firm flesh', 'Uniform 50-70mm grading'],
      defectIndicators: ['Greening (solanine accumulation)', 'Late blight rot patches', 'Sprouting eyes', 'Mechanical cuts / bruises'],
      physicalLimits: ['Specific gravity / dry matter', 'Reducing sugar level for chips'],
    },
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    localNames: {
      en: 'Brinjal (Eggplant)',
      hi: 'बैंगन',
      mr: 'वांगी',
      te: 'వంకాయలు',
    },
    category: 'vegetables',
    icon: '🍆',
    defaultUnit: 'quintal',
    modalPrice: 1950,
    minPrice: 1400,
    maxPrice: 2600,
    qualityProfile: {
      visualTraits: ['Deep purple gloss', 'Firm tender body', 'Fresh green calyx with prickles intact', 'Uniform taper'],
      defectIndicators: ['Fruit and shoot borer exit holes', 'Dull faded skin', 'Soft spongy rot', 'Sunburn spots'],
      physicalLimits: ['Seed maturity bitterness score'],
    },
  },
  {
    id: 'chilli',
    name: 'Green Chilli / Red Chilli',
    localNames: {
      en: 'Green Chilli / Red Chilli',
      hi: 'हरी मिर्च / लाल मिर्च',
      mr: 'हिरवी मिरची / लाल मिरची',
      te: 'పచ్చి మిరపకాయలు / ఎండు మిర్చి',
    },
    category: 'vegetables',
    icon: '🌶️',
    defaultUnit: 'quintal',
    modalPrice: 4500,
    minPrice: 3200,
    maxPrice: 6200,
    qualityProfile: {
      visualTraits: ['Crisp turgid pod', 'Uniform dark green / deep crimson red', 'Intact stem stalk'],
      defectIndicators: ['Anthracnose die-back spots', 'Blotchy yellow viral mottling', 'Shriveled wilted tips'],
      physicalLimits: ['Capsaicin Scoville Heat Units', 'Extractable color ASTA units'],
    },
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    localNames: {
      en: 'Cabbage',
      hi: 'पत्ता गोभी',
      mr: 'कोबी',
      te: 'క్యాబేజీ',
    },
    category: 'vegetables',
    icon: '🥬',
    defaultUnit: 'quintal',
    modalPrice: 1400,
    minPrice: 900,
    maxPrice: 1900,
    qualityProfile: {
      visualTraits: ['Dense compact solid head', 'Fresh light green wrapper leaves', 'Clean trimmed stalk'],
      defectIndicators: ['Black rot vein yellowing', 'Diamondback moth tunneling', 'Loose puffy heads', 'Outer leaf decay'],
      physicalLimits: ['Compactness density quotient'],
    },
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    localNames: {
      en: 'Cauliflower',
      hi: 'फूल गोभी',
      mr: 'फ्लॉवर / फुलकोबी',
      te: 'కాలీఫ్లవర్',
    },
    category: 'vegetables',
    icon: '🥦',
    defaultUnit: 'quintal',
    modalPrice: 2100,
    minPrice: 1500,
    maxPrice: 2800,
    qualityProfile: {
      visualTraits: ['Pure ivory-white compact curd', 'Firm curd granules', 'Fresh green jacket leaves'],
      defectIndicators: ['Ricey / riciness fuzzy curds', 'Yellowing / purple sun discoloration', 'Downy mildew mold spots', 'Hollow stem browning'],
      physicalLimits: ['Moisture loss rate'],
    },
  },
  {
    id: 'okra',
    name: 'Okra / Bhindi',
    localNames: {
      en: 'Okra / Bhindi (Lady Finger)',
      hi: 'भिंडी',
      mr: 'भेंडी',
      te: 'బెండకాయలు',
    },
    category: 'vegetables',
    icon: '🥒',
    defaultUnit: 'quintal',
    modalPrice: 3200,
    minPrice: 2400,
    maxPrice: 4100,
    qualityProfile: {
      visualTraits: ['Crisp snap at tip', 'Vibrant medium green pods', 'Tender 7-10 cm length', 'Straight ribs'],
      defectIndicators: ['Yellow vein mosaic virus streaks', 'Fibrous over-mature tough pods', 'Borer caterpillar damage'],
      physicalLimits: ['Crude fiber laboratory measurement'],
    },
  },
  {
    id: 'carrot',
    name: 'Carrot',
    localNames: {
      en: 'Carrot',
      hi: 'गाजर',
      mr: 'गाजर',
      te: 'క్యారెట్',
    },
    category: 'vegetables',
    icon: '🥕',
    defaultUnit: 'quintal',
    modalPrice: 2300,
    minPrice: 1700,
    maxPrice: 3000,
    qualityProfile: {
      visualTraits: ['Bright orange-red hue', 'Straight smooth taproot', 'Firm crunchy flesh', 'Clean crown'],
      defectIndicators: ['Forking / multi-rooted splitting', 'Green shoulder sunburn', 'Cracks caused by moisture shock', 'Soft crown rot'],
      physicalLimits: ['Beta-carotene content', 'Soluble solids %'],
    },
  },
  {
    id: 'french_beans',
    name: 'French Beans',
    localNames: {
      en: 'French Beans',
      hi: 'फ्रेंच बीन्स',
      mr: 'फरसबी',
      te: 'ఫ్రెంచ్ బీన్స్',
    },
    category: 'vegetables',
    icon: '🌱',
    defaultUnit: 'quintal',
    modalPrice: 4100,
    minPrice: 3100,
    maxPrice: 5200,
    qualityProfile: {
      visualTraits: ['Slender tender fleshy pods', 'Smooth green surface', 'Crisp snap with minimal stringiness'],
      defectIndicators: ['Bulging oversized seeds', 'Rust fungal pustules', 'Curved deformed pods'],
      physicalLimits: ['Fiber tensile toughness test'],
    },
  },

  // FRUITS
  {
    id: 'banana',
    name: 'Banana',
    localNames: {
      en: 'Banana (G9 / Robusta)',
      hi: 'केला',
      mr: 'केळी',
      te: 'అరటిపండ్లు',
    },
    category: 'fruits',
    icon: '🍌',
    defaultUnit: 'quintal',
    modalPrice: 2100,
    minPrice: 1500,
    maxPrice: 2800,
    qualityProfile: {
      visualTraits: ['Uniform finger caliber', 'Clean unblemished peel', 'Slight angularity to round fingers', 'Fresh green stalk'],
      defectIndicators: ['Cigar end rot', 'Deep peel abrasions / latex stains', 'Premature ripening fingers', 'Chilling injury blackening'],
      physicalLimits: ['Pulp-to-peel ratio', 'Starch conversion sugar test (Brix)'],
    },
  },
  {
    id: 'mango',
    name: 'Mango',
    localNames: {
      en: 'Mango (Banganapalli / Alphonso / Kesar)',
      hi: 'आम',
      mr: 'आंबा',
      te: 'మామిడి పండ్లు',
    },
    category: 'fruits',
    icon: '🥭',
    defaultUnit: 'quintal',
    modalPrice: 5800,
    minPrice: 4200,
    maxPrice: 8500,
    qualityProfile: {
      visualTraits: ['Clean smooth skin with bloom', 'Characteristic plump shoulder shape', 'Intact pedicel', 'Absence of sap burn'],
      defectIndicators: ['Anthracnose tear-drop spots', 'Fruit fly puncture scars', 'Spongy tissue softness', 'Stem-end rot browning'],
      physicalLimits: ['Brix sugar reading', 'Internal pulp discoloration test'],
    },
  },
  {
    id: 'papaya',
    name: 'Papaya',
    localNames: {
      en: 'Papaya (Red Lady)',
      hi: 'पपीता',
      mr: 'पपई',
      te: 'బొప్పాయి',
    },
    category: 'fruits',
    icon: '🍈',
    defaultUnit: 'quintal',
    modalPrice: 2400,
    minPrice: 1800,
    maxPrice: 3200,
    qualityProfile: {
      visualTraits: ['Smooth olive green turning yellow streaks', 'Uniform pear / cylindrical shape', 'Firm resilient flesh'],
      defectIndicators: ['Sunburn blotches', 'Ring spot virus halos', 'Phomopsis fruit rot lesions', 'Bruised leaky depressions'],
      physicalLimits: ['Penetrometer skin pressure', 'Core sweetness Brix'],
    },
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    localNames: {
      en: 'Pomegranate (Bhagwa)',
      hi: 'अनार',
      mr: 'डाळिंब',
      te: 'దానిమ్మ',
    },
    category: 'fruits',
    icon: '🍎',
    defaultUnit: 'quintal',
    modalPrice: 9500,
    minPrice: 7500,
    maxPrice: 13500,
    qualityProfile: {
      visualTraits: ['Deep saffron-red glossy rind', 'Heavy weight for size', 'Prominent intact calyx crown', 'Clean surface'],
      defectIndicators: ['Bacterial blight (Telya) oily black spots', 'Fruit cracking / rifting', 'Sunscald brown patches', 'Calyx insect borers'],
      physicalLimits: ['Aril juice extraction %', 'Aril redness tint index'],
    },
  },
  {
    id: 'grapes',
    name: 'Grapes',
    localNames: {
      en: 'Grapes (Thompson / Sonaka / Sharad)',
      hi: 'अंगूर',
      mr: 'द्राक्षे',
      te: 'ద్రాక్ష పండ్లు',
    },
    category: 'fruits',
    icon: '🍇',
    defaultUnit: 'quintal',
    modalPrice: 6200,
    minPrice: 4800,
    maxPrice: 8000,
    qualityProfile: {
      visualTraits: ['Conical well-filled bunch', 'Natural whitish waxy bloom', 'Turgid berries attached firmly to pedicel', 'Fresh green rachis stem'],
      defectIndicators: ['Downy / powdery mildew dusting', 'Berry drop / shatter', 'Waterberry softening', 'Sunburn amber scorching'],
      physicalLimits: ['Brix:Acid ratio', 'Berry firmness tester'],
    },
  },
  {
    id: 'orange',
    name: 'Orange / Sweet Lime',
    localNames: {
      en: 'Orange / Sweet Lime (Mosambi)',
      hi: 'संतरा / मौसंबी',
      mr: 'संत्रे / मोसंबी',
      te: 'బత్తాయి / నారింజ',
    },
    category: 'fruits',
    icon: '🍊',
    defaultUnit: 'quintal',
    modalPrice: 3800,
    minPrice: 2800,
    maxPrice: 5000,
    qualityProfile: {
      visualTraits: ['Tight glossy rind', 'Rich green-yellow / orange color', 'Firm globular fruit', 'Healthy button calyx'],
      defectIndicators: ['Citrus canker corky lesions', 'Mite silvery russeting', 'Stem rot mold', 'Creasing / puffy loose skin'],
      physicalLimits: ['Juice volume % per fruit', 'Brix sweetness'],
    },
  },

  // COMMERCIAL
  {
    id: 'soybean',
    name: 'Soybean',
    localNames: {
      en: 'Soybean (Yellow)',
      hi: 'सोयाबीन',
      mr: 'सोयाबीन',
      te: 'సోయాబీన్',
    },
    category: 'commercial',
    icon: '🫘',
    defaultUnit: 'quintal',
    modalPrice: 4850,
    minPrice: 4500,
    maxPrice: 5300,
    qualityProfile: {
      visualTraits: ['Uniform bright yellow seed coat', 'Light clear hilum', 'Smooth spherical shape', 'Clean sample'],
      defectIndicators: ['Green immature seeds', 'Purple stain fungus', 'Splits / broken pieces', 'Weed seeds (Datura, etc.)'],
      physicalLimits: ['Oil content percentage', 'Moisture meter %', 'Free fatty acid (FFA)'],
    },
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    localNames: {
      en: 'Groundnut (Peanut in pod)',
      hi: 'मूंगफली',
      mr: 'भुईमूग',
      te: 'వేరుశనగ (పల్లీలు)',
    },
    category: 'commercial',
    icon: '🥜',
    defaultUnit: 'quintal',
    modalPrice: 6780,
    minPrice: 6377,
    maxPrice: 7400,
    qualityProfile: {
      visualTraits: ['Clean dry pods', 'Distinct reticulation veins', 'Double/triple kernel fullness', 'Bright shell color'],
      defectIndicators: ['Apergillus flavus yellow mold', 'Punctured insect pods', 'Soil-caked wet shells', 'Popped hollow pods'],
      physicalLimits: ['Shelling percentage (turnout)', 'Aflatoxin assay', 'Pod moisture %'],
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower Seed',
    localNames: {
      en: 'Sunflower Seed',
      hi: 'सूरजमुखी बीज',
      mr: 'सूर्यफूल बियाणे',
      te: 'పొద్దుతిరుగుడు గింజలు',
    },
    category: 'commercial',
    icon: '🌻',
    defaultUnit: 'quintal',
    modalPrice: 6200,
    minPrice: 5800,
    maxPrice: 6900,
    qualityProfile: {
      visualTraits: ['Black seeds with white striping', 'Heavy plump achenes', 'Dry crisp husks'],
      defectIndicators: ['Head rot mold', 'Hollow empty hulls', 'Debris and dust'],
      physicalLimits: ['Oil extraction %', 'Shell thickness'],
    },
  },
  {
    id: 'sesame',
    name: 'Sesame',
    localNames: {
      en: 'Sesame (Til)',
      hi: 'तिल (सफेद / काला)',
      mr: 'तीळ',
      te: 'నువ్వులు',
    },
    category: 'commercial',
    icon: '🌱',
    defaultUnit: 'quintal',
    modalPrice: 14200,
    minPrice: 12500,
    maxPrice: 16800,
    qualityProfile: {
      visualTraits: ['Uniform pearly white / jet black seeds', 'High purity luster', 'Absence of sandy grit'],
      defectIndicators: ['Brown discoloration', 'Insect webbing', 'Foreign weed seeds'],
      physicalLimits: ['Oil content %', 'Purity sorting machine grade'],
    },
  },
  {
    id: 'mustard',
    name: 'Mustard',
    localNames: {
      en: 'Mustard (Sarson / Rai)',
      hi: 'सरसों / राई',
      mr: 'मोहरी',
      te: 'ఆవాలు',
    },
    category: 'commercial',
    icon: '🌾',
    defaultUnit: 'quintal',
    modalPrice: 5650,
    minPrice: 5200,
    maxPrice: 6150,
    qualityProfile: {
      visualTraits: ['Uniform bold round seeds', 'Glossy dark brown / yellow skin', 'Clean free-flowing sample'],
      defectIndicators: ['Shriveled immature seeds', 'White rust powdery spores', 'Stones and sand'],
      physicalLimits: ['Erucic acid profile', 'Moisture %'],
    },
  },
  {
    id: 'cotton',
    name: 'Raw Cotton',
    localNames: {
      en: 'Raw Cotton (Kapas)',
      hi: 'कपास (नरमा)',
      mr: 'कापूस',
      te: 'పత్తి (కాటన్)',
    },
    category: 'commercial',
    icon: '☁️',
    defaultUnit: 'quintal',
    modalPrice: 7520,
    minPrice: 7122,
    maxPrice: 8300,
    qualityProfile: {
      visualTraits: ['Fluffy bright white bolls', 'Clean lint', 'High bloom', 'Dry crisp fiber touch'],
      defectIndicators: ['Yellow / grey stained lint', 'Leaf trash / bract contamination', 'Immature green seed crushed lint', 'Damp water-sprayed fibers'],
      physicalLimits: ['Staple length in mm', 'Micronaire fineness value', 'Moisture meter %'],
    },
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    localNames: {
      en: 'Sugarcane',
      hi: 'गन्ना',
      mr: 'ऊस',
      te: 'చెరకు',
    },
    category: 'commercial',
    icon: '🎋',
    defaultUnit: 'tonne',
    modalPrice: 3400, // per tonne
    minPrice: 3150,
    maxPrice: 3800,
    qualityProfile: {
      visualTraits: ['Thick solid stalks', 'Fresh cut base', 'No pithiness in inter-nodes', 'Tight leaf sheath'],
      defectIndicators: ['Red rot internal reddening', 'Early flowering pithiness', 'Stem borer holes', 'Dry dried-up tops'],
      physicalLimits: ['Sugar recovery percentage (CCS %)', 'Brix hydrometer test'],
    },
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    localNames: {
      en: 'Turmeric (Haldi)',
      hi: 'हल्दी (कच्ची / सूखी)',
      mr: 'हळद',
      te: 'పసుపు కొమ్ములు',
    },
    category: 'commercial',
    icon: '🫚',
    defaultUnit: 'quintal',
    modalPrice: 13800,
    minPrice: 11000,
    maxPrice: 16500,
    qualityProfile: {
      visualTraits: ['Deep orange-yellow interior flesh', 'Stout well-fingered rhizomes', 'Smooth polished surface', 'Aromatic pungent smell'],
      defectIndicators: ['Rhizome rot wateriness', 'Insect bore holes and frass', 'Root mold', 'Excessive mud crust'],
      physicalLimits: ['Curcumin percentage %', 'Dry recovery ratio'],
    },
  },
  {
    id: 'tobacco',
    name: 'Virginia Tobacco',
    localNames: {
      en: 'Virginia Tobacco (FCV)',
      hi: 'तंबाकू (वर्जिनिया)',
      mr: 'तंबाखू',
      te: 'పొగాకు (వర్జీనియా)',
    },
    category: 'commercial',
    icon: '🍂',
    defaultUnit: 'quintal',
    modalPrice: 19500,
    minPrice: 16500,
    maxPrice: 23000,
    qualityProfile: {
      visualTraits: ['Bright lemon-orange cured leaf color', 'Broad open pliable leaf body', 'Pleasant cured aroma', 'Clean mid-rib'],
      defectIndicators: ['Sponge / scald dark discoloration', 'Green cure blotches', 'Torn / shattered leaf lamina', 'Barn rot mold'],
      physicalLimits: ['Nicotine %', 'Reducing sugars %', 'Chloride level test'],
    },
  },
];

export const CROP_IMAGE_MAP: Record<string, string> = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  paddy: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  cotton: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
  turmeric: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  soybean: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80',
  groundnut: groundnutImg,
  sugarcane: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
  pomegranate: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800&auto=format&fit=crop&q=80',
  grapes: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80',
  orange: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&auto=format&fit=crop&q=80',
  papaya: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=800&auto=format&fit=crop&q=80',
  cauliflower: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
  cabbage: cabbageImg,
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80',
  sorghum: sorghumImg,
  pearl_millet: pearlMilletImg,
  finger_millet: fingerMilletImg,
  toor_dal: toorDalImg,
  moong: moongImg,
  urad: uradImg,
  chana: chanaImg,
  okra: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=800&auto=format&fit=crop&q=80',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80',
  ginger: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  cardamom: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
  black_pepper: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
};

export function getCropImageUrl(cropId: string): string {
  if (CROP_IMAGE_MAP[cropId]) return CROP_IMAGE_MAP[cropId];
  const cleanId = (cropId || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (CROP_IMAGE_MAP[cleanId]) return CROP_IMAGE_MAP[cleanId];
  for (const [key, url] of Object.entries(CROP_IMAGE_MAP)) {
    if (key !== 'default' && cleanId.includes(key)) return url;
  }
  return CROP_IMAGE_MAP.default;
}

// Automatically enrich CROP_DATABASE items with reliable agricultural photo URLs
CROP_DATABASE.forEach((c) => {
  if (!c.imageUrl) {
    c.imageUrl = getCropImageUrl(c.id);
  }
});

// Reusable single filtering function adhering strictly to PART 1 rules
export function filterCrops(
  crops: CropItem[],
  category: CropCategory,
  searchQuery: string
): CropItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return crops.filter((crop) => {
    // 1. Category Filter
    const matchesCategory =
      category === 'all' || crop.category === category;

    if (!matchesCategory) {
      return false;
    }

    // 2. Search Query Filter (name, english name, hindi, marathi, telugu, etc.)
    if (!normalizedQuery) {
      return true;
    }

    const nameMatch = crop.name.toLowerCase().includes(normalizedQuery);
    const enMatch = (crop.localNames.en || '').toLowerCase().includes(normalizedQuery);
    const hiMatch = (crop.localNames.hi || '').toLowerCase().includes(normalizedQuery);
    const mrMatch = (crop.localNames.mr || '').toLowerCase().includes(normalizedQuery);
    const teMatch = (crop.localNames.te || '').toLowerCase().includes(normalizedQuery);
    const taMatch = (crop.localNames.ta || '').toLowerCase().includes(normalizedQuery);
    const knMatch = (crop.localNames.kn || '').toLowerCase().includes(normalizedQuery);
    const mlMatch = (crop.localNames.ml || '').toLowerCase().includes(normalizedQuery);

    return nameMatch || enMatch || hiMatch || mrMatch || teMatch || taMatch || knMatch || mlMatch;
  });
}
