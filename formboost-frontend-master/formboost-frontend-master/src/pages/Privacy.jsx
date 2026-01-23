import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-primary py-8 px-10">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white/80 hover:text-white mb-4 flex items-center transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="text-primary-foreground/80 mt-2">Last Updated: January 22, 2026</p>
                </div>

                <div className="p-10 prose prose-blue max-w-none text-gray-600 leading-relaxed">
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Formboom ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. The Data We Collect</h2>
                        <p>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> Includes email address.</li>
                            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            <li><strong>Usage Data:</strong> Includes information about how you use our website and services.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>To register you as a new customer.</li>
                            <li>To provide and manage your account.</li>
                            <li>To improve our website, products/services, marketing or customer relationships.</li>
                            <li>To comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Third-Party Links</h2>
                        <p>
                            This website may include links to third-party websites, plug-ins and applications (like Google Auth). Clicking on those links or enabling those connections may allow third parties to collect or share data about you.
                        </p>
                    </section>

                    <section className="mt-12 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        </p>
                        <p className="mt-2 text-primary font-semibold">contact@formboom.site</p>
                    </section>
                </div>
            </div>
            <div className="text-center mt-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Formboom. All rights reserved.
            </div>
        </div>
    );
};

export default Privacy;
