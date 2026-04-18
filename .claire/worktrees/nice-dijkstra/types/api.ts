export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface DeployRequest {
  siteId: string;
}

export interface DeployResponse {
  deploymentId: string;
  url: string;
  status: string;
}

export interface CheckoutRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  url: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  customerName: string;
  siteUrl: string;
  siteId: string;
  businessName: string;
}
