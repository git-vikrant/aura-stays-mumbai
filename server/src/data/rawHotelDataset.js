/**
 * Raw Boutique Hotel Group Dataset - Mumbai Portfolio
 * Contains 14 properties with realistic, messy operational records:
 * - Room types renamed across properties
 * - Multi-currency pricing (INR and USD string formats)
 * - Legacy corrupted booking records with inverted check-out dates
 */

export const RAW_MUMBAI_PROPERTIES = [
  {
    name: "The Colaba Heritage Manor",
    slug: "the-colaba-heritage-manor",
    neighborhood: "Colaba",
    address: "24 Arthur Bunder Road, Near Gateway of India, Colaba",
    city: "Mumbai",
    pincode: "400005",
    description: "A restored 1912 Victorian-Edwardian heritage manor overlooking the Arabian Sea harbor, featuring teakwood balconies, antique chandeliers, high-ceiling suites, and colonial afternoon tea courtyards.",
    starRating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Heritage Courtyard", "Harbor View Tea Lounge", "Butler Service", "Valet Parking", "Artisan Spa", "High-Speed WiFi"],
    contactEmail: "concierge.colaba@aurastays.com",
    contactPhone: "+91 22 2285 4100",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    rooms: [
      { roomNumber: "101", name: "Colonial Heritage Grand Suite", rawType: "Heritage Suite - Royal", rawPrice: "INR 18,500", capacity: 2, bed: "1 King Four-Poster Bed", sqft: 580 },
      { roomNumber: "102", name: "Gateway Harbor Deluxe King", rawType: "King Deluxe Room", rawPrice: "$165", capacity: 2, bed: "1 King Bed", sqft: 450 },
      { roomNumber: "103", name: "Old Bunder Luxury Studio", rawType: "Boutique Queen Room", rawPrice: "INR 12,000", capacity: 2, bed: "1 Queen Bed", sqft: 380 },
      { roomNumber: "201", name: "Viceroy Presidential Suite", rawType: "Presidential Penthouse Villa", rawPrice: "USD 380", capacity: 4, bed: "2 King Beds", sqft: 950 }
    ]
  },
  {
    name: "Marine Promenade Suites",
    slug: "marine-promenade-suites",
    neighborhood: "Marine Drive",
    address: "112 Netaji Subhash Chandra Bose Road, Marine Drive",
    city: "Mumbai",
    pincode: "400020",
    description: "Iconic Art Deco beachfront boutique along Mumbai's Queen's Necklace. Floor-to-ceiling bay windows framing golden Arabian Sea sunsets and sea-breeze cocktail terraces.",
    starRating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Oceanfront Terrace Bar", "Sea View Breakfast", "Fitness Studio", "Valet Parking", "Curated Vinyl Library", "High-Speed WiFi"],
    contactEmail: "marine@aurastays.com",
    contactPhone: "+91 22 2204 9820",
    rooms: [
      { roomNumber: "301", name: "Queen's Necklace Panoramic Suite", rawType: "Executive Suite Oceanfront", rawPrice: "INR 22,000", capacity: 3, bed: "1 King Bed + Daybed", sqft: 620 },
      { roomNumber: "302", name: "Arabian Sea Deluxe Bayview", rawType: "Deluxe Room - Sea Facing", rawPrice: "USD 190", capacity: 2, bed: "1 King Bed", sqft: 460 },
      { roomNumber: "401", name: "Art Deco Studio Queen", rawType: "Queen Cozy Studio", rawPrice: "₹13,500", capacity: 2, bed: "1 Queen Bed", sqft: 390 },
      { roomNumber: "501", name: "Marine Promenade Royal Penthouse", rawType: "Royal Penthouse", rawPrice: "USD 450", capacity: 4, bed: "2 King Beds", sqft: 1100 }
    ]
  },
  {
    name: "The Kala Ghoda Art Deco Residency",
    slug: "the-kala-ghoda-art-deco-residency",
    neighborhood: "Kala Ghoda",
    address: "18 Forbes Street, Kala Ghoda Arts Precinct, Fort",
    city: "Mumbai",
    pincode: "400001",
    description: "Nestled in the bohemian heart of Mumbai's premier arts and heritage quarter, surrounded by contemporary galleries, designer boutiques, and indie cafes.",
    starRating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Art Gallery Atrium", "Espresso & Reading Parlor", "Bespoke City Walk Tours", "High-Speed WiFi", "Organic Toiletries"],
    contactEmail: "arts@aurastays.com",
    contactPhone: "+91 22 2267 3344",
    rooms: [
      { roomNumber: "11", name: "Curator's Heritage Loft", rawType: "Heritage Suite", rawPrice: "INR 15,500", capacity: 2, bed: "1 King Bed", sqft: 520 },
      { roomNumber: "12", name: "Gallery Deluxe King", rawType: "Deluxe King", rawPrice: "$140", capacity: 2, bed: "1 King Bed", sqft: 430 },
      { roomNumber: "14", name: "Bohemian Queen Studio", rawType: "Studio Queen", rawPrice: "INR 11,000", capacity: 2, bed: "1 Queen Bed", sqft: 360 }
    ]
  },
  {
    name: "Fort Victoria Chambers",
    slug: "fort-victoria-chambers",
    neighborhood: "Fort",
    address: "42 P.M. Road, Historic Financial District, Fort",
    city: "Mumbai",
    pincode: "400001",
    description: "A dignified Victorian stone sanctuary catering to business luminaries and cultured travelers with bespoke executive boardrooms and old-world cigar lounges.",
    starRating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Private Boardroom", "Single-Malt Library Lounge", "Concierge Chauffeur", "Gymnasium", "Valet Parking"],
    contactEmail: "fort@aurastays.com",
    contactPhone: "+91 22 2265 1900",
    rooms: [
      { roomNumber: "201", name: "Governor's Executive Suite", rawType: "Business Exec Suite", rawPrice: "INR 19,000", capacity: 2, bed: "1 King Bed", sqft: 610 },
      { roomNumber: "202", name: "Chamber Deluxe King", rawType: "Deluxe King Room", rawPrice: "$150", capacity: 2, bed: "1 King Bed", sqft: 460 },
      { roomNumber: "203", name: "Victoria Heritage Queen", rawType: "Boutique Queen Room", rawPrice: "INR 12,800", capacity: 2, bed: "1 Queen Bed", sqft: 390 }
    ]
  },
  {
    name: "Bandra Seafront Haven",
    slug: "bandra-seafront-haven",
    neighborhood: "Bandra West",
    address: "88 Bandstand Promenade, Byramji Jeejeebhoy Road, Bandra West",
    city: "Mumbai",
    pincode: "400050",
    description: "Chic coastal haven overlooking the Arabian Sea surf in Mumbai's trendiest cultural enclave. Steps from sunset promenades, indie bistros, and iconic celebrity residences.",
    starRating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Rooftop Infinity Dip Pool", "Coastal Seafood Bistro", "Yoga Sunrise Deck", "EV Charging", "Pet Friendly", "Valet Parking"],
    contactEmail: "bandra@aurastays.com",
    contactPhone: "+91 22 2640 7711",
    rooms: [
      { roomNumber: "B1", name: "Seafront Ocean Villa Suite", rawType: "Presidential Villa", rawPrice: "USD 320", capacity: 3, bed: "1 King Bed", sqft: 750 },
      { roomNumber: "B2", name: "Bandstand Sunset Deluxe", rawType: "Deluxe Room - Sea View", rawPrice: "INR 16,500", capacity: 2, bed: "1 King Bed", sqft: 480 },
      { roomNumber: "B3", name: "Boutique Queen Seaside", rawType: "Queen Cozy Studio", rawPrice: "$130", capacity: 2, bed: "1 Queen Bed", sqft: 400 },
      { roomNumber: "B4", name: "Bay Executive Suite", rawType: "Exec Bay View Suite", rawPrice: "INR 21,000", capacity: 2, bed: "1 King Bed", sqft: 650 }
    ]
  },
  {
    name: "Pali Hill Palms",
    slug: "pali-hill-palms",
    neighborhood: "Pali Hill",
    address: "14 Nargis Dutt Road, Pali Hill, Bandra West",
    city: "Mumbai",
    pincode: "400050",
    description: "Ultra-private hideaway shrouded by centuries-old banyans and tropical bougainvillea on Mumbai's most prestigious hillside. Unmatched peace, tranquility, and discreet luxury.",
    starRating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Private Plunge Pools", "In-Suite Ayurvedic Spa", "Organic Garden Dining", "Soundproofed Rooms", "Discreet Valet"],
    contactEmail: "palihill@aurastays.com",
    contactPhone: "+91 22 2605 9292",
    rooms: [
      { roomNumber: "PH-1", name: "Garden Villa Sanctuary", rawType: "Presidential Penthouse Villa", rawPrice: "INR 28,000", capacity: 4, bed: "2 King Beds", sqft: 980 },
      { roomNumber: "PH-2", name: "Pali Palms Deluxe", rawType: "King Deluxe", rawPrice: "USD 175", capacity: 2, bed: "1 King Bed", sqft: 500 },
      { roomNumber: "PH-3", name: "Bougainvillea Studio", rawType: "Studio Queen", rawPrice: "₹14,000", capacity: 2, bed: "1 Queen Bed", sqft: 420 }
    ]
  },
  {
    name: "Juhu Pearl Beach Villa",
    slug: "juhu-pearl-beach-villa",
    neighborhood: "Juhu",
    address: "33 Juhu Tara Road, Beach Access Lane, Juhu",
    city: "Mumbai",
    pincode: "400049",
    description: "Direct golden sand beach access in Mumbai's glittering Bollywood beach strip. Barefoot tropical opulence meets modern architecture with private sundecks.",
    starRating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Direct Beach Access", "Beach Cabanas & Hammocks", "Seafood Grill", "Surf & Paddleboard Gear", "Pool Bar"],
    contactEmail: "juhu@aurastays.com",
    contactPhone: "+91 22 2618 6600",
    rooms: [
      { roomNumber: "JP-01", name: "Beachfront Imperial Villa", rawType: "Imperial Beach Villa", rawPrice: "USD 350", capacity: 4, bed: "2 King Beds", sqft: 1050 },
      { roomNumber: "JP-02", name: "Juhu Shore Deluxe King", rawType: "Ocean Deluxe King", rawPrice: "INR 17,500", capacity: 2, bed: "1 King Bed", sqft: 490 },
      { roomNumber: "JP-03", name: "Seaside Queen Loft", rawType: "Studio Queen", rawPrice: "$145", capacity: 2, bed: "1 Queen Bed", sqft: 410 }
    ]
  },
  {
    name: "Worli Bayview Boutique",
    slug: "worli-bayview-boutique",
    neighborhood: "Worli",
    address: "7 Khan Abdul Gaffar Khan Road, Worli Seaface",
    city: "Mumbai",
    pincode: "400018",
    description: "Floor-to-ceiling vistas of the futuristic Bandra-Worli Sea Link cable bridge. Minimalist Japanese-Scandinavian interiors accented with warm Indian brassware.",
    starRating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Sea Link View Sundeck", "Omakase Sushi & Indian Fusion", "Sauna & Steam", "Valet Parking", "Airport Shuttle"],
    contactEmail: "worli@aurastays.com",
    contactPhone: "+91 22 2493 8810",
    rooms: [
      { roomNumber: "W-501", name: "Sea Link Panorama Suite", rawType: "Sea Link Penthouse", rawPrice: "INR 26,000", capacity: 3, bed: "1 King Bed + Lounge", sqft: 720 },
      { roomNumber: "W-502", name: "Bayview Executive King", rawType: "Executive Suite", rawPrice: "USD 210", capacity: 2, bed: "1 King Bed", sqft: 520 },
      { roomNumber: "W-503", name: "Worli Horizon Deluxe", rawType: "Deluxe King Room", rawPrice: "INR 15,000", capacity: 2, bed: "1 King Bed", sqft: 440 }
    ]
  },
  {
    name: "Malabar Hill Serenity",
    slug: "malabar-hill-serenity",
    neighborhood: "Malabar Hill",
    address: "12 Walkeshwar Road, Near Hanging Gardens, Malabar Hill",
    city: "Mumbai",
    pincode: "400006",
    description: "Perched atop South Mumbai's grandest promontory overlooking Back Bay and Chowpatty. Tranquil gardens, marble verandas, and classical chamber music soirees.",
    starRating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Hanging Garden Views", "Classical Tea Room", "Lotus Pond Courtyard", "Yoga Pavilion", "Valet Parking"],
    contactEmail: "malabar@aurastays.com",
    contactPhone: "+91 22 2363 1188",
    rooms: [
      { roomNumber: "MH-101", name: "Royal Back Bay Heritage Suite", rawType: "Victoria Royal Suite", rawPrice: "INR 24,000", capacity: 2, bed: "1 King Four-Poster", sqft: 680 },
      { roomNumber: "MH-102", name: "Hilltop Panorama Deluxe", rawType: "Deluxe King", rawPrice: "$180", capacity: 2, bed: "1 King Bed", sqft: 480 },
      { roomNumber: "MH-103", name: "Serenity Studio Queen", rawType: "Studio Queen", rawPrice: "₹14,500", capacity: 2, bed: "1 Queen Bed", sqft: 390 }
    ]
  },
  {
    name: "Lower Parel Loft & Suites",
    slug: "lower-parel-loft-and-suites",
    neighborhood: "Lower Parel",
    address: "Senapati Bapat Marg, Mills District, Lower Parel",
    city: "Mumbai",
    pincode: "400013",
    description: "Industrial heritage meets modern urban luxury inside a converted 1930s textile mill. Exposed brick, iron beams, high ceilings, craft cocktail speak-easy.",
    starRating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Craft Speakeasy Bar", "Artisanal Bakery & Cafe", "Coworking Lounge", "24h Fitness", "Direct Mall Walkway"],
    contactEmail: "lowerparel@aurastays.com",
    contactPhone: "+91 22 2490 2200",
    rooms: [
      { roomNumber: "LP-21", name: "Mill Owner's Executive Loft", rawType: "Grand Executive", rawPrice: "INR 18,000", capacity: 2, bed: "1 King Bed", sqft: 590 },
      { roomNumber: "LP-22", name: "Urban Brick Deluxe King", rawType: "Deluxe King", rawPrice: "USD 155", capacity: 2, bed: "1 King Bed", sqft: 460 },
      { roomNumber: "LP-23", name: "Foundry Queen Studio", rawType: "Boutique Queen Room", rawPrice: "13000", capacity: 2, bed: "1 Queen Bed", sqft: 380 }
    ]
  },
  {
    name: "BKC Executive Pavilion",
    slug: "bkc-executive-pavilion",
    neighborhood: "BKC",
    address: "G-Block, Bandra Kurla Complex, Behind Diamond Bourse",
    city: "Mumbai",
    pincode: "400051",
    description: "The preferred destination for global executives, founders, and delegates in Mumbai's modern financial center. High-speed conference facilities and acoustic pods.",
    starRating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Smart Meeting Pods", "Executive Club Lounge", "Heated Lap Pool", "Airport Chauffeur", "24/7 Business Concierge"],
    contactEmail: "bkc@aurastays.com",
    contactPhone: "+91 22 2650 9900",
    rooms: [
      { roomNumber: "BKC-11", name: "Pavilion Ambassador Suite", rawType: "Business Exec Suite", rawPrice: "INR 23,000", capacity: 2, bed: "1 King Bed", sqft: 640 },
      { roomNumber: "BKC-12", name: "Tech Deluxe King", rawType: "King Deluxe Room", rawPrice: "$185", capacity: 2, bed: "1 King Bed", sqft: 470 },
      { roomNumber: "BKC-14", name: "Executive Studio Queen", rawType: "Queen Cozy Studio", rawPrice: "INR 16,000", capacity: 2, bed: "1 Queen Bed", sqft: 400 }
    ]
  },
  {
    name: "Powai Lake Sanctuary",
    slug: "powai-lake-sanctuary",
    neighborhood: "Powai",
    address: "Central Avenue, Hiranandani Gardens, Powai Lakefront",
    city: "Mumbai",
    pincode: "400076",
    description: "Tranquil neoclassical lakeside resort wrapped around serene Powai Lake with views of green hillocks, flamingos, and European cobblestone plazas.",
    starRating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Lakeside Promenade", "Open-Air Grill", "Tennis Court", "Spa & Wellness", "Bicycle Rentals"],
    contactEmail: "powai@aurastays.com",
    contactPhone: "+91 22 2570 3300",
    rooms: [
      { roomNumber: "PW-101", name: "Lakefront Panorama Suite", rawType: "Executive Suite", rawPrice: "INR 17,000", capacity: 3, bed: "1 King Bed", sqft: 580 },
      { roomNumber: "PW-102", name: "Garden Deluxe King", rawType: "Deluxe King", rawPrice: "$140", capacity: 2, bed: "1 King Bed", sqft: 440 },
      { roomNumber: "PW-103", name: "Sanctuary Studio Queen", rawType: "Studio Queen", rawPrice: "INR 11,500", capacity: 2, bed: "1 Queen Bed", sqft: 370 }
    ]
  },
  {
    name: "Versova Coastal Retreat",
    slug: "versova-coastal-retreat",
    neighborhood: "Versova",
    address: "7 Koliwada Lane, Off Versova Beach, Andheri West",
    city: "Mumbai",
    pincode: "400061",
    description: "Bohemian artisanal haven near Versova's historic fishing village and golden sands. Vibrant mural art, bamboo verandas, organic pottery, and sunset live acoustics.",
    starRating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Rooftop Acoustic Sessions", "Seafood Cooking Masterclasses", "Sunset Yoga", "Pet Friendly", "Beach Cycles"],
    contactEmail: "versova@aurastays.com",
    contactPhone: "+91 22 2632 4455",
    rooms: [
      { roomNumber: "V-1", name: "Artisanal Coastal Villa", rawType: "Imperial Beach Villa", rawPrice: "USD 220", capacity: 3, bed: "1 King Bed", sqft: 680 },
      { roomNumber: "V-2", name: "Fisherman's Wharf Deluxe", rawType: "Deluxe Room - Sea Facing", rawPrice: "INR 13,000", capacity: 2, bed: "1 King Bed", sqft: 430 },
      { roomNumber: "V-3", name: "Boho Beach Queen Studio", rawType: "Boutique Queen Room", rawPrice: "$105", capacity: 2, bed: "1 Queen Bed", sqft: 360 }
    ]
  },
  {
    name: "Dadar Heritage Inn",
    slug: "dadar-heritage-inn",
    neighborhood: "Dadar",
    address: "15 Shivaji Park Cross Road, Dadar West",
    city: "Mumbai",
    pincode: "400028",
    description: "Celebrating the vibrant soul of classical Mumbai next to historic Shivaji Park. Art Deco balconies, brass filter coffee bars, and authentic Maharashtrian gourmet dining.",
    starRating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Heritage Filter Coffee Bar", "Maharashtrian Gourmet Dining", "Park Walking Access", "Library", "Valet Parking"],
    contactEmail: "dadar@aurastays.com",
    contactPhone: "+91 22 2444 8900",
    rooms: [
      { roomNumber: "D-1", name: "Shivaji Park Heritage Suite", rawType: "Colonial Heritage Room", rawPrice: "INR 14,000", capacity: 2, bed: "1 King Bed", sqft: 510 },
      { roomNumber: "D-2", name: "Art Deco Deluxe King", rawType: "Deluxe King", rawPrice: "$120", capacity: 2, bed: "1 King Bed", sqft: 420 },
      { roomNumber: "D-3", name: "Chhatrapati Queen Studio", rawType: "Studio Queen", rawPrice: "INR 9,500", capacity: 2, bed: "1 Queen Bed", sqft: 350 }
    ]
  }
];

