import React from 'react';
import Card from '../../../components/ui/Card';

const SkillProgress = ({ skills }) => {
  return (
    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white tracking-tight">Skill Intelligence</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Dynamic Proficiency Tracking</p>
      </div>

      <div className="space-y-8">
        {skills.map((skill, index) => (
          <div key={index} className="group">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-tighter group-hover:text-white transition-colors">
                {skill.title}
              </h3>
              <span className="text-xs font-black text-indigo-400 italic">
                {skill.progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.02] border border-white/[0.05]">
              <div
                style={{ width: `${skill.progress}%` }}
                className="h-full rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-1000"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SkillProgress;
