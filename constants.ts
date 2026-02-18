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
    imageUrl: "https://picsum.photos/id/1080/400/400",
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
    imageUrl: "https://picsum.photos/id/1060/400/400",
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
    imageUrl: "https://picsum.photos/id/102/400/400",
    upc: "892123000003"
  }
];