import { Github, Linkedin, Globe, MapPin, ExternalLink, Briefcase, GraduationCap, Sparkles, ChevronRight, Link as LinkIcon } from "lucide-react";
import { motion } from "motion/react";
import "./DeveloperTerminal.css";
import { PortfolioData } from '../../../types/portfolio';

export default function PortfolioDeveloper({ data }: { data?: PortfolioData }) {
  if (!data) return null;
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  return (
    <div className="min-h-screen relative bg-[#0A0C10] text-slate-200 font-sans p-4 sm:p-10 flex flex-col selection:bg-cyan-500/30 border-t-8 sm:border-y-8 sm:border-x-8 border-[#161B22]">
      {/* Cyan Lighting Accents */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none z-0" />
      
      <main className="max-w-5xl w-full mx-auto relative z-10 flex flex-col flex-grow">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 z-10">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
             className="relative flex-shrink-0"
           >
             <div className="w-32 h-32 rounded-full border-2 border-cyan-400/30 p-1.5 bg-[#161B22]">
               <img 
                 src={data.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop"} 
                 alt={data.fullName || "Profile"}
                 className="w-full h-full rounded-full object-cover"
               />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-[#0A0C10] text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Active</div>
           </motion.div>
           
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
             className="flex-grow w-full"
           >
             <div className="flex flex-col lg:flex-row lg:items-baseline justify-between mb-1 gap-2 lg:gap-0 text-center md:text-left">
               <h1 className="text-4xl font-light tracking-tight text-white flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
                 {data.fullName || 'Nama Anda'} <span className="hidden sm:inline text-cyan-400 mx-2 font-thin">|</span> <span className="text-slate-400 text-2xl sm:text-4xl">{data.role || 'Peran Anda'}</span>
               </h1>
               <div className="text-xs font-mono text-cyan-500/80 tracking-widest uppercase flex items-center justify-center md:justify-start gap-1">
                 {data.location || 'Lokasi Anda'} <MapPin className="w-3 h-3" />
               </div>
             </div>
             <p className="text-slate-400 max-w-xl text-sm leading-relaxed mb-4 italic text-center md:text-left mx-auto md:mx-0 whitespace-pre-wrap">
               {data.aboutMe || data.shortBio || 'Ceritakan tentang diri Anda...'}
             </p>
             
             {/* Connect With Me */}
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
               {data.links.length > 0 ? data.links.map((link, idx) => {
                 let Icon = <LinkIcon className="w-3.5 h-3.5" />;
                 const lowerUrl = link.url.toLowerCase();
                 if (lowerUrl.includes('github.com')) Icon = <Github className="w-3.5 h-3.5" />;
                 if (lowerUrl.includes('linkedin.com')) Icon = <Linkedin className="w-3.5 h-3.5" />;
                 return <SocialButton key={idx} icon={Icon} label={link.title} url={link.url} />;
               }) : (
                 <span className="text-slate-500 text-xs">Belum ada tautan.</span>
               )}
             </div>
           </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow mb-8">
          {/* Project Highlights */}
          <section className="md:col-span-12 lg:col-span-5 flex flex-col">
            <SectionHeading title="Project Highlights" />
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.projects.length > 0 ? data.projects.map((project, idx) => (
                <ProjectCard 
                  key={idx}
                  title={project.title}
                  description={project.description}
                  image={project.imageUrl || ''}
                  link={project.url || '#'}
                />
              )) : (
                 <div className="text-slate-500 text-sm">Belum ada proyek.</div>
              )}
            </div>
          </section>

          {/* Detailed Experience & Education */}
          <section className="md:col-span-12 lg:col-span-7 flex flex-col">
            <SectionHeading title="Experience & Education" />
            <div className="space-y-6 flex-grow pb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.experiences.length > 0 ? data.experiences.map((exp, idx) => (
                 <ExperienceItem 
                   key={idx}
                   role={exp.role}
                   company={exp.company}
                   date={exp.years}
                   description={exp.description}
                 />
              )) : (
                 <div className="text-slate-500 text-sm pl-6">Belum ada riwayat.</div>
              )}
            </div>
          </section>
        </div>

        {/* Footer / Main Skills */}
        <footer className="mt-auto">
          <div className="bg-[#111419] p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="flex flex-col gap-2 w-full md:w-auto items-center md:items-start text-center md:text-left">
               <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Main Skills</span>
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                 {skillsList.length > 0 ? skillsList.map((skill) => (
                   <span key={skill} className="bg-slate-800 text-slate-300 text-[10px] px-3 py-1 rounded-full border border-slate-700 font-mono">
                     {skill}
                   </span>
                 )) : (
                   <span className="text-slate-500 text-xs">Belum ada skill.</span>
                 )}
               </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Design & Code by {data.fullName || 'Nama Anda'}</p>
              <p className="text-[9px] text-slate-600 italic">Built for the modern web &copy; {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] mb-4 border-b border-slate-800 pb-2">
      {title}
    </h3>
  );
}

function SocialButton({ icon, label, url }: { icon: React.ReactNode, label: string, url: string }) {
  return (
    <a 
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-1.5 border border-slate-700 hover:border-cyan-400/50 bg-[#161B22] rounded flex items-center gap-2 text-xs font-medium transition-colors"
    >
      <div className="text-cyan-400 flex items-center justify-center">
        {icon}
      </div> 
      {label}
    </a>
  );
}

function ProjectCard({ title, description, image, link }: { title: string, description: string, image: string, link: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-[#111419] border border-slate-800 hover:border-slate-700 transition-all group items-center">
       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#161B22] rounded flex-shrink-0 overflow-hidden relative border border-slate-800 flex items-center justify-center">
         {image ? (
           <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 mix-blend-luminosity" />
         ) : (
           <span className="text-cyan-500 font-mono text-xl opacity-50">{'</>'}</span>
         )}
       </div>
       <div className="flex flex-col justify-center">
         <h4 className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">{title}</h4>
         <p className="text-xs text-slate-500 mt-1 mb-2 line-clamp-2">{description}</p>
         {link && (
           <a href={link} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-500 underline underline-offset-4 uppercase font-bold tracking-tighter inline-flex items-center gap-1 w-fit">
             View Project <ExternalLink className="w-3 h-3" />
           </a>
         )}
       </div>
    </div>
  );
}

function ExperienceItem({ role, company, date, description }: { role: string, company: string, date: string, description: string }) {
  return (
    <div className="relative pl-6 border-l border-slate-800">
      <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-cyan-500`}></div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1 gap-1 sm:gap-0">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          {role}
        </h4>
        <span className={`text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 w-fit`}>
          {date}
        </span>
      </div>
      <p className="text-xs text-cyan-500/80 mb-2">{company}</p>
      <div className="text-[11px] text-slate-400 space-y-1 whitespace-pre-wrap">
        {description}
      </div>
    </div>
  );
}

