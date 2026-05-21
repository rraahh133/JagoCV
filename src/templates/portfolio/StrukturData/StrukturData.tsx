/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Linkedin, Mail, ExternalLink, ArrowRight, Link as LinkIcon } from "lucide-react";
import "./StrukturData.css";
import { PortfolioData } from '../../../types/portfolio';

export default function StrukturData({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  
  // Custom colors for brutalist style skills
  const brutalColors = ['bg-[#00f0ff]', 'bg-[#ff00f5]', 'bg-[#fef01e]', 'bg-white', 'bg-black text-white'];
  const rotations = ['rotate-[-6deg]', 'rotate-[8deg]', 'rotate-[-12deg]', 'rotate-[4deg]', 'rotate-[-2deg]'];
  const positions = [
    'top-0 left-0 sm:left-4',
    'top-10 right-2 sm:right-6',
    'bottom-6 left-6 sm:left-12',
    'bottom-0 right-4 sm:right-10',
    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  ];
  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-16 max-w-[1600px] mx-auto pb-24 font-sans selection:bg-pink-400 text-black bg-[#fdfaf5]">
      {/* Header Section */}
      <header className="bg-[#fef01e] brutal-border brutal-shadow p-6 md:p-10 mb-12">
        <h1 className="font-black text-6xl sm:text-8xl md:text-[9vw] leading-[0.85] uppercase tracking-tighter w-full max-w-[1200px] break-words">
          {data.fullName || 'Nama Anda'}
        </h1>
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-4 border-black pt-6">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-mono font-bold uppercase tracking-tight">
            {data.role || 'Peran Anda'}
          </h2>
          <div className="flex gap-4 bg-white brutal-border p-3 brutal-shadow-sm">
            {data.profileImageUrl && (
              <div className="h-12 w-12 rounded-full border-4 border-black bg-[#00f0ff] flex items-center justify-center rotate-6 overflow-hidden">
                 <img src={data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-8">
        
        {/* Left Column (Bio, Links, Skills) */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          
          {/* Bio Box */}
          <section className="bg-[#00f0ff] p-6 sm:p-8 brutal-border brutal-shadow">
            <div className="flex items-center gap-3 mb-4 border-b-4 border-black pb-2">
              <span className="text-3xl">🚀</span>
              <h3 className="font-mono text-2xl font-black uppercase underline decoration-black">Biography</h3>
            </div>
            <p className="font-mono text-lg font-bold leading-tight mb-6 whitespace-pre-wrap">
              {data.shortBio || data.aboutMe || 'Ceritakan tentang diri Anda di sini...'}
            </p>
            <div className="bg-white px-2 py-1 italic border-2 border-black w-max max-w-full font-mono font-bold text-sm sm:text-base">
              {data.location || 'Lokasi Anda'}
            </div>
          </section>

          {/* Important Links */}
          <section className="flex flex-col gap-4">
            {data.links.length > 0 ? data.links.map((link, idx) => {
              let Icon = <LinkIcon size={32} className="stroke-[3]" />;
              const lowerUrl = link.url.toLowerCase();
              if (lowerUrl.includes('github')) Icon = <Github size={32} className="stroke-[3]" />;
              if (lowerUrl.includes('linkedin')) Icon = <Linkedin size={32} className="stroke-[3]" />;
              
              const linkColors = ['bg-[#ff00f5]', 'bg-[#fef01e]', 'bg-[#00f0ff]'];
              const bgColor = linkColors[idx % linkColors.length];
              
              return (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className={`${bgColor} text-black p-4 brutal-border brutal-shadow-md flex items-center justify-between group active:translate-x-1 active:translate-y-1 active:shadow-none transition-all hover:-translate-y-1`}>
                  <div className="flex items-center gap-4 overflow-hidden">
                    {Icon}
                    <span className="text-xl font-black uppercase tracking-tight group-hover:underline truncate">{link.title} ↗</span>
                  </div>
                </a>
              );
            }) : (
              <div className="bg-white border-4 border-black p-4 font-mono font-bold italic">Belum ada tautan.</div>
            )}
          </section>

          {/* Key Skills */}
          <section className="bg-white brutal-border brutal-shadow p-6 group">
            <h3 className="font-mono text-lg font-black uppercase border-b-4 border-black mb-6 pb-1 italic">Key_Skills.sys</h3>
            <div className="relative h-48 sm:h-40 flex items-center justify-center mt-6 overflow-hidden">
              {skillsList.length > 0 ? skillsList.slice(0, 5).map((skill, idx) => (
                <div 
                  key={idx} 
                  className={`absolute ${positions[idx]} ${brutalColors[idx]} border-2 border-black px-4 py-2 font-black ${rotations[idx]} brutal-shadow-sm hover:-translate-y-2 transition-transform z-${idx * 10} cursor-default truncate max-w-[150px]`}
                  title={skill}
                >
                  {skill.toUpperCase()}
                </div>
              )) : (
                 <span className="font-mono font-bold italic">Belum ada skill</span>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (Projects, Experience) */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          
          {/* Featured Projects */}
          <section className="brutal-border bg-white brutal-shadow p-6 flex-grow flex flex-col">
            <h2 className="text-3xl font-black uppercase mb-6 italic tracking-tight border-b-4 border-black pb-2">Featured Projects_</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {data.projects.length > 0 ? data.projects.map((project, idx) => {
                const boxColors = ['bg-[#ff00f5]', 'bg-[#fef01e]', 'bg-[#00f0ff]'];
                const bColor = boxColors[idx % boxColors.length];
                const rotateClasses = ['-rotate-12', 'rotate-12', '-rotate-6', 'rotate-6'];
                const rotate = rotateClasses[idx % rotateClasses.length];
                
                return (
                  <article key={idx} className="border-4 border-black bg-white p-5 group flex flex-col transition-all hover:bg-gray-50">
                    <div className={`w-full aspect-video ${project.imageUrl ? 'bg-black' : bColor} border-4 border-black mb-4 flex items-center justify-center overflow-hidden`}>
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-90" />
                      ) : (
                        <span className={`text-white font-black text-4xl sm:text-5xl transform ${rotate} group-hover:scale-110 transition-transform truncate px-2`}>
                          {project.title.substring(0, 5).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-2xl uppercase mb-1">{project.title}</h4>
                      <p className="font-mono text-sm font-bold opacity-80 mb-4">{project.description}</p>
                    </div>
                    {project.url && (
                      <div className="mt-auto pt-4 border-t-2 border-black border-dashed">
                        <a href={project.url} target="_blank" rel="noreferrer" className="font-mono text-sm font-black uppercase bg-black text-white px-3 py-2 inline-flex items-center gap-2 hover:bg-[#ff00f5] transition-colors brutal-shadow-sm active:translate-y-1 active:translate-x-1 active:shadow-none">
                          Lihat Proyek <ExternalLink size={16} />
                        </a>
                      </div>
                    )}
                  </article>
                );
              }) : (
                <div className="col-span-2 font-mono font-bold italic border-4 border-black p-4 text-center">Belum ada proyek.</div>
              )}
            </div>
          </section>

          {/* Timeline / Data Table */}
          <section className="brutal-border bg-white brutal-shadow p-6 flex-grow">
             <h2 className="font-mono font-black uppercase text-2xl border-b-4 border-black mb-6 pb-2 italic">History.log</h2>

             <div className="space-y-6 font-mono max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data.experiences.length > 0 ? data.experiences.map((exp, idx) => {
                  const roleColors = ['text-[#ff00f5]', 'text-[#00f0ff]', 'text-black'];
                  const rColor = roleColors[idx % roleColors.length];
                  
                  const bgColors = ['bg-[#fef01e]', 'bg-black text-white', 'bg-white'];
                  const bgColor = bgColors[idx % bgColors.length];

                  return (
                    <div key={idx} className={`border-b-4 border-black pb-4 hover:pl-2 sm:hover:pl-4 transition-all ${idx === data.experiences.length - 1 ? 'border-b-0' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center font-black text-lg sm:text-xl uppercase mb-2">
                        <span className={rColor}>{exp.role}</span>
                        <span className="text-sm mt-1 sm:mt-0 font-bold sm:text-base">{exp.years}</span>
                      </div>
                      <div className={`text-sm sm:text-base font-bold ${bgColor} inline-block px-2 border-2 border-black mb-2`}>{exp.company}</div>
                      <div className="text-sm font-medium opacity-90 whitespace-pre-wrap mt-2">{exp.description}</div>
                    </div>
                  );
                }) : (
                   <div className="font-mono font-bold italic">Belum ada riwayat pengalaman.</div>
                )}
             </div>
          </section>

        </div>
      </main>
      
      {/* Footer Status Bar */}
      <footer className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs md:text-sm font-black uppercase border-t-4 border-black pt-4">
        <span>SYSTEM_READY: TRUE</span>
        <span>SHAFNAT_RAMADHAN // PORTFOLIO_V1</span>
        <span>{data.location || 'BANDUNG, ID'}</span>
      </footer>
    </div>
  );
}
