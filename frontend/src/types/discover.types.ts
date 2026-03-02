export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rating?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchServiceParams {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
}

export interface AvailabilityFilterParams {
  date: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}
