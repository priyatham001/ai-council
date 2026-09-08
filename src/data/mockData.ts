import { 
  Student, 
  AcademicRecord, 
  AttendanceRecord, 
  GalleryPhoto, 
  AchievementBadge, 
  TeacherRemark, 
  Announcement, 
  SchoolEvent, 
  ProgramInfo, 
  TeacherProfile 
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-aarav-01',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2020-04-14',
    age: '5 Years 2 Months',
    class: 'UKG',
    section: 'A - Sunshine',
    rollNo: 'UKG-A-12',
    academicYear: '2025 - 2026',
    bloodGroup: 'O+',
    allergies: 'Mild dust sensitivity, No food allergies',
    emergencyContact: '+91 98765 43210 (Mother)',
    parentName: 'Anita Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'anita.sharma@example.com',
    address: 'Flat 402, Lotus Orchid, Palm Avenue, Sector 14',
    teacherName: 'Ms. Priya Deshmukh',
    teacherId: 'teach-priya-01',
    attendanceRate: 94.2,
    overallScore: 88,
    dailyStatus: {
      mood: 'Joyful & Eager to Learn 🌟',
      snack: 'Finished apple slices & milk 🍎🥛',
      nap: 'Rested peacefully for 45 mins 😴',
      activity: 'Painted a colorful rainbow and led story-circle! 🎨📖',
      updatedAt: 'Today at 2:15 PM'
    }
  },
  {
    id: 'stud-ananya-02',
    name: 'Ananya Verma',
    avatar: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2020-07-22',
    age: '4 Years 11 Months',
    class: 'UKG',
    section: 'A - Sunshine',
    rollNo: 'UKG-A-04',
    academicYear: '2025 - 2026',
    bloodGroup: 'B+',
    allergies: 'None',
    emergencyContact: '+91 98123 45678',
    parentName: 'Vikram Verma',
    parentPhone: '+91 98123 45678',
    parentEmail: 'vikram.verma@example.com',
    address: 'B-12, Green Glen Villas, Sector 18',
    teacherName: 'Ms. Priya Deshmukh',
    teacherId: 'teach-priya-01',
    attendanceRate: 96.5,
    overallScore: 92,
    dailyStatus: {
      mood: 'Super Creative 🎨',
      snack: 'Finished vegetable sandwich 🥪',
      nap: '30 mins calm reading',
      activity: 'Built a 10-block castle with Aarav!',
      updatedAt: 'Today at 2:00 PM'
    }
  },
  {
    id: 'stud-kabir-03',
    name: 'Kabir Mehta',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2020-02-18',
    age: '5 Years 4 Months',
    class: 'UKG',
    section: 'A - Sunshine',
    rollNo: 'UKG-A-08',
    academicYear: '2025 - 2026',
    bloodGroup: 'A+',
    allergies: 'Peanut allergy',
    emergencyContact: '+91 99887 66554',
    parentName: 'Sanjay Mehta',
    parentPhone: '+91 99887 66554',
    parentEmail: 'sanjay.mehta@example.com',
    address: 'Villa 7, Hillview Enclave',
    teacherName: 'Ms. Priya Deshmukh',
    teacherId: 'teach-priya-01',
    attendanceRate: 91.0,
    overallScore: 85,
    dailyStatus: {
      mood: 'Active & Energetic ⚡',
      snack: 'Fruit bowl completed 🍌',
      nap: 'Rest period completed',
      activity: 'Won the mini obstacle relay race! 🏃',
      updatedAt: 'Today at 2:20 PM'
    }
  },
  {
    id: 'stud-meera-04',
    name: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2020-09-05',
    age: '4 Years 9 Months',
    class: 'UKG',
    section: 'A - Sunshine',
    rollNo: 'UKG-A-16',
    academicYear: '2025 - 2026',
    bloodGroup: 'AB+',
    allergies: 'None',
    emergencyContact: '+91 97711 22334',
    parentName: 'Neha Patel',
    parentPhone: '+91 97711 22334',
    parentEmail: 'neha.patel@example.com',
    address: 'A-304, Marvel Heights',
    teacherName: 'Ms. Priya Deshmukh',
    teacherId: 'teach-priya-01',
    attendanceRate: 98.0,
    overallScore: 94,
    dailyStatus: {
      mood: 'Singing & Cheerful 🎵',
      snack: 'Poha and papaya bowl 🥣',
      nap: 'Refreshed after 40 mins nap',
      activity: 'Recited English poem with actions! 🌟',
      updatedAt: 'Today at 2:10 PM'
    }
  },
  {
    id: 'stud-rohan-05',
    name: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2020-05-11',
    age: '5 Years 1 Month',
    class: 'UKG',
    section: 'A - Sunshine',
    rollNo: 'UKG-A-19',
    academicYear: '2025 - 2026',
    bloodGroup: 'O-',
    allergies: 'None',
    emergencyContact: '+91 96655 44332',
    parentName: 'Deepak Gupta',
    parentPhone: '+91 96655 44332',
    parentEmail: 'deepak.gupta@example.com',
    address: 'C-101, Silver Springs, Sector 21',
    teacherName: 'Ms. Priya Deshmukh',
    teacherId: 'teach-priya-01',
    attendanceRate: 88.5,
    overallScore: 81,
    dailyStatus: {
      mood: 'Curious & Inquisitive 🔬',
      snack: 'Ate pancakes and honey 🥞',
      nap: 'Rest time observed',
      activity: 'Plant germination experiment observation 🌱',
      updatedAt: 'Today at 2:05 PM'
    }
  }
];

