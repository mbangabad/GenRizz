import React, { useState, useEffect } from 'react';
import { AllowedUser } from '@/api/entities';
import { Trash2, Plus, UserPlus, Mail, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function BetaAccess() {
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', name: '' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const users = await AllowedUser.list('created_at', 100, false);
    setAllowedUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.email) return;
    
    setLoading(true);
    try {
      await AllowedUser.create(newUser);
      setNewUser({ email: '', name: '' });
      await fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove access for this user?')) return;
    await AllowedUser.delete(id);
    setAllowedUsers(allowedUsers.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#3C3C3C]">Private Beta Access</h2>
          <p className="text-sm text-[#777777]">Manage who can access the app.</p>
        </div>
        <div className="badge-3d badge-green">
          {allowedUsers.length} Allowed
        </div>
      </div>

      <div className="card-3d p-6 bg-white">
        <h3 className="font-bold text-[#3C3C3C] mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Grant Access
        </h3>
        <form onSubmit={handleAddUser} className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-[#AFAFAF] uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#AFAFAF]" />
              <Input 
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value.toLowerCase()})}
                placeholder="user@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-[#AFAFAF] uppercase">Name (Optional)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-[#AFAFAF]" />
              <Input 
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                placeholder="John Doe"
                className="pl-10"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-3d btn-3d-green py-2.5 px-6 h-[42px]"
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {allowedUsers.map(user => (
          <div key={user.id} className="card-3d p-4 flex items-center justify-between hover:border-[#1CB0F6] transition-colors bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1CB0F6] to-[#1899D6] flex items-center justify-center text-white font-bold">
                {user.name?.[0] || user.email[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#3C3C3C]">{user.name || 'No Name'}</p>
                <p className="text-sm text-[#777777]">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(user.id)}
              className="p-2 hover:bg-[#FFF5F5] rounded-lg text-[#FF4B4B] transition-colors"
              title="Revoke Access"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {allowedUsers.length === 0 && (
          <div className="text-center py-8 text-[#AFAFAF] font-semibold">
            No users allowed yet. Add someone above!
          </div>
        )}
      </div>
    </div>
  );
}