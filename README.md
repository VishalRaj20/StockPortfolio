# Smart Portfolio - AI-Powered Market Insights

A modern web application that provides AI-powered market insights, portfolio management, and personalized news filtering.

## Features

- User authentication with MongoDB
- Real-time stock portfolio tracking
- AI-powered news analysis
- Personalized market insights
- Responsive design with Framer Motion animations

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Gemini API key (for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## MongoDB Integration

This application uses MongoDB for user authentication and data storage. To set up MongoDB:

1. Create a MongoDB Atlas account or use a local MongoDB instance
2. Create a new cluster and database
3. Add your connection string to the `.env` file

### Troubleshooting Authentication Issues

If you encounter issues with signup or signin:

1. Check browser console for detailed error messages
2. Verify your MongoDB connection string in the `.env` file
3. Ensure the MongoDB user has read/write permissions
4. Check if the database and collections exist
5. Verify that bcryptjs is properly installed

## Technologies Used

- React with TypeScript
- MongoDB & Mongoose
- Framer Motion for animations
- Tailwind CSS for styling
- Vite for build tooling

## License

MIT