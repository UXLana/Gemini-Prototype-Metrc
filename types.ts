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

export enum ViewState {
  SEARCH = 'SEARCH',
  CONFIRM = 'CONFIRM',
  EDIT = 'EDIT',
}
