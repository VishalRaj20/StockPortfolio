export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  relevantStocks: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  impact?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  stocks: PortfolioStock[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  sector: string;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning: string;
  impactScore: number;
}

export interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface FilterOptions {
  sentiment: 'all' | 'positive' | 'negative' | 'neutral';
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  sources: string[];
  sectors: string[];
  minConfidence: number;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  upiId: string;
  bankAccount: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiConfig {
  geminiApiKey: string;
}