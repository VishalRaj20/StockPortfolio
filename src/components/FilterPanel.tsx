import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableSources: string[];
  availableSectors: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableSources,
  availableSectors
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    handleFilterChange('sources', newSources);
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector];
    handleFilterChange('sectors', newSectors);
  };

  const resetFilters = () => {
    onFiltersChange({
      sentiment: 'all',
      timeRange: '24h',
      sources: [],
      sectors: [],
      minConfidence: 0
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetFilters}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Sentiment Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sentiment</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Sentiments', color: 'gray' },
                      { value: 'positive', label: 'Positive', color: 'green' },
                      { value: 'negative', label: 'Negative', color: 'red' },
                      { value: 'neutral', label: 'Neutral', color: 'yellow' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="sentiment"
                          value={option.value}
                          checked={filters.sentiment === option.value}
                          onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                        <div className={`w-2 h-2 rounded-full bg-${option.color}-500`}></div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Time Range</h3>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>

                {/* Confidence Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Minimum Confidence: {Math.round(filters.minConfidence * 100)}%
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.minConfidence}
                    onChange={(e) => handleFilterChange('minConfidence', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Sources Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">News Sources</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableSources.map((source) => (
                      <label key={source} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.sources.includes(source)}
                          onChange={() => handleSourceToggle(source)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sectors Filter */}
                {availableSectors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Sectors</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableSectors.map((sector) => (
                        <label key={sector} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.sectors.includes(sector)}
                            onChange={() => handleSectorToggle(sector)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{sector}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;