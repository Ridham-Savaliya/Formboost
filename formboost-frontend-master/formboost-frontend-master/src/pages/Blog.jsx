import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import SEOHead from "../components/SEOHead";
import { ZapIcon } from "../components/OptimizedIcons";
import { useState } from "react";

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

    const filteredPosts = activeCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    return (
        <>
            <SEOHead
                title="FormBoom Blog — Insights on Lead Gen, Forms & Automation"
                description="Stay ahead of the curve with our latest tips on form building, conversion optimization, and workflow automation. Beat your competitors with FormBoom insights."
                keywords="form builder blog, marketing automation tips, lead conversion strategies, formboom guides"
            />
            <div className="min-h-screen bg-slate-50 pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                            <ZapIcon className="w-4 h-4" />
                            <span>The FormBoom Gazette</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Master the Art of <span className="text-[#0080FF]">Conversion</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600">
                            Expert insights, detailed comparisons, and step-by-step guides to help you build a high-converting lead generation engine.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                    ? "bg-[#0080FF] text-white shadow-lg"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.id}`}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="aspect-[16/9] overflow-hidden relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0080FF] transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center text-[#0080FF] text-sm font-bold">
                                        <span>Read More</span>
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <div className="mt-24 bg-gradient-to-br from-[#0080FF] to-blue-700 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-bold">Join 5,000+ Smart Marketers</h2>
                            <p className="text-blue-100 max-w-md mx-auto">Get our best SEO and lead generation tips delivered straight to your inbox once a week.</p>
                            <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-blue-100 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                                <button className="px-8 py-4 bg-white text-[#0080FF] font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-lg">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;
