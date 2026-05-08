import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://advergentmarketers.com';

  // These are your static core pages
  const routes = [
    '',
    '/about',
    '/services',
    '/work',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8, // The home page gets highest priority
  }));

  // Note: Once you build out the dynamic `/work/[id]` pages for your case studies,
  // you would fetch those IDs from Supabase here and push them into this array!

  return [...routes];
}