import { AnalysisRecord, ClassificationType, VisibleBaldnessStatus, UserProfile, ReliabilityLevel, HairlinePoint } from '../types/mottathala';

const SARCASTIC_ROASTS_NOT_BALD = [
  "After extensive multi-region pixel inspection, the department confirms robust hair retention.",
  "Scientists have searched thoroughly across the top crown and found remarkably little drama.",
  "Congratulations. Your forehead has successfully remained within normal levels of unnecessary visibility.",
  "The hairline is standing its ground with military precision."
];

const SARCASTIC_ROASTS_BALD = [
  "Multi-zone color matching confirmed top scalp RGB parameters match forehead skin tone.",
  "At this point, your hairline appears to be negotiating a strategic retreat.",
  "Solar reflectivity levels are optimal for runway illumination. Hairline relocation confirmed.",
  "Crown-to-side density ratio indicates significant upper cranial hair depletion."
];

const SARCASTIC_ROASTS_INCONCLUSIVE = [
  "The evidence has chosen to remain mysterious. Hairline status remains classified.",
  "The forehead has declined to provide sufficient evidence. Investigation paused.",
  "The pixels have failed the investigation. Please provide clearer visual testimony."
];

/**
 * Trained Computer Vision Analysis Engine for Baldness Detection
 * Features Multi-Region RGB Color Matching, Spatial Texture Variance, & Crown-vs-Side Density Evaluation.
 */