/**
 * Raw Guest Stay / Booking Records with MESSY cases:
 * - Mixed currency payments (INR & USD)
 * - Transposed / Inverted dates where checkOut <= checkIn
 * - Renamed room types
 */
export const RAW_MESSY_BOOKINGS = [
  {
    ref: "AURA-MUM-10001",
    guestName: "Aditya Roy Kapur",
    guestEmail: "aditya.roy@example.com",
    guestPhone: "+91 98201 12345",
    hotelSlug: "the-colaba-heritage-manor",
    roomNumber: "101",
    rawCheckIn: "2026-11-10",
    rawCheckOut: "2026-11-14", // Valid 4 nights
    rawCurrency: "INR",
    rawTotal: "INR 74,000",
    status: "CHECKED_OUT"
  },
  {
    ref: "AURA-MUM-10002",
    guestName: "Zara Henderson",
    guestEmail: "zara.h@london-design.co.uk",
    guestPhone: "+44 7700 900123",
    hotelSlug: "marine-promenade-suites",
    roomNumber: "301",
    rawCheckIn: "2026-11-18",
    rawCheckOut: "2026-11-23", // Valid 5 nights
    rawCurrency: "USD",
    rawTotal: "USD 1,310",
    status: "CHECKED_IN"
  },
  {
    // MESSY CASE: CHECK-OUT DATE BEFORE CHECK-IN DATE! (transposed dates by desk staff)
    ref: "AURA-LEGACY-ERR-001",
    guestName: "Vikram Singhania",
    guestEmail: "vikram.s@singhaniagroup.in",
    guestPhone: "+91 98210 55443",
    hotelSlug: "the-kala-ghoda-art-deco-residency",
    roomNumber: "11",
    rawCheckIn: "2026-11-15",
    rawCheckOut: "2026-11-12", // INVERTED! Check-out is 3 days earlier than check-in
    rawCurrency: "INR",
    rawTotal: "46500",
    status: "CONFIRMED"
  },
  {
    // MESSY CASE: SAME DAY CHECK-IN / CHECK-OUT (0 NIGHTS)
    ref: "AURA-LEGACY-ERR-002",
    guestName: "Meera Nair",
    guestEmail: "meera.nair@cinema-arts.org",
    guestPhone: "+91 98190 88776",
    hotelSlug: "bandra-seafront-haven",
    roomNumber: "B2",
    rawCheckIn: "2026-10-20",
    rawCheckOut: "2026-10-20", // 0 nights corrupted
    rawCurrency: "USD",
    rawTotal: "$195",
    status: "CHECKED_OUT"
  },
  {
    ref: "AURA-MUM-10003",
    guestName: "Rohan Deshmukh",
    guestEmail: "rohan.deshmukh@fintech-bkc.com",
    guestPhone: "+91 99200 44332",
    hotelSlug: "bkc-executive-pavilion",
    roomNumber: "BKC-11",
    rawCheckIn: "2026-11-20",
    rawCheckOut: "2026-11-25",
    rawCurrency: "INR",
    rawTotal: "INR 115,000",
    status: "CONFIRMED"
  },
  {
    ref: "AURA-MUM-10004",
    guestName: "Elena Rostova",
    guestEmail: "elena.rostova@traveler.ru",
    guestPhone: "+7 916 555 0199",
    hotelSlug: "juhu-pearl-beach-villa",
    roomNumber: "JP-01",
    rawCheckIn: "2026-11-21",
    rawCheckOut: "2026-11-28",
    rawCurrency: "USD",
    rawTotal: "USD 2,450",
    status: "CHECKED_IN"
  },
  {
    ref: "AURA-MUM-10005",
    guestName: "Ananya Mehta",
    guestEmail: "ananya.mehta@mumbaifoundation.org",
    guestPhone: "+91 98205 77665",
    hotelSlug: "malabar-hill-serenity",
    roomNumber: "MH-101",
    rawCheckIn: "2026-11-15",
    rawCheckOut: "2026-11-19",
    rawCurrency: "INR",
    rawTotal: "96000",
    status: "CHECKED_OUT"
  },
  {
    ref: "AURA-MUM-10006",
    guestName: "David Chen",
    guestEmail: "david.chen@singapore-vc.sg",
    guestPhone: "+65 9123 4567",
    hotelSlug: "worli-bayview-boutique",
    roomNumber: "W-501",
    rawCheckIn: "2026-11-22",
    rawCheckOut: "2026-11-26",
    rawCurrency: "USD",
    rawTotal: "USD 1,240",
    status: "CONFIRMED"
  },
  {
    ref: "AURA-MUM-10007",
    guestName: "Pooja Hegde",
    guestEmail: "pooja.h@studio-productions.in",
    guestPhone: "+91 98200 99881",
    hotelSlug: "pali-hill-palms",
    roomNumber: "PH-1",
    rawCheckIn: "2026-11-12",
    rawCheckOut: "2026-11-16",
    rawCurrency: "INR",
    rawTotal: "INR 112,000",
    status: "CHECKED_OUT"
  },
  {
    ref: "AURA-MUM-10008",
    guestName: "Marcus Sterling",
    guestEmail: "marcus@sterling-commodities.com",
    guestPhone: "+1 415 555 2671",
    hotelSlug: "fort-victoria-chambers",
    roomNumber: "201",
    rawCheckIn: "2026-11-19",
    rawCheckOut: "2026-11-24",
    rawCurrency: "USD",
    rawTotal: "USD 1,140",
    status: "CHECKED_IN"
  }
];

