/**
 * Detail-page content for each car: overview, specifications, variants,
 * colours, owner sentiment and same-segment rivals.
 *
 * PROVENANCE: figures here are researched approximations of the Indian market
 * and are used as the fallback when no MyNewCar API key is configured. The owner
 * quotes are illustrative compositions, not transcriptions of real published
 * reviews — reproducing those verbatim would be a copyright problem. The UI
 * labels this content as sample data via the provenance badge, and swaps in
 * live vendor rows automatically once `MYNEWCAR_API_KEY` is set.
 */
import type { CarDetail } from "./types";

export const carDetails: Record<string, CarDetail> = {
  "tata-nexon": {
    overview:
      "The Nexon is the safety-first pick in its class. It earned a full five stars from Bharat NCAP for both adults and children, and it feels solid and planted on the highway in a way that smaller crossovers do not. The proper torque-converter automatic is the version to have if you sit in traffic every day.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "1.2-litre turbo petrol" },
          { label: "Power", value: "118 bhp", plain: "Plenty for overtaking on a two-lane highway" },
          { label: "Gearbox", value: "6-speed automatic", plain: "No clutch pedal, creeps forward on its own" },
          { label: "Also sold as", value: "Diesel, CNG, and a manual petrol" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "3,995 mm", plain: "Short enough for tight city parking" },
          { label: "Boot", value: "382 litres", plain: "Three large suitcases" },
          { label: "Seats", value: "5" },
          { label: "Ground clearance", value: "208 mm", plain: "Clears tall speed breakers unloaded" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "13.8 km/l", plain: "Measured in stop-start traffic, not a lab" },
          { label: "Cost per km", value: "₹7.4" },
          { label: "Service interval", value: "Every 15,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Bharat NCAP", value: "5 stars (adult and child)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Cameras", value: "360° view with blind-spot feed" },
          { label: "Also fitted", value: "Stability control, hill-hold, tyre-pressure warning" },
        ],
      },
    ],
    variants: [
      {
        id: "smart-plus",
        name: "Smart+",
        exShowroom: 8_00_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The way in. Six airbags and the safety kit are already here.",
        keyKit: ["6 airbags", "Stability control", "Rear camera", "Steering-mounted controls"],
      },
      {
        id: "pure-plus-s",
        name: "Pure+ S",
        exShowroom: 9_70_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Adds the sunroof and a proper touchscreen.",
        keyKit: ["Electric sunroof", "10.25\" touchscreen", "Wireless phone mirroring", "Alloy wheels"],
      },
      {
        id: "creative-plus-s",
        name: "Creative+ S",
        exShowroom: 11_30_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The sweet spot — you get the 360° camera and climate control.",
        keyKit: ["360° camera", "Automatic climate control", "Ventilated front seats", "Wireless charging"],
        isValuePick: true,
      },
      {
        id: "creative-plus-s-at",
        name: "Creative+ S Automatic",
        exShowroom: 12_40_000,
        gearbox: "Automatic",
        fuel: "Petrol",
        headline: "Same kit, no clutch pedal. Worth it if you commute in traffic.",
        keyKit: ["6-speed automatic", "360° camera", "Ventilated front seats", "Blind-spot monitor"],
      },
    ],
    colours: [
      { id: "creative-ocean", name: "Creative Ocean", swatch: ["#1c4f8b"] },
      { id: "pure-grey", name: "Pure Grey", swatch: ["#5b6067"] },
      { id: "flame-red", name: "Flame Red", swatch: ["#b81f24"], premium: 15_000 },
      { id: "pristine-white", name: "Pristine White", swatch: ["#f1f3f5"] },
      { id: "ocean-black", name: "Ocean / Black roof", swatch: ["#1c4f8b", "#111827"], premium: 20_000 },
    ],
    reviews: {
      ownerRating: 4.3,
      ownerCount: 1_842,
      expertRating: 4.2,
      loved: [
        "Feels heavy and planted at 100 km/h",
        "Five-star crash rating at this price",
        "Automatic is genuinely smooth in traffic",
      ],
      watchOut: [
        "Touchscreen software can lag on startup",
        "Service quality varies a lot between dealers",
        "Middle rear seat is tight for a third adult",
      ],
      quotes: [
        {
          author: "Rohit M.",
          city: "Pune",
          months: 14,
          rating: 5,
          text: "Bought it for the safety rating and stayed for the ride. It soaks up bad roads better than anything else I test drove in this budget.",
        },
        {
          author: "Sneha K.",
          city: "Bengaluru",
          months: 8,
          rating: 4,
          text: "The automatic is the reason I can do Whitefield to Koramangala daily without hating my life. Only gripe is the infotainment takes a few seconds to wake up.",
        },
      ],
    },
    rivals: [
      {
        carId: "mahindra-xuv-3xo",
        brand: "Mahindra",
        model: "XUV 3XO",
        priceFrom: 7_99_000,
        stars: 5,
        oneLiner: "The same five-star safety, with a longer feature list.",
        edge: "More kit for the money — panoramic sunroof, ADAS, Harman audio.",
        gap: "The Nexon rides better on broken roads and has a smoother automatic.",
      },
      {
        carId: "maruti-fronx",
        brand: "Maruti Suzuki",
        model: "Fronx",
        priceFrom: 7_50_000,
        stars: 4,
        oneLiner: "Cheaper to run and to service, but less crash protection.",
        edge: "CNG option, and Maruti's service network reaches small towns.",
        gap: "Four stars against the Nexon's five, and it feels lighter on the highway.",
      },
      {
        brand: "Hyundai",
        model: "Venue",
        priceFrom: 7_94_000,
        stars: 4,
        oneLiner: "Better cabin fit and finish, smaller boot.",
        edge: "Interior plastics and switchgear feel a class above.",
        gap: "Less boot space and a stiffer low-speed ride.",
      },
    ],
  },

  "maruti-fronx": {
    overview:
      "The Fronx is the running-cost champion. The factory CNG version returns around 24 km per kg on a daily commute, which is roughly half the fuel bill of an equivalent petrol crossover. You give up some crash protection and highway heft in exchange, and the CNG tank eats most of the boot.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "1.2-litre petrol with factory CNG" },
          { label: "Power", value: "76 bhp on CNG", plain: "Adequate in town, needs planning to overtake" },
          { label: "Gearbox", value: "5-speed manual" },
          { label: "Also sold as", value: "1.0-litre turbo petrol with automatic" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "3,995 mm" },
          { label: "Boot", value: "308 litres petrol", plain: "The CNG cylinder takes most of this" },
          { label: "Seats", value: "5" },
          { label: "Ground clearance", value: "190 mm" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "24 km/kg CNG", plain: "About ₹3.1 per kilometre" },
          { label: "Cost per km", value: "₹3.1" },
          { label: "Service interval", value: "Every 10,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Global NCAP", value: "4 stars (adult)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Also fitted", value: "Stability control, hill-hold, reverse camera" },
        ],
      },
    ],
    variants: [
      {
        id: "sigma",
        name: "Sigma",
        exShowroom: 7_50_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Bare bones, but the six airbags are standard.",
        keyKit: ["6 airbags", "Stability control", "Manual air conditioning"],
      },
      {
        id: "delta-cng",
        name: "Delta+ CNG",
        exShowroom: 9_20_000,
        gearbox: "Manual",
        fuel: "CNG",
        headline: "The one to buy if fuel bills are the whole point.",
        keyKit: ["Factory CNG", "9\" touchscreen", "Reverse camera", "Alloy wheels"],
        isValuePick: true,
      },
      {
        id: "zeta-turbo",
        name: "Zeta Turbo",
        exShowroom: 10_60_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The turbo engine transforms how it drives on the highway.",
        keyKit: ["1.0 turbo petrol", "Head-up display", "Wireless charging", "Cruise control"],
      },
      {
        id: "alpha-turbo-at",
        name: "Alpha Turbo Automatic",
        exShowroom: 13_10_000,
        gearbox: "Automatic",
        fuel: "Petrol",
        headline: "Fully loaded with a torque-converter automatic.",
        keyKit: ["6-speed automatic", "360° camera", "Sunroof", "Connected car app"],
      },
    ],
    colours: [
      { id: "nexa-blue", name: "Nexa Blue", swatch: ["#1e3f8f"] },
      { id: "earthen-brown", name: "Earthen Brown", swatch: ["#6b4a35"] },
      { id: "splendid-silver", name: "Splendid Silver", swatch: ["#b6bbc0"] },
      { id: "arctic-white", name: "Arctic White", swatch: ["#f4f6f7"] },
      { id: "blue-black", name: "Nexa Blue / Black roof", swatch: ["#1e3f8f", "#111827"], premium: 17_000 },
    ],
    reviews: {
      ownerRating: 4.1,
      ownerCount: 2_310,
      expertRating: 3.9,
      loved: [
        "Fuel bill roughly halves versus petrol",
        "Service is cheap and available almost everywhere",
        "Light steering makes city driving effortless",
      ],
      watchOut: [
        "CNG cylinder leaves very little boot space",
        "Feels light and nervous above 100 km/h",
        "Four-star rating, not five",
      ],
      quotes: [
        {
          author: "Imran S.",
          city: "Ahmedabad",
          months: 19,
          rating: 4,
          text: "I drive 60 km a day. On CNG that is about ₹190 instead of ₹430 in my old petrol car. The boot is basically gone, but I knew that going in.",
        },
        {
          author: "Divya R.",
          city: "Chennai",
          months: 6,
          rating: 4,
          text: "Perfect second car for the city. I would not choose it for regular highway runs to Bengaluru — it gets buffeted by trucks.",
        },
      ],
    },
    rivals: [
      {
        carId: "tata-nexon",
        brand: "Tata",
        model: "Nexon",
        priceFrom: 8_00_000,
        stars: 5,
        oneLiner: "Safer and more substantial, but costs more per kilometre.",
        edge: "Five-star crash rating and a much more planted highway ride.",
        gap: "Running costs are more than double on petrol.",
      },
      {
        brand: "Tata",
        model: "Punch",
        priceFrom: 6_13_000,
        stars: 5,
        oneLiner: "Cheaper and five-star safe, but slower and smaller inside.",
        edge: "Five-star Global NCAP result at a lower price.",
        gap: "Less rear space and a noisier engine at speed.",
      },
      {
        brand: "Hyundai",
        model: "Exter",
        priceFrom: 6_20_000,
        stars: 4,
        oneLiner: "Similar CNG maths in a smaller package.",
        edge: "Dual-cylinder CNG keeps some usable boot space.",
        gap: "Smaller cabin and a shorter feature list at the top end.",
      },
    ],
  },

  "hyundai-creta": {
    overview:
      "The Creta is the default choice in the midsize class, and it earns that with refinement rather than flash. It is quiet at highway speed, the seats support you on a long drive, and the automatic is unobtrusive. It is also the most expensive car here once you reach the SX Tech trim.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "1.5-litre petrol" },
          { label: "Power", value: "113 bhp", plain: "Relaxed rather than quick" },
          { label: "Gearbox", value: "CVT automatic", plain: "Seamless, with no gearshift jolt at all" },
          { label: "Also sold as", value: "1.5 diesel, and a 1.5 turbo petrol" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "4,330 mm", plain: "Noticeably bigger than a compact SUV" },
          { label: "Boot", value: "433 litres", plain: "Four large suitcases" },
          { label: "Seats", value: "5" },
          { label: "Rear legroom", value: "Generous", plain: "Three adults fit across without complaint" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "12.5 km/l" },
          { label: "Cost per km", value: "₹8.2" },
          { label: "Service interval", value: "Every 10,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Bharat NCAP", value: "5 stars (adult and child)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Driver aids", value: "Level-2 ADAS on higher trims", plain: "Keeps its own distance in highway traffic" },
          { label: "Cameras", value: "360° view with blind-spot feed" },
        ],
      },
    ],
    variants: [
      {
        id: "e",
        name: "E",
        exShowroom: 11_10_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The badge and the space, with little else.",
        keyKit: ["6 airbags", "Stability control", "Manual air conditioning"],
      },
      {
        id: "s-plus",
        name: "S+",
        exShowroom: 14_20_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Where the Creta starts feeling like a Creta.",
        keyKit: ["10.25\" touchscreen", "Automatic climate control", "Rear camera", "Alloy wheels"],
      },
      {
        id: "sx-tech",
        name: "SX Tech",
        exShowroom: 16_90_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The value pick — sunroof, 360° camera and ADAS arrive here.",
        keyKit: ["Panoramic sunroof", "360° camera", "Level-2 ADAS", "Ventilated seats"],
        isValuePick: true,
      },
      {
        id: "sx-tech-at",
        name: "SX Tech Automatic",
        exShowroom: 18_60_000,
        gearbox: "Automatic",
        fuel: "Petrol",
        headline: "The quietest, most effortless way to own one.",
        keyKit: ["CVT automatic", "Level-2 ADAS", "Bose audio", "Memory driver seat"],
      },
    ],
    colours: [
      { id: "atlas-white", name: "Atlas White", swatch: ["#f2f4f6"] },
      { id: "abyss-black", name: "Abyss Black", swatch: ["#14161a"] },
      { id: "titan-grey", name: "Titan Grey Matte", swatch: ["#71767c"], premium: 35_000 },
      { id: "ranger-khaki", name: "Ranger Khaki", swatch: ["#7c7551"] },
      { id: "white-black", name: "Atlas White / Black roof", swatch: ["#f2f4f6", "#14161a"], premium: 20_000 },
    ],
    reviews: {
      ownerRating: 4.4,
      ownerCount: 3_967,
      expertRating: 4.3,
      loved: [
        "Very quiet cabin on the highway",
        "Rear seat comfort on long trips",
        "ADAS works well on open roads",
      ],
      watchOut: [
        "Top trims are expensive for the segment",
        "CVT drones if you push it hard uphill",
        "Resale is strong, so used ones are dear too",
      ],
      quotes: [
        {
          author: "Anand P.",
          city: "Hyderabad",
          months: 22,
          rating: 5,
          text: "Delhi to Jaipur without a break and nobody complained. That is the whole review. It is quiet, the seats are good, and the ADAS takes the edge off truck traffic.",
        },
        {
          author: "Meera J.",
          city: "Mumbai",
          months: 11,
          rating: 4,
          text: "Lovely to live with, but I paid a genuine premium for the badge. The Seltos gave me more equipment for the same money — I just preferred how this one drove.",
        },
      ],
    },
    rivals: [
      {
        brand: "Kia",
        model: "Seltos",
        priceFrom: 11_19_000,
        stars: 5,
        oneLiner: "Same underpinnings, more equipment, firmer ride.",
        edge: "More features per rupee and a sharper turbo engine option.",
        gap: "Rides more firmly over broken city roads.",
      },
      {
        brand: "Maruti Suzuki",
        model: "Grand Vitara",
        priceFrom: 11_42_000,
        stars: 4,
        oneLiner: "The hybrid halves your fuel bill in the city.",
        edge: "Strong hybrid returns around 25 km/l in traffic.",
        gap: "Smaller boot in hybrid form, and a less refined cabin.",
      },
      {
        brand: "Volkswagen",
        model: "Taigun",
        priceFrom: 11_70_000,
        stars: 5,
        oneLiner: "The driver's choice, with a shorter feature list.",
        edge: "Best steering and body control in the class.",
        gap: "Fewer creature comforts and a smaller service network.",
      },
    ],
  },

  "mahindra-xuv-3xo": {
    overview:
      "The XUV 3XO undercuts everything else on features. A panoramic sunroof, Harman audio, Level-2 driver aids and a five-star crash rating all appear well below ₹16 lakh. The trade-off is a ride that thumps over sharp bumps and an interior that feels built to a price in places.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "1.2-litre turbo petrol" },
          { label: "Power", value: "129 bhp", plain: "The quickest car in this comparison" },
          { label: "Gearbox", value: "6-speed automatic" },
          { label: "Also sold as", value: "1.5 diesel, and a 111 bhp petrol manual" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "3,990 mm" },
          { label: "Boot", value: "364 litres", plain: "Three large suitcases" },
          { label: "Seats", value: "5" },
          { label: "Sunroof", value: "Panoramic", plain: "Runs over both seat rows" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "13.2 km/l" },
          { label: "Cost per km", value: "₹7.8" },
          { label: "Service interval", value: "Every 10,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Bharat NCAP", value: "5 stars (adult and child)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Driver aids", value: "Level-2 ADAS on AX7 L" },
          { label: "Also fitted", value: "All-wheel disc brakes, 360° camera" },
        ],
      },
    ],
    variants: [
      {
        id: "mx1",
        name: "MX1",
        exShowroom: 7_99_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The cheapest five-star car in the class.",
        keyKit: ["6 airbags", "All-disc brakes", "Stability control"],
      },
      {
        id: "mx3",
        name: "MX3 Pro",
        exShowroom: 9_90_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Adds the big screens and the sunroof.",
        keyKit: ["10.25\" touchscreen", "Panoramic sunroof", "Rear camera", "Cruise control"],
      },
      {
        id: "ax5-l",
        name: "AX5 L",
        exShowroom: 12_20_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Best balance — 360° camera and Harman audio without the ADAS premium.",
        keyKit: ["360° camera", "Harman Kardon audio", "Ventilated seats", "Wireless charging"],
        isValuePick: true,
      },
      {
        id: "ax5-l-at",
        name: "AX5 L Automatic",
        exShowroom: 13_50_000,
        gearbox: "Automatic",
        fuel: "Petrol",
        headline: "The same kit with a clutchless gearbox.",
        keyKit: ["6-speed automatic", "360° camera", "Harman Kardon audio", "Dual-zone climate"],
      },
    ],
    colours: [
      { id: "everest-white", name: "Everest White", swatch: ["#f3f5f6"] },
      { id: "galaxy-grey", name: "Galaxy Grey", swatch: ["#63686e"] },
      { id: "tango-red", name: "Tango Red", swatch: ["#b5202a"], premium: 12_000 },
      { id: "citrine-yellow", name: "Citrine Yellow", swatch: ["#d8a318"], premium: 12_000 },
      { id: "white-black", name: "Everest White / Black roof", swatch: ["#f3f5f6", "#111827"], premium: 18_000 },
    ],
    reviews: {
      ownerRating: 4.2,
      ownerCount: 1_204,
      expertRating: 4.0,
      loved: [
        "Feature list embarrasses cars costing lakhs more",
        "Genuinely quick with the turbo petrol",
        "Brakes on all four wheels, unusual at this price",
      ],
      watchOut: [
        "Ride thumps over sharp bumps and expansion joints",
        "Some interior plastics feel built to a cost",
        "Software has needed dealer updates for some owners",
      ],
      quotes: [
        {
          author: "Karthik V.",
          city: "Bengaluru",
          months: 10,
          rating: 4,
          text: "I compared it against the Nexon and Venue and nothing came close on equipment for the money. It does crash over bad patches though — my wife noticed immediately.",
        },
        {
          author: "Preeti N.",
          city: "Delhi",
          months: 7,
          rating: 4,
          text: "The panoramic sunroof sold it to my kids and the five-star rating sold it to me. Two software updates in seven months is the only annoyance.",
        },
      ],
    },
    rivals: [
      {
        carId: "tata-nexon",
        brand: "Tata",
        model: "Nexon",
        priceFrom: 8_00_000,
        stars: 5,
        oneLiner: "Rides better and feels more solid, with less kit.",
        edge: "Noticeably more comfortable over broken roads.",
        gap: "You pay more for fewer features at the same trim level.",
      },
      {
        brand: "Hyundai",
        model: "Venue",
        priceFrom: 7_94_000,
        stars: 4,
        oneLiner: "Better built inside, four stars instead of five.",
        edge: "Cabin quality and dealer experience.",
        gap: "Smaller boot, no panoramic sunroof, no ADAS.",
      },
      {
        brand: "Kia",
        model: "Sonet",
        priceFrom: 7_99_000,
        stars: 5,
        oneLiner: "Similar equipment, tighter rear seat.",
        edge: "Best-in-class diesel automatic option.",
        gap: "Less rear legroom and a smaller sunroof.",
      },
    ],
  },

  "tata-punch-ev": {
    overview:
      "The Punch.ev makes sense if you can charge at home. Around 320 km of real range covers a week of city driving, and at home tariffs you are looking at roughly ₹1.2 per kilometre — a fifth of what a petrol crossover costs to run. Long highway trips still need planning.",
    specGroups: [
      {
        label: "Motor & battery",
        items: [
          { label: "Battery", value: "35 kWh (Long Range)" },
          { label: "Power", value: "120 bhp", plain: "Instant response from a standstill" },
          { label: "Real-world range", value: "About 320 km", plain: "Mixed city driving with air conditioning on" },
          { label: "Fast charging", value: "10-80% in about 56 minutes", plain: "On a 50 kW public charger" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "3,857 mm", plain: "Very easy to park" },
          { label: "Boot", value: "366 litres", plain: "Three large suitcases, plus a small front boot" },
          { label: "Seats", value: "5" },
          { label: "Ground clearance", value: "190 mm" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Home charging", value: "About ₹1.2 per km", plain: "At a typical domestic tariff" },
          { label: "Full charge cost", value: "Around ₹280 at home" },
          { label: "Battery warranty", value: "8 years / 1,60,000 km" },
          { label: "Service interval", value: "Every 15,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Bharat NCAP", value: "5 stars (adult and child)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Also fitted", value: "Stability control, hill-descent, 360° camera" },
        ],
      },
    ],
    variants: [
      {
        id: "smart",
        name: "Smart",
        exShowroom: 10_00_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The short-range version — fine as a purely local second car.",
        keyKit: ["25 kWh battery", "6 airbags", "Rear camera"],
      },
      {
        id: "adventure",
        name: "Adventure",
        exShowroom: 11_50_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "Adds the touchscreen and automatic climate control.",
        keyKit: ["10.25\" touchscreen", "Automatic climate control", "Cruise control", "Alloy wheels"],
      },
      {
        id: "empowered-lr",
        name: "Empowered Long Range",
        exShowroom: 12_50_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The one worth buying — the bigger battery changes the car.",
        keyKit: ["35 kWh battery", "Sunroof", "Ventilated seats", "Wireless charging"],
        isValuePick: true,
      },
      {
        id: "empowered-plus-lr",
        name: "Empowered+ Long Range",
        exShowroom: 13_20_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "Adds the 360° camera and a premium audio setup.",
        keyKit: ["360° camera", "JBL audio", "Air purifier", "Electric driver seat"],
      },
    ],
    colours: [
      { id: "empowered-oxide", name: "Empowered Oxide", swatch: ["#8a6a44"] },
      { id: "pristine-white", name: "Pristine White", swatch: ["#f2f4f5"] },
      { id: "daytona-grey", name: "Daytona Grey", swatch: ["#5f646a"] },
      { id: "fearless-red", name: "Fearless Red", swatch: ["#a81f2b"], premium: 15_000 },
      { id: "seaweed", name: "Seaweed", swatch: ["#4a6b62"] },
    ],
    reviews: {
      ownerRating: 4.2,
      ownerCount: 738,
      expertRating: 4.1,
      loved: [
        "Running cost is a fifth of a petrol car",
        "Instant pull from a standstill in traffic",
        "Silent cabin around town",
      ],
      watchOut: [
        "Range drops noticeably on the highway",
        "Public charging outside big cities is unreliable",
        "You really do need a home charging point",
      ],
      quotes: [
        {
          author: "Vikram T.",
          city: "Pune",
          months: 13,
          rating: 5,
          text: "Charge it twice a week in my parking spot and my monthly fuel spend went from about ₹9,000 to ₹1,600. For city use it is unbeatable maths.",
        },
        {
          author: "Ayesha F.",
          city: "Kolkata",
          months: 5,
          rating: 4,
          text: "Brilliant in town, stressful on the highway. I did Kolkata to Digha and spent the whole trip watching the range readout. Know what you are buying.",
        },
      ],
    },
    rivals: [
      {
        brand: "MG",
        model: "Windsor EV",
        priceFrom: 13_99_000,
        stars: 4,
        oneLiner: "Roomier and smoother, with a battery-rental option.",
        edge: "Far more rear space and a battery subscription that cuts the upfront price.",
        gap: "Four-star safety rating and a firmer feel over bumps.",
      },
      {
        brand: "Tata",
        model: "Nexon EV",
        priceFrom: 12_49_000,
        stars: 5,
        oneLiner: "The bigger sibling, with about 100 km more range.",
        edge: "Around 425 km of real range, and a more grown-up highway ride.",
        gap: "Costs meaningfully more and is harder to park.",
      },
      {
        brand: "Citroen",
        model: "eC3",
        priceFrom: 11_61_000,
        stars: 3,
        oneLiner: "Cheaper, but well behind on safety and features.",
        edge: "Lower entry price and a genuinely soft ride.",
        gap: "No sunroof, sparse equipment, weaker crash performance.",
      },
    ],
  },

  "maruti-ertiga": {
    overview:
      "The Ertiga exists to move seven people cheaply, and nothing else does that job as well for the money. The CNG version costs about ₹3.4 per kilometre with a full load. Be clear-eyed about the compromises: it is a three-star car, and with all seven seats up the boot holds almost nothing.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "1.5-litre petrol with factory CNG" },
          { label: "Power", value: "88 bhp on CNG", plain: "Fine when empty, works hard fully loaded" },
          { label: "Gearbox", value: "5-speed manual" },
          { label: "Also sold as", value: "Petrol manual, and a 6-speed petrol automatic" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Length", value: "4,395 mm" },
          { label: "Seats", value: "7", plain: "Third row is usable by adults on shorter trips" },
          { label: "Boot with 7 up", value: "209 litres", plain: "A couple of soft bags, no more" },
          { label: "Boot with 5 up", value: "550 litres", plain: "Fold row three and it swallows luggage" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "22 km/kg CNG", plain: "Measured with all seven seats occupied" },
          { label: "Cost per km", value: "₹3.4" },
          { label: "Service interval", value: "Every 10,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Global NCAP", value: "3 stars (adult)" },
          { label: "Airbags", value: "6 as standard" },
          { label: "Also fitted", value: "Stability control, hill-hold, reverse camera" },
        ],
      },
    ],
    variants: [
      {
        id: "lxi",
        name: "LXi",
        exShowroom: 8_80_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Seven seats at the lowest possible price.",
        keyKit: ["6 airbags", "Stability control", "Manual air conditioning"],
      },
      {
        id: "vxi-cng",
        name: "VXi CNG",
        exShowroom: 10_70_000,
        gearbox: "Manual",
        fuel: "CNG",
        headline: "The value pick — cheapest way to move seven people.",
        keyKit: ["Factory CNG", "7\" touchscreen", "Rear air-con vents", "Reverse camera"],
        isValuePick: true,
      },
      {
        id: "zxi-plus",
        name: "ZXi+",
        exShowroom: 12_20_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Adds automatic climate control and alloys.",
        keyKit: ["9\" touchscreen", "Automatic climate control", "Alloy wheels", "Cruise control"],
      },
      {
        id: "zxi-plus-cng",
        name: "ZXi+ CNG",
        exShowroom: 12_90_000,
        gearbox: "Manual",
        fuel: "CNG",
        headline: "Top trim with the cheap-to-run gas tank.",
        keyKit: ["Factory CNG", "Roof-mounted rear vents", "Auto climate control", "360° camera"],
      },
    ],
    colours: [
      { id: "pearl-white", name: "Pearl Arctic White", swatch: ["#f3f5f6"] },
      { id: "splendid-silver", name: "Splendid Silver", swatch: ["#b4b9be"] },
      { id: "magma-grey", name: "Magma Grey", swatch: ["#5d6268"] },
      { id: "auburn-red", name: "Auburn Red", swatch: ["#8c2b2f"], premium: 13_000 },
      { id: "dignity-brown", name: "Dignity Brown", swatch: ["#4f3a30"] },
    ],
    reviews: {
      ownerRating: 4.0,
      ownerCount: 4_512,
      expertRating: 3.8,
      loved: [
        "Genuinely usable third row for adults",
        "CNG running cost is hard to argue with",
        "Cheap, predictable servicing anywhere in India",
      ],
      watchOut: [
        "Only three stars for adult crash protection",
        "Almost no boot when all seven seats are up",
        "Struggles on hills with a full load",
      ],
      quotes: [
        {
          author: "Suresh B.",
          city: "Jaipur",
          months: 28,
          rating: 4,
          text: "Three generations in one car every weekend. Nothing else does that for this money. I did have to accept the three-star rating, which I still think about.",
        },
        {
          author: "Lakshmi V.",
          city: "Chennai",
          months: 16,
          rating: 4,
          text: "We use rows two and three daily for the school run and fold them for airport trips. Just do not expect to carry seven people and their suitcases at the same time.",
        },
      ],
    },
    rivals: [
      {
        brand: "Kia",
        model: "Carens",
        priceFrom: 10_52_000,
        stars: 5,
        oneLiner: "Much safer and better equipped, and costs more to run.",
        edge: "Five-star crash rating and a far longer feature list.",
        gap: "No factory CNG, so running costs are roughly double.",
      },
      {
        brand: "Toyota",
        model: "Rumion",
        priceFrom: 10_44_000,
        stars: 3,
        oneLiner: "The same car with a Toyota badge and warranty.",
        edge: "Longer standard warranty and Toyota's service reputation.",
        gap: "Fewer colour and trim choices, slightly higher price.",
      },
      {
        brand: "Maruti Suzuki",
        model: "XL6",
        priceFrom: 11_71_000,
        stars: 3,
        oneLiner: "Six seats with captain chairs instead of seven.",
        edge: "Middle-row captain seats are far more comfortable.",
        gap: "You lose the seventh seat entirely.",
      },
    ],
  },

  "royal-enfield-classic-350": {
    overview:
      "The Classic 350 is the bike people buy when they want to look like they have somewhere unhurried to be. The thump is the point, the seat is a sofa, and the riding position is upright enough that a two-hour ride does not leave you folded in half. It is not the fastest 350, and it is not trying to be.",
    specGroups: [
      {
        label: "Engine & ride",
        items: [
          { label: "Engine", value: "349 cc air-oil cooled", plain: "The slow, even beat you can hear from the next street" },
          { label: "Power", value: "20 bhp", plain: "Enough for town and touring, not a race" },
          { label: "Gearbox", value: "5-speed manual", plain: "You will be shifting, but the clutch is light" },
          { label: "Also sold as", value: "Halcyon, Signals, Dark and Chrome" },
        ],
      },
      {
        label: "Size & comfort",
        items: [
          { label: "Seat height", value: "805 mm", plain: "Most riders can put both feet down at a signal" },
          { label: "Weight", value: "195 kg", plain: "Heavy to paddle in a crowded parking lot" },
          { label: "Pillion", value: "Proper two-up seat", plain: "A passenger can last a highway stretch" },
          { label: "Luggage", value: "None as standard", plain: "Add panniers if you tour" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "35 km/l", plain: "Touring pace, not a laboratory claim" },
          { label: "Service interval", value: "Every 5,000 km or 6 months" },
        ],
      },
    ],
    variants: [
      {
        id: "halcyon",
        name: "Halcyon",
        exShowroom: 1_93_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The way in — same engine, simpler paint and switchgear.",
        keyKit: ["Dual-channel ABS", "Analogue-digital cluster", "LED headlamp"],
      },
      {
        id: "signals",
        name: "Signals",
        exShowroom: 2_05_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The trim most buyers choose — period colours and spoke wheels.",
        keyKit: ["Spoke wheels", "Tripper navigation pod", "Period badging"],
        isValuePick: true,
      },
      {
        id: "dark",
        name: "Dark",
        exShowroom: 2_15_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Blacked-out metal for riders who want less chrome.",
        keyKit: ["Blacked-out engine", "Alloy wheels", "USB charging"],
      },
      {
        id: "chrome",
        name: "Chrome",
        exShowroom: 2_30_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The dressy one — chrome tank and matching bits.",
        keyKit: ["Chrome tank panels", "Alloy wheels", "Tripper navigation"],
      },
    ],
    colours: [
      { id: "halcyon-green", name: "Halcyon Green", swatch: ["#4a5d4e"] },
      { id: "madras-red", name: "Madras Red", swatch: ["#8f2b2b"] },
      { id: "jodhpur-blue", name: "Jodhpur Blue", swatch: ["#2f4b7c"] },
      { id: "chrome-bronze", name: "Chrome Bronze", swatch: ["#8a6a44"] },
    ],
    reviews: {
      ownerRating: 4.3,
      ownerCount: 6_210,
      expertRating: 4.1,
      loved: [
        "The idle sound is the reason people buy it",
        "Upright touring posture over long weekend rides",
        "Dealers and spare parts almost everywhere",
      ],
      watchOut: [
        "Heavy to shuffle in tight parking",
        "Vibration at highway speeds is part of the character",
        "Two-wheelers are not crash-rated in India",
      ],
      quotes: [
        {
          author: "Arjun M.",
          city: "Lucknow",
          months: 18,
          rating: 5,
          text: "Sunday mornings on the Raebareli road. I did not buy it to be first at the lights — I bought it because it sounds like a motorcycle should.",
        },
        {
          author: "Neha S.",
          city: "Pune",
          months: 11,
          rating: 4,
          text: "Comfortable two-up to Lonavala. Parking at the office is the only part I still find clumsy.",
        },
      ],
    },
    rivals: [
      {
        brand: "Honda",
        model: "H'ness CB350",
        priceFrom: 2_10_000,
        stars: 0,
        oneLiner: "Smoother, more refined, and a little less of a character piece.",
        edge: "Quieter engine and a more modern switchgear feel.",
        gap: "Does not have the same idle thump or dealer density.",
      },
      {
        brand: "Jawa",
        model: "42",
        priceFrom: 1_98_000,
        stars: 0,
        oneLiner: "Similar retro look, lighter to handle in town.",
        edge: "Easier to paddle around a crowded parking lot.",
        gap: "Service network is thinner outside the big cities.",
      },
    ],
  },

  "tvs-iqube": {
    overview:
      "The iQube is the electric scooter for people who are done with petrol queues and still want a floorboard they can actually use. It is quiet, the app shows you the remaining range in kilometres rather than percentage, and the home charger is a three-pin plug. Range anxiety is real on a long highway — this is a city machine.",
    specGroups: [
      {
        label: "Motor & charge",
        items: [
          { label: "Motor", value: "Hub motor, single speed", plain: "Twist and go — no gears, no clutch" },
          { label: "Battery", value: "2.2 to 5.1 kWh depending on trim", plain: "Bigger pack, longer weekday range" },
          { label: "Charge", value: "Home 3-pin, 4–5 hours", plain: "Plug it in when you park for the night" },
        ],
      },
      {
        label: "Size & practicality",
        items: [
          { label: "Under-seat storage", value: "Fits a full-face helmet", plain: "Plus a small grocery bag" },
          { label: "Pillion", value: "Flat floorboard", plain: "A second rider stands comfortably at signals" },
          { label: "Weight", value: "Around 118 kg", plain: "Light enough to park by hand" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world range", value: "About 75 km per charge on the 3.4 kWh", plain: "City speeds, mixed traffic, air-con off at home" },
          { label: "Cost per km", value: "A few paise on a home tariff" },
        ],
      },
    ],
    variants: [
      {
        id: "iqube-22",
        name: "iQube 2.2 kWh",
        exShowroom: 94_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The short-commute pack — cheapest way onto an electric scooter.",
        keyKit: ["Home charger", "App range display", "LED lighting"],
      },
      {
        id: "iqube-34",
        name: "iQube 3.4 kWh",
        exShowroom: 1_17_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The one most buyers pick — a full week of city riding.",
        keyKit: ["Larger battery", "Navigation", "USB charging"],
        isValuePick: true,
      },
      {
        id: "iqube-s",
        name: "iQube S",
        exShowroom: 1_25_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "Adds a TFT cluster and more kit for daily riders.",
        keyKit: ["TFT display", "Bluetooth", "Park-assist reverse"],
      },
      {
        id: "iqube-st",
        name: "iQube ST",
        exShowroom: 1_45_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The touring-leaning pack with the biggest battery in the line-up.",
        keyKit: ["Largest battery", "TFT", "Cruise-style assist"],
      },
    ],
    colours: [
      { id: "pearl-white", name: "Pearl White", swatch: ["#f2f4f5"] },
      { id: "titanium-grey", name: "Titanium Grey", swatch: ["#6a6f75"] },
      { id: "lucid-red", name: "Lucid Red", swatch: ["#a5232c"] },
      { id: "starlight-blue", name: "Starlight Blue", swatch: ["#26456f"] },
    ],
    reviews: {
      ownerRating: 4.1,
      ownerCount: 3_840,
      expertRating: 4.0,
      loved: [
        "Silent crawl in morning traffic",
        "Home charging from a normal plug",
        "Floorboard space for a grocery bag",
      ],
      watchOut: [
        "Highway trips need a charging plan",
        "Winter range is shorter than the brochure",
        "Two-wheelers are not crash-rated in India",
      ],
      quotes: [
        {
          author: "Ritika P.",
          city: "Noida",
          months: 9,
          rating: 4,
          text: "Office and back, every day, and I have not stood at a petrol pump since April. I would not take it to Haridwar without a charge stop.",
        },
        {
          author: "Imran K.",
          city: "Bengaluru",
          months: 14,
          rating: 4,
          text: "The app number matches what I actually get. That is rarer than it should be.",
        },
      ],
    },
    rivals: [
      {
        brand: "Ather",
        model: "Rizta",
        priceFrom: 1_25_000,
        stars: 0,
        oneLiner: "More family-scooter space, usually a higher sticker.",
        edge: "Bigger floorboard and a more car-like seat.",
        gap: "Costs more, and home charging is similar.",
      },
      {
        brand: "Ola",
        model: "S1 X",
        priceFrom: 90_000,
        stars: 0,
        oneLiner: "Cheaper on paper, with a very different service experience.",
        edge: "Lower entry price on some packs.",
        gap: "TVS's dealer network is the safer long-term bet for most owners.",
      },
    ],
  },

  "mahindra-thar": {
    overview:
      "The Thar ROXX is the five-door Thar: you still get the boxy stance and a proper 4x4 option, but the cabin is now something you can live with every weekday. The diesel automatic is the one that makes sense if the weekday is a city commute and the weekend is a dirt track. It drinks diesel, and it is tall — both are the point.",
    specGroups: [
      {
        label: "Engine & gearbox",
        items: [
          { label: "Engine", value: "2.2-litre diesel or 2.0-litre turbo petrol" },
          { label: "Power", value: "172 bhp (diesel)", plain: "Enough to climb, not to race" },
          { label: "Gearbox", value: "6-speed automatic", plain: "The weekday version — no clutch in traffic" },
          { label: "Also sold as", value: "Petrol manual, diesel 4x2 and 4x4" },
        ],
      },
      {
        label: "Size & space",
        items: [
          { label: "Doors", value: "5", plain: "Rear passengers no longer climb over a barrel" },
          { label: "Boot", value: "About 3 large suitcases", plain: "Weekend kit, not a family airport run" },
          { label: "Seats", value: "5" },
          { label: "Ground clearance", value: "233 mm", plain: "Ruts and water crossings are the brief" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "11 km/l diesel", plain: "City plus a weekend trail, air-con on" },
          { label: "Service interval", value: "Every 10,000 km or 12 months" },
        ],
      },
      {
        label: "Safety",
        items: [
          { label: "Bharat NCAP", value: "5 stars" },
          { label: "Airbags", value: "6 on popular trims" },
          { label: "Also fitted", value: "Stability control, hill-descent, 360° camera on AX7 L" },
        ],
      },
    ],
    variants: [
      {
        id: "mx1",
        name: "MX1 Petrol",
        exShowroom: 12_99_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The way in — same shape, fewer toys.",
        keyKit: ["6 airbags", "Manual climate control", "Rear camera"],
      },
      {
        id: "ax5",
        name: "AX5 Petrol",
        exShowroom: 15_49_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "Adds the screen and the kit you will actually use.",
        keyKit: ["Touchscreen", "Cruise control", "Alloy wheels"],
      },
      {
        id: "ax7l",
        name: "AX7 L Diesel Automatic",
        exShowroom: 18_99_000,
        gearbox: "Automatic",
        fuel: "Diesel",
        headline: "The weekday-and-weekend trim most buyers sign.",
        keyKit: ["Torque-converter automatic", "Sunroof", "360° camera", "ADAS on this trim"],
        isValuePick: true,
      },
      {
        id: "ax7l-4wd",
        name: "AX7 L Diesel 4WD Automatic",
        exShowroom: 21_49_000,
        gearbox: "Automatic",
        fuel: "Diesel",
        headline: "The one you want if the dirt is not optional.",
        keyKit: ["Selectable 4WD", "Hill-descent", "All-terrain tyres"],
      },
    ],
    colours: [
      { id: "everest-white", name: "Everest White", swatch: ["#f3f5f6"] },
      { id: "napoli-black", name: "Napoli Black", swatch: ["#14161a"] },
      { id: "deep-forest", name: "Deep Forest", swatch: ["#3d4a38"] },
      { id: "stealth-black", name: "Stealth Black", swatch: ["#2a2c2e"] },
    ],
    reviews: {
      ownerRating: 4.3,
      ownerCount: 1_240,
      expertRating: 4.2,
      loved: [
        "Looks like a Thar, seats like a family SUV",
        "Diesel automatic is calm in city traffic",
        "Ground clearance you can see from the pavement",
      ],
      watchOut: [
        "Fuel bills are not compact-SUV bills",
        "Width and height need a measured garage",
        "Soft-roader tyres on lower trims are not trail rubber",
      ],
      quotes: [
        {
          author: "Rohit K.",
          city: "Gurugram",
          months: 8,
          rating: 5,
          text: "Weekdays to Cyber Hub, Sundays toward Alwar. The five doors are why my parents finally agreed to sit in the back.",
        },
        {
          author: "Meera D.",
          city: "Pune",
          months: 5,
          rating: 4,
          text: "It drinks diesel and I knew that. What I did not expect is how easy the automatic is in Baner traffic.",
        },
      ],
    },
    rivals: [
      {
        brand: "Mahindra",
        model: "Thar 3-door",
        priceFrom: 11_35_000,
        stars: 4,
        oneLiner: "The original — more character, less cabin.",
        edge: "Lighter, cheaper, and still the poster Thar.",
        gap: "Rear passengers climb in. Weekend luggage is a negotiation.",
      },
      {
        brand: "Maruti Suzuki",
        model: "Jimny",
        priceFrom: 12_74_000,
        stars: 3,
        oneLiner: "A proper 4x4 in a much smaller box.",
        edge: "Easier to park, and a genuine low-range gearbox.",
        gap: "Four seats only, and a three-star crash score.",
      },
      {
        brand: "Force",
        model: "Gurkha",
        priceFrom: 16_75_000,
        stars: 0,
        oneLiner: "More tractor than lifestyle SUV.",
        edge: "Serious off-road hardware for the money.",
        gap: "Ride and cabin are from another decade.",
      },
    ],
  },

  "ola-s1": {
    overview:
      "The S1 is the scooter you charge in a basement, not the one you queue for at a pump. The Pro pack is the one that survives a full week of office runs. Service and software updates are the conversation every owner has — buy it if you can live with a phone-app brand, not if you want a neighbourhood mechanic on speed-dial.",
    specGroups: [
      {
        label: "Motor & battery",
        items: [
          { label: "Battery", value: "Up to 4 kWh on Pro packs" },
          { label: "Real-world range", value: "About 110–140 km", plain: "City riding with a pillion some days" },
          { label: "Home charging", value: "A normal 5A socket overnight" },
        ],
      },
      {
        label: "Size & use",
        items: [
          { label: "Under-seat", value: "A full-face helmet on most packs" },
          { label: "Floorboard", value: "A grocery bag, not a crate" },
          { label: "Seats", value: "2" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Home charging", value: "About 25–40 paise per km" },
          { label: "Service", value: "App-led; confirm a hub in your city first" },
        ],
      },
    ],
    variants: [
      {
        id: "s1x",
        name: "S1 X",
        exShowroom: 80_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The short-range pack — a second scooter, not a touring tool.",
        keyKit: ["Smaller battery", "Digital cluster", "App lock"],
      },
      {
        id: "s1-air",
        name: "S1 Air",
        exShowroom: 90_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "A middle pack if you only commute across one city.",
        keyKit: ["Mid battery", "Cruise mode", "USB charge"],
      },
      {
        id: "s1-pro",
        name: "S1 Pro",
        exShowroom: 1_15_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The pack most owners should actually sign.",
        keyKit: ["Larger battery", "Better range", "Ride modes"],
        isValuePick: true,
      },
      {
        id: "s1-pro-plus",
        name: "S1 Pro+",
        exShowroom: 1_40_000,
        gearbox: "Single-speed",
        fuel: "Electric",
        headline: "The top pack if you want the longest weekday buffer.",
        keyKit: ["Largest battery", "Faster home charge on some kits"],
      },
    ],
    colours: [
      { id: "porcelain-white", name: "Porcelain White", swatch: ["#f4f6f7"] },
      { id: "midnight-blue", name: "Midnight Blue", swatch: ["#1c3558"] },
      { id: "jet-black", name: "Jet Black", swatch: ["#16181c"] },
      { id: "liquid-silver", name: "Liquid Silver", swatch: ["#b8bec4"] },
    ],
    reviews: {
      ownerRating: 3.9,
      ownerCount: 5_120,
      expertRating: 3.8,
      loved: [
        "Home charging kills the petrol-pump ritual",
        "Silent roll-off in a housing society",
        "The Pro range lasts a working week for many",
      ],
      watchOut: [
        "Service wait times vary wildly by city",
        "Software updates have left some owners stranded",
        "Two-wheelers are not crash-rated in India",
      ],
      quotes: [
        {
          author: "Karan J.",
          city: "Bengaluru",
          months: 10,
          rating: 4,
          text: "I charge it next to the washing machine. That is the whole review. I would not buy it in a town without an Ola hub.",
        },
        {
          author: "Sneha R.",
          city: "Mumbai",
          months: 7,
          rating: 3,
          text: "The scooter is fine. Getting a part replaced took three weeks. Ask about the nearest service hub before you pay.",
        },
      ],
    },
    rivals: [
      {
        brand: "TVS",
        model: "iQube",
        priceFrom: 94_000,
        stars: 0,
        oneLiner: "The safer service-network bet for most cities.",
        edge: "A dealer you can walk into, almost everywhere.",
        gap: "Less of the 'app scooter' theatre.",
      },
      {
        brand: "Ather",
        model: "450X",
        priceFrom: 1_30_000,
        stars: 0,
        oneLiner: "Sharper to ride, usually dearer.",
        edge: "The best fast-scooter chassis in this price band.",
        gap: "You pay for that chassis.",
      },
    ],
  },

  "ducati-panigale-v4": {
    overview:
      "The Panigale V4 is a race bike with lights and a number plate. It is loud, low, and expensive to register in every state we quote. Buy it if you already know how a superbike sits — not as a first motorcycle, and not as a daily through Lucknow traffic. The V4 S is the one most buyers who have done the homework actually take home.",
    specGroups: [
      {
        label: "Engine & ride",
        items: [
          { label: "Engine", value: "1,103 cc V4" },
          { label: "Power", value: "About 215 bhp", plain: "Track figures. On the road you will use a sliver." },
          { label: "Gearbox", value: "6-speed with a quickshifter", plain: "You still have a clutch lever; you rarely need it" },
        ],
      },
      {
        label: "Size & use",
        items: [
          { label: "Seat height", value: "About 850 mm", plain: "A stretch at every signal if you are not tall" },
          { label: "Pillion", value: "A pad, not a seat", plain: "An hour is a conversation" },
          { label: "Luggage", value: "None", plain: "A tank bag if you insist" },
        ],
      },
      {
        label: "Running costs",
        items: [
          { label: "Real-world economy", value: "About 14 km/l", plain: "Touring pace, not a laboratory claim" },
          { label: "Service", value: "Ducati workshops only — budget for it" },
        ],
      },
    ],
    variants: [
      {
        id: "v4",
        name: "Panigale V4",
        exShowroom: 27_50_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The way into the V4 family.",
        keyKit: ["V4 engine", "Riding modes", "Quickshifter"],
      },
      {
        id: "v4s",
        name: "Panigale V4 S",
        exShowroom: 33_50_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The trim most buyers who have ridden one actually choose.",
        keyKit: ["Öhlins suspension", "Lighter wheels", "Cornering ABS"],
        isValuePick: true,
      },
      {
        id: "v4s-corse",
        name: "Panigale V4 S Corse",
        exShowroom: 36_00_000,
        gearbox: "Manual",
        fuel: "Petrol",
        headline: "The dressy S — same engine, louder livery.",
        keyKit: ["Corse paint", "Öhlins kit", "Termignoni option on some packs"],
      },
    ],
    colours: [
      { id: "ducati-red", name: "Ducati Red", swatch: ["#c8102e"] },
      { id: "dark-stealth", name: "Dark Stealth", swatch: ["#1a1c1f"] },
    ],
    reviews: {
      ownerRating: 4.6,
      ownerCount: 186,
      expertRating: 4.7,
      loved: [
        "The sound is why people cross the showroom",
        "Electronics that keep a very fast bike usable",
        "It still looks like the poster after a year",
      ],
      watchOut: [
        "Wrists and neck on a two-hour highway run",
        "Service invoices are superbike invoices",
        "Two-wheelers are not crash-rated in India",
      ],
      quotes: [
        {
          author: "Aditya S.",
          city: "Mumbai",
          months: 14,
          rating: 5,
          text: "I keep a scooter for the office. This is Sunday and the Western Express at 6 a.m. It is not a commuter and I did not pretend it was.",
        },
        {
          author: "Farhan A.",
          city: "Delhi",
          months: 9,
          rating: 4,
          text: "The S is the one. The base V4 is still a Panigale, but once you have sat on the Öhlins you will not go back.",
        },
      ],
    },
    rivals: [
      {
        brand: "BMW",
        model: "S 1000 RR",
        priceFrom: 20_90_000,
        stars: 0,
        oneLiner: "The more usable superbike for Indian roads.",
        edge: "A slightly less extreme riding position, and more dealers.",
        gap: "It will never sound like a V4.",
      },
      {
        brand: "Aprilia",
        model: "RSV4",
        priceFrom: 23_69_000,
        stars: 0,
        oneLiner: "The other Italian V4, usually a shade calmer.",
        edge: "Electronics and a chassis people praise on track days.",
        gap: "Fewer workshops outside the big cities.",
      },
    ],
  },
};
