export type AppState = 
  | 'landing'
  | 'onboarding' 
  | 'upload' 
  | 'nasaAnalyzing' 
  | 'result' 
  | 'baldMode' 
  | 'certificate' 
  | 'history' 
  | 'leaderboard'
  | 'groupAnalyzer' 
  | 'about'
  | 'settings';

export type ClassificationType = 
  | 'HAIR FORTRESS' 
  | 'PRE-KASHANDI' 
  | 'EMERGENCY KASHANDI' 
  | 'SIGNIFICANTLY MOTTATHALA'
  | 'MOTTATHALA FOUND';

export type VisibleBaldnessStatus = 
  | '🟢 NOT VISIBLY BALD' 
  | '🔴 VISIBLY BALD' 
  | '🟡 INCONCLUSIVE';

export type ReliabilityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT DATA';

export type HistoryFilterMode = 'recent' | 'highest';

export interface UserProfile {
  name: string;
  nickname?: string;
  age?: string;
  location?: string;
}

export interface EvidenceState {
  frontUrl: string | null;
  backUrl: string | null;
  groupUrl: string | null;
  mode: 'single' | 'group';
}

export interface ImageQualityBreakdown {
  blurScore: number; // 0-100
  lightingScore: number; // 0-100
  faceVisibilityScore: number; // 0-100
  hairlineVisibilityScore: number; // 0-100
  isReadyForAnalysis: boolean;
  rejectionReason?: string | null;
}

export interface HeadPose {
  yaw: number; // degrees
  pitch: number;
  roll: number;
}

export interface ForeheadRegion {
  topY: number;
  bottomY: number;
  leftX: number;
  rightX: number;
}

export interface HairlinePoint {
  x: number;
  y: number;
}

export interface HairlineRegion {
  confidence: number; // 0-100 %
  points: HairlinePoint[];
  isUserAdjusted?: boolean;
}

export interface ForeheadMetrics {
  heightRatio: number; // ratio to facial height
  areaRatio: number; // % of head area
  solarReflectivityLux: number; // Lux units
}

export interface HairCoverageMetrics {
  densityScore: number; // 0-100
  recessionIndex: number; // 0-100
}

export interface MetricsBreakdown {
  farsFasel: string;
  foreheadRatio: string;
  hairlinePosition: string;
  foreheadArea: string;
  vegetationSignal: string;
  solarReflectivity: string;
}

export interface AnalysisRecord {
  // Centralized Result Object (Single Source of Truth)
  id: string;
  resultId: string;
  personId: string;
  timestamp: number;
  createdAt: number;
  user: UserProfile;
  
  // Computer Vision Data
  sourceImage: string;
  cropImage: string;
  frontPhoto: string;
  backPhoto: string;
  
  imageQuality: ImageQualityBreakdown;
  faceDetected: boolean;
  headPose: HeadPose;
  foreheadRegion: ForeheadRegion;
  hairlineRegion: HairlineRegion;
  foreheadMetrics: ForeheadMetrics;
  hairCoverageMetrics: HairCoverageMetrics;
  
  // Reality-Based Baldness Classification (Separate from Forehead Size)
  visibleBaldnessStatus: VisibleBaldnessStatus;
  baldnessConfidence: number; // 0-100%
  inconclusiveReason?: string | null;

  // Observations vs Entertainment Score
  visibleHairStatus: string; // Objective visual observation
  reliability: ReliabilityLevel; // Qualitative reliability
  score: number; // Mottathala Index score (0-100)
  mottathalaScore: number;
  classification: ClassificationType;
  
  // Metadata & Commentary
  algorithmVersion: string;
  certificateId: string;
  confidence: number;
  roast: string;
  scientificNonsense: string;
  metrics: MetricsBreakdown;
}

export interface GroupDetectedHead {
  id: string;
  personId: string;
  headNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  croppedPhotoUrl: string;
  score: number;
  classification: ClassificationType;
  visibleBaldnessStatus: VisibleBaldnessStatus;
  baldnessConfidence: number;
  inconclusiveReason?: string | null;
  reliability: ReliabilityLevel;
  visibleHairStatus: string;
  roast: string;
}
