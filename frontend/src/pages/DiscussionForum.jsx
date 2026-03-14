import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Search, Plus, ThumbsUp, MessageCircle, Clock, X, Tag, ExternalLink, Check, ChevronRight } from 'lucide-react';
import { getPosts, createPost, togglePostUpvote } from '../services/forumService';
import Button from '../components/ui/Button';

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

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (activeTag) params.tag = activeTag;
      const data = await getPosts(params);
      setPosts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) { console.error('Failed to fetch posts', err); } finally { setLoading(false); }
  }, [page, searchQuery, activeTag]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return alert('Please fill in all fields');
    setCreating(true);
    try {
      await createPost({ title: newTitle.trim(), content: newContent.trim(), tag: newTag });
      setNewTitle(''); setNewContent(''); setNewTag('QUESTION'); setShowNewPost(false);
      showSuccess('Post created successfully! 🎉');
      setPage(0); fetchPosts();
    } catch (err) { console.error('Failed to create post', err); alert('Failed to create post'); } finally { setCreating(false); }
  };

  const handleUpvote = async (e, postId) => {
    e.stopPropagation();
    try {
      const updated = await togglePostUpvote(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
    } catch (err) { console.error('Failed to upvote', err); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchPosts(); };

  const getTagInfo = (tag) => TAGS.find(t => t.value === tag) || TAGS[0];

  const handleOpenPost = (postId) => { onSelectPost(postId); onNavigate('forum-post-detail'); };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* --- Hero Header --- */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700 p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium shadow-sm">
              <MessageSquare className="w-4 h-4 text-fuchsia-200" />
              <span>Community Discussions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">Discussion Forum</h1>
            <p className="text-purple-50 text-lg opacity-90 leading-relaxed">
              Ask questions, share tips, and learn from the community. Your knowledge could be the breakthrough someone else needs.
            </p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="inline-flex items-center justify-center px-6 py-3 shrink-0 border border-transparent text-base font-bold rounded-xl text-purple-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Discussion
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
        </div>
      )}

      {/* --- Search and Filters --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Search discussions by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-sm bg-white dark:bg-[#1e1e2e] border-none rounded-2xl shadow-sm text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all font-medium"
          />
        </form>
        <div className="flex gap-2 flex-wrap items-center bg-white dark:bg-[#1e1e2e] p-2 rounded-2xl shadow-sm">
          <button
            onClick={() => { setActiveTag(null); setPage(0); }}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              !activeTag ? 'bg-gray-900 dark:bg-[#cdd6f4] text-white dark:text-[#1e1e2e] shadow-md' : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-100 dark:hover:bg-[#313244]'
            }`}
          >
            All Topics
          </button>
          {TAGS.map(tag => (
            <button
              key={tag.value}
              onClick={() => { setActiveTag(activeTag === tag.value ? null : tag.value); setPage(0); }}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                activeTag === tag.value ? tag.bg + ' shadow-md scale-105 transform' : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-100 dark:hover:bg-[#313244]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Posts Feed --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white/50 dark:bg-[#1e1e2e]/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-[#313244] p-16 text-center">
            <div className="w-24 h-24 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] mb-2">No discussions found</h3>
            <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                {searchQuery || activeTag ? 'Try adjusting your filters to find what you are looking for.' : 'Be the first to start a conversation in the community!'}
            </p>
            <Button variant="primary" onClick={() => setShowNewPost(true)} icon={Plus}>Start Discussion</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => {
            const tagInfo = getTagInfo(post.tag);
            return (
              <div
                key={post.id}
                onClick={() => handleOpenPost(post.id)}
                className="group relative bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-100 dark:border-[#313244] p-5 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden flex flex-col md:flex-row md:items-center gap-5"
              >
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-500/5 dark:to-fuchsia-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-0" />
                
                <div className="flex flex-col items-center shrink-0 w-16 relative z-10">
                  <div
                    onClick={(e) => handleUpvote(e, post.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      post.upvotedByMe
                        ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-[#181825] text-gray-400 dark:text-[#6c7086] hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-100 dark:border-[#313244]'
                    }`}
                  >
                    <ThumbsUp className={`w-6 h-6 ${post.upvotedByMe ? '' : 'transform group-hover:-translate-y-0.5 transition-transform'}`} />
                  </div>
                  <span className={`text-sm font-black mt-2 ${post.upvotedByMe ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-[#6c7086]'}`}>
                    {post.upvotes}
                  </span>
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${tagInfo.bg}`}>
                      {tagInfo.label}
                    </span>
                    {post.skillName && (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-500/20">
                        {post.skillName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 mb-1.5">
                    {post.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-[#a6adc8] mb-4 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-gray-400 dark:text-[#585b70]">
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-[#cdd6f4] bg-gray-50 dark:bg-[#181825] px-2 py-1 rounded-md">
                        <span className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#313244] dark:to-[#45475a] inline-block" />
                        {post.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {timeAgo(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" /> {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-[#181825] text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors relative z-10">
                    <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e2e] p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-[#313244]">
                <Button variant={page === 0 ? 'secondary' : 'primary'} onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
                <span className="px-3 text-sm font-bold text-gray-600 dark:text-[#a6adc8]">
                    {page + 1} / {totalPages}
                </span>
                <Button variant={page === totalPages - 1 ? 'secondary' : 'primary'} onClick={() => setPage(page + 1)} disabled={page === totalPages - 1} className="px-4">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
      )}

      {/* --- New Post Modal --- */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowNewPost(false)}>
          <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-200 dark:border-[#313244] w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-500/10 dark:to-fuchsia-500/10 px-6 py-4 border-b border-gray-200 dark:border-[#313244] flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Start a Discussion
              </h2>
              <button onClick={() => setShowNewPost(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-[#cdd6f4] hover:bg-white/50 dark:hover:bg-[#313244] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-3">Topic Category</label>
                <div className="flex gap-3 flex-wrap">
                  {TAGS.map(tag => (
                    <button
                      key={tag.value}
                      onClick={() => setNewTag(tag.value)}
                      className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all flex items-center gap-2 ${
                        newTag === tag.value
                          ? `${tag.bg} border-transparent shadow-sm ring-2 ring-offset-2 ring-purple-500/30 dark:ring-offset-[#1e1e2e]`
                          : 'bg-white dark:bg-[#181825] border-gray-200 dark:border-[#313244] text-gray-600 dark:text-[#a6adc8] hover:border-gray-300'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Summarize your question or topic..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Details <span className="text-rose-500">*</span></label>
                <textarea
                  placeholder="Provide context, share code snippets, or explain your problem..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#181825] px-6 py-4 flex justify-end gap-3 border-t border-gray-200 dark:border-[#313244]">
              <Button variant="secondary" onClick={() => setShowNewPost(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreatePost} disabled={!newTitle.trim() || !newContent.trim() || creating} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 border-transparent hover:shadow-purple-500/30">
                {creating ? 'Publishing...' : 'Publish Discussion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;