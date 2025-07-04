import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  Lightbulb,
  Target,
  AlertTriangle
} from 'lucide-react';
import { NewsArticle, PortfolioStock } from '../types';
import { generatePortfolioSummary } from '../services/geminiService';

interface AIInsightsSectionProps {
  portfolioStocks: PortfolioStock[];
  relevantNews: NewsArticle[];
  isLoading?: boolean;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ 
  portfolioStocks, 
  relevantNews, 
  isLoading = false 
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const generateSummary = async () => {
    if (portfolioStocks.length === 0 || relevantNews.length === 0) return;
    
    setIsGenerating(true);
    try {
      const portfolioSymbols = portfolioStocks.map(stock => stock.symbol);
      const generatedSummary = await generatePortfolioSummary(portfolioSymbols, relevantNews, "your-api-key-here");
      setSummary(generatedSummary);
      
      // Generate additional insights
      const mockInsights = [
        "Consider diversifying into defensive sectors given current market volatility",
        "Technology stocks in your portfolio show strong fundamentals",
        "Banking sector exposure looks optimal for current market conditions"
      ];
      setInsights(mockInsights);
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
      return { sentiment: 'positive', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-50' };
    } else if (stats.negative > stats.positive && stats.negative > stats.neutral) {
      return { sentiment: 'negative', icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-50' };
    } else {
      return { sentiment: 'neutral', icon: Minus, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    }
  };

  const sentimentStats = getSentimentStats();
  const overallSentiment = getOverallSentiment();
  const IconComponent = overallSentiment.icon;

  if (portfolioStocks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Portfolio Insights</h2>
              <p className="text-sm text-gray-500">Get AI-powered analysis</p>
            </div>
          </div>
          <div className="text-center py-8">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Data</h3>
            <p className="text-gray-500">Add stocks to your portfolio to get AI-powered insights and analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Portfolio Insights</h2>
            <p className="text-sm text-gray-500">AI-powered market analysis</p>
          </div>
        </div>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Sentiment */}
        <div className={`${overallSentiment.bgColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Portfolio Sentiment</span>
            </div>
            <div className="flex items-center space-x-2">
              <IconComponent className={`w-5 h-5 ${overallSentiment.color}`} />
              <span className={`text-sm font-medium capitalize ${overallSentiment.color}`}>
                {overallSentiment.sentiment}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Based on {relevantNews.length} relevant news articles for your portfolio
          </p>
        </div>

        {/* Sentiment Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Sentiment Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Positive News</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sentimentStats.positive}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{sentimentStats.positive}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Negative News</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sentimentStats.negative}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{sentimentStats.negative}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Neutral News</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sentimentStats.neutral}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{sentimentStats.neutral}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-medium text-purple-800">AI Analysis Summary</h3>
          </div>
          {isGenerating ? (
            <div className="flex items-center space-x-2 text-purple-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating insights...</span>
            </div>
          ) : (
            <p className="text-sm text-purple-700 leading-relaxed">
              {summary || 'Add more stocks to your portfolio for comprehensive AI analysis and insights.'}
            </p>
          )}
        </div>

        {/* Key Insights */}
        {insights.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-medium text-gray-900">Key Insights</h3>
            </div>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Health Score */}
        {relevantNews.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Portfolio Health Score</span>
              <span className="text-sm text-gray-600">{sentimentStats.positive}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${sentimentStats.positive}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on sentiment analysis of {relevantNews.length} relevant news articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsSection;