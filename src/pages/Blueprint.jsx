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
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header */}
      <div className="glass-header z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-0)',
                  borderColor: 'var(--border-subtle)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Project Blueprint</h1>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>GenRizz Architecture</p>
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
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-strong:font-black" 
            style={{
              '--prose-headings': 'var(--text-primary)',
              '--prose-body': 'var(--text-secondary)',
              '--prose-links': 'var(--brand-blue)',
              '--prose-bold': 'var(--text-primary)'
            }}>
            <ReactMarkdown>{BLUEPRINT_CONTENT}</ReactMarkdown>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