export const INITIAL_ACADEMIC_RECORDS: Record<string, AcademicRecord> = {
  'stud-aarav-01': {
    studentId: 'stud-aarav-01',
    term: 'Term 1 Evaluation (2025-2026)',
    overallScore: 88,
    overallGrade: 'A+ (Excellent Explorer)',
    subjects: [
      {
        id: 'eng',
        subject: 'English & Phonics',
        icon: 'BookOpen',
        color: 'from-amber-400 to-orange-400',
        score: 88,
        previousScore: 82,
        grade: 'A+',
        skills: [
          { name: 'Letter Sound Recognition (A-Z)', status: 'Mastered' },
          { name: 'Sight Word Flashcards', status: 'Mastered' },
          { name: 'Three-letter CVC Blending', status: 'Developing' },
          { name: 'Listening & Rhyme Comprehension', status: 'Mastered' }
        ],
        teacherFeedback: 'Aarav has shown outstanding enthusiasm in our daily phonics games and loves enacting stories!'
      },
      {
        id: 'math',
        subject: 'Early Mathematics & Logic',
        icon: 'Binary',
        color: 'from-blue-400 to-cyan-400',
        score: 84,
        previousScore: 78,
        grade: 'A',
        skills: [
          { name: 'Number Counting (1 to 50)', status: 'Mastered' },
          { name: 'Shape Identification (2D & 3D)', status: 'Mastered' },
          { name: 'Pattern Sequencing & Sorting', status: 'Developing' },
          { name: 'Simple Additive Grouping with Blocks', status: 'Developing' }
        ],
        teacherFeedback: 'Understands mathematical concepts very quickly when working with tangible abacus and wooden blocks.'
      },
      {
        id: 'evs',
        subject: 'Environmental Discovery (EVS)',
        icon: 'Leaf',
        color: 'from-emerald-400 to-teal-400',
        score: 92,
        previousScore: 86,
        grade: 'A+',
        skills: [
          { name: 'Animal Habitats & Sounds', status: 'Mastered' },
          { name: 'Plant Parts & Sunshine Cycle', status: 'Mastered' },
          { name: 'Weather & Seasons Recognition', status: 'Mastered' },
          { name: 'Cleanliness & Healthy Habits', status: 'Mastered' }
        ],
        teacherFeedback: 'Aarav is our little junior naturalist! He was fascinated during our butterfly garden observation session.'
      },
      {
        id: 'art',
        subject: 'Creative Arts & Expression',
        icon: 'Palette',
        color: 'from-pink-400 to-rose-400',
        score: 95,
        previousScore: 90,
        grade: 'A+ (Star Artist)',
        skills: [
          { name: 'Color Blending & Finger Painting', status: 'Mastered' },
          { name: 'Play-Dough & Clay Sculpting', status: 'Mastered' },
          { name: 'Safety Scissor Craft & Cutting', status: 'Mastered' },
          { name: 'Origami & Paper Folding', status: 'Developing' }
        ],
        teacherFeedback: 'Shows exceptional color sense and patience when working on canvas and collage crafts.'
      },
      {
        id: 'comm',
        subject: 'Communication & Expression',
        icon: 'MessageCircleHeart',
        color: 'from-purple-400 to-indigo-400',
        score: 90,
        previousScore: 84,
        grade: 'A+',
        skills: [
          { name: 'Expressing Needs in Full Sentences', status: 'Mastered' },
          { name: 'Show & Tell Presentation', status: 'Mastered' },
          { name: 'Vocabulary Expansion', status: 'Developing' },
          { name: 'Interactive Dialogue with Peers', status: 'Mastered' }
        ],
        teacherFeedback: 'Aarav articulates his thoughts with great confidence and asks brilliant, curious questions.'
      },
      {
        id: 'social',
        subject: 'Social & Emotional Skills',
        icon: 'Smile',
        color: 'from-yellow-400 to-amber-500',
        score: 94,
        previousScore: 90,
        grade: 'A+',
        skills: [
          { name: 'Sharing Toys & Taking Turns', status: 'Mastered' },
          { name: 'Empathy Towards Classmates', status: 'Mastered' },
          { name: 'Tidying Up After Playtime', status: 'Mastered' },
          { name: 'Following Classroom Routines', status: 'Mastered' }
        ],
        teacherFeedback: 'A gentle, caring friend to all his classmates. Always willing to help a friend pick up fallen crayons.'
      },
      {
        id: 'motor',
        subject: 'Physical & Motor Skills',
        icon: 'Activity',
        color: 'from-teal-400 to-cyan-500',
        score: 89,
        previousScore: 85,
        grade: 'A',
        skills: [
          { name: 'Gross Motor (Hopping, Balancing, Catching)', status: 'Mastered' },
          { name: 'Pencil Tripod Grip Development', status: 'Developing' },
          { name: 'Bead Stringing & Buttoning', status: 'Mastered' },
          { name: 'Kid Yoga & Rhythm Gymnastics', status: 'Mastered' }
        ],
        teacherFeedback: 'Great agility during outdoor playground hours. Working gently on refining pencil grip.'
      }
    ],
    strengths: [
      'Incredible creative imagination & vivid color choices in art',
      'Naturally empathetic, comforting peers when they are upset',
      'Strong grasp of alphabet phonetics and expressive storytelling',
      'Curious scientific mind regarding nature and living things'
    ],
    areasForImprovement: [
      'Gentle reinforcement on tripod pencil grip during handwriting time',
      'Encourage patience during independent 2-step craft instructions',
      'Practicing number sequence from 40 to 50 with abacus games at home'
    ],
    generalRemarks: 'Aarav is a radiant spark of joy in our Sunshine UKG classroom! He arrives with a bright smile every morning, enthusiastically leads circle time songs, and displays genuine love for learning new concepts.',
    updatedAt: '2026-08-10'
  }
};

