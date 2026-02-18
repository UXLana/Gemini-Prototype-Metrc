import { Product, DashboardProduct } from "./types";

// Helper for consistent high-quality images
const IMAGES = {
  WYLD_GUMMIES: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?auto=format&fit=crop&q=80&w=800", // Gummy bears
  FLOWER_JAR: "https://images.unsplash.com/photo-1606902965551-dce0b6238b32?auto=format&fit=crop&q=80&w=800", // Dried herbs/flower
  VAPE_PEN: "https://images.unsplash.com/photo-1520186994231-6ea0019d80a6?auto=format&fit=crop&q=80&w=800", // Abstract smoke/vibe for vape
  PRE_ROLLS: "https://images.unsplash.com/photo-1555529733-146e499d372f?auto=format&fit=crop&q=80&w=800", // Rolled paper
  CONCENTRATE: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800", // Honey/oil texture
  KYND_FLOWER: "https://images.unsplash.com/photo-1536640523419-482a46645367?auto=format&fit=crop&q=80&w=800", // Premium green herbs
  CHOCOLATE: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800", // Chocolate
  FALLBACK: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800" // Fallback botanical
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Raspberry Sativa Gummies",
    licenseNumber: "12345-NG-567890",
    brand: "Wyld",
    category: "Edibles",
    subspecies: "Sativa",
    strain: "Raspberry",
    potency: "100mg THC",
    feelings: ["Energetic", "Focused"],
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
    potency: "5mg THC : 1mg CBN",
    feelings: ["Sleepy", "Calm"],
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
    potency: "100mg THC",
    markets: ["CA", "NV", "OR", "AZ", "MI"],
    totalMarkets: 5,
    imageUrl: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800" // Dark berries
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