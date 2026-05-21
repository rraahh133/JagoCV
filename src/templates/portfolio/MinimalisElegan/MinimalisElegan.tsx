/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import './MinimalisElegan.css';
import { PortfolioData } from '../../../types/portfolio';

export default function PortfolioMinimalist({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-400/30 selection:text-white font-sans overflow-x-hidden flex flex-col">
      <main className="w-full max-w-5xl mx-auto px-8 md:px-16 py-16 flex flex-col flex-1">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:justify-between items-start gap-8"
        >
          <div>
            <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter leading-none uppercase">
              {data.fullName || 'JOHN DOE'}
            </h1>
            <p className="mt-4 text-xs tracking-[0.4em] text-cyan-400 font-semibold uppercase">
              {data.role || 'Innovative Solutions Developer'}
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-4 mt-6 md:mt-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E5E5E5] overflow-hidden grayscale border border-white/10 hover:grayscale-0 transition-all duration-700 relative">
              <img 
                src={data.profileImageUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop"} 
                alt={data.fullName || "Profile"}
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-0 bg-[#D4D4D4] flex items-center justify-center text-[10px] text-black/40 italic font-serif z-0">PORTRAIT</div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest flex items-center md:justify-end gap-1">
                {data.location || 'Stockholm, SE'}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Bio Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mt-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif max-w-2xl leading-[1.1] text-gray-100 whitespace-pre-wrap">
            {data.shortBio || 'Building cool web apps and learning AI to solve human problems at scale.'}
          </h2>
          <p className="mt-6 text-gray-400 max-w-2xl leading-relaxed whitespace-pre-wrap text-sm">
             {data.aboutMe}
          </p>
        </motion.section>

        {/* Main Content Grid */}
        <div className="mt-16 flex flex-col md:flex-row flex-1 gap-16 md:gap-20">
          
          {/* Experience Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex-1"
          >
            <h3 className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-8 font-bold">Selected Experience</h3>
            <div className="space-y-8 border-l border-white/10 pl-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {data.experiences.length > 0 ? data.experiences.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-2 h-2 bg-cyan-400/50 group-hover:bg-cyan-400 rounded-full transition-colors duration-300"></div>
                  <p className="text-xs text-cyan-400 font-mono mb-1">{exp.years}</p>
                  <p className="text-lg font-serif text-white/90 group-hover:text-cyan-400 transition-colors duration-300">{exp.role}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{exp.company}</p>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              )) : (
                 <div className="text-gray-600 text-sm italic">Belum ada riwayat.</div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Projects & Connect */}
          <div className="md:w-80 flex flex-col gap-12 justify-between">
            
            {/* Projects Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <h3 className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-8 font-bold">Latest Projects</h3>
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {data.projects.length > 0 ? data.projects.map((project, i) => (
                  <a 
                    href={project.url || '#'} 
                    target={project.url ? '_blank' : undefined}
                    rel="noreferrer"
                    key={i} 
                    className="group block relative no-underline hover:opacity-100 opacity-90 transition-opacity"
                  >
                    <div className="flex items-start gap-4">
                      {/* Tiny clean square image */}
                      <div className="w-8 h-8 shrink-0 bg-white/5 border border-white/10 group-hover:border-cyan-400/50 transition-colors duration-500 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />
                        {project.imageUrl ? (
                           <img 
                             src={project.imageUrl} 
                             alt={project.title}
                             className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                           />
                        ) : (
                           <span className="text-cyan-400 font-mono text-[8px] opacity-50">{'</>'}</span>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-serif tracking-wide text-white/90 group-hover:text-cyan-400 transition-colors duration-500">
                          {project.title}
                        </p>
                        <p className="text-[10px] text-gray-500 tracking-wide mt-0.5 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </a>
                )) : (
                   <div className="text-gray-600 text-sm italic">Belum ada proyek.</div>
                )}
              </div>
            </motion.section>

            {/* Connect Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-4"
            >
              <h3 className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-4 font-bold">Connect</h3>
              <div className="flex flex-col gap-2">
                {data.links.length > 0 ? data.links.map((link, i) => (
                  <a 
                    key={i}
                    href={link.url} 
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300 hover:text-cyan-400 transition-colors w-fit font-sans truncate"
                  >
                    {link.title.toUpperCase()}
                  </a>
                )) : (
                  <div className="text-gray-600 text-sm italic">Belum ada tautan.</div>
                )}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Footer / Skills */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mt-16 md:mt-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="flex flex-wrap gap-4 md:gap-6">
            {skillsList.length > 0 ? skillsList.map(skill => (
              <span key={skill} className="text-[10px] font-light text-gray-500 tracking-widest uppercase">
                {skill}
              </span>
            )) : (
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">Belum ada skill.</span>
            )}
          </div>
          <p className="text-[10px] text-gray-700 font-mono tracking-tighter shrink-0">
            ©{new Date().getFullYear()} {data.fullName?.toUpperCase() || 'J_DOE'} PORTFOLIO
          </p>
        </motion.footer>

      </main>
    </div>
  );
}

