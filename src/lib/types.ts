// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiListResponse<T = any> extends ApiResponse<T[]> {
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Service Content Type
export interface ServiceContent {
  _id: string;
  slug: string;
  sectionName: string;
  title: string;
  tagline: string;
  description: string;
  poster: string;
  images?: string[];
  lists?: string[];
  designType: 'Design' | 'Simulation' | 'Manufacturing' | 'PLM' | string;
  icon: string;
  
  // Additional fields
  isActive?: boolean;
  isFeatured?: boolean;
  lastEditedAuthor?: string | AuthorInfo;
  author?: string | AuthorInfo;
  
  // Service specific fields
  industries?: string[];
  technologies?: string[];
  capabilities?: string[];
  benefits?: string[];
  pricingModel?: string;
  duration?: string;
  teamSize?: string;
  
  // SEO and metadata
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Author/Admin Info
export interface AuthorInfo {
  _id: string;
  name: string;
  email: string;
}

// API Request Types
export interface CreateServiceRequest {
  slug: string;
  sectionName: string;
  title: string;
  tagline: string;
  description: string;
  poster: string;
  images?: string[];
  lists?: string[];
  designType: string;
  icon: string;
  
  // Optional fields
  isActive?: boolean;
  isFeatured?: boolean;
  author?: string;
  lastEditedAuthor?: string;
  industries?: string[];
  technologies?: string[];
  capabilities?: string[];
  benefits?: string[];
  pricingModel?: string;
  duration?: string;
  teamSize?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  lastEditedAuthor?: string;
}

export interface BulkActionRequest {
  action: 'delete' | 'update' | 'activate' | 'deactivate';
  ids: string[];
  updateData?: Partial<ServiceContent>;
}

// Query Parameters
export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  designType?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sectionName?: string;
}

export interface SearchQueryParams {
  q: string;
  designType?: string;
  page?: number;
  limit?: number;
}

// MongoDB Document Type (with Mongoose methods)
export interface ServiceDocument extends ServiceContent {
  save: () => Promise<ServiceDocument>;
  populate: (path: string, select?: string) => Promise<ServiceDocument>;
}