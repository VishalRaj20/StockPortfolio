import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Clock } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  isPortfolioRelevant?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, isPortfolioRelevant = false }) => {
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${
        isPortfolioRelevant ? getSentimentColor(article.sentiment) : 'border-l-blue-500'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isPortfolioRelevant && getSentimentIcon(article.sentiment)}
            <span className="text-sm font-medium text-gray-600">{article.source}</span>
            {isPortfolioRelevant && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Portfolio Stock
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>

        {article.relevantStocks && article.relevantStocks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.relevantStocks.map((stock, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {stock}
              </span>
            ))}
          </div>
        )}

        {isPortfolioRelevant && article.confidence && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Confidence</span>
              <span className="text-sm text-gray-600">{Math.round(article.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${article.confidence * 100}%` }}
              />
            </div>
            {article.impact && (
              <p className="text-sm text-gray-600 mt-2 italic">
                {article.impact}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-sm font-medium">Read Full Article</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;