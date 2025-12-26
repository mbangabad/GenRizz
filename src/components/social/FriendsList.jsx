import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Friendship } from '@/api/entities';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, Trophy, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PremiumBadge from '@/components/premium/PremiumBadge';

export default function FriendsList({ userId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      const friendships = await Friendship.filter({ 
        user_id: userId,
        status: 'accepted' 
      });
      return friendships;
    },
    enabled: !!userId,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingFriends', userId],
    queryFn: async () => {
      const requests = await Friendship.filter({ 
        friend_id: userId,
        status: 'pending' 
      });
      return requests;
    },
    enabled: !!userId,
  });

  const filteredFriends = friends.filter(f => 
    f.friend_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.friend_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--brand-blue)]" />
          Friends
          {friends.length > 0 && (
            <span className="text-sm font-bold text-[var(--text-muted)]">({friends.length})</span>
          )}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddFriend(true)}
          className="btn-3d btn-3d-blue px-4 py-2 text-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </motion.button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d card-3d-pink p-4"
        >
          <p className="font-bold text-[var(--text-primary)] mb-2">
            {pendingRequests.length} Friend Request{pendingRequests.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-pink)] flex items-center justify-center text-white font-bold">
                  {req.friend_name?.[0] || '?'}
                </div>
                <span className="flex-1 font-semibold text-[var(--text-primary)]">{req.friend_name}</span>
                <button className="btn-3d btn-3d-lime px-3 py-1 text-xs">Accept</button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--border-subtle)] bg-white font-semibold text-[var(--text-primary)] focus:border-[var(--brand-blue)] focus:outline-none"
        />
      </div>

      {/* Friends List */}
      <div className="space-y-2">
        {filteredFriends.length === 0 ? (
          <div className="card-3d p-8 text-center">
            <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="font-bold text-[var(--text-primary)]">No friends yet</p>
            <p className="text-sm text-[var(--text-secondary)]">Add friends to compete and compare scores!</p>
          </div>
        ) : (
          filteredFriends.map((friend, i) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-3d p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-dark)] flex items-center justify-center text-white font-black text-lg">
                {friend.friend_name?.[0] || '?'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[var(--text-primary)] truncate">{friend.friend_name}</p>
                  {friend.is_premium && <PremiumBadge size="xs" />}
                </div>
                <p className="text-sm text-[var(--text-muted)] truncate">{friend.friend_email}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="badge-3d badge-xp">
                  <Zap className="w-3 h-3" />
                  <span>{friend.total_xp || 0}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAddFriend(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card-3d p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-black text-lg text-[var(--text-primary)] mb-4">Add Friend</h3>
              <input
                type="email"
                placeholder="Enter friend's email..."
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-subtle)] bg-white font-semibold text-[var(--text-primary)] focus:border-[var(--brand-blue)] focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddFriend(false)}
                  className="btn-3d btn-3d-ghost flex-1 py-3"
                >
                  Cancel
                </button>
                <button className="btn-3d btn-3d-lime flex-1 py-3">
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}