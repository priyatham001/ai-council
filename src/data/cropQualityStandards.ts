export interface QualityGradeStandard {
  grade: 'A' | 'B' | 'C';
  title: string;
  visualStandards: string[];
  maxDefectTolerance: string;
  priceImpact: string;
}

export interface CropQualityStandard {
  cropId: string;
  cropName: string;
  category: string;
  gradeA: QualityGradeStandard;
  gradeB: QualityGradeStandard;
  gradeC: QualityGradeStandard;
  rejectionDisqualifiers: string[];
  laboratoryLimits: string[];
}

export const CROP_QUALITY_STANDARDS: Record<string, CropQualityStandard> = {
  paddy: {
    cropId: 'paddy',
    cropName: 'Paddy (Dhan)',
    category: 'cereals',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Superior / Export Quality)',
      visualStandards: [
        'Golden, uniform, mature husk with unbroken grain tips',
        'Plump grains with full kernel development',
        'Absence of black-spotting, discolored kernels, or green immature grains (<1%)',
        'Clean harvest lot free from straw, weed seeds, and inorganic dirt (<0.5%)',
      ],
      maxDefectTolerance: '< 1% total defective grains',
      priceImpact: '+5% Price Premium over Mandi modal rate',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard Fair Average Quality - FAQ)',
      visualStandards: [
        'Naturally dried golden/yellow husks, standard uniform maturity',
        'Minor foreign matter (chaff, straw dust) < 2%',
        'Slight color variation, small percentage of slightly tipped grains (< 3%)',
        'Zero active mold or insect webs',
      ],
      maxDefectTolerance: '2% - 4% minor cosmetic defects',
      priceImpact: 'Standard Mandi Modal Market Rate (0% adjustment)',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Secondary / Mixed Quality)',
      visualStandards: [
        'Uneven grain maturity with noticeable green or chalky kernels (5-10%)',
        'Visible discoloration, partial weather staining, or minor insect damage marks',
        'High chaff, straw, or broken grain content (3-6%)',
        'Requires winnowing / re-cleaning prior to milling',
      ],
      maxDefectTolerance: '5% - 10% defects',
      priceImpact: '-5% Price Discount from Mandi modal rate',
    },
    rejectionDisqualifiers: [
      'Visible fungal mold, white mildew mycelium, or black grain smut',
      'Soft water-soaked rot, decaying wet grains, or foul fermentation smell',
      'Active live insect larvae or heavy weevil bore damage (>6%)',
      'High mud cake, stone, or gravel contamination (>5%)',
      'Sprouted / germinated grains from standing water damage',
    ],
    laboratoryLimits: [
      'Moisture % cannot be verified from a 2D photo (requires digital moisture meter; Agmark standard is ≤ 14%)',
      'Milling head rice recovery (turnout %) requires huller lab testing',
      'Pesticide residues & aflatoxin require chemical chromatography',
    ],
  },
  wheat: {
    cropId: 'wheat',
    cropName: 'Wheat (Gehun)',
    category: 'cereals',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Sharbati / Mill Superior)',
      visualStandards: [
        'Bold, plump amber grains with consistent glassy luster',
        'Uniform grain size and complete absence of shriveling',
        'Spotless bran coat; zero weevil holes or insect boring',
        'Completely free of dirt, foreign seeds, and chaff dust (<0.5%)',
      ],
      maxDefectTolerance: '< 1% total defects',
      priceImpact: '+5% Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (FAQ Mandi Standard)',
      visualStandards: [
        'Sound, wholesome wheat kernels with typical golden-amber hue',
        'Low broken grains (<2%), negligible foreign matter (<1.5%)',
        'Slight size variance without significant shrunken grains',
        'No weevil infestation or mold growth',
      ],
      maxDefectTolerance: '2% - 4% FAQ limits',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Secondary / Cattle Feed / Broken)',
      visualStandards: [
        'Dull, faded grain coat due to unseasonal rain exposure',
        'Noticeable broken, cracked, or shriveled grains (5-10%)',
        'Minor insect puncture spots or smut dust',
      ],
      maxDefectTolerance: '5% - 10% defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Visible black mold (Karnal bunt / fungus spores) or white powdery mildew',
      'Rotten, fermented, water-damaged blackened kernels',
      'Live insect larvae / heavy weevil bored tunnels (>5%)',
      'Sprouted kernels with decayed shoots',
      'Severe rodent dropping or chemical contamination',
    ],
    laboratoryLimits: [
      'Moisture % requires calibrated grain moisture tester (Agmark FAQ ≤ 12%)',
      'Gluten content % and protein % require laboratory spectrophotometry',
      'Sedimentation value requires laboratory test',
    ],
  },
  tomato: {
    cropId: 'tomato',
    cropName: 'Tomato',
    category: 'vegetables',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Export / Retail Table Top)',
      visualStandards: [
        'Firm, smooth skin with uniform red or breaker ripening stage',
        'Uniform spherical/oval sizing (50-70mm diameter)',
        'Intact fresh green calyx (stem crown)',
        'Completely free of blemishes, micro-cracks, or sunscald',
      ],
      maxDefectTolerance: '< 1% minor cosmetic spots',
      priceImpact: '+5% Price Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Mandi Standard / Processing)',
      visualStandards: [
        'Firm to medium-firm texture, acceptable red color coverage (>85%)',
        'Minor surface russeting or small healed superficial scars (<5% surface)',
        'Slight size variance, intact skin with no leaking juice',
        'Clean harvest without soil encrustation',
      ],
      maxDefectTolerance: '3% - 6% minor blemishes',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Local Mandi / Puree / Second Pick)',
      visualStandards: [
        'Noticeable uneven ripening (yellow shoulders / blotchy color)',
        'Visible radial growth cracks (healed, dry)',
        'Variable sizes and softer pressure firmness',
      ],
      maxDefectTolerance: '7% - 12% superficial defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Visible soft rot (watery, leaking pulp, burst skin with decay)',
      'Black rot lesions, blossom-end rot with dark decaying sunken spots',
      'White/grey mold mycelium, fungal growth on fruit surface',
      'Fruit fly larvae / worm bore holes with internal black frass',
      'Crushed, soured, fermented lot smelling of rot',
    ],
    laboratoryLimits: [
      'Brix sweetness sugar % requires digital refractometer',
      'Internal acidity (pH) requires laboratory chemical sensor',
      'Pesticide MRL compliance requires GC-MS laboratory test',
    ],
  },
  onion: {
    cropId: 'onion',
    cropName: 'Onion',
    category: 'vegetables',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Export / Nasik Grade 55mm+)',
      visualStandards: [
        'Bright, well-cured papery dry outer tunic with deep red/pink hue',
        'Tight, thin dry neck closure preventing water entry',
        'Uniform spherical shape (55mm - 70mm diameter)',
        'Firm solid texture; zero sprouting, zero double bulbs',
      ],
      maxDefectTolerance: '< 1% cosmetic flaws',
      priceImpact: '+5% Price Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard Mandi FAQ)',
      visualStandards: [
        'Sound, mature bulbs with good outer skin retention (>2 dry layers)',
        'Firm basal plate, dry neck, standard size (40mm - 55mm)',
        'Negligible skin peeling or mild soil dust (<3%)',
        'No rot or black mold at the neck',
      ],
      maxDefectTolerance: '3% - 5% minor skin peel',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Patti / Golta / Small Bulbs)',
      visualStandards: [
        'Small or uneven bulb sizing (<35mm golti onions or split doubles)',
        'Exposed fleshy scales due to detached outer papery skin',
        'Mild mechanical scratches from harvest handling',
      ],
      maxDefectTolerance: '6% - 12% minor defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Black mold fungus (Aspergillus niger) forming soot under outer scales',
      'Bacterial soft rot or slippery skin (squishy, smelly water discharge)',
      'Basal plate root rot or white mold cushions',
      'Sprouted onions with long green stalks and hollow soft centers',
      'Maggot or insect bore infestation',
    ],
    laboratoryLimits: [
      'Internal pungency / pyruvic acid requires laboratory spectrophotometer',
      'Internal dry matter % requires oven drying test',
      'Long-term storage shelf-life cannot be guaranteed from a single photo',
    ],
  },
  potato: {
    cropId: 'potato',
    cropName: 'Potato',
    category: 'vegetables',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Super Table / French Fry Grade)',
      visualStandards: [
        'Smooth, unbroken skin with clean uniform shape (oval/round)',
        'Medium-large uniform sizing (45mm - 65mm+)',
        'Shallow eyes; completely free from greening (solanine) or cuts',
        'Dry, firm surface with minimal clinging loose dry soil (<1%)',
      ],
      maxDefectTolerance: '< 1% defects',
      priceImpact: '+5% Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard Mandi FAQ)',
      visualStandards: [
        'Firm tubers with healthy natural skin color (yellow/white/red)',
        'Minor superficial skin russeting or small scabs (<3% surface)',
        'Standard uniform sorting, firm texture without soft spots',
        'Zero rot or blight lesions',
      ],
      maxDefectTolerance: '3% - 5% minor defects',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Small Seed / Chhanta)',
      visualStandards: [
        'Mixed small tubers (<35mm), irregular knobby shapes',
        'Minor mechanical harvest cuts (healed, dry)',
        'Higher clinging dry clay or surface dirt',
      ],
      maxDefectTolerance: '6% - 12% defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Bacterial soft rot (slimy, foul-smelling, liquid tuber breakdown)',
      'Late blight rot (dark brown/purple dry rot sinking into flesh)',
      'Heavy greening (>20% surface green, high toxic solanine)',
      'Sprouted shriveled tubers with rotten eyes',
      'Potato tuber moth tunnels with black frass/rot',
    ],
    laboratoryLimits: [
      'Dry matter % and specific gravity require hydrometer / lab testing',
      'Reducing sugar % (for chips/crisps) requires lab glucose test strip',
      'Internal hollow heart or black heart cannot be seen without cutting',
    ],
  },
  maize: {
    cropId: 'maize',
    cropName: 'Maize (Corn)',
    category: 'cereals',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Poultry / Starch Export)',
      visualStandards: [
        'Bright, uniform golden-yellow kernels with intact flint/dent crown',
        'Bold, fully matured kernels without shriveling',
        'Zero visible cob mold, zero weevil bore holes',
        'Clean sample without cob chaff or dust (<0.5%)',
      ],
      maxDefectTolerance: '< 1% defects',
      priceImpact: '+5% Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard FAQ Mandi)',
      visualStandards: [
        'Sound yellow kernels, natural harvest luster',
        'Low broken kernel fragments (<3%), low foreign matter (<1.5%)',
        'Uniform drying, firm texture, no insect webbing',
      ],
      maxDefectTolerance: '2% - 4% defects',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Secondary / Mixed)',
      visualStandards: [
        'Dull or mixed colored kernels with broken fractions (4-8%)',
        'Small immature or dented kernels, slight cob silk mixture',
      ],
      maxDefectTolerance: '5% - 10% defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Aspergillus flavus yellow-green mold (high aflatoxin indicator)',
      'Fusarium pink/white ear rot or black ear smut',
      'Water-damaged rotten discolored kernels with sour smell',
      'Heavy grain weevil / borer infestation (>5%)',
      'Live rodent contamination or bird damage decomposition',
    ],
    laboratoryLimits: [
      'Aflatoxin B1 level (ppb) requires ELISA or HPLC laboratory test (Agmark limit ≤ 20 ppb)',
      'Moisture % requires grain moisture meter (safe storage ≤ 13%)',
      'Starch recovery ratio requires laboratory extraction',
    ],
  },
  cotton: {
    cropId: 'cotton',
    cropName: 'Cotton (Kapas)',
    category: 'commercial',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Shankar-6 / Export Ginning)',
      visualStandards: [
        'Fluffy, bright creamy-white lint with high natural luster',
        'Well-opened bolls, long uniform staple fibers',
        'Near zero leaf trash, bract dust, or yellow staining (<1%)',
        'Clean seed attachment with dry, crisp boll formation',
      ],
      maxDefectTolerance: '< 1% trash content',
      priceImpact: '+5% Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard Mandi FAQ)',
      visualStandards: [
        'Good white to off-white lint, standard staple length',
        'Minor leaf trash or dry bract pieces (<3%)',
        'No yellow bollworm staining, dry non-sticky fibers',
      ],
      maxDefectTolerance: '2% - 4% leaf trash',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Yellow / Weathered / Rain Damaged)',
      visualStandards: [
        'Yellowish, dull greyish lint due to unseasonal rain',
        'Higher trash content (4-8% leaves, dust, unopened carpels)',
        'Slightly matted or compressed lint structure',
      ],
      maxDefectTolerance: '5% - 9% defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Black fungal mold or mildew on damp lint',
      'Pink bollworm or American bollworm active rot in locks',
      'Water-soaked, rotting, fermenting cotton bales or heaps',
      'Contamination with motor oil, chemical grease, or synthetic fibers',
      'High mud cake or stones (>5%)',
    ],
    laboratoryLimits: [
      'Micronaire (fiber fineness) requires airflow lab tester',
      'Staple length (28-32mm) & fiber strength (g/tex) require HVI laboratory testing',
      'Moisture % requires capacitive moisture probe (standard ≤ 8-9%)',
    ],
  },
  soybean: {
    cropId: 'soybean',
    cropName: 'Soybean',
    category: 'pulses',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Yellow Bold / Oil Processing)',
      visualStandards: [
        'Bright, uniform yellow spherical seeds with light hilum',
        'Plump, smooth seed coat without wrinkling or green seeds (<1%)',
        'Completely free from split seeds, weed seeds, or dirt (<0.5%)',
        'Clean harvest lot, high seed integrity',
      ],
      maxDefectTolerance: '< 1% defects',
      priceImpact: '+5% Premium',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard FAQ Mandi)',
      visualStandards: [
        'Sound yellow seeds with healthy appearance',
        'Low broken/split seeds (<3%), negligible pod trash (<1.5%)',
        'Small percentage of green or immature seeds (<2%)',
        'Zero mold, zero insect holes',
      ],
      maxDefectTolerance: '2% - 4% defects',
      priceImpact: 'Standard Modal Rate',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Secondary / Mixed Seeds)',
      visualStandards: [
        'Dull, mottled seed coats (weather damaged)',
        'Noticeable split or cracked seeds (4-8%)',
        'Immature green or shriveled seeds (3-6%)',
      ],
      maxDefectTolerance: '5% - 10% defects',
      priceImpact: '-5% Discount',
    },
    rejectionDisqualifiers: [
      'Purple seed stain or fungal mold (Cercospora kikuchii) infection',
      'Rotten, blackened, fermented water-damaged seeds',
      'Severe insect damage / pod borer bore tunnels (>5%)',
      'Sprouted seeds or rancid decomposition smell',
      'Excessive mud balls or gravel (>4%)',
    ],
    laboratoryLimits: [
      'Oil content % (18-20% benchmark) requires Soxhlet / NIR lab testing',
      'Protein % (38-40%) requires Kjeldahl laboratory nitrogen analysis',
      'Moisture % requires calibrated grain moisture tester (safe ≤ 12%)',
    ],
  },
};

