import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { AnalysisRecord } from '../types/mottathala';
import { Award, Share2, RotateCcw, ChevronDown, ChevronUp, Sparkles, Eye, ShieldCheck, EyeOff, RefreshCw, Layers } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface ResultViewProps {
  record: AnalysisRecord;
  onActivateBaldMode: () => void;
  onViewCertificate: () => void;
  onShare: () => void;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  record,
  onActivateBaldMode,
  onViewCertificate,
  onShare,
  onReset
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState(false);
  const [isUserAdjusted, setIsUserAdjusted] = useState(false);

  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);

  // Animated Spring Score Counter (0 -> final score)
  const springScore = useSpring(0, { stiffness: 45, damping: 14 });
  const displayScore = useTransform(springScore, (latest) => Math.round(latest));
  const [currentScoreDisplay, setCurrentScoreDisplay] = useState(0);

  useEffect(() => {
    springScore.set(record.score);
    const unsubscribe = displayScore.on("change", (val) => setCurrentScoreDisplay(val));
    return () => unsubscribe();
  }, [record.score]);

  // Render Visual Overlay Canvas when "SHOW ANALYSIS" is toggled on
  useEffect(() => {
    if (showAnalysisOverlay && canvasOverlayRef.current) {
      const canvas = canvasOverlayRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.naturalWidth || 500;
        canvas.height = img.naturalHeight || 500;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;

        // 1. Draw Face Bounding Box
        ctx.strokeStyle = '#06b6d4'; // Cyan
        ctx.lineWidth = 3;
        const faceBoxX = w * 0.25;
        const faceBoxY = h * 0.15;
        const faceBoxW = w * 0.5;
        const faceBoxH = h * 0.7;
        ctx.strokeRect(faceBoxX, faceBoxY, faceBoxW, faceBoxH);

        // Face Box HUD Label
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`FACE REGION [YAW:${record.headPose?.yaw || 0}°]`, faceBoxX + 5, faceBoxY - 8);

        // 2. Draw Forehead Polygon Region
        ctx.strokeStyle = '#a855f7'; // Purple
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 2.5;

        const fh = record.foreheadRegion || { topY: h * 0.2, bottomY: h * 0.38, leftX: w * 0.3, rightX: w * 0.7 };
        ctx.beginPath();
        ctx.moveTo(fh.leftX, fh.bottomY);
        ctx.lineTo(fh.leftX, fh.topY);
        ctx.lineTo(fh.rightX, fh.topY);
        ctx.lineTo(fh.rightX, fh.bottomY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.fillText('FOREHEAD GEOMETRY AREA', fh.leftX, fh.topY - 8);

        // 3. Draw Hairline Curve Points
        if (record.hairlineRegion?.points && record.hairlineRegion.points.length > 0) {
          ctx.strokeStyle = '#f59e0b'; // Amber
          ctx.fillStyle = '#ef4444';
          ctx.lineWidth = 3.5;
          ctx.beginPath();

          record.hairlineRegion.points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Draw landmark dots
          record.hairlineRegion.points.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // HUD Footer Stamp on Canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(10, h - 35, w - 20, 25);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`FARS-FASel™ CV OVERLAY — CONFIDENCE: ${record.hairlineRegion.confidence}% [${record.reliability}]`, 20, h - 18);
      };
      img.src = record.frontPhoto;
    }
  }, [showAnalysisOverlay, record]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto space-y-6 pb-12"
    >
      
      {/* Top Reveal Headline */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
          <ShieldCheck size={14} /> COMPUTER VISION ANALYSIS COMPLETE
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight pt-1">
          ANALYSIS RESULTS & VERIFICATION
        </h2>
      </div>

      {/* Main Result Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 bg-black/70 backdrop-blur-xl shadow-2xl text-center space-y-6">
        
        {/* Subject Photo & Visual Overlay Container */}
        <div className="flex flex-col items-center space-y-3">
          
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-4 border-red-500 shadow-2xl bg-black group">
            {showAnalysisOverlay ? (
              <canvas ref={canvasOverlayRef} className="w-full h-full object-cover" />
            ) : (
              <img
                src={record.frontPhoto}
                alt={record.user.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {isUserAdjusted && (
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] font-mono rounded border border-yellow-300 shadow">
                USER-ADJUSTED REGION
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playBeep();
                setShowAnalysisOverlay(!showAnalysisOverlay);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showAnalysisOverlay
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {showAnalysisOverlay ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showAnalysisOverlay ? 'HIDE OVERLAY' : 'SHOW ANALYSIS OVERLAY'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playBeep();
                setIsUserAdjusted(!isUserAdjusted);
              }}
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-300 border border-white/20 flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>{isUserAdjusted ? 'RESET REGION' : 'RETRY REGION'}</span>
            </button>
          </div>

          <h3 className="text-2xl font-black text-white">
            {record.user.name}
          </h3>
        </div>

        {/* Reality-Based Visible Baldness Classification */}
        <div className={`p-4 rounded-2xl border text-left space-y-2 ${
          record.visibleBaldnessStatus === '🔴 VISIBLY BALD'
            ? 'bg-red-950/80 border-red-500/50'
            : record.visibleBaldnessStatus === '🟢 NOT VISIBLY BALD'
            ? 'bg-emerald-950/80 border-emerald-500/50'
            : 'bg-amber-950/80 border-amber-500/50'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={14} className={
                record.visibleBaldnessStatus === '🔴 VISIBLY BALD'
                  ? 'text-red-400'
                  : record.visibleBaldnessStatus === '🟢 NOT VISIBLY BALD'
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              } /> VISIBLE BALDNESS CLASSIFICATION
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 font-bold border border-white/20">
              CONFIDENCE: {record.visibleBaldnessStatus === '🟡 INCONCLUSIVE' ? 'INSUFFICIENT EVIDENCE' : `${record.baldnessConfidence}%`}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className={`text-xl font-black font-mono ${
              record.visibleBaldnessStatus === '🔴 VISIBLY BALD'
                ? 'text-red-400'
                : record.visibleBaldnessStatus === '🟢 NOT VISIBLY BALD'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}>
              {record.visibleBaldnessStatus || '🟢 NOT VISIBLY BALD'}
            </span>
          </div>

          {record.inconclusiveReason && (
            <p className="text-xs text-amber-300 font-mono italic pt-1 border-t border-white/10">
              Note: {record.inconclusiveReason}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono text-slate-300">
            <div>Hairline Position: <strong className="text-white">{record.metrics?.hairlinePosition ?? 'Equatorial'}</strong></div>
            <div>Solar Reflectivity: <strong className="text-yellow-400">{record.foreheadMetrics?.solarReflectivityLux ?? 70} Lux</strong></div>
          </div>
        </div>

        {/* Clear Concept Separation: 2. MOTTATHALA INDEX™ (Entertainment Score) */}
        <div className="space-y-1 bg-black/60 p-6 rounded-2xl border-2 border-red-500/50">
          <div className="text-6xl sm:text-8xl font-black font-mono tracking-tighter text-red-500">
            {currentScoreDisplay}
          </div>
          <div className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            MOTTATHALA INDEX™ (ENTERTAINMENT METRIC)
          </div>
          
          <div className="pt-2">
            <span className="px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-sm tracking-wider uppercase shadow-md">
              {record.classification}
            </span>
          </div>
        </div>

        {/* Dynamic Scale Visualization (0 --- 25 --- 50 --- 75 --- 100) */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

          <div className="relative w-full h-5 rounded-full bg-slate-900 border border-white/20 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(4, record.score)}%` }}
            />
          </div>
        </div>

        {/* Satirical Comedy Explanation */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm italic text-yellow-300">
          “{record.roast}”
        </div>

        {/* Expandable Analysis Details */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/30">
          <button
            onClick={() => {
              soundEngine.playBeep();
              setDetailsOpen(!detailsOpen);
            }}
            className="w-full px-4 py-3 text-xs font-mono font-bold text-slate-300 hover:text-white flex items-center justify-between bg-white/5"
          >
            <span>VIEW COMPUTER VISION METRICS & ALGORITHM VERIFICATION</span>
            {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {detailsOpen && (
            <div className="p-4 text-left space-y-4 text-xs font-mono text-slate-300 border-t border-white/10 animate-fadeIn">
              
              <div className="space-y-1">
                <span className="text-red-400 font-bold block uppercase">Forehead Geometry Metrics</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Forehead Ratio: <strong className="text-white">{record.metrics.foreheadRatio}</strong></div>
                  <div>Hairline Position: <strong className="text-white">{record.metrics.hairlinePosition}</strong></div>
                  <div>Forehead Area: <strong className="text-white">{record.metrics.foreheadArea}</strong></div>
                  <div>Algorithm Version: <strong className="text-white">{record.algorithmVersion}</strong></div>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-yellow-400 font-bold block uppercase">Scientific Nonsense Commentary</span>
                <p className="text-slate-400 italic">
                  "{record.scientificNonsense}"
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playBeep();
              onActivateBaldMode();
            }}
            className="py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 transition-transform hover:scale-102"
          >
            BALD MODE™
          </button>

          <button
            onClick={() => {
              soundEngine.playBeep();
              onViewCertificate();
            }}
            className="py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
          >
            <Award size={16} /> CERTIFICATE
          </button>

          <button
            onClick={() => {
              soundEngine.playBeep();
              onShare();
            }}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-300 font-extrabold text-xs tracking-wider uppercase border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <Share2 size={16} /> SHARE
          </button>
        </div>

        <button
          onClick={() => {
            soundEngine.playBeep();
            onReset();
          }}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <RotateCcw size={12} /> Run New Analysis
        </button>

      </div>

    </motion.div>
  );
};
