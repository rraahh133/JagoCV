/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import './NeoBrutalis.css';
import { Github, Linkedin, MapPin, Briefcase, GraduationCap, ChevronRight, ExternalLink } from 'lucide-react';
import { PortfolioData } from '../../../types/portfolio';

export default function PortfolioCreative({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  return (
    <div className="min-h-screen py-12 px-6 sm:px-12 md:px-20 lg:px-32 max-w-5xl mx-auto flex flex-col gap-16 text-[#cbd5e1] pb-24 bg-[#1a1c1e]">

      {/* Top Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-6"
      >
        <div className="w-36 h-36 rounded-full neo-circle p-2 flex items-center justify-center mb-2">
          <img
            src={data.profileImageUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=Shafnat&backgroundColor=e2e8f0"}
            alt={data.fullName || "Profile Portrait"}
            className="w-full h-full rounded-full object-cover bg-[#202326] border-4 border-[#1a1c1e]"
          />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{data.fullName || 'Nama Anda'}</h1>
          <p className="text-xl text-[#3b82f6] font-medium flex items-center justify-center gap-2">
            {data.role || 'Peran Anda'}
          </p>
          <p className="flex items-center justify-center gap-2 text-[#94a3b8] mt-2">
            <MapPin size={18} /> {data.location || 'Lokasi Anda'}
          </p>
        </div>
      </motion.section>

      {/* Links */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-6"
      >
        {data.links.length > 0 ? data.links.map((link, idx) => {
           let Icon = <ExternalLink size={22} />;
           const lowerUrl = link.url.toLowerCase();
           if (lowerUrl.includes('github')) Icon = <Github size={22} />;
           if (lowerUrl.includes('linkedin')) Icon = <Linkedin size={22} />;
           return (
             <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="neo-button rounded-full px-8 py-3.5 flex items-center gap-3 font-bold text-lg text-blue-400">
               {Icon} {link.title}
             </a>
           );
        }) : (
           <div className="text-[#94a3b8] font-medium">Belum ada tautan.</div>
        )}
      </motion.section>

      {/* About Me */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="neo-raised rounded-[40px] p-8 md:p-12 text-[#94a3b8] leading-relaxed text-lg">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest opacity-40">About Me</h2>
          <p className="whitespace-pre-wrap">
            {data.aboutMe || data.shortBio || 'Ceritakan tentang diri Anda, passion, dan apa yang sedang Anda cari...'}
          </p>
        </div>
      </motion.section>

      {/* Featured Projects */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-lg font-bold text-white mb-8 pl-5 border-l-4 border-neo-accent uppercase tracking-widest opacity-40">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {data.projects.length > 0 ? data.projects.map((project, idx) => (
            <div key={idx} className="neo-raised rounded-[32px] p-6 flex flex-col gap-6">
              <div className="neo-pressed-small h-56 rounded-2xl w-full flex items-center justify-center overflow-hidden p-2">
                 <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-black/20">
                   <div className="absolute inset-0 bg-neo-bg/30 z-10 mix-blend-overlay"></div>
                   {project.imageUrl ? (
                     <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                   ) : (
                     <span className="text-[#3b82f6] font-bold text-3xl opacity-50">{'</>'}</span>
                   )}
                 </div>
              </div>
              <div className="px-2 pb-2 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                <p className="text-[#94a3b8] mb-6 leading-relaxed flex-grow whitespace-pre-wrap">
                  {project.description}
                </p>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noreferrer" className="text-[#3b82f6] font-semibold flex items-center gap-1 hover:brightness-125 transition-all w-fit">
                    View Project <ChevronRight size={18} />
                  </a>
                )}
              </div>
            </div>
          )) : (
            <div className="text-[#94a3b8] italic col-span-2">Belum ada proyek yang ditambahkan.</div>
          )}
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white mb-8 pl-5 border-l-4 border-neo-accent uppercase tracking-widest opacity-40">Experience</h2>
        <div className="relative border-l-2 border-[#25282c] ml-6 space-y-12 pl-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {data.experiences.length > 0 ? data.experiences.map((exp, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[57px] top-4 neo-circle bg-neo-bg w-10 h-10 rounded-full flex items-center justify-center text-blue-500 z-10">
                <Briefcase size={18} />
              </div>
              <div className="neo-pressed rounded-[40px] p-8">
                <h3 className="font-bold text-xl text-white">{exp.role}</h3>
                <p className="text-[#3b82f6] font-medium mb-3">{exp.company}</p>
                <span className="neo-inset-sm px-4 py-1.5 text-sm font-medium text-[#94a3b8] rounded-full inline-block mb-4">{exp.years}</span>
                <p className="text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            </div>
          )) : (
            <div className="text-[#94a3b8] italic">Belum ada riwayat pengalaman.</div>
          )}
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-lg font-bold text-white mb-8 pl-5 border-l-4 border-neo-accent uppercase tracking-widest opacity-40">Skills & Tools</h2>
        <div className="flex flex-wrap gap-5">
          {skillsList.length > 0 ? skillsList.map(skill => (
            <span key={skill} className="neo-pressed-small px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-neo-accent transition-colors select-none cursor-default">
              {skill}
            </span>
          )) : (
            <span className="text-[#94a3b8] italic">Belum ada skill yang ditambahkan.</span>
          )}
        </div>
      </motion.section>

    </div>
  );
}

