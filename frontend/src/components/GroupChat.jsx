import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { sendMessage, getGroupMessages, deleteMessage } from '../services/groupMessageService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const GroupChat = ({ groupId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        if (!window.confirm('Delete this message?')) return;

        try {
            await deleteMessage(messageId);
            setMessages(messages.filter(m => m.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#1e1e2e] rounded-lg border border-gray-200 dark:border-[#313244]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-[#6c7086]">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex flex-col max-w-xs rounded-lg p-3 ${
                                    msg.userId === currentUserId
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4]'
                                }`}
                            >
                                {msg.userId !== currentUserId && (
                                    <p className="text-xs font-semibold mb-1 opacity-75">
                                        {msg.userName}
                                    </p>
                                )}
                                <p className="text-sm break-words">{msg.content}</p>
                                <div className="flex items-center justify-between mt-1 gap-2">
                                    <p className="text-xs opacity-70">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {msg.isEdited && (
                                        <p className="text-xs opacity-70 italic">edited</p>
                                    )}
                                    {msg.userId === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="text-xs opacity-70 hover:opacity-100 underline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-[#313244] flex gap-2">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1"
                />
                <Button type="submit" loading={sending} size="sm">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
};

export default GroupChat;
