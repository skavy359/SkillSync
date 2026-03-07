import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, Check, Send, Trash2, Clock, MessageCircle, Award } from 'lucide-react';
import { getPost, getReplies, addReply, togglePostUpvote, toggleReplyUpvote, acceptAnswer, deletePost, deleteReply } from '../services/forumService';

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

  useEffect(() => {
    if (postId) fetchData();
  }, [postId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postData, repliesData] = await Promise.all([
        getPost(postId),
        getReplies(postId),
      ]);
      setPost(postData);
      setReplies(repliesData);
    } catch (err) {
      console.error('Failed to load post', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpvote = async () => {
    try {
      const updated = await togglePostUpvote(postId);
      setPost(updated);
    } catch (err) {
      console.error('Failed to upvote', err);
    }
  };

  const handleReplyUpvote = async (replyId) => {
    try {
      const updated = await toggleReplyUpvote(replyId);
      setReplies(prev => prev.map(r => r.id === replyId ? updated : r));
    } catch (err) {
      console.error('Failed to upvote reply', err);
    }
  };

  const handleAcceptAnswer = async (replyId) => {
    try {
      const updated = await acceptAnswer(replyId);
      const repliesData = await getReplies(postId);
      setReplies(repliesData);
      showSuccess('Answer accepted! ✓');
    } catch (err) {
      console.error('Failed to accept answer', err);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setSending(true);
    try {
      const newReply = await addReply(postId, { content: replyContent.trim() });
      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
      showSuccess('Reply posted successfully!');
      setPost(prev => ({ ...prev, replyCount: prev.replyCount + 1 }));
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setSending(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeletePost = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(postId);
      showSuccess('Post deleted');
      onNavigate('discussions');
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await deleteReply(postId, replyId);
      setReplies(prev => prev.filter(r => r.id !== replyId));
      setPost(prev => ({ ...prev, replyCount: Math.max(0, prev.replyCount - 1) }));
      showSuccess('Reply deleted');
    } catch (err) {
      console.error('Failed to delete reply', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-[#6c7086]">Post not found.</p>
        <button onClick={() => onNavigate('discussions')} className="mt-4 text-purple-600 dark:text-purple-400 hover:underline">
          ← Back to Discussions
        </button>
      </div>
    );
  }

  const tagInfo = TAGS[post.tag] || TAGS.QUESTION;
  const isAuthor = post.authorId === currentUserId;
  const canAcceptAnswer = isAuthor && (post.tag === 'QUESTION' || post.tag === 'DISCUSSION');
  const acceptedReply = replies.find(r => r.acceptedAnswer);
  const otherReplies = replies.filter(r => !r.acceptedAnswer);
  const sortedReplies = acceptedReply ? [acceptedReply, ...otherReplies] : replies;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('discussions')}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#a6adc8] hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Discussions
      </button>

      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={handlePostUpvote}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                post.upvotedByMe
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-2 ring-purple-200 dark:ring-purple-500/30'
                  : 'bg-gray-100 dark:bg-[#313244] text-gray-400 dark:text-[#6c7086] hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-500'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <span className={`text-sm font-bold mt-1 ${
              post.upvotedByMe ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-[#6c7086]'
            }`}>
              {post.upvotes}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagInfo.bg}`}>
                {tagInfo.label}
              </span>
              {post.skillName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                  {post.skillName}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-3">
              {post.title}
            </h1>
            <p className="text-gray-700 dark:text-[#bac2de] whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-[#585b70]">
                <span className="font-medium text-gray-600 dark:text-[#a6adc8]">{post.authorName}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {timeAgo(post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {post.replyCount} replies
                </span>
              </div>
              {isAuthor && (
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-[#a6adc8] mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {sortedReplies.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244]">
            <MessageCircle className="w-8 h-8 text-gray-300 dark:text-[#45475a] mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-[#6c7086]">No replies yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedReplies.map(reply => {
              const isReplyAuthor = reply.authorId === currentUserId;
              return (
                <div
                  key={reply.id}
                  className={`bg-white dark:bg-[#1e1e2e] rounded-xl border p-5 transition-all ${
                    reply.acceptedAnswer
                      ? 'border-green-300 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5 ring-1 ring-green-200 dark:ring-green-500/20'
                      : 'border-gray-200 dark:border-[#313244]'
                  }`}
                >
                  {reply.acceptedAnswer && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 mb-3">
                      <Award className="w-4 h-4" /> Accepted Answer
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => handleReplyUpvote(reply.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          reply.upvotedByMe
                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-[#313244] text-gray-400 dark:text-[#6c7086] hover:bg-purple-50 dark:hover:bg-purple-500/10'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold mt-0.5 text-gray-500 dark:text-[#6c7086]">{reply.upvotes}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 dark:text-[#bac2de] whitespace-pre-wrap text-sm leading-relaxed">
                        {reply.content}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#585b70]">
                          <span className="font-medium text-gray-600 dark:text-[#a6adc8]">{reply.authorName}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {canAcceptAnswer && !reply.acceptedAnswer && (
                            <button
                              onClick={() => handleAcceptAnswer(reply.id)}
                              className="flex items-center gap-1 text-xs text-green-500 hover:text-green-600 transition-colors"
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                          )}
                          {isReplyAuthor && (
                            <button
                              onClick={() => handleDeleteReply(reply.id)}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
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

      <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-4">
        <textarea
          placeholder="Write your reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSendReply}
            disabled={!replyContent.trim() || sending}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail;