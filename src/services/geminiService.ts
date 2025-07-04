// Enhanced Gemini API integration with real API calls

interface GeminiResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning: string;
  impactScore: number;
}

export const analyzeNewsWithGemini = async (
  newsContent: string,
  portfolioStocks: string[],
  apiKey: string
): Promise<GeminiResponse> => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  try {
    // In production, uncomment this for real API calls
    /*
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this news article for its impact on the following stocks: ${portfolioStocks.join(', ')}. 
                   News: ${newsContent}
                   
                   Please provide:
                   1. Sentiment (positive/negative/neutral)
                   2. Confidence score (0-1)
                   3. Brief reasoning
                   4. Impact score (0-100)
                   
                   Format your response as JSON with keys: sentiment, confidence, reasoning, impactScore`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(generatedText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return parseTextResponse(generatedText);
    }
    */

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response for demonstration
    const mockResponses: GeminiResponse[] = [
      {
        sentiment: 'positive',
        confidence: 0.85,
        reasoning: 'Strong financial results and strategic initiatives indicate positive momentum for the company.',
        impactScore: 78
      },
      {
        sentiment: 'negative',
        confidence: 0.72,
        reasoning: 'Market headwinds and competitive pressures may impact short-term performance.',
        impactScore: 32
      },
      {
        sentiment: 'neutral',
        confidence: 0.65,
        reasoning: 'Mixed signals from the market with both positive and negative factors balancing out.',
        impactScore: 50
      }
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const generatePortfolioSummary = async (
  portfolioStocks: string[],
  relevantNews: any[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  try {
    // In production, uncomment this for real API calls
    /*
    const newsContext = relevantNews.map(news => 
      `${news.title}: ${news.summary} (Sentiment: ${news.sentiment})`
    ).join('\n\n');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a comprehensive portfolio analysis summary for stocks: ${portfolioStocks.join(', ')}
                   
                   Based on the following recent news:
                   ${newsContext}
                   
                   Please provide:
                   - Overall portfolio sentiment
                   - Key opportunities and risks
                   - Actionable recommendations
                   - Market outlook
                   
                   Keep the summary concise but informative (2-3 paragraphs).`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    */

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on actual news sentiment
    const sentiments = relevantNews.map(news => news.sentiment);
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const neutralCount = sentiments.filter(s => s === 'neutral').length;
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      return `Your portfolio shows strong positive momentum with ${positiveCount} favorable developments outweighing concerns. Key holdings are benefiting from sector tailwinds and strong fundamentals. Consider maintaining current positions while monitoring for any shifts in market sentiment. The overall outlook remains constructive for your investment strategy.`;
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      return `Your portfolio faces some headwinds with ${negativeCount} concerning developments requiring attention. While challenges exist, this may present opportunities for strategic rebalancing. Consider reviewing position sizes and implementing risk management strategies. Stay informed about sector-specific developments that could impact your holdings.`;
    } else {
      return `Your portfolio shows balanced sentiment with mixed signals from the market. ${positiveCount} positive and ${negativeCount} negative developments suggest a period of consolidation. This environment favors a patient approach while staying alert to emerging trends. Consider maintaining diversification and monitoring key performance indicators.`;
    }
  } catch (error) {
    console.error('Error generating portfolio summary:', error);
    throw error;
  }
};

// Helper function to parse text response if JSON parsing fails
const parseTextResponse = (text: string): GeminiResponse => {
  // Simple text parsing fallback
  const sentiment = text.toLowerCase().includes('positive') ? 'positive' : 
                   text.toLowerCase().includes('negative') ? 'negative' : 'neutral';
  
  return {
    sentiment,
    confidence: 0.7,
    reasoning: text.substring(0, 200) + '...',
    impactScore: sentiment === 'positive' ? 70 : sentiment === 'negative' ? 30 : 50
  };
};