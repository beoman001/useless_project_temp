import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Sparkles, ArrowLeft, Users, Trophy, ShieldCheck } from 'lucide-react';
import { GroupDetectedHead } from '../types/mottathala';
import { detectGroupHeads } from '../utils/groupDetector';
import { soundEngine } from '../utils/soundEngine';

interface GroupAnalysisViewProps {
  onReturn: () => void;
  onTriggerGroupAlarm?: (statuses: Array<{
    personId: string;
    name: string;
    score: number;
    status: 'positive' | 'negative' | 'insufficient';
    classification?: string;
  }>) => void;
}

export const GroupAnalysisView: React.FC<GroupAnalysisViewProps> = ({ onReturn, onTriggerGroupAlarm }) => {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [annotatedPhotoUrl, setAnnotatedPhotoUrl] = useState<string | null>(null);
  const [detectedHeads, setDetectedHeads] = useState<GroupDetectedHead[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleGroupPhotos = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      soundEngine.playBeep();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processGroupPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const processGroupPhoto = async (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setIsAnalyzing(true);
    soundEngine.playBeep();

    const res = await detectGroupHeads(photoUrl);
    setAnnotatedPhotoUrl(res.annotatedCanvasUrl);
    setDetectedHeads(res.heads);
    setIsAnalyzing(false);
    soundEngine.playFanfare();

    if (onTriggerGroupAlarm && res.heads.length > 0) {
      const alarmThreshold = Number(localStorage.getItem('mottathala_alarm_threshold') || '80');
      const statuses = res.heads.map((h, i) => ({
        personId: h.personId || `PERSON-0${i + 1}`,
        name: `Subject #${h.headNumber}`,
        score: h.score,
        status: (h.score >= alarmThreshold
          ? 'positive'
          : h.score < 40 || h.classification.includes('FORTRESS')
          ? 'negative'
          : 'insufficient') as 'positive' | 'negative' | 'insufficient',
        classification: h.classification
      }));
      onTriggerGroupAlarm(statuses);
    }
  };

  // Sort detected heads by Mottathala score (highest score first)
  const sortedHeads = [...detectedHeads].sort((a, b) => b.score - a.score);
  const isEndangeredGroup = detectedHeads.length > 0 && detectedHeads.every(h => h.score < 45);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-3xl glass-card border-2 border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 bg-slate-900/90 text-slate-100"
    >
      
      <div className="flex justify-between items-start">
        <button
          onClick={() => {
            soundEngine.playBeep();
            onReturn();
          }}
          className="px-3.5 py-1.5 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold border border-blue-500/20">
            <Users size={14} /> MULTI-HEAD COMPUTER VISION
          </div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-3xl font-black text-slate-100 tracking-tight">
          GROUP MOTTATHALA SCANNER™
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Upload any group photo to automatically detect, number, and measure every visible forehead.
        </p>
      </div>

      {!selectedPhotoUrl ? (
        <div className="space-y-6">
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[16/9] border-2 border-dashed border-blue-500/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500/60 bg-blue-500/5 cursor-pointer transition-all text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
              <Upload size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Upload Group Photograph</p>
              <p className="text-xs text-slate-400 mt-0.5">Click to browse or drop multi-person photo file</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Sample Group Photos */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase">Or test with sample group photo:</span>
            <div className="grid grid-cols-2 gap-3">
              {sampleGroupPhotos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => processGroupPhoto(url)}
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-blue-500/30 hover:border-cyan-400 group transition-all"
                >
                  <img src={url} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center font-bold text-xs text-white">
                    Sample Group {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : isAnalyzing ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-blue-500/30" />
          <p className="text-sm font-mono text-cyan-400 font-bold animate-pulse">
            MediaPipe multi-head bounding box analysis in progress…
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Group Endangered Troll Notice */}
          {isEndangeredGroup && (
            <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-2xl text-center space-y-1 text-amber-300 font-mono text-xs shadow-lg">
              <div className="font-bold uppercase tracking-wider text-amber-400">THE MOTTATHALA SPECIES IS ENDANGERED!</div>
              <p className="opacity-90">Suspiciously good hair detected across all subjects in this photograph.</p>
            </div>
          )}

          {/* Annotated Group Image Canvas Output */}
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-black">
            <img
              src={annotatedPhotoUrl || selectedPhotoUrl}
              alt="Annotated Group Analysis"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 right-3 px-3.5 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-full shadow-lg">
              {detectedHeads.length} HEADS DETECTED & MEASURED
            </div>
          </div>

          {/* Individual Head Score Cards List & Leaderboard */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
              <span className="flex items-center gap-1.5"><Trophy size={14} /> Group Forehead Leaderboard</span>
              <span className="opacity-60">{detectedHeads.length} Subjects Evaluated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedHeads.map((head, index) => (
                <div
                  key={head.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-blue-500/20 flex items-center gap-3 shadow-inner"
                >
                  <div className="relative shrink-0">
                    <img
                      src={head.croppedPhotoUrl}
                      alt={`Head #${head.headNumber}`}
                      className="w-16 h-16 rounded-xl object-cover border border-blue-500/40"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white font-black font-mono text-[10px] flex items-center justify-center border border-white/20">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">SUBJECT #{head.headNumber}</span>
                      <span className="text-cyan-400">{head.score} / 100</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/60 border border-white/20">
                        {head.visibleBaldnessStatus || '🟢 NOT VISIBLY BALD'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">
                        {head.classification}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 italic line-clamp-1">
                      "{head.roast}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedPhotoUrl(null);
                setAnnotatedPhotoUrl(null);
                setDetectedHeads([]);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30"
            >
              Analyze Another Group Photo
            </button>
          </div>

        </div>
      )}

    </motion.div>
  );
};
