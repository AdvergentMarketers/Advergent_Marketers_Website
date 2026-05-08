import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Target all search engines (Google, Bing, etc.)
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/auth/'
      ], // Critically important: Keep bots out of your secure command centers
    },
    sitemap: 'https://advergentmarketers.com/sitemap.xml',
  };
}