# Global Trending Topics Web App

A clean, responsive web application that displays trending topics from multiple sources without requiring API keys.

## Features

- **Real-time trending topics** from multiple sources
- **No API keys required** for basic functionality
- **Responsive design** works on desktop and mobile
- **Auto-refresh** every 30 minutes
- **Multiple data sources**: News, Reddit, Hacker News

## Data Sources

### Free (No API Key Required)
- **Reddit Popular**: Uses Reddit's public JSON API
- **Hacker News**: Uses their free Firebase API
- **Mock News Data**: Placeholder for news trends

### Optional Upgrades (API Key Required)
- **NewsAPI.org**: Free tier available (100 requests/day)
- **Google Trends API**: Recently launched (alpha access)
- **Twitter API**: Expensive ($42k/month for enterprise)

## Quick Start

1. Open `index.html` in your browser
2. That's it! No setup required

## File Structure

```
trending-topics-app/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Adding API Keys (Optional)

To add real news data, sign up for a free NewsAPI.org account and replace the mock data in `script.js`:

```javascript
// Replace this line in loadNewsAPI():
const mockNews = [...];

// With this:
const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`);
const data = await response.json();
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

## CORS Note

Some APIs may require a backend proxy due to CORS restrictions. The current implementation uses:
- Reddit's CORS-enabled JSON endpoints
- Hacker News Firebase API (CORS-enabled)
- Mock data for news (no external calls)

## Future Enhancements

- Add more data sources
- Implement caching
- Add search functionality
- Include trending hashtags
- Add data visualization charts