export const INITIAL_ATTENDANCE: Record<string, AttendanceRecord> = {
  'stud-aarav-01': {
    studentId: 'stud-aarav-01',
    totalDays: 86,
    presentDays: 81,
    absentDays: 5,
    holidayDays: 14,
    percentage: 94.2,
    history: [
      { date: '2026-08-01', status: 'present' },
      { date: '2026-08-02', status: 'holiday', note: 'Sunday Weekend' },
      { date: '2026-08-03', status: 'present' },
      { date: '2026-08-04', status: 'present' },
      { date: '2026-08-05', status: 'present', note: 'Water Splash Fun Day' },
      { date: '2026-08-06', status: 'present' },
      { date: '2026-08-07', status: 'present' },
      { date: '2026-08-08', status: 'holiday', note: 'Second Saturday' },
      { date: '2026-08-09', status: 'holiday', note: 'Sunday Weekend' },
      { date: '2026-08-10', status: 'present' },
      { date: '2026-08-11', status: 'absent', note: 'Mild cold - Leave approved' },
      { date: '2026-08-12', status: 'present' },
      { date: '2026-08-13', status: 'present' },
      { date: '2026-08-14', status: 'present', note: 'Tricolor Craft Celebration' },
      { date: '2026-08-15', status: 'holiday', note: 'Independence Day Celebrations' },
      { date: '2026-08-16', status: 'holiday', note: 'Sunday Weekend' },
      { date: '2026-08-17', status: 'present' },
      { date: '2026-08-18', status: 'present' },
      { date: '2026-08-19', status: 'present' },
      { date: '2026-08-20', status: 'present' }
    ]
  }
};