export const RAW_GUEST_REVIEWS = [
  {
    hotelSlug: "the-colaba-heritage-manor",
    guestName: "Aditya Roy Kapur",
    rating: 5,
    title: "Stepping back into colonial majesty",
    comment: "The teakwood ceilings, the brass fittings, and the high tea in the courtyard overlooking the Gateway harbor were unforgettable. Front desk staff were impeccably polite."
  },
  {
    hotelSlug: "marine-promenade-suites",
    guestName: "Zara Henderson",
    rating: 5,
    title: "Queen's Necklace sunsets are magical",
    comment: "Sitting in the Art Deco bay window with a gin cocktail watching the Marine Drive traffic lights sparkle against the Arabian sea is pure Mumbai magic."
  },
  {
    hotelSlug: "bandra-seafront-haven",
    guestName: "Meera Nair",
    rating: 5,
    title: "Sunset deck & ocean breeze bliss",
    comment: "The rooftop infinity pool facing Bandstand and the curated indie playlists made this boutique stay our favorite in Mumbai."
  },
  {
    hotelSlug: "juhu-pearl-beach-villa",
    guestName: "Elena Rostova",
    rating: 5,
    title: "Barefoot luxury on Juhu beach",
    comment: "Waking up to the sea waves, fresh coconut water delivered to our terrace, and complete privacy despite being in the center of Juhu."
  },
  {
    hotelSlug: "bkc-executive-pavilion",
    guestName: "Rohan Deshmukh",
    rating: 4,
    title: "Top-notch business hotel",
    comment: "Quiet, ultra-fast fiber internet, soundproof meeting rooms, and just 5 minutes from my meetings in G-Block. The breakfast buffet was exquisite."
  }
];

