// lib/rate-limit.js
export function rateLimit({ interval, max, uniqueTokenPerInterval = 500 }) {
    const tokens = new Map();
    const tokenCache = new Set();
    
    // Cleanup old tokens periodically
    setInterval(() => {
      const now = Date.now();
      for (const [token, timestamp] of tokens.entries()) {
        if (now - timestamp > interval) {
          tokens.delete(token);
          tokenCache.delete(token);
        }
      }
    }, interval);
  
    return {
      check: (res, limit, token) => new Promise((resolve, reject) => {
        const now = Date.now();
        const tokenCount = tokens.get(token) || 0;
        
        // If token doesn't exist or has expired
        if (!tokens.has(token)) {
          tokens.set(token, now);
          tokenCache.add(token);
        }
        
        // If token exists and is within limit
        if (tokenCount < limit) {
          tokens.set(token, now);
          return resolve();
        }
        
        // If token exists but has exceeded limit
        reject();
      })
    };
  }