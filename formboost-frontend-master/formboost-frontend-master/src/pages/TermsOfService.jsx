import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
                    <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                    <p className="text-primary-foreground/80 mt-2">Last Updated: January 22, 2026</p>
                </div>

                <div className="p-10 prose prose-blue max-w-none text-gray-600 leading-relaxed">
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using Formboom, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily use Formboom for personal or commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any unauthorized commercial purpose;</li>
                            <li>Attempt to decompile or reverse engineer any software contained on Formboom;</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on Formboom are provided on an 'as is' basis. Formboom makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Limitations</h2>
                        <p>
                            In no event shall Formboom or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Formboom.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>

                    <section className="mt-12 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">6. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;
