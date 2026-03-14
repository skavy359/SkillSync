import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, Check, Send, Trash2, Clock, MessageCircle, Award, Share2, AlertTriangle } from 'lucide-react';
import { getPost, getReplies, addReply, togglePostUpvote, toggleReplyUpvote, acceptAnswer, deletePost, deleteReply } from '../services/forumService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const TAGS = {
  QUESTION: { label: 'Question', bg: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
  DISCUSSION: { label: 'Discussion', bg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
  TIP: { label: 'Tip', bg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
  RESOURCE: { label: 'Resource', bg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' },
};

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

const ForumPostDetail = ({ postId, onNavigate, currentUserId }) => {
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { if (postId) fetchData(); }, [postId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postData, repliesData] = await Promise.all([getPost(postId), getReplies(postId)]);
      setPost(postData); setReplies(repliesData);
    } catch (err) { console.error('Failed to load post', err); } finally { setLoading(false); }
  };

  const handlePostUpvote = async () => {
    try { const updated = await togglePostUpvote(postId); setPost(updated); } catch (err) { console.error('Failed to upvote', err); }
  };

  const handleReplyUpvote = async (replyId) => {
    try {
      const updated = await toggleReplyUpvote(replyId);
      setReplies(prev => prev.map(r => r.id === replyId ? updated : r));
    } catch (err) { console.error('Failed to upvote reply', err); }
  };

  const handleAcceptAnswer = async (replyId) => {
    try {
      await acceptAnswer(replyId);
      const repliesData = await getReplies(postId); setReplies(repliesData);
      showSuccess('Answer accepted! ✅');
    } catch (err) { console.error('Failed to accept answer', err); }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setSending(true);
    try {
      const newReply = await addReply(postId, { content: replyContent.trim() });
      setReplies(prev => [...prev, newReply]); setReplyContent('');
      showSuccess('Reply posted successfully!');
      setPost(prev => ({ ...prev, replyCount: prev.replyCount + 1 }));
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) { console.error('Failed to send reply', err); } finally { setSending(false); }
  };

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'post') {
        await deletePost(postId);
        showSuccess('Post deleted');
        setTimeout(() => onNavigate('discussions'), 1000);
      } else {
        await deleteReply(postId, deleteTarget.id);
        setReplies(prev => prev.filter(r => r.id !== deleteTarget.id));
        setPost(prev => ({ ...prev, replyCount: Math.max(0, prev.replyCount - 1) }));
        showSuccess('Reply deleted');
      }
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-lg" /></div>;
  if (!post) return <div className="text-center py-20 bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244]"><p className="text-gray-500 text-lg font-semibold">Discussion not found.</p><Button onClick={() => onNavigate('discussions')} className="mt-6 font-bold" variant="secondary">Back to Forum</Button></div>;

  const tagInfo = TAGS[post.tag] || TAGS.QUESTION;
  const isAuthor = post.authorId === currentUserId;
  const canAcceptAnswer = isAuthor && (post.tag === 'QUESTION' || post.tag === 'DISCUSSION');
  const acceptedReply = replies.find(r => r.acceptedAnswer);
  const otherReplies = replies.filter(r => !r.acceptedAnswer);
  const sortedReplies = acceptedReply ? [acceptedReply, ...otherReplies] : replies;

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">

      <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('discussions')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-xl text-sm font-bold text-gray-700 dark:text-[#cdd6f4] hover:bg-gray-50 dark:hover:bg-[#313244] shadow-sm transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" /> All Discussions
          </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1e2e] rounded-[2rem] border border-gray-100 dark:border-[#313244] shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-500/5 dark:to-fuchsia-500/5 rounded-bl-[100px] pointer-events-none -z-0" />
        
        <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
                
                <div className="hidden md:flex flex-col items-center shrink-0 w-16">
                    <button
                        onClick={handlePostUpvote}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            post.upvotedByMe
                                ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-100 dark:ring-purple-500/20'
                                : 'bg-gray-50 dark:bg-[#181825] text-gray-400 dark:text-[#6c7086] hover:bg-purple-100 hover:text-purple-600 border border-gray-100 dark:border-[#313244]'
                        }`}
                    >
                        <ThumbsUp className={`w-6 h-6 ${post.upvotedByMe ? '' : 'transform hover:-translate-y-1 transition-transform'}`} />
                    </button>
                    <span className={`text-xl font-black mt-3 ${post.upvotedByMe ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-[#6c7086]'}`}>
                        {post.upvotes}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Votes</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${tagInfo.bg}`}>
                            {tagInfo.label}
                        </span>
                        {post.skillName && (
                            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                <span className="mr-1">🎯</span>{post.skillName}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 dark:text-[#6c7086] font-semibold flex items-center gap-1 ml-auto">
                            <Clock className="w-3.5 h-3.5" /> Posted {timeAgo(post.createdAt)}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-[#cdd6f4] mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-[#bac2de] text-[15px] md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                        {post.content}
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-[#313244] gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                <span className="text-sm font-bold text-white">{post.authorName?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{post.authorName}</p>
                                <p className="text-xs text-gray-500 dark:text-[#6c7086] font-medium">Original Poster</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePostUpvote}
                                className={`md:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    post.upvotedByMe ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                }`}
                            >
                                <ThumbsUp className="w-4 h-4" /> {post.upvotes}
                            </button>

                            {isAuthor && (
                                <button
                                    onClick={() => { setDeleteTarget({ type: 'post' }); setDeleteModalOpen(true); }}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between ml-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
        </div>

        {sortedReplies.length === 0 ? (
          <div className="bg-gray-50/50 dark:bg-[#1e1e2e]/50 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#313244] p-12 text-center">
            <div className="w-16 h-16 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-300 dark:text-[#45475a]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">No replies yet</h3>
            <p className="text-gray-500 dark:text-[#6c7086]">Be the first to share your thoughts or answer the question.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReplies.map(reply => {
              const isReplyAuthor = reply.authorId === currentUserId;
              return (
                <div
                  key={reply.id}
                  className={`relative bg-white dark:bg-[#1e1e2e] rounded-2xl p-6 transition-all ${
                    reply.acceptedAnswer
                      ? 'border-2 border-emerald-400 dark:border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-50 dark:ring-emerald-500/5'
                      : 'border border-gray-200 dark:border-[#313244] shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/30'
                  }`}
                >
                  {reply.acceptedAnswer && (
                    <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-md">
                      <Award className="w-4 h-4" /> MARKED AS ANSWER
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-row sm:flex-col items-center gap-2 sm:shrink-0 sm:w-12 bg-gray-50 dark:bg-[#181825] sm:bg-transparent p-2 sm:p-0 rounded-xl">
                      <button
                        onClick={() => handleReplyUpvote(reply.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          reply.upvotedByMe
                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold'
                            : 'bg-white dark:bg-[#313244] sm:bg-gray-50 sm:dark:bg-[#181825] border border-gray-100 dark:border-[#313244] text-gray-400 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${reply.upvotedByMe ? '' : 'sm:hover:-translate-y-0.5 transition-transform'}`} />
                      </button>
                      <span className={`text-sm font-black ${reply.upvotedByMe ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                        {reply.upvotes}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      
                      <div className="flex items-center gap-3 mb-4 text-xs">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#313244] flex items-center justify-center shadow-inner">
                              <span className="font-bold text-gray-600 dark:text-[#cdd6f4]">{reply.authorName?.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-[#cdd6f4]">{reply.authorName}</span>
                          {reply.authorId === post.authorId && (
                               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-widest">Author</span>
                          )}
                          <span className="text-gray-400 flex items-center gap-1 ml-auto font-medium">
                            <Clock className="w-3.5 h-3.5" /> {timeAgo(reply.createdAt)}
                          </span>
                      </div>

                      <div className="text-gray-700 dark:text-[#bac2de] text-sm md:text-[15px] whitespace-pre-wrap leading-relaxed font-medium">
                        {reply.content}
                      </div>

                      <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-50 dark:border-[#313244]">
                          <div className="flex items-center gap-2">
                            {canAcceptAnswer && !reply.acceptedAnswer && (
                              <button
                                onClick={() => handleAcceptAnswer(reply.id)}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100"
                              >
                                <Check className="w-4 h-4" /> Accept As Answer
                              </button>
                            )}
                            {isReplyAuthor && (
                              <button
                                onClick={() => { setDeleteTarget({ type: 'reply', id: reply.id }); setDeleteModalOpen(true); }}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            )}
                          </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-200 dark:border-[#313244] overflow-hidden shadow-lg mt-8">
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-[#181825] dark:to-purple-900/10 px-6 py-4 border-b border-gray-100 dark:border-[#313244] flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            <span className="font-black text-gray-900 dark:text-[#cdd6f4]">Leave a Reply</span>
        </div>
        <div className="p-6">
            <textarea
              placeholder="Write a thoughtful response..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={5}
              className="w-full px-5 py-4 text-sm md:text-[15px] border-2 border-gray-100 dark:border-[#313244] rounded-2xl bg-gray-50 dark:bg-[#181825] hover:bg-white focus:bg-white text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 resize-none transition-all font-medium mb-4"
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSendReply}
                disabled={!replyContent.trim() || sending}
                icon={Send}
                className="px-8 bg-gradient-to-r from-purple-500 to-indigo-600 border-transparent hover:shadow-purple-500/25 disabled:opacity-50"
              >
                {sending ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
        </div>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6 text-center">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">
                {deleteTarget?.type === 'post' ? 'Delete Discussion?' : 'Delete Reply?'}
            </h3>
            <p className="text-gray-500 dark:text-[#6c7086] mb-8">
                Are you sure you want to delete this {deleteTarget?.type === 'post' ? 'discussion' : 'reply'}? This action cannot be undone and will remove all associated responses.
            </p>
            <div className="flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} className="px-6 font-bold">Cancel</Button>
                <Button 
                    variant="primary" 
                    onClick={confirmDelete}
                    className="px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.3)]"
                >
                    Yes, Delete
                </Button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default ForumPostDetail;