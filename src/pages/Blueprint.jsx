import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Download } from 'lucide-react';
import { BLUEPRINT_MARKDOWN } from '@/components/docs/BlueprintData';

const BLUEPRINT_CONTENT = BLUEPRINT_MARKDOWN;

export default function Blueprint() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Header */}
      <div className="glass-light sticky top-0 z-30 border-b border-[#E5E0DA]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <button className="w-10 h-10 rounded-xl bg-white hover:bg-[#F0EDE8] flex items-center justify-center border-2 border-[#E5E0DA] transition-colors">
                <ChevronLeft className="w-5 h-5 text-[#777777]" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#3C3C3C]">Project Blueprint</h1>
              <p className="text-xs text-[#777777] font-bold">GenRizz Architecture</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="btn-3d btn-3d-ghost px-4 py-2 flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-8 bg-white"
        >
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-[#3C3C3C] prose-p:text-[#777777] prose-a:text-[#1CB0F6] prose-strong:text-[#3C3C3C]">
            <ReactMarkdown>{BLUEPRINT_CONTENT}</ReactMarkdown>
          </div>
        </motion.div>
      </main>
    </div>
  );
}