export const RAW_ENQUIRIES = [
  {
    hotelSlug: "the-colaba-heritage-manor",
    name: "Sunita Godrej",
    email: "sunita.g@godrej-initiatives.com",
    phone: "+91 98200 11223",
    category: "EVENT_WEDDING",
    subject: "Intimate Courtyard Wedding Reception for 80 Guests",
    message: "We are planning an intimate heritage wedding dinner in mid-December 2026. Could you share your courtyard banquet packages, heritage suite block booking rates, and catering menus?",
    status: "IN_PROGRESS",
    staffNotes: "Contacted by Concierge Manager on Nov 20. Sent wedding brochure and scheduled walkthrough."
  },
  {
    hotelSlug: "marine-promenade-suites",
    name: "Arthur Pendelton",
    email: "arthur.p@uk-consulate.gov.uk",
    phone: "+44 20 7946 0991",
    category: "CORPORATE",
    subject: "Diplomatic Delegation Extended Stay (7 Suites)",
    message: "Looking to reserve 7 suites for a visiting trade delegation in January 2027. We require high-security protocols, private breakfast lounge, and airport chauffeur transfers.",
    status: "NEW",
    staffNotes: null
  },
  {
    hotelSlug: "bandra-seafront-haven",
    name: "Karan Johar Film Productions",
    email: "locations@dharmaprod.in",
    phone: "+91 98211 44556",
    category: "GENERAL",
    subject: "Fashion Editorial Photoshoot on Sunset Deck",
    message: "Requesting half-day rooftop pool deck rental for a luxury fashion cover shoot with golden hour lighting.",
    status: "RESOLVED",
    staffNotes: "Permit approved for Nov 28 between 3 PM - 7 PM. Security deposit received."
  }
];
