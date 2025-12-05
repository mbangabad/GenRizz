import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/api/entities';
import { Bell, X, UserPlus, Swords, Trophy, TrendingUp, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const NOTIFICATION_ICONS = {
  friend_request: UserPlus,
  friend_accepted: UserPlus,
  challenge_received: Swords,
  challenge_completed: Trophy,
  level_up: TrendingUp,
  new_record: Trophy,
};

const NOTIFICATION_COLORS = {
  friend_request: 'text-blue-400 bg-blue-500/20',
  friend_accepted: 'text-green-400 bg-green-500/20',
  challenge_received: 'text-orange-400 bg-orange-500/20',
  challenge_completed: 'text-yellow-400 bg-yellow-500/20',
  level_up: 'text-purple-400 bg-purple-500/20',
  new_record: 'text-pink-400 bg-pink-500/20',
};

export default function NotificationBell({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => Notification.filter({ user_id: userId }).then(notifications => 
      notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20)
    ),
    enabled: !!userId,
    refetchInterval: 30000, // Poll every 30s
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => Notification.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => Notification.update(n.id, { read: true })));
    },
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    markReadMutation.mutate(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto glass-panel rounded-2xl shadow-2xl z-50 border border-white/10">
            <div className="p-3 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-xl">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map(notification => {
                  const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                  const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-slate-400 bg-slate-500/20';
                  
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.read ? 'text-slate-400' : 'text-white'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">{notification.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="p-2 border-t border-white/10 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl">
              <button
                onClick={() => {
                  navigate(createPageUrl('Notifications'));
                  setIsOpen(false);
                }}
                className="w-full py-2 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}