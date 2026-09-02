export interface MegaChild {
  label: string;
  href: string;
  cityId?: string;
  lens?: string;
}

export interface MegaItem {
  label: string;
  href: string;
  hint?: string;
  lens?: string;
  cityId?: string;
  explain?: { term: string; meaning: string };
  children?: MegaChild[];
}

export interface MegaColumn {
  title: string;
  items: MegaItem[];
}

export interface MegaCategory {
  id: string;
  label: string;
  lens?: string;
  columns: MegaColumn[];
}

export const megaCategories: MegaCategory[] = [
  {
    id: "new-cars",
    label: "New Cars",
    lens: "cars",
    columns: [
      {
        title: "Explore",
        items: [
          { label: "Explore New Cars", href: "#trending" },
          {
            label: "Electric Cars",
            href: "#trending",
            children: [
              { label: "All EVs", href: "#trending" },
              { label: "Long-range family SUVs", href: "#trending" },
              { label: "City runabouts", href: "#finder" },
            ],
          },
          {
            label: "Popular Cars",
            href: "#trending",
            children: [
              { label: "Top SUVs", href: "#trending" },
              { label: "Top sedans", href: "#trending" },
              { label: "Under ₹10 lakh", href: "#finder" },
            ],
          },
          { label: "Upcoming Cars", href: "#trending" },
          { label: "New Launches", href: "#top" },
        ],
      },
      {
        title: "Brands & tools",
        items: [
          {
            label: "Popular Brands",
            href: "#trending",
            children: [
              { label: "Tata", href: "#trending" },
              { label: "Mahindra", href: "#trending" },
              { label: "Maruti Suzuki", href: "#trending" },
              { label: "Hyundai", href: "#trending" },
              { label: "Kia", href: "#trending" },
            ],
          },
          { label: "Compare Cars", href: "#compare" },
          { label: "New Car Offers & Discounts", href: "#money" },
          { label: "Find Car Dealers", href: "#finder" },
        ],
      },
      {
        title: "On the road",
        items: [
          { label: "EV Charging Stations", href: "#finder" },
          { label: "Fuel Stations & Live Fuel Prices", href: "#money" },
          {
            label: "Gearboxes, explained",
            href: "#finder",
            explain: {
              term: "AMT",
              meaning: "A basic automatic — no clutch, but you still feel a small pause between gears.",
            },
          },
          {
            label: "Smooth automatics",
            href: "#finder",
            explain: {
              term: "Torque converter",
              meaning: "The buttery-smooth automatic — creeps forward in traffic with no clutch at all.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "used-cars",
    label: "Used Cars",
    lens: "cars",
    columns: [
      {
        title: "Buy",
        items: [
          { label: "Buy Used Cars", href: "#trending" },
          {
            label: "Used Cars in Your City",
            href: "#trending",
            children: [
              { label: "Lucknow (UP-32)", href: "#trending", cityId: "lucknow" },
              { label: "Delhi (DL)", href: "#trending", cityId: "new-delhi" },
              { label: "Mumbai (MH-01)", href: "#trending", cityId: "mumbai" },
              { label: "Bengaluru (KA-01)", href: "#trending", cityId: "bengaluru" },
            ],
          },
          { label: "Dealerships Near Me", href: "#finder" },
        ],
      },
      {
        title: "Sell",
        items: [
          { label: "Sell My Car", href: "#money", hint: "Instant valuation" },
          { label: "Used Car Valuation Tool", href: "#money" },
        ],
      },
    ],
  },
  {
    id: "bikes",
    label: "New Bikes & Two-Wheelers",
    lens: "bikes",
    columns: [
      {
        title: "Explore",
        items: [
          { label: "Explore Bikes", href: "#trending" },
          {
            label: "Superbikes",
            href: "#trending",
            children: [
              { label: "Ducati", href: "#trending" },
              { label: "Kawasaki", href: "#trending" },
              { label: "BMW Motorrad", href: "#trending" },
            ],
          },
          { label: "Electric Scooters & Bikes", href: "#trending" },
          { label: "Popular Commuters", href: "#trending" },
        ],
      },
      {
        title: "Tools",
        items: [
          { label: "Compare Bikes", href: "#compare" },
          { label: "Two-Wheeler Dealers", href: "#finder" },
        ],
      },
    ],
  },
  {
    id: "news",
    label: "News & Reviews",
    columns: [
      {
        title: "Read",
        items: [
          { label: "News & Top Stories", href: "#top" },
          { label: "Expert Road Tests", href: "#trending" },
          { label: "Verified Owner Reviews", href: "#trending" },
          { label: "Curated Car Collections", href: "#trending" },
          { label: "Layman Buying Tips & Advice", href: "#finder" },
        ],
      },
    ],
  },
  {
    id: "videos",
    label: "Videos",
    columns: [
      {
        title: "Watch",
        items: [
          { label: "Video Reviews", href: "#top" },
          { label: "Visual Stories", href: "#top", hint: "Reels-style" },
          { label: "First Drive Impressions", href: "#top" },
        ],
      },
    ],
  },
];