export const INITIAL_ACHIEVEMENTS: Record<string, AchievementBadge[]> = {
  'stud-aarav-01': [
    {
      id: 'ach-01',
      title: 'Star of the Week',
      category: 'Overall Excellence',
      icon: 'Award',
      badgeEmoji: '⭐',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Awarded for showing exemplary kindness and leading the morning prayer circle.',
      awardedDate: 'August 08, 2026',
      awardedBy: 'Ms. Priya Deshmukh'
    },
    {
      id: 'ach-02',
      title: 'Creative Artist Champion',
      category: 'Art & Craft',
      icon: 'Palette',
      badgeEmoji: '🎨',
      color: 'bg-pink-100 text-pink-800 border-pink-300',
      description: 'Created the most colorful textured paper rainbow during Monsoon Art Week!',
      awardedDate: 'July 28, 2026',
      awardedBy: 'Ms. Clara D’souza'
    },
    {
      id: 'ach-03',
      title: 'Reading Star & Phonics Pro',
      category: 'Language Skills',
      icon: 'BookOpen',
      badgeEmoji: '📚',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Mastered 30 sight words and read aloud the "Curious Caterpillar" story.',
      awardedDate: 'July 15, 2026',
      awardedBy: 'Ms. Priya Deshmukh'
    },
    {
      id: 'ach-04',
      title: 'Helpful Friend Award',
      category: 'Social Values',
      icon: 'HeartHandshake',
      badgeEmoji: '🤝',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Volunteered to help classmates organize play blocks during free play hour.',
      awardedDate: 'June 30, 2026',
      awardedBy: 'Ms. Priya Deshmukh'
    },
    {
      id: 'ach-05',
      title: 'Clean Plate Super Hero',
      category: 'Health & Nutrition',
      icon: 'Sparkles',
      badgeEmoji: '🥦',
      color: 'bg-lime-100 text-lime-800 border-lime-300',
      description: 'Finished all green veggies and fruit snack bowls without fuss for two consecutive weeks!',
      awardedDate: 'June 18, 2026',
      awardedBy: 'School Nutrition Team'
    },
    {
      id: 'ach-06',
      title: 'Little Melody Maker',
      category: 'Music & Movement',
      icon: 'Music',
      badgeEmoji: '🎵',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Played the xylophone rhythm perfectly during the Jungle Beats concert.',
      awardedDate: 'May 20, 2026',
      awardedBy: 'Mr. David (Music Coach)'
    }
  ]
};

