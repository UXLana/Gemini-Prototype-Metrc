
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
  status?: 'Active' | 'Inactive';
  // Extended fields for detail view consistency
  subspecies?: string;
  strain?: string;
  feelings?: string[];
  description?: string;
}

export enum ViewState {
  SEARCH = 'SEARCH',
  CONFIRM = 'CONFIRM',
  MARKET_SELECTION = 'MARKET_SELECTION',
  EDIT = 'EDIT',
}

export type UseCase = 'standard' | 'empty-search' | 'market-selection';
export type AppView = 'home' | 'products' | 'integrations';
export type DotAnimation = 'pulse' | 'wind';
