/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import './CyberpunkNeon.css';
import { 
  Terminal, 
  MapPin, 
  Rocket, 
  Github, 
  Linkedin, 
  Briefcase, 
  Code2, 
  ExternalLink,
  Cpu
} from 'lucide-react';
import { PortfolioData } from '../../../types/portfolio';

export default function PortfolioCyberpunk({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e0] font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Background Detail: Scanlines and Circuit Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#06b6d4 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>


      <motion.div 
        className="max-w-6xl mx-auto space-y-6 relative z-10"
        variants={containerVars}
        initial="hidden"
        animate="show"
      >
        {/* TOP ROW */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Module 1: Profile (col-span-4) */}
          <motion.div variants={itemVars} className="md:col-span-4 bg-[#0a0a0f] border border-cyan-500/30 rounded-bl-3xl rounded-tr-3xl p-6 flex flex-col justify-center items-center md:items-start text-center md:text-left shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <div className="relative mb-4">
              <div className="absolute -inset-1 rounded-full border border-cyan-500/50 animate-[spin_10s_linear_infinite] border-dashed"></div>
              <img 
                src={data.profileImageUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=JohnDoe&backgroundColor=0a0a0f&colors=00f3ff,ff00ff"} 
                alt={data.fullName || "John Doe Avatar"} 
                className="w-24 h-24 rounded-full relative z-10 border border-cyan-800 bg-[#050505] object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
              {data.fullName || 'Nama Anda'}
            </h1>
            <p className="text-lg neon-text-cyan font-mono mb-3">{data.role || 'Peran Anda'}</p>
            
            <div className="flex items-center text-slate-400 text-sm mt-auto">
              <MapPin size={16} className="mr-1 text-cyan-500" />
              <span>{data.location || 'Lokasi Anda'}</span>
            </div>
          </motion.div>

          {/* Module 2: Terminal Bio (col-span-5) */}
          <motion.div variants={itemVars} className="md:col-span-6 bg-black border border-gray-800 rounded-lg p-0 flex flex-col relative overflow-hidden group">
            {/* Terminal Top Bar */}
            <div className="bg-[#050508] border-b border-gray-800 p-3 flex items-center justify-between">
              <div className="flex items-center text-cyan-600 font-mono text-xs">
                <Terminal size={14} className="mr-2" />
                <span>{data.fullName ? data.fullName.toLowerCase().replace(/\s/g, '') : 'guest'}@cyber-sys: ~</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed flex-grow bg-black">
              <p className="text-green-400 mb-1"><span className="text-magenta-500 mr-2">❯</span>./load_bio.sh</p>
              <div className="text-slate-300 ml-4 mb-4 border-l border-cyan-900/40 pl-3 py-1">
                <p className="opacity-80">Loading Short Bio... <span className="text-green-400">[OK]</span></p>
                <p className="mt-1 font-sans text-[15px] whitespace-pre-wrap">{data.shortBio || 'Initialize bio...'}</p>
              </div>

              <p className="text-green-400 mb-1"><span className="text-magenta-500 mr-2">❯</span>cat about_me.md</p>
              <div className="text-slate-300 ml-4 border-l border-magenta-900/40 pl-3 py-1">
                <p className="font-sans text-[15px] whitespace-pre-wrap">{data.aboutMe || 'Waiting for input...'}</p>
              </div>
              <div className="mt-3 text-cyan-400 animate-pulse font-bold text-lg">_</div>
            </div>
          </motion.div>

          {/* Module 3: Essential Links (col-span-3) */}
          <motion.div variants={itemVars} className="md:col-span-2 bg-[#0a0a0f] border border-magenta-500/30 rounded-tl-3xl rounded-br-3xl p-6 flex flex-col justify-center gap-4 shadow-[0_0_20px_rgba(217,70,239,0.05)]">
            <h3 className="text-xs font-mono text-magenta-400 uppercase tracking-widest mb-1 border-b border-gray-800 pb-2 flex-grow-0">Essential Links</h3>
            {data.links.length > 0 ? data.links.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full py-2 px-3 bg-cyan-500/5 border border-cyan-500/50 hover:bg-cyan-500/10 rounded gap-2 transition-colors">
                <div className="flex items-center text-cyan-400 text-xs font-bold truncate">
                  <span className="w-2 h-2 mr-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] shrink-0"></span> <span className="truncate">{link.title}</span>
                </div>
                <ExternalLink size={14} className="text-cyan-600 shrink-0" />
              </a>
            )) : (
              <div className="text-center text-slate-500 text-xs font-mono mt-2">NO LINKS FOUND</div>
            )}
          </motion.div>
        </div>

        {/* MIDDLE ROW - Featured Projects */}
        <motion.div variants={itemVars} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white flex items-center">
              <Code2 className="mr-3 w-4 h-4 text-cyan-400" /> 
              Featured Projects
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.projects.length > 0 ? data.projects.map((project, idx) => {
              const borderColors = ['border-cyan-500/40', 'border-magenta-500/40', 'border-blue-500/40'];
              const bgOverlayColors = ['bg-cyan-500/10', 'bg-magenta-500/10', 'bg-blue-500/10'];
              const textHoverColors = ['group-hover:text-cyan-400', 'group-hover:text-magenta-400', 'group-hover:text-blue-400'];
              
              const bColor = borderColors[idx % borderColors.length];
              const bgOverlay = bgOverlayColors[idx % bgOverlayColors.length];
              const tHover = textHoverColors[idx % textHoverColors.length];

              return (
                <a key={idx} href={project.url || '#'} target={project.url ? '_blank' : undefined} rel="noreferrer" className={`group relative rounded-md overflow-hidden bg-[#0a0a0f] border border-gray-800 hover:${bColor} transition-colors flex flex-col h-full`}>
                  <div className="h-40 overflow-hidden relative border-b border-cyan-900/30">
                    <div className={`absolute inset-0 ${bgOverlay} mix-blend-overlay group-hover:bg-transparent transition-all z-10`}></div>
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                        alt={project.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#050505] flex items-center justify-center font-mono text-gray-700 text-3xl font-bold group-hover:text-gray-500 transition-colors">
                        {'</>'}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`font-bold text-xl text-white mb-2 ${tHover} transition-colors`}>{project.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-sans flex-grow">
                      {project.description}
                    </p>
                  </div>
                </a>
              );
            }) : (
              <div className="col-span-3 text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-lg">
                NO PROJECTS IN DATABASE
              </div>
            )}
          </div>
        </motion.div>

        {/* BOTTOM ROW - Experience & Skills */}
        <motion.div variants={itemVars} className="bg-[#0a0a0f] border-t border-cyan-500/20 p-6 md:p-8 rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
           <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white flex items-center">
              <Briefcase className="mr-3 w-4 h-4 text-cyan-500" /> 
              Professional Experience
            </h2>
            <div className="h-px bg-gradient-to-r from-gray-800 to-transparent flex-grow ml-6"></div>
          </div>

          <div className="relative border-l border-gray-800 ml-4 md:ml-6 space-y-10 pl-6 md:pl-10 pb-4">
            
            {data.experiences.length > 0 ? data.experiences.map((exp, idx) => (
              <div key={idx} className={`relative ${idx > 0 ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
                <div className={`absolute -left-[29px] md:-left-[45px] top-1.5 w-[9px] h-[9px] ${idx === 0 ? 'bg-cyan-500' : 'bg-gray-700'} rounded-full`}></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold ${idx === 0 ? 'text-white' : 'text-slate-200'}`}>{exp.role}</h3>
                  <span className={`font-mono text-xs ${idx === 0 ? 'text-cyan-500 bg-cyan-950/30 border-cyan-900/50' : 'text-slate-400 bg-slate-900/50 border-slate-800'} opacity-80 px-2 py-1 rounded border mt-2 md:mt-0 inline-block w-fit`}>{exp.years}</span>
                </div>
                <div className={`${idx === 0 ? 'text-magenta-400' : 'text-cyan-600'} font-medium mb-3 flex items-center text-sm`}>
                  <Cpu size={14} className="mr-2" /> {exp.company}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            )) : (
              <div className="text-slate-600 font-mono text-sm">NO EXP RECORDS</div>
            )}

            {data.skills && (
              <div className="mt-8 border-t border-slate-800 pt-6">
                 <div className="font-mono text-xs bg-[#050508] inline-block p-3 rounded border border-slate-800">
                    <span className="text-slate-500 mr-2">SYS_SKILLS:</span>
                    {data.skills.split(',').map((s, i, arr) => (
                      <span key={i}>
                        <span className={i % 2 === 0 ? "neon-text-cyan" : "neon-text-magenta"}>{s.trim()}</span>
                        {i < arr.length - 1 && <span className="text-slate-600 mx-1">,</span>}
                      </span>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-6 font-mono text-xs text-cyan-900 uppercase tracking-widest">
          System Initialized • End of Portfolio
        </div>
      </motion.div>
    </div>
  );
}

