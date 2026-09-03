import { catalogPath } from "@/lib/catalogue/filters";

export interface MegaChild {
  label: string;
  subtext?: string;
  href: string;
  cityId?: string;
  lens?: string;
}

export interface MegaItem {
  label: string;
  subtext?: string;
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

const cars = (params?: Parameters<typeof catalogPath>[1]) =>
  catalogPath("cars", params);
const bikes = (params?: Parameters<typeof catalogPath>[1]) =>
  catalogPath("bikes", params);

export const megaCategories: MegaCategory[] = [
  {
    id: "new-cars",
    label: "New Cars",
    lens: "cars",
    columns: [
      {
        title: "By body type",
        items: [
          {
            label: "SUVs",
            subtext: "Family crossovers and off-road 4x4s",
            href: cars({ body: "suv" }),
          },
          {
            label: "Hatchbacks",
            subtext: "City cars with a usable boot",
            href: cars({ body: "hatchback" }),
          },
          {
            label: "Sedans",
            subtext: "Highway saloons with a proper boot",
            href: cars({ body: "sedan" }),
          },
          {
            label: "MUVs",
            subtext: "7-seaters adults will sit in",
            href: cars({ body: "muv" }),
          },
        ],
      },
      {
        title: "By fuel",
        items: [
          {
            label: "Electric cars",
            subtext: "Battery-electric, real range figures",
            href: cars({ fuel: "ev" }),
          },
          {
            label: "Hybrid cars",
            subtext: "Petrol-electric when we list them",
            href: cars({ fuel: "hybrid" }),
          },
          {
            label: "CNG cars",
            subtext: "Factory gas kits, honest running cost",
            href: cars({ fuel: "cng" }),
          },
        ],
      },
      {
        title: "Popular",
        items: [
          {
            label: "Top 10 cars",
            subtext: "What buyers shortlist first this week",
            href: cars({ popular: "top10" }),
          },
          {
            label: "Best mileage cars",
            subtext: "Ranked by real-world km per litre",
            href: cars({ popular: "mileage" }),
          },
          {
            label: "Luxury cars",
            subtext: "The top of this catalogue by price",
            href: cars({ popular: "luxury" }),
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
        title: "Buy used",
        items: [
          {
            label: "Used cars in Lucknow",
            subtext: "On-road quotes for UP-32 while certified stock lists",
            href: cars({ condition: "used", city: "lucknow" }),
            cityId: "lucknow",
          },
          {
            label: "Certified pre-owned",
            subtext: "Inspected cars — catalogue expanding",
            href: cars({ condition: "used", certified: "1" }),
          },
          {
            label: "Under ₹5 lakh",
            subtext: "Entry used budget, including two-wheelers we can price",
            href: cars({ condition: "used", maxLakh: "5" }),
          },
          {
            label: "Used SUVs",
            subtext: "Tall cars with luggage room",
            href: cars({ condition: "used", body: "suv" }),
          },
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
        title: "By type",
        items: [
          {
            label: "Commuter bikes",
            subtext: "Daily rides — scooters and relaxed cruisers",
            href: bikes({ kind: "commuter" }),
          },
          {
            label: "Sports bikes",
            subtext: "Superbikes with an honest on-road number",
            href: bikes({ kind: "sports" }),
          },
          {
            label: "Cruisers",
            subtext: "Upright weekend roadsters",
            href: bikes({ kind: "cruiser" }),
          },
          {
            label: "Electric scooters",
            subtext: "Plug-in commuters, real range",
            href: bikes({ kind: "scooter" }),
          },
        ],
      },
      {
        title: "Popular brands",
        items: [
          {
            label: "Royal Enfield",
            subtext: "Classic 350 and the rest of the line-up",
            href: bikes({ brand: "royal-enfield" }),
          },
          {
            label: "TVS",
            subtext: "iQube and city two-wheelers",
            href: bikes({ brand: "tvs" }),
          },
          {
            label: "Ola",
            subtext: "S1 electric scooters",
            href: bikes({ brand: "ola" }),
          },
          {
            label: "Ducati",
            subtext: "Panigale V4 and track bikes",
            href: bikes({ brand: "ducati" }),
          },
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
          {
            label: "Expert drive reviews",
            subtext: "First drives in plain English, not brochure copy",
            href: cars({ view: "reviews" }),
          },
          {
            label: "Car buying guides",
            subtext: "Luggage, traffic and the invoice — then decide",
            href: cars({ view: "guides" }),
          },
          {
            label: "Video walkarounds",
            subtext: "Films on each vehicle page",
            href: cars({ view: "videos" }),
          },
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
          {
            label: "Car video walkarounds",
            subtext: "First-drive films and owner diaries",
            href: cars({ view: "videos" }),
          },
          {
            label: "Two-wheeler walkarounds",
            subtext: "Cruisers, scooters and superbikes on camera",
            href: bikes({ view: "videos" }),
          },
          {
            label: "Expert road tests",
            subtext: "The same reviews, with the video player on the page",
            href: cars({ view: "reviews" }),
          },
        ],
      },
    ],
  },
];
