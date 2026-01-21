import axios from 'axios';

const HOST = 'formboom.site';
const KEY = '7bd9e9f1a0b34e5c8a9f2e3d4c5b6a71'; // This should be a unique key file in the root
const KEY_LOCATION = `https://${HOST}/indexnow-key.txt`;

const urls = [
    `https://${HOST}/`,
    `https://${HOST}/blog`,
    `https://${HOST}/blog/best-free-form-builders-2024`,
    `https://${HOST}/blog/formboom-vs-typeform-comparison`,
    `https://${HOST}/blog/how-to-automate-lead-capture`,
    `https://${HOST}/blog/google-forms-alternatives-2024`
];

const submitToIndexNow = async () => {
    try {
        const response = await axios.post('https://api.indexnow.org/IndexNow', {
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList: urls
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
