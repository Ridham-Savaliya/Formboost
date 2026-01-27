import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import blogPosts from '../src/data/blogPosts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://formboom.site';

const formatDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
        return d.toISOString().split('T')[0];
    } catch (e) {
        return new Date().toISOString().split('T')[0];
    }
};

const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/signup', priority: '0.9', changefreq: 'weekly' },
    { url: '/login', priority: '0.8', changefreq: 'weekly' },
    { url: '/dashboard', priority: '0.7', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Static Pages -->
    ${staticRoutes.map(route => `
    <url>
        <loc>${BASE_URL}${route.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}

    <!-- Blog Posts -->
    ${blogPosts.map(post => `
    <url>
        <loc>${BASE_URL}/blog/${post.id}</loc>
        <lastmod>${formatDate(post.date)}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}

</urlset>`;

    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, sitemap.trim());
    console.log(`✅ Sitemap updated at ${publicPath}`);
};

generateSitemap();
