import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { UserSubmittedQuestion } from '@/api/entities';
import { Lightbulb, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Plus, TrendingUp } from 'lucide-react';
import SubmitQuestion from '../ugc/SubmitQuestion';

export default function CreatorHub({ userId }) {
  const { data: submissions = [], refetch } = useQuery({
    queryKey: ['mySubmissions', userId],
    queryFn: () => UserSubmittedQuestion.filter({ submitted_by: userId }).then(s => 
      s.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20)
    ),
    enabled: !!userId,
  });

  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge-3d badge-green text-xs"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] text-xs font-bold"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFC800]/20 text-[#E5B400] text-xs font-bold"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CE82FF] to-[#A855F7] flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-black text-[#3C3C3C] text-xl">Creator Hub</h2>
            <p className="text-sm text-[#777777] font-semibold">Submit & track your questions</p>
          </div>
        </div>
        <SubmitQuestion userId={userId} onSuccess={refetch} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { value: stats.total, label: 'Submitted', color: '#1CB0F6' },
          { value: stats.approved, label: 'Approved', color: '#58CC02' },
          { value: stats.pending, label: 'Pending', color: '#FFC800' },
          { value: stats.rejected, label: 'Rejected', color: '#FF4B4B' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-3d p-3 text-center"
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[#AFAFAF] font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="card-3d p-8 text-center">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-[#AFAFAF]" />
          <p className="text-[#777777] font-semibold mb-2">No submissions yet</p>
          <p className="text-sm text-[#AFAFAF]">Submit your first question and help grow the game!</p>
        </div>
      ) : (
        <div className="card-3d overflow-hidden">
          <div className="p-4 border-b border-[#E5E0DA]">
            <h3 className="font-bold text-[#3C3C3C]">Your Submissions</h3>
          </div>
          <div className="divide-y divide-[#E5E0DA] max-h-96 overflow-y-auto">
            {submissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 hover:bg-[#F7F4F0] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3C3C3C] line-clamp-2">{sub.question}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {getStatusBadge(sub.status)}
                      {sub.upvotes > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[#58CC02] font-semibold">
                          <ThumbsUp className="w-3 h-3" /> {sub.upvotes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card-3d card-3d-purple p-4">
        <h4 className="font-bold text-[#3C3C3C] mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#CE82FF]" />
          Tips for Approval
        </h4>
        <ul className="text-sm text-[#777777] space-y-1">
          <li>• Make questions fun and engaging</li>
          <li>• Ensure answers are clearly correct/incorrect</li>
          <li>• Add helpful explanations</li>
          <li>• Avoid offensive or controversial content</li>
        </ul>
      </div>
    </div>
  );
}