import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/api/entities';
import { Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow({ friend, onClose, currentUser }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch messages between current user and friend
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', friend.id],
    queryFn: async () => {
      const sent = await Message.filter({ 
        sender_id: currentUser.id, 
        receiver_id: friend.friend_id 
      });
      const received = await Message.filter({ 
        sender_id: friend.friend_id, 
        receiver_id: currentUser.id 
      });
      return [...sent, ...received].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      await Message.create({
        sender_id: currentUser.id,
        receiver_id: friend.friend_id,
        content: content,
        read: false
      });
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries(['messages', friend.id]);
      scrollToBottom();
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-4 w-80 h-96 glass-card flex flex-col rounded-2xl overflow-hidden shadow-2xl z-50 border border-white/20"
    >
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {friend.friend_name?.[0]}
          </div>
          <span className="font-bold text-white">{friend.friend_name}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
        {isLoading ? (
          <div className="flex justify-center pt-4">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-slate-500 mt-4">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  isMe 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
          className="p-2 bg-purple-600 rounded-xl text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}