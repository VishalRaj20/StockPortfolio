import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, Loader2, ArrowRight, Home } from 'lucide-react';
import NewsCard from './NewsCard';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  news: NewsArticle[];
  isLoading: boolean;
  onRefresh: () => void;
  title: string;
  showPortfolioRelevant: boolean;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  isLoading,
  onRefresh,
  title,
  showPortfolioRelevant,
  showViewAllButton = false,
  onViewAll
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{news.length} articles found</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Go Home Button */}
          {/* Show Go Home only if View All is NOT shown */}
          {!showViewAllButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Go Home</span>
            </button>
          )}


          {/* View All Button */}
          {showViewAllButton && onViewAll && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading latest news...</span>
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-6">
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NewsCard
                  article={article}
                  isPortfolioRelevant={showPortfolioRelevant && article.relevantStocks.length > 0}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or check back later for new updates
            </p>
            <button
              onClick={onRefresh}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh News</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
