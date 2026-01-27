import axios from 'axios';

import blogPosts from '../src/data/blogPosts.js';

const HOST = 'formboom.site';
const KEY = '7bd9e9f1a0b34e5c8a9f2e3d4c5b6a71'; // This should be a unique key file in the root
const KEY_LOCATION = `https://${HOST}/indexnow-key.txt`;

const staticRoutes = [
    '/',
    '/blog',
];

const urls = [
    ...staticRoutes.map(route => `https://${HOST}${route}`),
    ...blogPosts.map(post => `https://${HOST}/blog/${post.id}`)
];

// Ensure unique URLs
const uniqueUrls = [...new Set(urls)];

const submitToIndexNow = async () => {
    try {
        const response = await axios.post('https://api.indexnow.org/IndexNow', {
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList: uniqueUrls
        });

        if (response.status === 200) {
            console.log('✅ IndexNow submission successful!');
        } else {
            console.error('❌ IndexNow submission failed:', response.status);
        }
    } catch (error) {
        console.error('❌ Error submitting to IndexNow:', error.message);
    }
};

submitToIndexNow();
