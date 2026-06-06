// API route to fetch GitHub stats
// File: app/api/github-stats/route.js

import fs from 'fs';
import path from 'path';

// Cache to prevent too many API calls
let lastFetch = 0;
let cachedData = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();
  
  // Return cached data if less than 5 minutes old
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    console.log('Returning cached GitHub stats');
    return Response.json(cachedData);
  }

  try {
    const repoOwner = 'jaseci-labs';
    const repoName = 'jaseci';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    
    console.log('Fetching fresh GitHub stats...');
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'jac-website',
        // Add your GitHub token for higher rate limits (optional)
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      // No caching - fetch fresh data every time
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    const stats = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      lastUpdated: new Date().toISOString()
    };

    // Update cache
    cachedData = stats;
    lastFetch = now;

    // Save to JSON file
    try {
      const jsonPath = path.join(process.cwd(), 'json', 'github-stats.json');
      fs.writeFileSync(jsonPath, JSON.stringify(stats, null, 2));
      console.log('✓ Updated github-stats.json with fresh data:', stats);
    } catch (fileError) {
      console.error('Error writing to JSON file:', fileError);
      // Continue anyway, return the fetched data
    }

    return Response.json(stats);
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    
    // Try to read existing JSON file as fallback
    try {
      const jsonPath = path.join(process.cwd(), 'json', 'github-stats.json');
      const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log('Using existing JSON data due to API error');
      
      // Cache the fallback data too
      cachedData = existingData;
      lastFetch = now;
      
      return Response.json(existingData);
    } catch (fileError) {
      console.error('Error reading JSON file:', fileError);
      
      // Return fallback data if everything fails
      return Response.json(
        { 
          stars: '--', 
          forks: '--', 
          lastUpdated: new Date().toISOString(),
          error: 'Failed to fetch from GitHub API and no local data available'
        },
        { status: 500 }
      );
    }
  }
}