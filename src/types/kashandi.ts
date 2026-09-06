export type AppState = 
  | 'idle' 
  | 'profile' 
  | 'frontEvidence' 
  | 'backEvidence' 
  | 'analyzing' 
  | 'result' 
  | 'mottathala' 
  | 'baldMode' 
  | 'baldProcessing' 
  | 'baldResult' 
  | 'certificate' 
  | 'groupAnalyzer' 
  | 'groupAnalyzing' 
  | 'groupResult' 
  | 'error';

export interface UserProfile {
  name: string;
  nickname?: string;
  analysisTitle?: string;
}

export interface EvidenceState {
  frontUrl: string | null;
  backUrl: string | null;
  frontQuality: 'acceptable' | 'blurry' | 'unusable' | null;
  backQuality: 'acceptable' | 'blurry' | 'unusable' | null;
}

export type ClassificationType = 
  | 'HAIR FORTRESS' 
  | 'PRE-KASHANDI' 
  | 'EMERGENCY KASHANDI' 
  | 'MOTTATHALA FOUND';

export interface MetricsBreakdown {
  farsFasel: string;
  foreheadRatio: string;
  vegetationSignal: string;
  rearStability: string;
  solarReflectivity: string;
  follicleDenialIndex: string;
}

export interface AnalysisResult {
  score: number; // 0 - 100
  classification: ClassificationType;
  confidence: number;
  roast: string;
  id: string;
  timestamp: number;
  metrics: MetricsBreakdown;
  user: UserProfile;
  frontPhoto: string;
  backPhoto: string;
}

export interface GroupMember {
  id: string;
  name: string;
  score: number;
  classification: ClassificationType;
}
