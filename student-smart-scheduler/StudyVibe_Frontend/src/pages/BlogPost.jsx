import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogPost, blogPosts } from "../data/blogData";
import Footer from "../components/Reusable/Footer";

// Individual blog post detail page
// Shows full blog post content with navigation
const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getBlogPost(id);

  // If post not found, show error
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find that blog post.
          </p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Article Header */}
      <article className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {/* Format the content - split by paragraphs and render */}
          {post.content.split("\n").map((paragraph, index) => {
            // Handle headers
            if (paragraph.startsWith("# ")) {
              return (
                <h1
                  key={index}
                  className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.substring(2)}
                </h1>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                  {paragraph.substring(3)}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-xl font-bold text-gray-800 mt-4 mb-2">
                  {paragraph.substring(4)}
                </h3>
              );
            }

            // Handle bold text
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed my-4 font-bold">
                  {paragraph.replace(/\*\*/g, "")}
                </p>
              );
            }

            // Handle lists
            if (
              paragraph.trim().startsWith("-") ||
              paragraph.trim().startsWith("•")
            ) {
              return (
                <li key={index} className="text-gray-700 leading-relaxed ml-6">
                  {paragraph.substring(paragraph.indexOf(" ") + 1)}
                </li>
              );
            }

            // Handle numbered lists
            if (/^\d+\./.test(paragraph.trim())) {
              return (
                <li key={index} className="text-gray-700 leading-relaxed ml-6">
                  {paragraph.substring(paragraph.indexOf(".") + 1).trim()}
                </li>
              );
            }

            // Regular paragraphs
            if (paragraph.trim()) {
              return (
                <p key={index} className="text-gray-700 leading-relaxed my-4">
                  {paragraph}
                </p>
              );
            }

            return null;
          })}
        </div>

        {/* Tags */}
        <div className="mb-12 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group bg-white rounded-lg shadow hover:shadow-lg transition-all p-4">
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {relatedPost.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to ace your exams?</h3>
          <p className="text-blue-100 mb-6">
            Create your personalized study schedule with StudyVibe
          </p>
          <Link
            to="/signup"
            className="btn bg-white text-blue-600 hover:bg-blue-50 border-none">
            Get Started Free
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
