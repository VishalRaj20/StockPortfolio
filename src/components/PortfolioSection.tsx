import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingCart,
  PieChart,
} from 'lucide-react';
import { PortfolioStock } from '../types';

interface PortfolioSectionProps {
  stocks: PortfolioStock[];
  onAddStock: (stock: PortfolioStock) => void;
  onRemoveStock: (symbol: string) => void;
  onUpdateStock: (symbol: string, updates: Partial<PortfolioStock>) => void;
  onBuyStock: (stock: PortfolioStock) => void;
  compact?: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  stocks,
  onAddStock,
  onRemoveStock,
  onBuyStock,
  compact = false
}) => {
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [newStock, setNewStock] = useState<Partial<PortfolioStock>>({
    symbol: '',
    name: '',
    quantity: 0,
    price: 0,
    sector: ''
  });

  const handleAddStock = () => {
    if (newStock.symbol && newStock.name && newStock.quantity && newStock.price) {
      onAddStock({
        symbol: newStock.symbol.toUpperCase(),
        name: newStock.name,
        quantity: newStock.quantity,
        price: newStock.price,
        sector: newStock.sector || 'Technology'
      });
      setNewStock({ symbol: '', name: '', quantity: 0, price: 0, sector: '' });
      setIsAddingStock(false);
    }
  };

  const getTotalValue = () => {
    return stocks.reduce((total, stock) => total + (stock.quantity * stock.price), 0);
  };

  const getTotalStocks = () => {
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  const getSectorDistribution = () => {
    const sectorMap = stocks.reduce((acc, stock) => {
      const value = stock.quantity * stock.price;
      acc[stock.sector] = (acc[stock.sector] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sectorMap).map(([sector, value]) => ({
      sector,
      value,
      percentage: (value / getTotalValue()) * 100
    }));
  };

  const popularStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', price: 2450.50 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', price: 3890.25 },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT', price: 1678.90 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', price: 2234.75 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking', price: 1089.30 },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', sector: 'Infrastructure', price: 789.60 }
  ];

  const sectorColors: Record<string, string> = {
    'Technology': 'bg-blue-500',
    'Banking': 'bg-green-500',
    'Energy': 'bg-yellow-500',
    'Healthcare': 'bg-red-500',
    'FMCG': 'bg-purple-500',
    'Infrastructure': 'bg-indigo-500',
    'Automotive': 'bg-pink-500',
    'IT': 'bg-cyan-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg shadow-sm">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Portfolio Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your stock investments</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingStock(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Stock</span>
        </button>
      </div>

      <div className="p-6 md:p-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg shadow-inner">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total Stocks</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stocks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-lg shadow-inner">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Total Shares</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{getTotalStocks()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg shadow-inner">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Total Value</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ₹{getTotalValue().toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Distribution */}
        {!compact && stocks.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <PieChart className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Sector Distribution</h3>
            </div>
            <div className="space-y-4">
              {getSectorDistribution().map((item) => (
                <div key={item.sector} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${sectorColors[item.sector] || 'bg-gray-500'} shadow-sm`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.sector}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div 
                        className={`h-2.5 rounded-full ${sectorColors[item.sector] || 'bg-gray-500'}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Stock Form */}
        {isAddingStock && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 md:p-8 mb-8 border border-blue-200 shadow-md"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Add New Stock</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                  placeholder="e.g., RELIANCE"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  placeholder="e.g., Reliance Industries Ltd"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newStock.price}
                  onChange={(e) => setNewStock({ ...newStock, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                <select
                  value={newStock.sector}
                  onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  <option value="">Select Sector</option>
                  <option value="Technology">Technology</option>
                  <option value="Banking">Banking</option>
                  <option value="Energy">Energy</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="FMCG">FMCG</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Automotive">Automotive</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={handleAddStock}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm hover:shadow-md"
              >
                Add Stock
              </button>
              <button
                onClick={() => setIsAddingStock(false)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Popular Stocks */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-gray-700">Popular Stocks</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      setNewStock({
                        ...newStock,
                        symbol: stock.symbol,
                        name: stock.name,
                        sector: stock.sector,
                        price: stock.price
                      });
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <p className="font-semibold text-gray-900 text-sm">{stock.symbol}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{stock.name}</p>
                    <p className="text-xs text-blue-600 font-medium mt-2">₹{stock.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio Stocks */}
        <div className="space-y-5">
          {stocks.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">No stocks in your portfolio</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Add some stocks to get started with portfolio tracking and analysis</p>
              <button
                onClick={() => setIsAddingStock(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Your First Stock</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Your Portfolio</h3>
              </div>
              <div className="space-y-4">
                {stocks.map((stock) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${sectorColors[stock.sector] || 'bg-gray-500'} shadow-sm`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{stock.symbol}</h4>
                          <p className="text-sm text-gray-600 mt-1">{stock.name}</p>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-2 font-medium">
                            {stock.sector}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-right bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-600">Quantity</p>
                        <p className="font-semibold text-gray-900 text-lg">{stock.quantity}</p>
                      </div>
                      <div className="text-right bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900 text-lg">₹{stock.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-blue-600">Total Value</p>
                        <p className="font-semibold text-blue-900 text-lg">
                          ₹{(stock.quantity * stock.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onBuyStock(stock)}
                          className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors shadow-sm hover:shadow-md"
                          title="Buy more shares"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onRemoveStock(stock.symbol)}
                          className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm hover:shadow-md"
                          title="Remove from portfolio"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;