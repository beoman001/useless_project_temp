import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppState, UserProfile, EvidenceState, AnalysisRecord } from './types/mottathala';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MottathalaAlarmModal, GroupSubjectAlarmStatus } from './components/MottathalaAlarmModal';
import { ShareCardModal } from './components/ShareCardModal';
import { IntroSequenceModal } from './components/IntroSequenceModal';
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { UploadView } from './views/UploadView';
import { NasaAnalysisView } from './views/NasaAnalysisView';
import { ResultView } from './views/ResultView';
import { BaldModeView } from './views/BaldModeView';
import { CertificateView } from './views/CertificateView';
import { HistoryView } from './views/HistoryView';
import { LeaderboardView } from './views/LeaderboardView';
import { GroupAnalysisView } from './views/GroupAnalysisView';
import { AboutView } from './views/AboutView';
import { SettingsView } from './views/SettingsView';
import { analyzeCranialVegetation } from './utils/farsFaselEngine';
import { storage } from './utils/storage';
import { soundEngine } from './utils/soundEngine';
import { ShieldCheck, Terminal, X } from 'lucide-react';

export default function MottathalaFinderApp() {
  const [state, setState] = useState<AppState>('landing');
  const [profile, setProfile] = useState<UserProfile>({ name: '' });
  const [evidence, setEvidence] = useState<EvidenceState>({
    frontUrl: null,
    backUrl: null,
    groupUrl: null,
    mode: 'single'
  });
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  
  const [alarmData, setAlarmData] = useState<{
    mode: 'positive' | 'negative' | 'group';
    name: string;
    score: number;
    classification?: string;
    groupStatuses?: GroupSubjectAlarmStatus[];
  } | null>(null);

  const [showAlarmModal, setShowAlarmModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [muted, setMuted] = useState<boolean>(soundEngine.isMuted());
  const [devMode, setDevMode] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  
  const toggleMute = () => {
    const isMutedNow = soundEngine.toggleMute();
    setMuted(isMutedNow);
  };

  const toggleDevMode = () => setDevMode(prev => !prev);

  const resetApp = () => {
    soundEngine.stopAlarm();
    setShowAlarmModal(false);
    setShowShareModal(false);
    setState('landing');
    setProfile({ name: '' });
    setEvidence({ frontUrl: null, backUrl: null, groupUrl: null, mode: 'single' });
    setRecord(null);
  };

  const handleConfirmSingleEvidence = (frontUrl: string, backUrl: string) => {
    setEvidence({ frontUrl, backUrl, groupUrl: null, mode: 'single' });
    setState('nasaAnalyzing');
  };

  const handleNasaAnalysisComplete = async () => {
    const result = await analyzeCranialVegetation(
      evidence.frontUrl || '',
      evidence.backUrl || '',
      profile
    );

    setRecord(result);
    storage.saveRecord(result);

    const alarmEnabled = localStorage.getItem('mottathala_alarm_enabled') !== 'false';
    const alarmThreshold = Number(localStorage.getItem('mottathala_alarm_threshold') || '80');

    if (alarmEnabled) {
      if (result.score >= alarmThreshold || result.classification === 'SIGNIFICANTLY MOTTATHALA' || result.classification === 'MOTTATHALA FOUND') {
        setAlarmData({
          mode: 'positive',
          name: result.user.name || 'Certified Subject',
          score: result.score,
          classification: result.classification
        });
        setShowAlarmModal(true);
      } else {
        // Trigger 🟢 NEGATIVE MOTTATHALA EMERGENCY
        setAlarmData({
          mode: 'negative',
          name: result.user.name || 'Certified Subject',
          score: result.score,
          classification: result.classification
        });
        setShowAlarmModal(true);
      }
    }

    setState('result');
  };

  const handleTriggerGroupAlarm = (groupStatuses: GroupSubjectAlarmStatus[]) => {
    const alarmEnabled = localStorage.getItem('mottathala_alarm_enabled') !== 'false';
    if (!alarmEnabled) return;

    setAlarmData({
      mode: 'group',
      name: 'Group Subjects',
      score: Math.max(...groupStatuses.map(s => s.score), 0),
      groupStatuses
    });
    setShowAlarmModal(true);
  };

  const handleReopenRecord = (rec: AnalysisRecord) => {
    setProfile(rec.user);
    setRecord(rec);
    setState('result');
  };

  const handleTestPositiveAlarm = () => {
    setAlarmData({
      mode: 'positive',
      name: 'Dr. Forehead',
      score: 94,
      classification: 'SIGNIFICANTLY MOTTATHALA'
    });
    setShowAlarmModal(true);
  };

  const handleTestNegativeAlarm = () => {
    setAlarmData({
      mode: 'negative',
      name: 'Subject Alpha',
      score: 18,
      classification: 'HAIR FORTRESS'
    });
    setShowAlarmModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0B132B] text-[#F7F7F5]' : 'bg-[#F8FAFC] text-[#151515]'} font-sans antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden`}>
      
      {/* Documentary Intro Sequence Modal */}
      {showIntroModal && (
        <IntroSequenceModal
          onComplete={() => setShowIntroModal(false)}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        activeState={state}
        onNavigate={(targetState) => {
          soundEngine.stopAlarm();
          setShowAlarmModal(false);
          setState(targetState);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        muted={muted}
        toggleMute={toggleMute}
        devMode={devMode}
        toggleDevMode={toggleDevMode}
        resetApp={resetApp}
      />

      {/* Transparent Local Privacy Banner */}
      <div className="w-full bg-slate-900/80 border-b border-blue-500/20 px-4 py-1.5 text-center text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 shadow-inner">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>Your photo is analysed 100% locally on this device using browser WebGL & Canvas APIs. No data is stored on external servers.</span>
      </div>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {state === 'landing' && (
            <LandingView
              key="landing"
              onStart={() => setState('onboarding')}
              onGroupScan={() => setState('groupAnalyzer')}
              onWatchIntro={() => setShowIntroModal(true)}
              onHowItWorks={() => setState('about')}
            />
          )}

          {state === 'onboarding' && (
            <OnboardingView
              key="onboarding"
              initialProfile={profile}
              onComplete={(prof) => {
                setProfile(prof);
                setState('upload');
              }}
            />
          )}

          {state === 'upload' && (
            <UploadView
              key="upload"
              onConfirmSingle={handleConfirmSingleEvidence}
              onConfirmGroup={() => setState('groupAnalyzer')}
              onBack={() => setState('onboarding')}
              devMode={devMode}
            />
          )}

          {state === 'nasaAnalyzing' && (
            <NasaAnalysisView
              key="nasaAnalyzing"
              onComplete={handleNasaAnalysisComplete}
            />
          )}

          {state === 'result' && record && (
            <ResultView
              key="result"
              record={record}
              onActivateBaldMode={() => setState('baldMode')}
              onViewCertificate={() => setState('certificate')}
              onShare={() => setShowShareModal(true)}
              onReset={resetApp}
            />
          )}

          {state === 'baldMode' && (
            <BaldModeView
              key="baldMode"
              name={profile.name || 'Subject'}
              onReturn={() => setState('result')}
            />
          )}

          {state === 'certificate' && record && (
            <CertificateView
              key="certificate"
              result={record}
              onReturn={() => setState('result')}
            />
          )}

          {state === 'history' && (
            <HistoryView
              key="history"
              onReopenRecord={handleReopenRecord}
              onReturn={() => setState('landing')}
            />
          )}

          {state === 'leaderboard' && (
            <LeaderboardView
              key="leaderboard"
              onStartScan={() => setState('onboarding')}
              onReturn={() => setState('landing')}
            />
          )}

          {state === 'groupAnalyzer' && (
            <GroupAnalysisView
              key="group"
              onReturn={() => setState('landing')}
              onTriggerGroupAlarm={handleTriggerGroupAlarm}
            />
          )}

          {state === 'about' && (
            <AboutView
              key="about"
              onReturn={() => setState('landing')}
            />
          )}

          {state === 'settings' && (
            <SettingsView
              key="settings"
              onReturn={() => setState('landing')}
              onTestPositiveAlarm={handleTestPositiveAlarm}
              onTestNegativeAlarm={handleTestNegativeAlarm}
            />
          )}

        </AnimatePresence>
      </main>

      {/* DEV MODE INSPECTOR DRAWER (When Dev Mode is Active) */}
      {devMode && (
        <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t-2 border-amber-500 p-4 font-mono text-xs text-amber-300 z-50 shadow-2xl backdrop-blur-xl max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-3">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Terminal size={16} /> COMPUTER VISION DEV / DEBUG INSPECTOR
            </div>
            <button
              onClick={() => setDevMode(false)}
              className="text-amber-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 bg-black/60 p-2.5 rounded border border-amber-500/20">
              <div className="font-bold text-white uppercase text-[11px] border-b border-white/10 pb-1">Quality Gate Metrics</div>
              <div>Blur Score: <strong className="text-emerald-400">{record?.imageQuality?.blurScore ?? 'N/A'}</strong></div>
              <div>Lighting Score: <strong className="text-yellow-400">{record?.imageQuality?.lightingScore ?? 'N/A'}</strong></div>
              <div>Face Visibility: <strong className="text-cyan-400">{record?.imageQuality?.faceVisibilityScore ?? 'N/A'}%</strong></div>
              <div>Hairline Visibility: <strong className="text-emerald-400">{record?.imageQuality?.hairlineVisibilityScore ?? 'N/A'}%</strong></div>
            </div>

            <div className="space-y-1 bg-black/60 p-2.5 rounded border border-amber-500/20">
              <div className="font-bold text-white uppercase text-[11px] border-b border-white/10 pb-1">Pose & Geometry Vectors</div>
              <div>Head Pose Yaw: <strong className="text-white">{record?.headPose?.yaw ?? 0}°</strong></div>
              <div>Head Pose Pitch: <strong className="text-white">{record?.headPose?.pitch ?? 0}°</strong></div>
              <div>Height Ratio: <strong className="text-amber-300">{record?.foreheadMetrics?.heightRatio ?? 'N/A'}</strong></div>
              <div>Solar Reflectivity: <strong className="text-yellow-300">{record?.foreheadMetrics?.solarReflectivityLux ?? 'N/A'} Lux</strong></div>
            </div>

            <div className="space-y-1 bg-black/60 p-2.5 rounded border border-amber-500/20">
              <div className="font-bold text-white uppercase text-[11px] border-b border-white/10 pb-1">Data Schema Identifiers</div>
              <div>Person ID: <strong className="text-white">{record?.personId ?? 'N/A'}</strong></div>
              <div>Result ID: <strong className="text-white">{record?.resultId ?? 'N/A'}</strong></div>
              <div>Algorithm: <strong className="text-cyan-300">{record?.algorithmVersion ?? 'FARS-FASel v3.2.0'}</strong></div>
              <div>Reliability: <strong className="text-emerald-300">{record?.reliability ?? 'HIGH'}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alarm Modal with Positive, Negative, and Group Alarm Modes */}
      {showAlarmModal && alarmData && (
        <MottathalaAlarmModal
          mode={alarmData.mode}
          name={alarmData.name}
          score={alarmData.score}
          classification={alarmData.classification}
          groupStatuses={alarmData.groupStatuses}
          onStopAlarm={() => {
            soundEngine.stopAlarm();
            setShowAlarmModal(false);
          }}
          onProceed={() => {
            soundEngine.stopAlarm();
            setShowAlarmModal(false);
          }}
        />
      )}

      {/* Share Modal */}
      {showShareModal && record && (
        <ShareCardModal
          record={record}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Satirical Footer */}
      <Footer />

    </div>
  );
}
