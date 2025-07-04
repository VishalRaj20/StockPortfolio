import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp} from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NewsSection from './components/NewsSection';
import PortfolioSection from './components/PortfolioSection';
import AIInsightsSection from './components/AIInsightsSection';
import FilterPanel from './components/FilterPanel';
import PaymentModal from './components/PaymentModal';
import Notification from './components/Notification';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import { useNotification } from './hooks/useNotification';
import { useAuth } from './hooks/useAuth';
import { useRealTimeData } from './hooks/useRealTimeData';
import { NewsArticle, PortfolioStock, FilterOptions} from './types';
import { 
  fetchGeneralNews, 
  fetchPortfolioRelevantNews, 
  analyzeNewsWithAI 
} from './services/newsService';
import { updateStockPrices } from './services/stockService';

function App() {
  const [generalNews, setGeneralNews] = useState<NewsArticle[]>([]);
  const [portfolioNews, setPortfolioNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'portfolio' | 'news'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    sentiment: 'all',
    timeRange: '24h',
    sources: [],
    sectors: [],
    minConfidence: 0
  });
  
  const { notification, showNotification, hideNotification } = useNotification();
  const { user, login, logout, signup, isAuthenticated } = useAuth();
  const { isConnected } = useRealTimeData();

  // Load API key from environment variables or localStorage
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const savedApiKey = localStorage.getItem('gemini_api_key');
    
    if (envApiKey && envApiKey !== 'your_gemini_api_key_here') {
      setGeminiApiKey(envApiKey);
      showNotification('success', 'API Key Loaded', 'Gemini API key loaded from environment');
    } else if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }
  }, []);

  // Auto-refresh news every 5 minutes when API key is available
  useEffect(() => {
    if (isAuthenticated && geminiApiKey) {
      loadGeneralNews();
      const interval = setInterval(loadGeneralNews, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, geminiApiKey]);

  // Auto-update stock prices every 30 seconds
  useEffect(() => {
    if (isAuthenticated && portfolioStocks.length > 0) {
      const interval = setInterval(() => {
        updatePortfolioStockPrices();
      }, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, portfolioStocks]);

  useEffect(() => {
    if (portfolioStocks.length > 0 && geminiApiKey) {
      loadPortfolioNews();
    } else {
      setPortfolioNews([]);
    }
  }, [portfolioStocks, geminiApiKey]);

  useEffect(() => {
    applyFilters();
  }, [generalNews, portfolioNews, filters, searchQuery, activeView]);

  const loadGeneralNews = async () => {
    if (!geminiApiKey) {
      showNotification('warning', 'API Key Required', 'Please set your Gemini API key in .env.local file or settings');
      return;
    }

    setIsLoadingGeneral(true);
    try {
      const news = await fetchGeneralNews(geminiApiKey);
      setGeneralNews(news);
      showNotification('success', 'News Updated', 'Latest market news loaded successfully');
    } catch (error) {
      console.error('Error loading general news:', error);
      showNotification('error', 'Error', 'Failed to load latest news');
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const loadPortfolioNews = async () => {
    if (!geminiApiKey) return;
    
    setIsLoadingPortfolio(true);
    try {
      const portfolioSymbols = portfolioStocks.map(stock => stock.symbol);
      const news = await fetchPortfolioRelevantNews(portfolioSymbols, geminiApiKey);
      const analyzedNews = await analyzeNewsWithAI(news, portfolioSymbols, geminiApiKey);
      setPortfolioNews(analyzedNews);
      showNotification('success', 'Portfolio News Updated', 
        `Found ${analyzedNews.length} relevant articles for your portfolio`);
    } catch (error) {
      console.error('Error loading portfolio news:', error);
      showNotification('error', 'Error', 'Failed to load portfolio news');
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const updatePortfolioStockPrices = async () => {
    try {
      const updatedStocks = await updateStockPrices(portfolioStocks);
      setPortfolioStocks(updatedStocks);
    } catch (error) {
      console.error('Error updating stock prices:', error);
    }
  };

  const applyFilters = () => {
    let newsToFilter = activeView === 'news' ? generalNews : 
                      activeView === 'dashboard' ? generalNews.slice(0, 3) : portfolioNews;
    
    // Apply search filter
    if (searchQuery) {
      newsToFilter = newsToFilter.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sentiment filter
    if (filters.sentiment !== 'all') {
      newsToFilter = newsToFilter.filter(article => article.sentiment === filters.sentiment);
    }

    // Apply confidence filter
    if (filters.minConfidence > 0) {
      newsToFilter = newsToFilter.filter(article => 
        (article.confidence || 0) >= filters.minConfidence
      );
    }

    // Apply time range filter
    const now = new Date();
    const timeRangeHours = {
      '1h': 1,
      '6h': 6,
      '24h': 24,
      '7d': 168,
      '30d': 720
    };
    
    const hoursAgo = timeRangeHours[filters.timeRange] || 24;
    const cutoffTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    newsToFilter = newsToFilter.filter(article => 
      new Date(article.publishedAt) >= cutoffTime
    );

    // Apply source filter
    if (filters.sources.length > 0) {
      newsToFilter = newsToFilter.filter(article => 
        filters.sources.includes(article.source)
      );
    }

    setFilteredNews(newsToFilter);
  };

  const handleAddStock = (stock: PortfolioStock) => {
    if (!isAuthenticated) {
      showNotification('warning', 'Login Required', 'Please login to manage your portfolio');
      setIsAuthModalOpen(true);
      return;
    }

    const existingStock = portfolioStocks.find(s => s.symbol === stock.symbol);
    if (existingStock) {
      showNotification('warning', 'Stock Already Exists', 
        `${stock.symbol} is already in your portfolio`);
      return;
    }
    
    setPortfolioStocks(prev => [...prev, stock]);
    showNotification('success', 'Stock Added', 
      `${stock.symbol} added to your portfolio`);
  };

  const handleRemoveStock = (symbol: string) => {
    setPortfolioStocks(prev => prev.filter(stock => stock.symbol !== symbol));
    showNotification('info', 'Stock Removed', 
      `${symbol} removed from your portfolio`);
  };

  const handleUpdateStock = (symbol: string, updates: Partial<PortfolioStock>) => {
    setPortfolioStocks(prev => 
      prev.map(stock => 
        stock.symbol === symbol ? { ...stock, ...updates } : stock
      )
    );
    showNotification('info', 'Stock Updated', 
      `${symbol} updated successfully`);
  };

  const handleBuyStock = (stock: PortfolioStock) => {
    if (!isAuthenticated) {
      showNotification('warning', 'Login Required', 'Please login to buy stocks');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedStock(stock);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (stock: PortfolioStock, quantity: number) => {
    const existingStock = portfolioStocks.find(s => s.symbol === stock.symbol);
    if (existingStock) {
      handleUpdateStock(stock.symbol, { 
        quantity: existingStock.quantity + quantity 
      });
    } else {
      handleAddStock({ ...stock, quantity });
    }
    setIsPaymentModalOpen(false);
    setSelectedStock(null);
    showNotification('success', 'Purchase Successful', 
      `Successfully purchased ${quantity} shares of ${stock.symbol}`);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsAuthModalOpen(false);
      showNotification('success', 'Welcome Back!', 'Successfully logged in');
    } catch (error) {
      showNotification('error', 'Login Failed', 'Invalid credentials');
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      await signup(name, email, password);
      setIsAuthModalOpen(false);
      showNotification('success', 'Account Created!', 'Welcome to Smart Portfolio');
    } catch (error) {
      showNotification('error', 'Signup Failed', 'Please try again');
    }
  };

  const handleLogout = () => {
    logout();
    setPortfolioStocks([]);
    setGeneralNews([]);
    setPortfolioNews([]);
    showNotification('info', 'Logged Out', 'See you next time!');
  };

  const handleSaveApiKey = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    localStorage.setItem('gemini_api_key', apiKey);
    setIsSettingsModalOpen(false);
    showNotification('success', 'API Key Saved', 'Gemini API key updated successfully');
    if (isAuthenticated) {
      loadGeneralNews();
    }
  };

  const refreshNews = () => {
    if (activeView === 'news') {
      loadGeneralNews();
    } else {
      loadPortfolioNews();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl inline-block mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Portfolio</h1>
              <p className="text-gray-600">AI-Powered Market Insights</p>
            </div>
            
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Get Started
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Track your portfolio • Get AI insights • Real-time updates
              </p>
            </div>
          </motion.div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />

        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always visible on desktop */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
        portfolioCount={portfolioStocks.length}
        newsCount={generalNews.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
          onFilterClick={() => setIsFilterOpen(true)}
          onSettingsClick={() => setIsSettingsModalOpen(true)}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isConnected={isConnected}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    <NewsSection 
                      news={filteredNews}
                      isLoading={isLoadingGeneral || isLoadingPortfolio}
                      onRefresh={refreshNews}
                      title="Top Market News"
                      showPortfolioRelevant={true}
                      showViewAllButton={true}
                      onViewAll={() => setActiveView('news')}
                    />
                  </div>
                  <div className="space-y-6">
                    <AIInsightsSection
                      portfolioStocks={portfolioStocks}
                      relevantNews={portfolioNews}
                      isLoading={isLoadingPortfolio}
                    />
                    <PortfolioSection
                      stocks={portfolioStocks}
                      onAddStock={handleAddStock}
                      onRemoveStock={handleRemoveStock}
                      onUpdateStock={handleUpdateStock}
                      onBuyStock={handleBuyStock}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio View */}
            {activeView === 'portfolio' && (
              <PortfolioSection
                stocks={portfolioStocks}
                onAddStock={handleAddStock}
                onRemoveStock={handleRemoveStock}
                onUpdateStock={handleUpdateStock}
                onBuyStock={handleBuyStock}
                compact={false}
              />
            )}

            {/* News View */}
            {activeView === 'news' && (
              <NewsSection 
                news={filteredNews}
                isLoading={isLoadingGeneral}
                onRefresh={refreshNews}
                title="All Market News"
                showPortfolioRelevant={false}
                showViewAllButton={false}
              />
            )}
          </div>
        </main>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableSources={[...new Set(generalNews.map(n => n.source))]}
        availableSectors={[...new Set(portfolioStocks.map(s => s.sector))]}
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        stock={selectedStock}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentApiKey={geminiApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;