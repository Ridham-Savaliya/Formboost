import { useParams, Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import SEOHead from "../components/SEOHead";
import { ZapIcon } from "../components/OptimizedIcons";
import { useEffect } from "react";

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen py-32 text-center space-y-4">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link to="/blog" className="text-[#0080FF] hover:underline">Back to blog</Link>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title={`${post.title} | FormBoom Blog`}
                description={post.excerpt}
                keywords={post.keywords}
                type="article"
            />
            <div className="min-h-screen bg-white pt-24 pb-20">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <header className="space-y-8 mb-12">
                        <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-[#0080FF] transition-colors text-sm font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Blog
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="bg-blue-100 text-[#0080FF] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                                <span className="text-slate-400">•</span>
                                <time className="text-slate-500 text-sm font-medium">{post.date}</time>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex items-center space-x-4 pt-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{post.author}</div>
                                    <div className="text-slate-500 text-sm">Product Specialist @ FormBoom</div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-xl">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate max-w-none 
            prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600 prose-strong:text-slate-900
            prose-a:text-[#0080FF] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-lg">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 p-8 sm:p-12 bg-slate-50 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080FF]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#0080FF]/20 transition-colors"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-slate-900 italic">Inspired to grow?</h3>
                                <p className="text-slate-600 max-w-sm">Capture better leads today with the same tools discussed in this article.</p>
                            </div>
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-[#0080FF] text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1 flex items-center space-x-2"
                            >
                                <span>Start Building Free</span>
                                <ZapIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
};

export default BlogPost;
