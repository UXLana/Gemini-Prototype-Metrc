import { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Cannabis-Infused Blood Raspberries",
    licenseNumber: "12345-NG-567890",
    brand: "Wyld",
    category: "Edibles",
    subspecies: "Sativa",
    strain: "Hybrid",
    potency: "10 mg THC",
    feelings: ["Inspired", "Energetic"],
    description: "Our Blood Orange CBC gummies are made with real fruit and a Sativa enhanced botanical terpene blend, making them a great addition to a day out and about.",
    markets: ["CA", "NV"],
    totalMarkets: 2,
    imageUrl: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?auto=format&fit=crop&q=80&w=800", // Red gummy/jelly texture
    upc: "892123000001"
  },
  {
    id: "prod_2",
    name: "Cannabis-Infused Sour Apple Gummies",
    licenseNumber: "12345-NG-567891",
    brand: "Wyld",
    category: "Edibles",
    subspecies: "Indica",
    strain: "Indica Dominant",
    potency: "10 mg THC",
    feelings: ["Relaxed", "Sleepy"],
    description: "Perfect for unwinding after a long day, these sour apple gummies pack a punch with natural fruit flavors.",
    markets: ["CA", "OR", "WA"],
    totalMarkets: 3,
    imageUrl: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?auto=format&fit=crop&q=80&w=800", // Green/Yellow gummy bears
    upc: "892123000002"
  },
  {
    id: "prod_3",
    name: "Elderberry Sleep Gummies",
    licenseNumber: "98765-AB-123456",
    brand: "Wyld",
    category: "Edibles",
    subspecies: "Hybrid",
    strain: "Pure CBN",
    potency: "10 mg CBN",
    feelings: ["Sleepy", "Calm"],
    description: "Enhanced with CBN to promote restful sleep without the grogginess the next morning.",
    markets: ["CA"],
    totalMarkets: 1,
    imageUrl: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", // Dark purple berries/gummies
    upc: "892123000003"
  }
];