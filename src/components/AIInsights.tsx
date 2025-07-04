import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { NewsArticle, PortfolioStock } from '../types';
import { generatePortfolioSummary } from '../services/geminiService';

interface AIInsightsProps {
  portfolioStocks: PortfolioStock[];
  relevantNews: NewsArticle[];
  isLoading?: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  portfolioStocks, 
  relevantNews, 
  isLoading = false 
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (portfolioStocks.length === 0 || relevantNews.length === 0) return;
    
    setIsGenerating(true);
    try {
      const portfolioSymbols = portfolioStocks.map(stock => stock.symbol);
      const generatedSummary = await generatePortfolioSummary(portfolioSymbols, relevantNews, "your-api-key-here");
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Unable to generate AI insights at this time. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (portfolioStocks.length > 0 && relevantNews.length > 0) {
      generateSummary();
    }
  }, [portfolioStocks.length, relevantNews.length]);

  const getSentimentStats = () => {
    const total = relevantNews.length;
    if (total === 0) return { positive: 0, negative: 0, neutral: 0 };
    
    const positive = relevantNews.filter(news => news.sentiment === 'positive').length;
    const negative = relevantNews.filter(news => news.sentiment === 'negative').length;
    const neutral = total - positive - negative;
    
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  };

  const getOverallSentiment = () => {
    const stats = getSentimentStats();
    if (stats.positive > stats.negative && stats.positive > stats.neutral) {
      return { sentiment: 'positive', icon: TrendingUp, color: 'text-green-500' };
    } else if (stats.negative > stats.positive && stats.negative > stats.neutral) {
      return { sentiment: 'negative', icon: TrendingDown, color: 'text-red-500' };
    } else {
      return { sentiment: 'neutral', icon: Minus, color: 'text-yellow-500' };
    }
  };

  const sentimentStats = getSentimentStats();
  const overallSentiment = getOverallSentiment();
  const IconComponent = overallSentiment.icon;

  if (portfolioStocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Portfolio Insights</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Add stocks to your portfolio to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Portfolio Insights</h2>
        </div>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Sentiment */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Portfolio Sentiment</span>
          <div className="flex items-center space-x-2">
            <IconComponent className={`w-5 h-5 ${overallSentiment.color}`} />
            <span className={`text-sm font-medium capitalize ${overallSentiment.color}`}>
              {overallSentiment.sentiment}
            </span>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sentiment Distribution</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.positive}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{sentimentStats.positive}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700">Negative</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.negative}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{sentimentStats.negative}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Minus className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.neutral}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{sentimentStats.neutral}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-purple-800 mb-2">AI Analysis Summary</h3>
        {isGenerating ? (
          <div className="flex items-center space-x-2 text-purple-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generating insights...</span>
          </div>
        ) : (
          <p className="text-sm text-purple-700 leading-relaxed">
            {summary || 'No insights available yet. Add more stocks to your portfolio for better analysis.'}
          </p>
        )}
      </div>

      {/* News Impact Score */}
      {relevantNews.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">News Impact Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.positive}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{sentimentStats.positive}/100</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on {relevantNews.length} relevant news articles
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;