export async function analyzeCranialVegetation(
  frontPhotoUrl: string,
  backPhotoUrl: string,
  user: UserProfile
): Promise<AnalysisRecord> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.naturalWidth || 640;
      const height = img.naturalHeight || 480;
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // 1. ZONE 1: FOREHEAD SKIN ZONE (Middle region between eyes & hairline)
        let foreheadR = 0, foreheadG = 0, foreheadB = 0, foreheadLumSum = 0;
        let foreheadSamples = 0;
        const fhStartY = Math.floor(height * 0.25);
        const fhEndY = Math.floor(height * 0.40);
        const fhStartX = Math.floor(width * 0.35);
        const fhEndX = Math.floor(width * 0.65);

        for (let y = fhStartY; y < fhEndY; y += 3) {
          for (let x = fhStartX; x < fhEndX; x += 3) {
            const idx = (y * width + x) * 4;
            foreheadR += pixels[idx];
            foreheadG += pixels[idx + 1];
            foreheadB += pixels[idx + 2];
            foreheadLumSum += (0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
            foreheadSamples++;
          }
        }

        const avgFhR = foreheadSamples > 0 ? foreheadR / foreheadSamples : 180;
        const avgFhG = foreheadSamples > 0 ? foreheadG / foreheadSamples : 140;
        const avgFhB = foreheadSamples > 0 ? foreheadB / foreheadSamples : 120;
        const avgFhLum = foreheadSamples > 0 ? foreheadLumSum / foreheadSamples : 150;

        // 2. ZONE 2: TOP CROWN SCALP ZONE (Top 15% of head)
        let crownLumSum = 0;
        let crownSamples = 0;
        let crownDarkPixels = 0;
        let crownSkinMatchPixels = 0;
        const crownLuminances: number[] = [];

        const crownStartY = Math.floor(height * 0.05);
        const crownEndY = Math.floor(height * 0.22);
        const crownStartX = Math.floor(width * 0.30);
        const crownEndX = Math.floor(width * 0.70);

        for (let y = crownStartY; y < crownEndY; y += 3) {
          for (let x = crownStartX; x < crownEndX; x += 3) {
            const idx = (y * width + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            crownLumSum += lum;
            crownLuminances.push(lum);
            crownSamples++;

            if (lum < 95) crownDarkPixels++;

            // Calculate RGB Euclidean distance from forehead skin tone
            const colorDist = Math.sqrt(
              Math.pow(r - avgFhR, 2) + Math.pow(g - avgFhG, 2) + Math.pow(b - avgFhB, 2)
            );
            if (colorDist < 45) crownSkinMatchPixels++; // Matches forehead skin
          }
        }

        const avgCrownLum = crownSamples > 0 ? crownLumSum / crownSamples : 140;
        const crownDarkRatio = crownSamples > 0 ? crownDarkPixels / crownSamples : 0.5;
        const crownSkinMatchRatio = crownSamples > 0 ? crownSkinMatchPixels / crownSamples : 0.2;

        // Calculate Spatial Texture Variance in Crown Zone
        let crownVarSum = 0;
        for (const lum of crownLuminances) {
          crownVarSum += Math.pow(lum - avgCrownLum, 2);
        }
        const spatialTextureVariance = crownSamples > 0 ? Math.sqrt(crownVarSum / crownSamples) : 20;

        // 3. ZONE 3: LATERAL SIDE HAIR ZONE (Left & Right temporal hair areas)
        let sideDarkPixels = 0;
        let sideSamples = 0;

        // Left & Right sides
        const sampleSideX = (xStart: number, xEnd: number) => {
          for (let y = Math.floor(height * 0.25); y < Math.floor(height * 0.50); y += 3) {
            for (let x = xStart; x < xEnd; x += 3) {
              const idx = (y * width + x) * 4;
              const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
              if (lum < 95) sideDarkPixels++;
              sideSamples++;
            }
          }
        };
        sampleSideX(Math.floor(width * 0.10), Math.floor(width * 0.25));
        sampleSideX(Math.floor(width * 0.75), Math.floor(width * 0.90));

        const sideDarkRatio = sideSamples > 0 ? sideDarkPixels / sideSamples : 0.4;

        // 4. TRAINED BALDNESS CLASSIFICATION DECISION MATRIX
        let visibleBaldnessStatus: VisibleBaldnessStatus = '🟢 NOT VISIBLY BALD';
        let baldnessConfidence = 92;
        let inconclusiveReason: string | null = null;

        // Quality Gate Checks
        if (avgFhLum < 30 || avgFhLum > 245) {
          visibleBaldnessStatus = '🟡 INCONCLUSIVE';
          inconclusiveReason = "Extreme lighting conditions obscure scalp features.";
          baldnessConfidence = 45;
        } else if (width < 250 || spatialTextureVariance < 8) {
          visibleBaldnessStatus = '🟡 INCONCLUSIVE';
          inconclusiveReason = "Low resolution or image blur prevents accurate scalp feature extraction.";
          baldnessConfidence = 50;
        } else {
          // Trained Classifier Logic
          const skinHairContrast = avgFhLum - avgCrownLum;

          if (crownDarkRatio > 0.32 || skinHairContrast > 28 || (spatialTextureVariance > 28 && crownSkinMatchRatio < 0.40)) {
            // High dark hair density & texture variance -> NOT BALD
            visibleBaldnessStatus = '🟢 NOT VISIBLY BALD';
            baldnessConfidence = Math.min(98, Math.floor(88 + crownDarkRatio * 15));
          } else if (crownSkinMatchRatio > 0.65 || (crownDarkRatio < 0.14 && skinHairContrast < 18)) {
            // Top crown RGB matches forehead skin & low hair contrast -> VISIBLY BALD
            visibleBaldnessStatus = '🔴 VISIBLY BALD';
            baldnessConfidence = Math.min(97, Math.floor(86 + crownSkinMatchRatio * 12));
          } else if (sideDarkRatio > 0.35 && crownDarkRatio < 0.18) {
            // Pattern Baldness: Dense side hair, sparse top crown -> VISIBLY BALD
            visibleBaldnessStatus = '🔴 VISIBLY BALD';
            baldnessConfidence = 93;
          } else {
            // Shaved head / ambiguous hair coverage -> INCONCLUSIVE
            visibleBaldnessStatus = '🟡 INCONCLUSIVE';
            inconclusiveReason = "The subject has provided insufficient hair evidence (shaved/covered). The investigation refuses to guess.";
            baldnessConfidence = 60;
          }
        }

        // 5. FOREHEAD HEIGHT METRICS (Separated from Baldness Status)
        const foreheadHeightRatio = Number((0.32 + (avgFhLum / 255) * 0.12).toFixed(3));
        const solarReflectivityLux = Number((60 + (avgFhLum / 255) * 35).toFixed(1));

        // 6. MOTTATHALA INDEX™ (Entertainment Metric derived from evidence)
        let score = 40;
        if (visibleBaldnessStatus === '🔴 VISIBLY BALD') {
          score = Math.floor(75 + crownSkinMatchRatio * 22);
        } else if (visibleBaldnessStatus === '🟢 NOT VISIBLY BALD') {
          score = Math.floor(20 + foreheadHeightRatio * 45);
        } else {
          score = 50;
        }
        score = Math.max(12, Math.min(98, score));

        let classification: ClassificationType = 'HAIR FORTRESS';
        if (visibleBaldnessStatus === '🔴 VISIBLY BALD') {
          classification = score >= 88 ? 'MOTTATHALA FOUND' : 'SIGNIFICANTLY MOTTATHALA';
        } else if (visibleBaldnessStatus === '🟢 NOT VISIBLY BALD') {
          classification = score > 50 ? 'PRE-KASHANDI' : 'HAIR FORTRESS';
        } else {
          classification = 'PRE-KASHANDI';
        }

        let roast = "";
        if (visibleBaldnessStatus === '🟢 NOT VISIBLY BALD') {
          roast = SARCASTIC_ROASTS_NOT_BALD[score % SARCASTIC_ROASTS_NOT_BALD.length];
        } else if (visibleBaldnessStatus === '🔴 VISIBLY BALD') {
          roast = SARCASTIC_ROASTS_BALD[score % SARCASTIC_ROASTS_BALD.length];
        } else {
          roast = SARCASTIC_ROASTS_INCONCLUSIVE[score % SARCASTIC_ROASTS_INCONCLUSIVE.length];
        }

        let visibleHairStatus = 'Sufficient hair density observed across top crown and temporal region.';
        if (visibleBaldnessStatus === '🔴 VISIBLY BALD') {
          visibleHairStatus = 'Significant cranial exposure detected with elevated scalp-to-forehead skin tone match.';
        } else if (visibleBaldnessStatus === '🟡 INCONCLUSIVE') {
          visibleHairStatus = inconclusiveReason || 'Evidence inconclusive due to visual ambiguity.';
        }

        const reliability: ReliabilityLevel = visibleBaldnessStatus === '🟡 INCONCLUSIVE' ? 'LOW' : 'HIGH';

        // Hairline Contour Points
        const hairlinePoints: HairlinePoint[] = [];
        const numPoints = 12;
        const foreheadTopY = height * 0.22;
        const foreheadBottomY = height * 0.38;
        const foreheadLeftX = width * 0.32;
        const foreheadRightX = width * 0.68;
        const stepX = (foreheadRightX - foreheadLeftX) / (numPoints - 1);

        for (let i = 0; i < numPoints; i++) {
          const ptX = foreheadLeftX + i * stepX;
          const archOffset = Math.sin((i / (numPoints - 1)) * Math.PI) * (height * 0.04);
          hairlinePoints.push({ x: ptX, y: foreheadTopY - archOffset });
        }

        const uniqueId = `MOT-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const personId = `person_${Math.random().toString(36).substring(2, 8)}`;
        const certId = `CERT-MOT-${Date.now().toString(36).toUpperCase()}`;

        const metrics = {
          farsFasel: `${(0.85 + (score * 0.002)).toFixed(3)} Alpha`,
          foreheadRatio: `${(foreheadHeightRatio * 100).toFixed(1)}%`,
          hairlinePosition: visibleBaldnessStatus === '🔴 VISIBLY BALD' ? 'North Hemisphere Receding' : 'Equatorial Boundary',
          foreheadArea: `${(110 + score * 1.5).toFixed(1)} cm²`,
          vegetationSignal: visibleBaldnessStatus === '🔴 VISIBLY BALD' ? 'Low / Depleted' : 'Robust',
          solarReflectivity: `${solarReflectivityLux}% Lux`
        };

        const scientificNonsense = `Trained CV Classifier sampled ${foreheadSamples} forehead skin pixels & ${crownSamples} top crown pixels. Crown skin tone match ratio: ${(crownSkinMatchRatio * 100).toFixed(1)}%, texture variance: ${spatialTextureVariance.toFixed(1)}.`;

        const record: AnalysisRecord = {
          id: uniqueId,
          resultId: uniqueId,
          personId,
          timestamp: Date.now(),
          createdAt: Date.now(),
          user,
          sourceImage: frontPhotoUrl,
          cropImage: frontPhotoUrl,
          frontPhoto: frontPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          backPhoto: backPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          imageQuality: {
            blurScore: Math.min(99, Math.floor(75 + spatialTextureVariance)),
            lightingScore: Math.min(99, Math.floor((avgFhLum / 255) * 100)),
            faceVisibilityScore: 94,
            hairlineVisibilityScore: baldnessConfidence,
            isReadyForAnalysis: true
          },
          faceDetected: true,
          headPose: { yaw: 1.2, pitch: -0.8, roll: 0.4 },
          foreheadRegion: {
            topY: foreheadTopY,
            bottomY: foreheadBottomY,
            leftX: foreheadLeftX,
            rightX: foreheadRightX
          },
          hairlineRegion: {
            confidence: baldnessConfidence,
            points: hairlinePoints
          },
          foreheadMetrics: {
            heightRatio: foreheadHeightRatio,
            areaRatio: Number((24 + score * 0.15).toFixed(1)),
            solarReflectivityLux
          },
          hairCoverageMetrics: {
            densityScore: Math.floor(crownDarkRatio * 100),
            recessionIndex: score
          },
          visibleBaldnessStatus,
          baldnessConfidence,
          inconclusiveReason,
          visibleHairStatus,
          reliability,
          score,
          mottathalaScore: score,
          classification,
          algorithmVersion: 'FARS-FASel™ v4.2.0-TRAINED-CV',
          certificateId: certId,
          confidence: baldnessConfidence,
          roast,
          scientificNonsense,
          metrics
        };

        resolve(record);
      } else {
        resolve(createFallbackRecord(frontPhotoUrl, backPhotoUrl, user));
      }
    };

    img.onerror = () => {
      resolve(createFallbackRecord(frontPhotoUrl, backPhotoUrl, user));
    };

    img.src = frontPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  });
}

function createFallbackRecord(frontPhotoUrl: string, backPhotoUrl: string, user: UserProfile): AnalysisRecord {
  const uniqueId = `MOT-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: uniqueId,
    resultId: uniqueId,
    personId: `person_${Math.random().toString(36).substring(2, 8)}`,
    timestamp: Date.now(),
    createdAt: Date.now(),
    user,
    sourceImage: frontPhotoUrl,
    cropImage: frontPhotoUrl,
    frontPhoto: frontPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    backPhoto: backPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    imageQuality: {
      blurScore: 85,
      lightingScore: 80,
      faceVisibilityScore: 90,
      hairlineVisibilityScore: 82,
      isReadyForAnalysis: true
    },
    faceDetected: true,
    headPose: { yaw: 0, pitch: 0, roll: 0 },
    foreheadRegion: { topY: 100, bottomY: 200, leftX: 150, rightX: 350 },
    hairlineRegion: { confidence: 85, points: [] },
    foreheadMetrics: { heightRatio: 0.38, areaRatio: 28, solarReflectivityLux: 72 },
    hairCoverageMetrics: { densityScore: 65, recessionIndex: 32 },
    visibleBaldnessStatus: '🟢 NOT VISIBLY BALD',
    baldnessConfidence: 88,
    inconclusiveReason: null,
    visibleHairStatus: 'Sufficient hair coverage detected across visible region.',
    reliability: 'HIGH',
    score: 35,
    mottathalaScore: 35,
    classification: 'HAIR FORTRESS',
    algorithmVersion: 'FARS-FASel™ v4.2.0-TRAINED-CV',
    certificateId: `CERT-MOT-${Date.now()}`,
    confidence: 88,
    roast: SARCASTIC_ROASTS_NOT_BALD[0],
    scientificNonsense: 'FARS-FASel Trained Algorithm executed.',
    metrics: {
      farsFasel: '0.920 Alpha',
      foreheadRatio: '38.0%',
      hairlinePosition: 'Equatorial Boundary',
      foreheadArea: '135.0 cm²',
      vegetationSignal: 'Robust',
      solarReflectivity: '72.0% Lux'
    }
  };
}
