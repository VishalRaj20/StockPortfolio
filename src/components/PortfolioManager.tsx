import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, TrendingUp, DollarSign, Package } from 'lucide-react';
import { PortfolioStock } from '../types';

interface PortfolioManagerProps {
  stocks: PortfolioStock[];
  onAddStock: (stock: PortfolioStock) => void;
  onRemoveStock: (symbol: string) => void;
  onUpdateStock: (symbol: string, updates: Partial<PortfolioStock>) => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  stocks,
  onAddStock,
  onRemoveStock,
  onUpdateStock
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
    return stocks.reduce((total, stock) => total + stock.quantity * stock.price, 0);
  };

  const getTotalStocks = () => {
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  const popularStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', sector: 'Infrastructure' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📈 Portfolio Manager</h2>
        <button
          onClick={() => setIsAddingStock(true)}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-800">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Total Stocks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stocks.length}</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-green-800">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total Quantity</span>
          </div>
          <p className="text-2xl font-bold mt-1">{getTotalStocks()}</p>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-800">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Value</span>
          </div>
          <p className="text-2xl font-bold mt-1">₹{getTotalValue().toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Add Stock Form */}
      {isAddingStock && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Stock Symbol</label>
              <input
                type="text"
                value={newStock.symbol}
                onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                placeholder="e.g., RELIANCE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={newStock.name}
                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                placeholder="e.g., Reliance Industries"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={newStock.quantity}
                onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={newStock.price}
                onChange={(e) => setNewStock({ ...newStock, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Sector</label>
              <select
                value={newStock.sector}
                onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Sector</option>
                <option value="Technology">Technology</option>
                <option value="Banking">Banking</option>
                <option value="Energy">Energy</option>
                <option value="Healthcare">Healthcare</option>
                <option value="FMCG">FMCG</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={handleAddStock}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Add Stock
            </button>
            <button
              onClick={() => setIsAddingStock(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Add: Popular Stocks</h4>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() =>
                    setNewStock({
                      ...newStock,
                      symbol: stock.symbol,
                      name: stock.name,
                      sector: stock.sector
                    })
                  }
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                >
                  {stock.symbol}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Portfolio Stocks */}
      <div className="space-y-3">
        {stocks.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No stocks in your portfolio yet.</p>
            <p className="text-sm">Add some stocks to get started!</p>
          </div>
        ) : (
          stocks.map((stock) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <span className="mt-1 sm:mt-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {stock.sector}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-semibold">{stock.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Price</p>
                  <p className="font-semibold">₹{stock.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Total Value</p>
                  <p className="font-semibold">₹{(stock.quantity * stock.price).toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => onRemoveStock(stock.symbol)}
                  className="text-sm px-2 py-1 rounded hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
