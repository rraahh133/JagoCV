import { Briefcase, ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import './AuraKaca.css';
import React from 'react';
import { PortfolioData } from '../../../types/portfolio';

// Reusable glassmorphism card component
const GlassCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`relative overflow-hidden rounded-[24px] bg-white/[0.05] backdrop-blur-[24px] border border-white/[0.12] ${className}`}
  >
    {/* Soft inner lighting */}
    <div className="absolute inset-0 bg-white/[0.02] pointer-events-none mix-blend-overlay"></div>
    <div className="relative z-10 w-full h-full">
      {children}
    </div>
  </motion.div>
);

export default function PortfolioGlassmorphism({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  return (
    <div className="min-h-screen bg-[#0B1221] text-[#FFFFFF] overflow-x-hidden selection:bg-[#00F0FF]/30 font-sans p-4 md:p-8 relative">
      
      {/* Abstract Glowing Orbs for background ambiance */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,240,255,0.15)_0%,transparent_70%)] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,0,229,0.1)_0%,transparent_70%)] rounded-full pointer-events-none z-0"></div>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 pb-16">
        
        {/* Left/Main Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Row: Profile & About */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile Card */}
            <GlassCard delay={0.1} className="flex flex-col items-center text-center p-8">
              <div className="relative w-[80px] h-[80px] rounded-full mb-4 p-[2px] bg-gradient-to-br from-[#00F0FF] to-[#FF00E5] shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <div className="w-full h-full rounded-full bg-[#0B1221] flex items-center justify-center overflow-hidden border border-transparent">
                   <img 
                      src={data.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop"} 
                      alt={data.fullName || "Profile Portrait"} 
                      className="w-full h-full object-cover"
                   />
                </div>
              </div>
              
              <h1 className="text-[20px] font-semibold text-white mb-1 tracking-tight">{data.fullName || 'Nama Anda'}</h1>
              <p className="text-[13px] text-[#00F0FF] uppercase tracking-[1.5px] font-medium mb-4 flex items-center gap-2">
                {data.role || 'Peran Anda'}
              </p>
              
              <div className="flex items-center text-white/60 text-[13px] mt-auto uppercase tracking-[0.5px]">
                <MapPin className="w-3.5 h-3.5 mr-2 text-[#FF00E5]" />
                {data.location || 'Lokasi Anda'}
              </div>
            </GlassCard>

            {/* About Card */}
            <GlassCard delay={0.2} className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.12]">
                  <span className="text-[#FF00E5] font-bold text-sm">i</span>
                </div>
                <h2 className="text-[11px] uppercase tracking-[2px] text-white/60">About Me</h2>
              </div>
              <p className="text-white/60 leading-[1.6] text-[15px] whitespace-pre-wrap">
                {data.aboutMe || data.shortBio || 'Ceritakan tentang diri Anda, passion, dan apa yang sedang Anda cari...'}
              </p>
            </GlassCard>
            
          </div>

          {/* Projects Grid */}
          <GlassCard delay={0.3} className="p-8">
            <h2 className="text-[11px] uppercase tracking-[2px] text-white/60 mb-6 flex items-center gap-3">
              <div className="w-[3px] h-4 bg-[#00F0FF] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.projects.length > 0 ? data.projects.map((project, idx) => {
                const colors = [
                  { from: 'from-cyan-500/20', to: 'to-blue-500/20', text: 'text-cyan-300' },
                  { from: 'from-fuchsia-500/20', to: 'to-purple-500/20', text: 'text-fuchsia-300' },
                  { from: 'from-emerald-500/20', to: 'to-teal-500/20', text: 'text-emerald-300' },
                  { from: 'from-amber-500/20', to: 'to-orange-500/20', text: 'text-amber-300' },
                ];
                const c = colors[idx % colors.length];
                return (
                  <div key={idx} className="group relative rounded-[20px] bg-white/[0.02] border border-white/[0.12] p-5 hover:border-[#00F0FF] transition-all duration-300">
                    {/* Image Placeholder */}
                    <div className={`w-full h-36 rounded-xl mb-4 bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center border border-white/[0.12] group-hover:scale-[1.02] transition-transform overflow-hidden relative`}>
                      {project.imageUrl ? (
                         <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                         <span className={`font-mono text-sm font-semibold uppercase tracking-widest ${c.text}`}>{project.title.substring(0, 10)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h3 className="text-white font-medium text-[16px] mb-1">{project.title}</h3>
                        <p className="text-white/60 text-[13px] leading-snug">{project.description}</p>
                      </div>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noreferrer" className="p-2 ml-3 shrink-0 bg-white/[0.03] hover:bg-white/[0.08] rounded-full transition-colors group-hover:text-[#00F0FF] text-white/40 border border-white/[0.12]">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              }) : (
                 <div className="col-span-2 text-center py-10 text-white/40 border border-white/10 border-dashed rounded-2xl text-sm">
                   Belum ada proyek yang ditambahkan.
                 </div>
              )}
            </div>
          </GlassCard>

          {/* Skills Panel */}
          <GlassCard delay={0.4} className="p-8">
             <h2 className="text-[11px] uppercase tracking-[2px] text-white/60 mb-6 flex items-center gap-3">
              <div className="w-[3px] h-4 bg-[#FF00E5] rounded-full shadow-[0_0_10px_rgba(255,0,229,0.8)]"></div>
              Key Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsList.length > 0 ? skillsList.map((skill, idx) => (
                <div 
                  key={idx} 
                  className="px-[12px] py-[6px] bg-white/[0.03] rounded-[100px] border border-white/[0.12] text-[12px] font-medium text-white hover:border-[#FF00E5] transition-colors cursor-default"
                >
                  {skill}
                </div>
              )) : (
                 <span className="text-white/40 text-sm">Belum ada skill yang ditambahkan.</span>
              )}
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-4 h-full">
          <GlassCard delay={0.5} className="p-8 h-full flex flex-col">
            <h2 className="text-[11px] uppercase tracking-[2px] text-white/60 mb-8 flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[#FF00E5]" />
              Experience & Education
            </h2>
            
            <div className="flex-grow">
              <div className="relative border-l border-white/[0.12] ml-3 space-y-8 pb-4">
                {data.experiences.length > 0 ? data.experiences.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    {/* Timeline Node */}
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-[#0B1221] border border-white/[0.12] flex items-center justify-center">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-white/60 mb-1">{item.years}</span>
                      <h3 className="text-white font-medium text-[15px] mb-0.5">{item.role}</h3>
                      <h4 className="text-white/60 text-[12px] mb-2">{item.company}</h4>
                      <p className="text-white/60 text-[13px] leading-relaxed whitespace-pre-wrap">{item.description}</p>
                    </div>
                  </div>
                )) : (
                  <div className="pl-8 text-white/40 text-sm">Belum ada riwayat.</div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/[0.12] text-center">
              <p className="text-[11px] text-white/40 font-mono tracking-widest uppercase">
                © {new Date().getFullYear()} {data.fullName || 'Nama Anda'}
              </p>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}

