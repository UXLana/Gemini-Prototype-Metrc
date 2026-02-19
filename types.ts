export interface Product {
  id: string;
  name: string;
  licenseNumber: string;
  brand: string;
  category: string;
  subspecies?: string;
  strain?: string;
  potency: string;
  feelings?: string[];
  description?: string;
  markets: string[];
  totalMarkets: number;
  imageUrl: string;
  upc?: string;
}

export interface DashboardProduct {
  id: string;
  type: 'Product' | 'Bundle';
  name: string;
  licenseNumber: string;
  brands: string[];
  category?: string;
  potency?: string;
  subProducts?: string[]; // For bundles
  markets: string[];
  totalMarkets: number;
  imageUrl: string;
}

export enum ViewState {
  SEARCH = 'SEARCH',
  CONFIRM = 'CONFIRM',
  MARKET_SELECTION = 'MARKET_SELECTION',
  EDIT = 'EDIT',
}