export const INITIAL_TEACHER_REMARKS: TeacherRemark[] = [
  {
    id: 'rem-01',
    studentId: 'stud-aarav-01',
    studentName: 'Aarav Sharma',
    teacherId: 'teach-priya-01',
    teacherName: 'Ms. Priya Deshmukh',
    date: 'August 14, 2026',
    category: 'Art & Creativity',
    tag: 'Independence Day Craft',
    badge: '🎨 Creative Spark',
    remark: 'Aarav was so engrossed in making his tricolor pinwheel today! He carefully folded each petal and helped Kabir glue his center button. Truly wonderful collaboration.',
    parentNote: 'Thank you so much Ms. Priya! Aarav proudly pinned the wheel to his study desk at home. 😊',
    createdAt: '2026-08-14T14:30:00Z'
  },
  {
    id: 'rem-02',
    studentId: 'stud-aarav-01',
    studentName: 'Aarav Sharma',
    teacherId: 'teach-priya-01',
    teacherName: 'Ms. Priya Deshmukh',
    date: 'August 10, 2026',
    category: 'Reading & Phonics',
    tag: 'Phonics Story Time',
    badge: '📚 Fluent Reader',
    remark: 'Aarav recognized all the "sh" and "ch" sound words in our puppet story session today. He stood up in front of class and pronounced "Ship" and "Cherry" with great diction.',
    createdAt: '2026-08-10T15:00:00Z'
  },
  {
    id: 'rem-03',
    studentId: 'stud-aarav-01',
    studentName: 'Aarav Sharma',
    teacherId: 'teach-priya-01',
    teacherName: 'Ms. Priya Deshmukh',
    date: 'August 05, 2026',
    category: 'Motor Skills',
    tag: 'Water Splash Fun',
    badge: '🏊 Joyful Spirit',
    remark: 'Had a wonderful time during the sensory water table games! Showed great physical balance while walking across the floating stepping stones.',
    parentNote: 'He talked about the floating bubbles the entire evening!',
    createdAt: '2026-08-05T13:45:00Z'
  },
  {
    id: 'rem-04',
    studentId: 'stud-aarav-01',
    studentName: 'Aarav Sharma',
    teacherId: 'teach-priya-01',
    teacherName: 'Ms. Priya Deshmukh',
    date: 'July 29, 2026',
    category: 'Social Sharing',
    tag: 'Sharing is Caring',
    badge: '🤝 Golden Heart',
    remark: 'During free clay play, Meera had run out of blue clay. Aarav happily sliced half of his clay block and gave it to her with a sweet smile.',
    createdAt: '2026-07-29T14:10:00Z'
  }
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-01',
    title: 'Clay Sculpting & Little Pottery Day',
    url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop&q=80',
    category: 'Art & Craft',
    date: 'August 12, 2026',
    description: 'UKG Sunshine kids molding miniature birds and colorful fruit bowls out of organic clay.',
    studentIds: ['stud-aarav-01', 'stud-ananya-02', 'stud-kabir-03'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Priya'
  },
  {
    id: 'gal-02',
    title: 'Outdoor Mini Olympics & Obstacle Course',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    category: 'Sports',
    date: 'August 07, 2026',
    description: 'Exciting beam balance, sack jump, and hula-hoop fun under the morning sunshine.',
    studentIds: ['stud-aarav-01', 'stud-meera-04', 'stud-rohan-05'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Coach David'
  },
  {
    id: 'gal-03',
    title: 'Storybook Puppet Theatre & Phonics Fun',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    category: 'Classroom',
    date: 'August 03, 2026',
    description: 'Interactive storytelling with soft hand puppets: "The Brave Little Fox".',
    studentIds: ['stud-aarav-01', 'stud-ananya-02'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Priya'
  },
  {
    id: 'gal-04',
    title: 'Annual Monsoon Splash Day',
    url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop&q=80',
    category: 'Activities',
    date: 'July 25, 2026',
    description: 'Safe shallow splash pool games, bubble machines, and rain dance fun in the shaded play lawn.',
    studentIds: ['stud-aarav-01', 'stud-kabir-03', 'stud-meera-04'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Clara'
  },
  {
    id: 'gal-05',
    title: 'Little Farmers Organic Garden Visit',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
    category: 'Field Trips',
    date: 'July 18, 2026',
    description: 'Learning where our food comes from: picking organic cherry tomatoes and watering herb patches.',
    studentIds: ['stud-aarav-01', 'stud-ananya-02', 'stud-rohan-05'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Priya'
  },
  {
    id: 'gal-06',
    title: 'Color Carnival & Rainbow Face Painting',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    category: 'Celebrations',
    date: 'July 10, 2026',
    description: 'Non-toxic sparkling face art, colorful party hats, and joyous dance circle with teachers.',
    studentIds: ['stud-aarav-01', 'stud-meera-04'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Clara'
  },
  {
    id: 'gal-07',
    title: 'STEM Curiosity Lab & Magnet Magic',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    category: 'Activities',
    date: 'June 26, 2026',
    description: 'Exploring magnetism, floating vs sinking experiments with water bins and geometric blocks.',
    studentIds: ['stud-aarav-01', 'stud-kabir-03'],
    isPublic: true,
    classTag: 'UKG - A',
    uploadedBy: 'Ms. Priya'
  },
  {
    id: 'gal-08',
    title: 'Grandparents Day Warm Smiles & Hugs',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    category: 'School Events',
    date: 'June 15, 2026',
    description: 'A heartwarming morning with grandparents enjoying special handmade cards and sweet treats.',
    studentIds: ['stud-aarav-01', 'stud-ananya-02', 'stud-meera-04', 'stud-rohan-05'],
    isPublic: true,
    classTag: 'All Classes',
    uploadedBy: 'Principal Office'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Independence Day Cultural Dress & Flag Hoisting',
    date: 'August 13, 2026',
    category: 'Celebration',
    priority: 'Urgent',
    targetClass: 'All Classes',
    author: 'Principal Office',
    content: 'Dear Parents, please send your little ones in traditional Indian attire or tricolor shades (Saffron, White, or Green) on Friday, August 15. The celebration starts at 9:00 AM sharp followed by sweets distribution and cultural dance.',
    read: false
  },
  {
    id: 'ann-02',
    title: 'Term 1 Parent-Teacher Interaction (PTM) Schedule',
    date: 'August 08, 2026',
    category: 'PTM',
    priority: 'High',
    targetClass: 'UKG - A',
    author: 'Ms. Priya Deshmukh',
    content: 'Term 1 individual one-on-one progress discussions will be held on Saturday, August 23rd from 9:30 AM to 1:00 PM. Please book your preferred 15-minute slot in the portal. We will review your child’s development portfolio and art folder.',
    read: false
  },
  {
    id: 'ann-03',
    title: 'Monsoon Health & Hygiene Advisory',
    date: 'July 30, 2026',
    category: 'Health & Safety',
    priority: 'Normal',
    targetClass: 'All Classes',
    author: 'School Medical Care Team',
    content: 'With the rainy season active, please ensure your child carries a spare set of labeled clothes, socks, and an umbrella/raincoat. Fresh boiled water is served in school and campus is fogged daily against mosquitoes.',
    read: true
  },
  {
    id: 'ann-04',
    title: 'Upcoming Nature Farm & Butterfly Sanctuary Visit',
    date: 'July 20, 2026',
    category: 'Event',
    priority: 'Normal',
    targetClass: 'UKG & LKG',
    author: 'Event Coordinator',
    content: 'Our annual field trip to Green Meadows Eco Farm is scheduled for Friday, Sept 05. AC bus transit, child seat harnesses, teacher supervision (1:4 ratio), and wholesome meals are fully included.',
    read: true
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-01',
    title: 'Grand Independence Day Fiesta 🇮🇳',
    date: 'August 15, 2026',
    time: '9:00 AM - 11:30 AM',
    location: 'Main School Amphitheatre & Lawn',
    category: 'Celebration',
    description: 'Patriotic rhymes by Playgroup and Nursery, Tricolor dance showcase by UKG Sunshine, and flag hoisting with parents & grandparents.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    highlights: ['Kids Costume Parade', 'Tricolor Art Gallery', 'Special Organic Refreshments', 'Family Photo Booth'],
    rsvpRequired: true,
    userRsvp: 'Attending'
  },
  {
    id: 'evt-02',
    title: 'Term 1 Parent-Teacher Meeting (PTM)',
    date: 'August 23, 2026',
    time: '9:30 AM - 1:00 PM',
    location: 'Respective Classrooms',
    category: 'Meeting',
    description: 'Personalized 1-on-1 discussion with class teachers regarding cognitive progress, emotional bonding, and milestone checklists.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    highlights: ['Individual Progress Portfolios', 'Handmade Art Folder Handover', 'Growth & Diet Chart Review'],
    rsvpRequired: true,
    userRsvp: 'Attending'
  },
  {
    id: 'evt-03',
    title: 'Little Explorers Eco-Farm & Butterfly Excursion',
    date: 'September 05, 2026',
    time: '8:30 AM - 2:00 PM',
    location: 'Green Meadows Eco Farm, Valley Road',
    category: 'Excursion',
    description: 'A sensory journey through butterfly gardens, rabbit petting enclosures, and safe child-friendly organic vegetable picking.',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
    highlights: ['Petting Zoo Experience', 'Butterfly Cocoon Watching', 'Farm-to-Plate Snack Time', 'Full Medical Escort'],
    rsvpRequired: true,
    userRsvp: 'Attending'
  },
  {
    id: 'evt-04',
    title: 'K for Kidz Annual Sports Carnival 🏅',
    date: 'October 10, 2026',
    time: '8:00 AM - 12:30 PM',
    location: 'K for Kidz Sports Arena',
    category: 'Sports',
    description: 'Fun-filled non-competitive games designed for motor skill celebration, animal walks, tricycle sprint, and parent-child piggyback race!',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    highlights: ['Tricycle Derby', 'Soft Bean Bag Toss', 'Parent-Kid Relay', 'Gold Medals for Every Child'],
    rsvpRequired: true
  }
];

export const SCHOOL_PROGRAMS: ProgramInfo[] = [
  {
    id: 'prog-playgroup',
    title: 'Toddler Playgroup',
    ageGroup: '1.5 - 2.5 Years',
    timings: '9:00 AM - 11:30 AM',
    ratio: '1 : 5 Caregiver Ratio',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    bgGradient: 'from-pink-50 to-rose-50 border-pink-200',
    emoji: '🧸',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=600&auto=format&fit=crop&q=80',
    description: 'Gentle transition from home to school through sensory play, musical rhymes, tactile discovery, and separation comfort.',
    features: [
      'Sensory sand & water exploration',
      'Circle time rhymes & language stimulation',
      'Toilet training & self-feeding encouragement',
      'Soft-fall cushioned play zones'
    ]
  },
  {
    id: 'prog-nursery',
    title: 'Nursery (Early Explorers)',
    ageGroup: '2.5 - 3.5 Years',
    timings: '8:45 AM - 12:00 PM',
    ratio: '1 : 7 Teacher Ratio',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgGradient: 'from-amber-50 to-orange-50 border-amber-200',
    emoji: '🎨',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=80',
    description: 'Igniting curiosity with phonics readiness, color recognition, finger gym, and structured social interaction.',
    features: [
      'Jolly Phonics foundation sounds',
      'Fine motor finger gym (clay & threading)',
      'Theme-based curiosity tables',
      'Daily story drama & puppet play'
    ]
  },
  {
    id: 'prog-lkg',
    title: 'Junior KG (LKG)',
    ageGroup: '3.5 - 4.5 Years',
    timings: '8:30 AM - 12:30 PM',
    ratio: '1 : 8 Teacher Ratio',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200',
    emoji: '🚀',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
    description: 'Building strong reading, writing, mathematical concepts, and scientific wonder through hands-on STEM experiments.',
    features: [
      'Pre-math counting & abacus logic',
      'Pattern writing & pencil grip mastery',
      'Junior STEM & Nature discovery',
      'Bilingual conversational confidence'
    ]
  },
  {
    id: 'prog-ukg',
    title: 'Senior KG (UKG - Grade Prep)',
    ageGroup: '4.5 - 5.5 Years',
    timings: '8:30 AM - 1:00 PM',
    ratio: '1 : 8 Teacher Ratio',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgGradient: 'from-blue-50 to-indigo-50 border-blue-200',
    emoji: '🌟',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive school readiness program focusing on sentence reading, math problem solving, and leadership.',
    features: [
      'Independent reading & creative journaling',
      'Addition, subtraction & money concepts',
      'Public speaking & Show-and-Tell',
      'Smooth primary school admission prep'
    ]
  },
  {
    id: 'prog-daycare',
    title: 'Day Care & After-School Club',
    ageGroup: '1.5 - 8 Years',
    timings: '12:30 PM - 6:30 PM',
    ratio: '1 : 6 Caregiver Ratio',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    bgGradient: 'from-purple-50 to-pink-50 border-purple-200',
    emoji: '🏡',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    description: 'A cozy home-away-from-home offering nutritious warm meals, peaceful naps, homework support, and enrichment hobbies.',
    features: [
      'Freshly prepared nutritionist-approved snacks',
      'Peaceful air-conditioned nap pods',
      'Taekwondo, Western dance & Chess clubs',
      'Homework supervision & reading time'
    ]
  }
];

export const TEACHER_PROFILES: TeacherProfile[] = [
  {
    id: 'teach-priya-01',
    name: 'Ms. Priya Deshmukh',
    role: 'Lead UKG Educator & Curriculum Head',
    assignedClass: 'UKG - A (Sunshine)',
    qualification: 'M.A. Early Childhood Education, Montessori Certified (AMI)',
    experience: '8+ Years in Preschool Pedagogy',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Priya believes that every child has a unique rhythm of wonder. She specializes in phonics storytelling and positive emotional guidance.',
    favoriteQuote: '“Children learn best when they feel deeply loved, respected, and heard.”',
    badges: ['⭐ Best Educator Award 2025', '📚 Phonics Specialist', '🎨 Creative Mind']
  },
  {
    id: 'teach-clara-02',
    name: 'Ms. Clara D’souza',
    role: 'Nursery Lead & Visual Arts Specialist',
    assignedClass: 'Nursery - Blossoms',
    qualification: 'B.Ed in Primary Education, Fine Arts Diploma',
    experience: '6+ Years Experience',
    photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80',
    bio: 'Clara turns every lesson into a sensory masterpiece. She loves transforming simple cardboard boxes into magical pirate ships and fairy gardens.',
    favoriteQuote: '“Art is not what you see, but what you inspire little eyes to explore.”',
    badges: ['🎨 Art Maestro', '🌱 Sensory Play Lead', '💖 Caring Heart']
  },
  {
    id: 'teach-aaradhya-03',
    name: 'Ms. Aaradhya Nair',
    role: 'Playgroup & Toddler Care Specialist',
    assignedClass: 'Playgroup - Little Angels',
    qualification: 'Diploma in Child Psychology & Infant Care',
    experience: '5+ Years in Toddler Nurturing',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    bio: 'Gentle, patient, and smiling, Aaradhya ensures zero tears during the first week of preschool and specializes in speech development.',
    favoriteQuote: '“Small steps today lead to mighty journeys tomorrow.”',
    badges: ['🧸 Toddler Whisperer', '🎵 Music & Rhymes', '🛡️ First-Aid Certified']
  },
  {
    id: 'teach-david-04',
    name: 'Mr. David Fernandez',
    role: 'Physical Fitness & Movement Coach',
    assignedClass: 'All Classes (Physical Ed & Motor Play)',
    qualification: 'B.P.Ed, Certified Junior Gymnastics & Yoga Trainer',
    experience: '7+ Years Experience',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'David brings unmatched energy with kid-friendly obstacle courses, balance drills, animal yoga poses, and joyful relay games.',
    favoriteQuote: '“A healthy, agile body nurtures a vibrant, joyful mind!”',
    badges: ['🏅 Sports Lead', '🤸 Kid Yoga Master', '🌟 High Energy']
  }
];

export const PARENT_TESTIMONIALS = [
  {
    id: 't-1',
    parentName: 'Anita Sharma',
    childName: 'Aarav (UKG - A)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Enrolling Aarav at K for Kidz was the single best decision we made for his early formative years. The live parent dashboard keeps me connected to his daily meals, nap times, and phonics achievements. Ms. Priya treats every child like her own!',
    tag: 'Parent of UKG Student'
  },
  {
    id: 't-2',
    parentName: 'Dr. Vikram & Shweta Verma',
    childName: 'Ananya (UKG - A)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'The hygiene and security at K for Kidz is unmatched. From RFID gate check-ins to the daily healthy meal menus, our daughter Ananya has blossomed from a shy toddler into a confident, expressive little orator.',
    tag: 'Parent of UKG Student'
  },
  {
    id: 't-3',
    parentName: 'Sneha & Rajiv Kapoor',
    childName: 'Vihaan (Nursery)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'The learning methodology is purely joyful! Vihaan is always singing new phonics rhymes and explaining butterfly life cycles at dinner. The photo gallery updates every Friday bring tears of joy to our family.',
    tag: 'Parent of Nursery Student'
  }
];

export const SCHOOL_FACILITIES = [
  {
    title: 'Child-Safe Air-Conditioned Classrooms',
    desc: 'Spacious, sunlit rooms with rounded edge furniture, anti-bacterial flooring, and ergonomic kid chairs.',
    icon: 'Sparkles',
    emoji: '🏫',
    color: 'bg-amber-100 text-amber-700'
  },
  {
    title: 'Indoor Soft Play Jungle Gym',
    desc: 'Shock-absorbent ball pools, slides, sensory crawl tunnels, and soft foam obstacles for rainy days.',
    icon: 'Layers',
    emoji: '🎪',
    color: 'bg-rose-100 text-rose-700'
  },
  {
    title: 'Interactive Smart Storyboards',
    desc: 'Audio-visual tactile screens showcasing gentle animations, phonics sing-alongs, and nature documentaries.',
    icon: 'Tv',
    emoji: '📺',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    title: 'Splash Pool & Organic Sand Pit',
    desc: 'UV-filtered shallow water play zone and sterilized kinetic sand pit for delightful tactile sensory development.',
    icon: 'Droplets',
    emoji: '🌊',
    color: 'bg-cyan-100 text-cyan-700'
  },
  {
    title: 'Organic Kids Cafeteria',
    desc: 'Freshly cooked warm meals planned by pediatric nutritionists, completely free of preservatives and refined sugars.',
    icon: 'Utensils',
    emoji: '🥗',
    color: 'bg-emerald-100 text-emerald-700'
  },
  {
    title: '24/7 CCTV & RFID Gate Security',
    desc: 'Comprehensive multi-angle HD camera surveillance, biometric gates, and verified parent pickup protocols.',
    icon: 'ShieldCheck',
    emoji: '🛡️',
    color: 'bg-indigo-100 text-indigo-700'
  }
];

export const SCHOOL_ACTIVITIES = [
  {
    title: 'Jolly Phonics & Story Club',
    desc: 'Multi-sensory phonics, rhyme recitation, and dramatic role-playing to spark lifelong love for reading.',
    emoji: '📖',
    gradient: 'from-amber-400 to-orange-400'
  },
  {
    title: 'Messy Art, Pottery & Origami',
    desc: 'Finger painting, natural clay modeling, leaf printing, and textured collages for creative independence.',
    emoji: '🎨',
    gradient: 'from-pink-400 to-rose-400'
  },
  {
    title: 'Little Einsteins STEM Discovery',
    desc: 'Magnets, plant germination, water displacement, and rainbow color spectrums explored through play.',
    emoji: '🔬',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    title: 'Music, Movement & Xylophone',
    desc: 'Percussion instruments, rhythm clapping, dance choreography, and melody awareness.',
    emoji: '🎵',
    gradient: 'from-purple-400 to-indigo-400'
  },
  {
    title: 'Animal Yoga & Gross Motor Agility',
    desc: 'Fun animal poses (Frog leap, Flamingo balance, Butterfly stretch) for posture and focus.',
    emoji: '🧘',
    gradient: 'from-emerald-400 to-teal-400'
  },
  {
    title: 'Organic Little Gardening',
    desc: 'Sowing seeds, watering microgreens, compost learning, and nurturing love for Mother Nature.',
    emoji: '🌱',
    gradient: 'from-lime-400 to-green-500'
  }
];

export const FAQS = [
  {
    q: 'What is the teacher-to-child ratio at K for Kidz?',
    a: 'We maintain an exceptional ratio of 1:5 in Playgroup, 1:7 in Nursery, and 1:8 in Junior/Senior KG, ensuring every child receives individualized attention, warmth, and guidance.'
  },
  {
    q: 'How do parents receive daily updates and photos?',
    a: 'Every enrolled parent receives secure credentials to our dedicated Parent Portal. You can track attendance, daily meals/nap logs, teacher remarks, academic milestones, and download high-resolution activity photos.'
  },
  {
    q: 'What security measures are in place on campus?',
    a: 'We maintain full 24/7 CCTV surveillance, RFID parent pickup verification cards, childproof electrical fittings, soft-edged furniture, and a full-time certified pediatric nurse on campus.'
  },
  {
    q: 'Is transport facility available with GPS tracking?',
    a: 'Yes, we provide GPS-tracked, air-conditioned school cabs equipped with child safety seat harnesses, speed governors, and female attendants for all morning and afternoon routes.'
  }
];
