import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 text-center text-xs text-slate-400 dark:text-slate-400 border-t border-blue-500/20 bg-slate-950/80 backdrop-blur-md mt-auto space-y-1 font-mono">
      <p className="font-bold tracking-wider text-cyan-400">
        MOTTATHALA FINDER™ — ThinkerHub Useless Project
      </p>
      <p className="text-[11px] text-slate-300">
        Humanity solved electricity, space travel, artificial intelligence and the human genome. We measured your forehead.
      </p>
      <p className="text-[11px] font-extrabold text-amber-400 tracking-widest pt-0.5 uppercase">
        THE FOREHEAD KNOWS.
      </p>
      <p className="text-[10px] text-slate-500 pt-1">
        © {new Date().getFullYear()} MOTTATHALA FINDER™ — Department of Cranial Vegetation Analysis. Fictional entertainment only.
      </p>
    </footer>
  );
};
