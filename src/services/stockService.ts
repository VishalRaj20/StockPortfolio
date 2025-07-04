import { PortfolioStock } from '../types';

// Mock stock price data with realistic Indian stock prices
const stockPrices: Record<string, number> = {
  'RELIANCE': 2450.50,
  'TCS': 3890.25,
  'INFY': 1678.90,
  'HINDUNILVR': 2234.75,
  'ICICIBANK': 1089.30,
  'ADANIPORTS': 789.60,
  'HDFCBANK': 1654.80,
  'BHARTIARTL': 1123.45,
  'ITC': 456.20,
  'KOTAKBANK': 1876.90
};

export const updateStockPrices = async (stocks: PortfolioStock[]): Promise<PortfolioStock[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return stocks.map(stock => {
    const basePrice = stockPrices[stock.symbol] || stock.price;
    // Simulate price fluctuation between -2% to +2%
    const fluctuation = (Math.random() - 0.5) * 0.04;
    const newPrice = basePrice * (1 + fluctuation);
    
    return {
      ...stock,
      price: Math.round(newPrice * 100) / 100
    };
  });
};

export const getStockPrice = (symbol: string): number => {
  const basePrice = stockPrices[symbol] || 1000;
  const fluctuation = (Math.random() - 0.5) * 0.04;
  return Math.round(basePrice * (1 + fluctuation) * 100) / 100;
};

export const searchStocks = async (query: string): Promise<PortfolioStock[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', sector: 'Infrastructure' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' }
  ];
  
  const filteredStocks = allStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredStocks.map(stock => ({
    ...stock,
    quantity: 0,
    price: getStockPrice(stock.symbol)
  }));
};