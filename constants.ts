import { Product, DashboardProduct } from "./types";

// Helper for consistent high-quality images
const IMAGES = {
  // Colorful gummies that look like Wyld (Fruit gummies on dark or clean background)
  WYLD_GUMMIES: "https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=800", 
  // Premium flower jar that looks like Kynd (Glass jar with buds)
  KYND_FLOWER: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?auto=format&fit=crop&q=80&w=800",
  // Vape pen
  VAPE_PEN: "https://images.unsplash.com/photo-1527661591478-9588939c4a87?auto=format&fit=crop&q=80&w=800",
  // Pre-roll
  PRE_ROLLS: "https://images.unsplash.com/photo-1528460033278-a6ba57020470?auto=format&fit=crop&q=80&w=800",
  // Concentrate
  CONCENTRATE: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=800",
  // Chocolate
  CHOCOLATE: "https://images.unsplash.com/photo-1511381971708-4122d2122615?auto=format&fit=crop&q=80&w=800",
  // Fallback
  FALLBACK: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800"
};

export const ALL_MARKETS = [
  { id: 'CA', name: 'California', active: true },
  { id: 'CO', name: 'Colorado', active: true },
  { id: 'MI', name: 'Michigan', active: true },
  { id: 'NV', name: 'Nevada', active: true },
  { id: 'OR', name: 'Oregon', active: true },
  { id: 'MA', name: 'Massachusetts', active: true },
  { id: 'AZ', name: 'Arizona', active: true },
  { id: 'FL', name: 'Florida', active: true },
  { id: 'IL', name: 'Illinois', active: true },
  { id: 'NY', name: 'New York', active: false }, 
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Raspberry Sativa Gummies",
    licenseNumber: "12345-NG-567890",
    brand: "Wyld",
    category: "Edibles",
    subspecies: "Sativa",
    strain: "Raspberry",
    potency: "100 mg of THC", 
    feelings: ["Inspired", "Energetic"], 
    description: "Made with real fruit and botanical terpenes, these Sativa gummies are great for outdoor adventures.",
    markets: ["CA", "NV", "OR", "CO"],
    totalMarkets: 4,
    imageUrl: IMAGES.WYLD_GUMMIES,
    upc: "892123000001"
  },
  {
    id: "prod_2",
    name: "Kynd Premium Flower - Kush Mints",
    licenseNumber: "KYND-001-NV",
    brand: "Kynd",
    category: "Flower",
    subspecies: "Hybrid",
    strain: "Kush Mints",
    potency: "28% THC",
    feelings: ["Relaxed", "Euphoric"],
    description: "Kush Mints is a hybrid marijuana strain obtained by crossing Animal Mints with Bubba Kush.",
    markets: ["NV", "MA", "FL"],
    totalMarkets: 3,
    imageUrl: IMAGES.KYND_FLOWER,
    upc: "KYND123456"
  },
  {
    id: "prod_3",
    name: "Midnight Blueberry Sleep Gummies",
    licenseNumber: "KIVA-998-CA",
    brand: "Kiva / Camino",
    category: "Edibles",
    subspecies: "Indica",
    strain: "Midnight Blueberry",
    potency: "10 mg of THC",
    feelings: ["Relaxed", "Euphoric"],
    description: "Settling in for a quiet night? Let the calming combination of THC and CBN put you to bed.",
    markets: ["CA", "MI", "IL"],
    totalMarkets: 3,
    imageUrl: IMAGES.CHOCOLATE, 
    upc: "KIVA998877"
  }
];

export const DASHBOARD_PRODUCTS: DashboardProduct[] = [
  {
    id: "dash_1",
    type: "Product",
    name: "Elderberry Indica Gummies",
    licenseNumber: "WYLD-IND-001",
    brands: ["Wyld"],
    category: "Edibles",
    potency: "100 mg of THC",
    markets: ["CA", "NV", "OR", "AZ", "MI"],
    totalMarkets: 5,
    imageUrl: IMAGES.WYLD_GUMMIES
  },
  {
    id: "dash_2",
    type: "Product",
    name: "Kynd - Blackwater OG (3.5g)",
    licenseNumber: "KYND-BW-002",
    brands: ["Kynd"],
    category: "Flower",
    potency: "24% THC",
    markets: ["NV", "FL"],
    totalMarkets: 2,
    imageUrl: IMAGES.KYND_FLOWER
  },
  {
    id: "dash_3",
    type: "Product",
    name: "Heavy Hitters - Northern Lights Cart",
    licenseNumber: "HH-VAPE-99",
    brands: ["Heavy Hitters"],
    category: "Vape",
    potency: "90% THC",
    markets: ["CA", "NY"],
    totalMarkets: 2,
    imageUrl: IMAGES.VAPE_PEN
  },
  {
    id: "dash_4",
    type: "Bundle",
    name: "Summer Vibes Starter Pack",
    licenseNumber: "BNDL-SUM-2024",
    brands: ["Wyld", "Kynd"],
    subProducts: ["Wyld Peach Hybrid Gummies", "Kynd 1g Pre-Roll"],
    markets: ["NV"],
    totalMarkets: 1,
    imageUrl: IMAGES.WYLD_GUMMIES
  },
  {
    id: "dash_5",
    type: "Product",
    name: "710 Labs - Persy Rosin",
    licenseNumber: "710-CONC-88",
    brands: ["710 Labs"],
    category: "Concentrate",
    potency: "78% THC",
    markets: ["CA", "CO", "FL"],
    totalMarkets: 3,
    imageUrl: IMAGES.CONCENTRATE
  },
  {
    id: "dash_6",
    type: "Product",
    name: "Lowell Smokes - The Hybrid",
    licenseNumber: "LOW-PR-44",
    brands: ["Lowell Farms"],
    category: "Pre-Roll",
    potency: "20% THC",
    markets: ["CA"],
    totalMarkets: 1,
    imageUrl: IMAGES.PRE_ROLLS
  }
];