// Generic benchmark for any crop not explicitly indexed in CROP_QUALITY_STANDARDS
export function getCropQualityStandard(cropIdOrName: string, category?: string): CropQualityStandard {
  const normalizedKey = cropIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  // Look for direct match
  for (const [key, standard] of Object.entries(CROP_QUALITY_STANDARDS)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return standard;
    }
  }

  // Generic fallback standard
  return {
    cropId: normalizedKey,
    cropName: cropIdOrName,
    category: category || 'agricultural',
    gradeA: {
      grade: 'A',
      title: 'Grade A (Superior / Export Quality)',
      visualStandards: [
        'Uniform characteristic color and natural luster for ' + cropIdOrName,
        'Uniform sizing, mature shape, and intact protective skin / husk',
        'Complete freedom from insect damage, blemishes, or discoloration (<1%)',
        'Clean produce without dirt, stones, foreign leaves, or weeds (<0.5%)',
      ],
      maxDefectTolerance: '< 1% total defective units',
      priceImpact: '+5% Price Premium over Mandi modal rate',
    },
    gradeB: {
      grade: 'B',
      title: 'Grade B (Standard Fair Average Quality - FAQ)',
      visualStandards: [
        'Sound, wholesome harvest sample meeting Mandi trading standards',
        'Minor cosmetic surface variation or small blemishes (<4%)',
        'Uniform harvest maturity without active rot or mold',
        'Low foreign impurities (<2%)',
      ],
      maxDefectTolerance: '2% - 4% minor blemishes',
      priceImpact: 'Standard Mandi Modal Market Rate (0% adjustment)',
    },
    gradeC: {
      grade: 'C',
      title: 'Grade C (Secondary / Mixed Quality)',
      visualStandards: [
        'Visible size and color variation, minor weather markings',
        'Noticeable superficial defects, broken pieces, or discoloration (5-10%)',
        'Requires sorting, grading, or re-cleaning prior to final sale',
      ],
      maxDefectTolerance: '5% - 10% defects',
      priceImpact: '-5% Price Discount from Mandi modal rate',
    },
    rejectionDisqualifiers: [
      'Visible fungal mold, white mildew mycelium, or black spore rot',
      'Soft water-soaked rot, decaying wet pulp, or foul decomposition odor',
      'Active live insect larvae or heavy bore hole damage (>5%)',
      'Severe unseasonal standing water damage, fermentation, or sprouted decay',
      'High foreign contamination (stones, gravel, chemical residue, animal waste)',
    ],
    laboratoryLimits: [
      'Exact moisture percentage cannot be verified from a 2D photograph (requires calibrated moisture meter)',
      'Internal chemical composition (oil %, sugar Brix, gluten, protein) requires physical laboratory instruments',
      'Pesticide MRLs, microbial toxins, and aflatoxin require chemical chromatography / ELISA testing',
    ],
  };
}
