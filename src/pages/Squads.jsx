import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { SquadMember, Squad } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, Shield, MessageCircle, LogOut, 
  Crown, ArrowLeft, Copy, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';

export default function Squads() {
  const [user, setUser] = useState(null);
  const [mySquad, setMySquad] = useState(null);
  const [allSquads, setAllSquads] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch my squad
  useEffect(() => {
    if (!user) return;
    const fetchMySquad = async () => {
      const membership = await SquadMember.filter({ user_id: user.id });
      if (membership.length > 0) {
        const squad = await Squad.filter({ id: membership[0].squad_id });
        setMySquad({ ...squad[0], role: membership[0].role });
      }
    };
    fetchMySquad();
  }, [user]);

  // Fetch Members
  const { data: squadMembers = [] } = useQuery({
    queryKey: ['squadMembers', mySquad?.id],
    queryFn: () => SquadMember.filter({ squad_id: mySquad?.id }),
    enabled: !!mySquad?.id
  });

  // Fetch all squads
  useEffect(() => {
    Squad.list('-total_xp', 20).then(setAllSquads);
  }, []);

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    if (!newSquadName) return;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      // Create Squad
      const newSquad = await Squad.create({
        name: newSquadName,
        created_by: user.id,
        join_code: code,
        total_xp: 0
      });

      // Create Membership
      await SquadMember.create({
        squad_id: newSquad.id,
        user_id: user.id,
        role: "owner",
      });

      setMySquad({ ...newSquad, role: 'leader' });
      setIsCreating(false);
      setAllSquads(prev => [newSquad, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinSquad = async (e) => {
    e.preventDefault();
    if (!joinCode) return;

    try {
      const squad = await Squad.filter({ join_code: joinCode });
      if (squad.length === 0) {
        alert("Invalid Code");
        return;
      }
      
      const targetSquad = squad[0];

      // Create Membership
      await SquadMember.create({
        squad_id: targetSquad.id,
        user_id: user.id,
        role: "member",
      });

      // Update Count (if needed - squad member count can be calculated)
      await Squad.update(targetSquad.id, {
        total_xp: targetSquad.total_xp || 0
      });

      setMySquad({ ...targetSquad, role: 'member' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveSquad = async () => {
    if (!mySquad) return;
    
    // Find membership
    const members = await SquadMember.filter({ squad_id: mySquad.id, user_id: user.id });
    if (members.length > 0) {
      await SquadMember.delete(members[0].id);
      
       // Update Count (if needed)
      await Squad.update(mySquad.id, {
        total_xp: mySquad.total_xp || 0
      });
      
      setMySquad(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-[#3C3C3C] text-lg">Squads</h1>
            <p className="text-xs text-[#AFAFAF] font-semibold">Team up & compete</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {mySquad ? (
          // My Squad View
          <div className="space-y-6">
            <div className="card-3d p-6 bg-gradient-to-br from-[#58CC02]/10 to-[#58CC02]/5 border-[#58CC02]/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#58CC02] flex items-center justify-center text-3xl shadow-lg">
                    {mySquad.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#3C3C3C]">{mySquad.name}</h2>
                    <p className="text-[#777777] font-semibold">{mySquad.member_count} members • {mySquad.total_xp} XP</p>
                  </div>
                </div>
                {mySquad.role === 'leader' && (
                  <div className="badge-3d badge-yellow">
                    <Crown className="w-4 h-4 mr-1" /> Leader
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-6">
                <div className="bg-white px-3 py-2 rounded-xl border-2 border-[#E5E0DA] flex items-center gap-2 font-mono text-sm">
                  <span className="text-[#AFAFAF]">Code:</span>
                  <span className="font-bold text-[#3C3C3C] select-all">{mySquad.join_code}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="btn-3d btn-3d-blue py-3 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Squad Chat
                </button>
                <button className="btn-3d btn-3d-ghost py-3 flex items-center justify-center gap-2" onClick={handleLeaveSquad}>
                  <LogOut className="w-5 h-5" /> Leave
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#AFAFAF] uppercase tracking-wide mb-3">Squad Members ({squadMembers.length})</h3>
              <div className="space-y-3">
                {squadMembers.map((member, i) => (
                  <div key={member.id} className="card-3d p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1CB0F6] to-[#1899D6] flex items-center justify-center text-white font-bold">
                      {member.user_name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#3C3C3C] flex items-center gap-2">
                        {member.user_name}
                        {member.role === 'leader' && <Crown className="w-3 h-3 text-[#FFC800]" />}
                      </h4>
                      <p className="text-xs text-[#AFAFAF]">{member.role}</p>
                    </div>
                    <div className="font-black text-[#AFAFAF]">
                      {member.contribution_xp} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // No Squad View
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create */}
              <div className="card-3d p-6">
                <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Create a Squad</h2>
                <p className="text-[#777777] text-sm mb-4">Start your own team and invite friends.</p>
                <form onSubmit={handleCreateSquad} className="space-y-3">
                  <Input 
                    placeholder="Squad Name" 
                    value={newSquadName}
                    onChange={e => setNewSquadName(e.target.value)}
                    className="border-2 border-[#E5E0DA]"
                  />
                  <button className="btn-3d btn-3d-green w-full py-3">
                    Create Squad
                  </button>
                </form>
              </div>

              {/* Join */}
              <div className="card-3d p-6">
                <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Join a Squad</h2>
                <p className="text-[#777777] text-sm mb-4">Enter a code to join an existing team.</p>
                <form onSubmit={handleJoinSquad} className="space-y-3">
                  <Input 
                    placeholder="Enter Squad Code" 
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    className="border-2 border-[#E5E0DA]"
                  />
                  <button className="btn-3d btn-3d-blue w-full py-3">
                    Join Squad
                  </button>
                </form>
              </div>
            </div>

            {/* Browse */}
            <div>
              <h3 className="font-bold text-[#AFAFAF] uppercase tracking-wide mb-3">Top Squads</h3>
              <div className="space-y-3">
                {allSquads.map(squad => (
                  <div key={squad.id} className="card-3d p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F4F0] flex items-center justify-center text-xl">
                      {squad.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#3C3C3C]">{squad.name}</h4>
                      <p className="text-xs text-[#AFAFAF]">{squad.member_count} members • {squad.total_xp} XP</p>
                    </div>
                    <div className="text-2xl font-black text-[#AFAFAF]">#{allSquads.indexOf(squad) + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}