import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Trash2, X } from 'lucide-react';
import { sendMessage, getGroupMessages, deleteMessage } from '../services/groupMessageService';

const GroupChat = ({ groupId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [contextMenu, setContextMenu] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const result = await getGroupMessages(groupId, 0, 50);
            setMessages(result.content ? result.content.reverse() : []);
            setHasMore(result.hasNextPage || false);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setSending(true);
            const message = await sendMessage(groupId, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        setDeleteConfirm(messageId);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            setDeleting(true);
            await deleteMessage(deleteConfirm);
            setMessages(messages.filter(m => m.id !== deleteConfirm));
            setContextMenu(null);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        } finally {
            setDeleting(false);
        }
    };

    const handleContextMenu = (e, messageId) => {
        e.preventDefault();
        setContextMenu({
            messageId,
            x: e.clientX,
            y: e.clientY
        });
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-[#11111b] dark:to-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-[#6c7086] gap-3">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                            <Send className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="font-semibold">Start the conversation!</p>
                        <p className="text-sm">Send the first message to get things rolling</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.userId === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold ${
                                msg.userId === currentUserId
                                    ? 'from-indigo-500 to-blue-600'
                                    : 'from-purple-500 to-pink-600'
                            }`}>
                                {msg.userName?.charAt(0).toUpperCase() || '?'}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-xs gap-1 ${msg.userId === currentUserId ? 'items-end' : 'items-start'}`}>
                                {/* User Info */}
                                <div className="flex items-center gap-2 px-3">
                                    <p className="text-xs font-bold text-gray-900 dark:text-[#cdd6f4]">
                                        {msg.userName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-[#6c7086]">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {msg.isEdited && (
                                        <p className="text-xs text-gray-400 dark:text-[#6c7086] italic">edited</p>
                                    )}
                                </div>

                                {/* Message Content */}
                                <div 
                                    onContextMenu={(e) => msg.userId === currentUserId && handleContextMenu(e, msg.id)}
                                    className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all cursor-context-menu ${
                                        msg.userId === currentUserId
                                            ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] rounded-bl-none border border-gray-200 dark:border-[#45475a]'
                                    }`}
                                >
                                    <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-[#313244] flex gap-2 bg-white dark:bg-[#1e1e2e]">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-[#313244] border border-gray-300 dark:border-[#45475a] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
                <button 
                    type="submit" 
                    disabled={sending || !newMessage.trim()}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed bg-white dark:bg-[#313244] border border-gray-200 dark:border-[#45475a] rounded-lg shadow-lg z-50 py-1 min-w-40"
                    style={{
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`
                    }}
                >
                    <button
                        onClick={() => handleDeleteMessage(contextMenu.messageId)}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Message
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">
                                Delete Message?
                            </h3>
                            <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-6">
                            This action cannot be undone. Are you sure you want to delete this message?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChat;
