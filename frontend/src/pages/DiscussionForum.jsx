import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Search, Plus, ThumbsUp, MessageCircle, Clock, X, Tag, ExternalLink, Check } from 'lucide-react';
import { getPosts, createPost, togglePostUpvote } from '../services/forumService';

const TAGS = [
  { value: 'QUESTION', label: 'Question', color: '#6366f1', bg: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
  { value: 'DISCUSSION', label: 'Discussion', color: '#8b5cf6', bg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
  { value: 'TIP', label: 'Tip', color: '#10b981', bg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
  { value: 'RESOURCE', label: 'Resource', color: '#f59e0b', bg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' },
];

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

const DiscussionForum = ({ onNavigate, onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('QUESTION');
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (activeTag) params.tag = activeTag;
      const data = await getPosts(params);
      setPosts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    try {
      await createPost({
        title: newTitle.trim(),
        content: newContent.trim(),
        tag: newTag,
      });
      setNewTitle('');
      setNewContent('');
      setNewTag('QUESTION');
      setShowNewPost(false);
      showSuccess('Post created successfully!');
      setPage(0);
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post', err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpvote = async (e, postId) => {
    e.stopPropagation();
    try {
      const updated = await togglePostUpvote(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
    } catch (err) {
      console.error('Failed to upvote', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPosts();
  };

  const getTagInfo = (tag) => TAGS.find(t => t.value === tag) || TAGS[0];

  const handleOpenPost = (postId) => {
    onSelectPost(postId);
    onNavigate('forum-post-detail');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">
              Discussions
            </h1>
          </div>
          <p className="text-gray-600 dark:text-[#a6adc8] mt-1">
            Ask questions, share tips, and learn from the community
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-white dark:bg-[#1e1e2e] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setActiveTag(null); setPage(0); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              !activeTag
                ? 'bg-gray-900 dark:bg-[#cdd6f4] text-white dark:text-[#1e1e2e]'
                : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-200 dark:hover:bg-[#45475a]'
            }`}
          >
            All
          </button>
          {TAGS.map(tag => (
            <button
              key={tag.value}
              onClick={() => { setActiveTag(activeTag === tag.value ? null : tag.value); setPage(0); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTag === tag.value
                  ? tag.bg + ' ring-2 ring-offset-1 dark:ring-offset-[#1e1e2e]'
                  : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-200 dark:hover:bg-[#45475a]'
              }`}
              style={activeTag === tag.value ? { '--tw-ring-color': tag.color + '40' } : {}}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-[#6c7086] mt-3 text-sm">Loading discussions...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-[#45475a] mx-auto mb-3" />
          <p className="text-gray-500 dark:text-[#6c7086]">
            {searchQuery || activeTag ? 'No discussions found matching your filters.' : 'No discussions yet. Start one!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const tagInfo = getTagInfo(post.tag);
            return (
              <button
                key={post.id}
                onClick={() => handleOpenPost(post.id)}
                className="w-full text-left bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  {/* Upvote column */}
                  <div className="flex flex-col items-center shrink-0 min-w-[44px]">
                    <div
                      onClick={(e) => handleUpvote(e, post.id)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        post.upvotedByMe
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-[#313244] text-gray-400 dark:text-[#6c7086] hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-500'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold mt-1 ${
                      post.upvotedByMe ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-[#6c7086]'
                    }`}>
                      {post.upvotes}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagInfo.bg}`}>
                        {tagInfo.label}
                      </span>
                      {post.skillName && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                          {post.skillName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-[#585b70]">
                      <span>{post.authorName}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                page === i
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-200 dark:hover:bg-[#45475a]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#313244]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">New Discussion</h2>
              <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#cdd6f4]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Tag selection */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-[#6c7086] mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {TAGS.map(tag => (
                    <button
                      key={tag.value}
                      onClick={() => setNewTag(tag.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        newTag === tag.value
                          ? tag.bg + ' ring-2 ring-offset-1 dark:ring-offset-[#1e1e2e]'
                          : 'bg-gray-100 dark:bg-[#313244] text-gray-500 dark:text-[#6c7086]'
                      }`}
                      style={newTag === tag.value ? { '--tw-ring-color': tag.color + '40' } : {}}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-[#6c7086] mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="What's your question or topic?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-white dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-[#6c7086] mb-1.5">Content</label>
                <textarea
                  placeholder="Share your thoughts, question, or tip..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-white dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 pt-0">
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newTitle.trim() || !newContent.trim() || creating}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
