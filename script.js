class TrendingTopics {
    constructor() {
        this.initTabs();
        this.loadAllTrends();
        this.startAutoRefresh();
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    async loadAllTrends() {
        await Promise.all([
            this.loadNewsAPI(),
            this.loadRedditTrends(),
            this.loadHackerNews()
        ]);
    }

    async loadNewsAPI() {
        try {
            // Using NewsAPI.org free tier (requires API key but has free tier)
            // For demo purposes, using mock data
            const mockNews = [
                { title: "AI Technology Breakthrough", source: "Tech News", time: "2 hours ago" },
                { title: "Global Climate Summit Results", source: "World News", time: "4 hours ago" },
                { title: "Cryptocurrency Market Update", source: "Finance", time: "6 hours ago" },
                { title: "Space Exploration Milestone", source: "Science", time: "8 hours ago" },
                { title: "Healthcare Innovation", source: "Health", time: "10 hours ago" }
            ];
            
            this.renderTrends('news', mockNews, 'news');
        } catch (error) {
            this.showError('news', 'Failed to load news trends');
        }
    }

    async loadRedditTrends() {
        try {
            // Reddit has a JSON API that doesn't require authentication
            const response = await fetch('https://www.reddit.com/r/popular.json?limit=10');
            const data = await response.json();
            
            const trends = data.data.children.map(post => ({
                title: post.data.title,
                source: `r/${post.data.subreddit}`,
                time: this.timeAgo(post.data.created_utc),
                url: `https://reddit.com${post.data.permalink}`,
                score: post.data.score
            }));
            
            this.renderTrends('reddit', trends, 'reddit');
        } catch (error) {
            console.error('Reddit API error:', error);
            // Fallback to mock data
            const mockReddit = [
                { title: "Amazing coding project showcase", source: "r/programming", time: "1 hour ago", score: 2500 },
                { title: "Life pro tip that changed everything", source: "r/LifeProTips", time: "3 hours ago", score: 1800 },
                { title: "Funny programming meme", source: "r/ProgrammerHumor", time: "5 hours ago", score: 3200 },
                { title: "Today I learned something incredible", source: "r/todayilearned", time: "7 hours ago", score: 1200 },
                { title: "Ask Reddit: What's your best advice?", source: "r/AskReddit", time: "9 hours ago", score: 950 }
            ];
            this.renderTrends('reddit', mockReddit, 'reddit');
        }
    }

    async loadHackerNews() {
        try {
            // Hacker News has a free API
            const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            const topStories = await topStoriesResponse.json();
            
            // Get first 10 stories
            const storyPromises = topStories.slice(0, 10).map(id => 
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
            );
            
            const stories = await Promise.all(storyPromises);
            
            const trends = stories.map(story => ({
                title: story.title,
                source: story.url ? new URL(story.url).hostname : 'Hacker News',
                time: this.timeAgo(story.time),
                url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                score: story.score
            }));
            
            this.renderTrends('hackernews', trends, 'tech');
        } catch (error) {
            console.error('Hacker News API error:', error);
            // Fallback to mock data
            const mockHN = [
                { title: "New JavaScript framework released", source: "github.com", time: "2 hours ago", score: 450 },
                { title: "AI breakthrough in machine learning", source: "arxiv.org", time: "4 hours ago", score: 380 },
                { title: "Open source project needs contributors", source: "opensource.com", time: "6 hours ago", score: 290 },
                { title: "Tech company announces major update", source: "techcrunch.com", time: "8 hours ago", score: 520 },
                { title: "Developer tools comparison", source: "dev.to", time: "10 hours ago", score: 180 }
            ];
            this.renderTrends('hackernews', mockHN, 'tech');
        }
    }

    renderTrends(containerId, trends, type) {
        const container = document.querySelector(`#${containerId} .trends-list`);
        const loading = document.querySelector(`#${containerId} .loading`);
        
        loading.style.display = 'none';
        
        container.innerHTML = trends.map((trend, index) => `
            <div class="trend-item">
                <div class="trend-rank">${index + 1}</div>
                <div class="trend-content">
                    <a href="${trend.url || '#'}" class="trend-link" target="_blank" rel="noopener">
                        <div class="trend-title">${trend.title}</div>
                        <div class="trend-meta">
                            ${trend.source} • ${trend.time}
                            ${trend.score ? ` • ${trend.score} points` : ''}
                        </div>
                    </a>
                </div>
            </div>
        `).join('');
    }

    showError(containerId, message) {
        const container = document.querySelector(`#${containerId} .trends-list`);
        const loading = document.querySelector(`#${containerId} .loading`);
        
        loading.style.display = 'none';
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    timeAgo(timestamp) {
        const now = Date.now() / 1000;
        const diff = now - timestamp;
        
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    }

    startAutoRefresh() {
        // Refresh every 30 minutes
        setInterval(() => {
            this.loadAllTrends();
        }, 30 * 60 * 1000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrendingTopics();
});