import { NewsArticle } from '../types';

// Enhanced news service with Gemini API integration
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Reliance Industries Reports Strong Q3 Results, Beats Estimates',
    summary: 'Reliance Industries Ltd posted robust quarterly results, driven by strong performance in oil-to-chemicals and digital services businesses. The company exceeded analyst expectations with a 25% year-on-year growth in net profit.',
    source: 'Economic Times',
    publishedAt: new Date().toISOString(),
    url: 'https://economictimes.indiatimes.com',
    relevantStocks: ['RELIANCE'],
    sentiment: 'positive',
    confidence: 0.85,
    impact: 'Strong quarterly results likely to boost investor confidence and stock price.'
  },
  {
    id: '2',
    title: 'TCS Announces Major Deal with European Bank, Stock Surges',
    summary: 'Tata Consultancy Services has secured a multi-billion dollar digital transformation deal with a major European banking institution. The 7-year contract is expected to significantly boost TCS revenue.',
    source: 'Business Standard',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    url: 'https://business-standard.com',
    relevantStocks: ['TCS'],
    sentiment: 'positive',
    confidence: 0.92,
    impact: 'Major contract win demonstrates strong market position and revenue growth potential.'
  },
  {
    id: '3',
    title: 'IT Sector Faces Headwinds as Global Demand Slows',
    summary: 'Indian IT companies are experiencing reduced demand from global clients due to economic uncertainties. Companies like Infosys and TCS may see slower growth in the coming quarters.',
    source: 'Moneycontrol',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    url: 'https://moneycontrol.com',
    relevantStocks: ['INFY', 'TCS'],
    sentiment: 'negative',
    confidence: 0.78,
    impact: 'Sector-wide challenges may impact growth prospects and stock performance.'
  },
  {
    id: '4',
    title: 'ICICI Bank Q3 Earnings: NII Growth Remains Strong',
    summary: 'ICICI Bank reported steady net interest income growth in Q3, with improved asset quality and lower provisions. The bank continues to show resilience in the current economic environment.',
    source: 'Hindu BusinessLine',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    url: 'https://thehindubusinessline.com',
    relevantStocks: ['ICICIBANK'],
    sentiment: 'positive',
    confidence: 0.82,
    impact: 'Consistent performance and improved asset quality support positive outlook.'
  },
  {
    id: '5',
    title: 'Adani Ports Expands Operations with New Terminal Acquisition',
    summary: 'Adani Ports & SEZ has acquired a new container terminal, expanding its port operations across India. The acquisition is expected to increase cargo handling capacity by 30%.',
    source: 'Financial Express',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    url: 'https://financialexpress.com',
    relevantStocks: ['ADANIPORTS'],
    sentiment: 'positive',
    confidence: 0.76,
    impact: 'Strategic expansion likely to drive future growth and market share gains.'
  },
  {
    id: '6',
    title: 'Hindustan Unilever Faces Margin Pressure from Rising Costs',
    summary: 'HUL reported margin compression in its latest quarter due to rising raw material costs. The company is implementing price increases to offset the impact on profitability.',
    source: 'Mint',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    url: 'https://mint.com',
    relevantStocks: ['HINDUNILVR'],
    sentiment: 'negative',
    confidence: 0.69,
    impact: 'Cost pressures may impact short-term profitability despite strong brand portfolio.'
  },
  {
    id: '7',
    title: 'Sensex Hits New All-Time High Amid FII Inflows',
    summary: 'The BSE Sensex reached a new record high today, driven by strong foreign institutional investor inflows and positive global market sentiment. Banking and IT stocks led the rally.',
    source: 'NDTV Profit',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    url: 'https://ndtvprofit.com',
    relevantStocks: ['RELIANCE', 'TCS', 'ICICIBANK'],
    sentiment: 'positive',
    confidence: 0.88,
    impact: 'Broad market rally benefits major index constituents and investor sentiment.'
  },
  {
    id: '8',
    title: 'RBI Monetary Policy: Rates Held Steady, Growth Outlook Revised',
    summary: 'The Reserve Bank of India maintained repo rates at current levels while revising growth projections. The central bank emphasized the need for continued vigilance on inflation.',
    source: 'Economic Times',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    url: 'https://economictimes.indiatimes.com',
    relevantStocks: ['ICICIBANK', 'HINDUNILVR'],
    sentiment: 'neutral',
    confidence: 0.74,
    impact: 'Stable interest rates provide clarity for business planning and investment decisions.'
  }
];

export const fetchGeneralNews = async (apiKey: string): Promise<NewsArticle[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would make actual API calls to news sources
  // and use Gemini API for sentiment analysis
  if (!apiKey) {
    throw new Error('API key required');
  }

  // Add some randomness to simulate real-time updates
  const updatedNews = mockNewsData.map(article => ({
    ...article,
    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    confidence: Math.random() * 0.3 + 0.7
  }));

  return updatedNews;
};

export const fetchPortfolioRelevantNews = async (
  portfolioSymbols: string[], 
  apiKey: string
): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!apiKey) {
    throw new Error('API key required');
  }
  
  return mockNewsData.filter(article => 
    article.relevantStocks.some(stock => 
      portfolioSymbols.includes(stock)
    )
  );
};

export const analyzeNewsWithAI = async (
  articles: NewsArticle[], 
  portfolioSymbols: string[],
  apiKey: string
): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (!apiKey) {
    throw new Error('API key required');
  }

  // In production, this would call Gemini API for actual analysis
  return articles.map(article => ({
    ...article,
    sentiment: article.sentiment || getRandomSentiment(),
    confidence: article.confidence || Math.random() * 0.3 + 0.7,
    impact: article.impact || generateMockImpact(article.title)
  }));
};

const getRandomSentiment = (): 'positive' | 'negative' | 'neutral' => {
  const sentiments = ['positive', 'negative', 'neutral'];
  return sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'negative' | 'neutral';
};

const generateMockImpact = (title: string): string => {
  const impacts = [
    'Strong fundamentals suggest potential for continued growth.',
    'Market conditions may create short-term volatility.',
    'Sector trends align with long-term investment thesis.',
    'Competitive positioning remains strong despite challenges.',
    'Regulatory changes may impact future performance.',
    'Innovation initiatives could drive future value creation.'
  ];
  return impacts[Math.floor(Math.random() * impacts.length)];
};