import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Check, Image as ImageIcon, AlertCircle, Video, ShieldAlert, SwitchCamera, Play, Terminal, ArrowRight, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';

export type CameraLifecycleState = 
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'STARTING_CAMERA'
  | 'LIVE'
  | 'CAPTURING'
  | 'CAPTURED'
  | 'ERROR'
  | 'STOPPED';

interface CameraUploaderProps {
  title: string;
  description: string;
  onCapture: (url: string) => void;
  presetSamples: string[];
  devMode?: boolean;
}

export const CameraUploader: React.FC<CameraUploaderProps> = ({
  title,
  description,
  onCapture,
  presetSamples,
  devMode = false
}) => {
  const [cameraState, setCameraState] = useState<CameraLifecycleState>('IDLE');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [faceTrackedStatus, setFaceTrackedStatus] = useState<string>('SEARCHING FOR FACE');
  
  // Video Metadata & Track Info
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [activeTrackName, setActiveTrackName] = useState<string>('Unknown Camera');
  
  // Device Selection & Mobile Controls
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const mpCameraRef = useRef<MediaPipeCamera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);

  // Enumerate video input devices after permission
  const enumerateVideoDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setAvailableDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      }
    } catch (e) {
      console.warn('Device enumeration warning:', e);
    }
  };

  // Strictly Stop Stream & Clean Up All Tracks (Non-Negotiable Resource Cleanup)
  const stopCamera = useCallback(() => {
    if (mpCameraRef.current) {
      try { mpCameraRef.current.stop(); } catch {}
      mpCameraRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('STOPPED');
  }, []);

  // Cleanup on unmount or leaving camera screen
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // MediaPipe FaceMesh Results Callback
  const onFaceMeshResults = useCallback((results: Results) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceTrackedStatus('FACIAL MESH TRACKED');
      const landmarks = results.multiFaceLandmarks[0];
      const w = canvas.width;
      const h = canvas.height;

      // Draw Cyan 3D MediaPipe Mesh Points across Forehead & Hairline Boundary
      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;

      // Forehead indices
      const foreheadIndices = [10, 338, 297, 332, 284, 251, 21, 54, 67, 109, 10];
      ctx.beginPath();
      foreheadIndices.forEach((idx, i) => {
        const pt = landmarks[idx];
        if (pt) {
          const x = pt.x * w;
          const y = pt.y * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          ctx.fillRect(x - 2, y - 2, 4, 4);
        }
      });
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fill();

      // HUD Text above Forehead
      const topPt = landmarks[10];
      if (topPt) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MEDIAPIPE LANDMARK MESH ACTIVE', topPt.x * w, Math.max(18, topPt.y * h - 12));
      }
    } else {
      setFaceTrackedStatus('SEARCHING FOR FACE');
    }
  }, []);

  // Initialize MediaPipe FaceMesh Engine
  useEffect(() => {
    try {
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(onFaceMeshResults);
      faceMeshRef.current = faceMesh;
    } catch (e) {
      console.warn('MediaPipe FaceMesh init warning:', e);
    }
  }, [onFaceMeshResults]);

  // Start Real Camera Feed via MediaStream
  const startCamera = async () => {
    soundEngine.playBeep();
    setCameraError(null);
    stopCamera();

    setCameraState('REQUESTING_PERMISSION');

    try {
      let mediaStream: MediaStream | null = null;

      // Progressive Constraint Fallback Cascade (Section 5)
      const constraintsList: MediaStreamConstraints[] = [
        selectedDeviceId 
          ? { video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }
          : { video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
        { video: { facingMode }, audio: false },
        { video: true, audio: false }
      ];

      for (const constraint of constraintsList) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
          if (mediaStream) break;
        } catch (e) {
          console.warn('Constraint fallback step...', e);
        }
      }

      if (!mediaStream) {
        throw new Error('NotFoundError');
      }

      streamRef.current = mediaStream;
      setCameraState('STARTING_CAMERA');

      // Track info
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        setActiveTrackName(videoTrack.label || 'Webcam Stream');
      }

      await enumerateVideoDevices();

      if (videoRef.current) {
        const videoEl = videoRef.current;
        videoEl.srcObject = mediaStream;
        videoEl.muted = true;
        videoEl.setAttribute('playsinline', '');
        videoEl.autoplay = true;

        videoEl.onloadedmetadata = async () => {
          try {
            await videoEl.play();
            
            // Verify video dimensions and readyState before declaring LIVE
            if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
              setVideoDimensions({ width: videoEl.videoWidth, height: videoEl.videoHeight });
              setCameraState('LIVE');

              if (overlayCanvasRef.current) {
                overlayCanvasRef.current.width = videoEl.videoWidth;
                overlayCanvasRef.current.height = videoEl.videoHeight;
              }

              // Start MediaPipe Camera Sending Loop
              if (faceMeshRef.current && videoEl) {
                const mpCamera = new MediaPipeCamera(videoEl, {
                  onFrame: async () => {
                    if (videoEl && faceMeshRef.current) {
                      await faceMeshRef.current.send({ image: videoEl });
                    }
                  },
                  width: videoEl.videoWidth,
                  height: videoEl.videoHeight
                });
                mpCamera.start();
                mpCameraRef.current = mpCamera;
              }
            } else {
              setCameraState('LIVE');
            }
          } catch (playErr) {
            console.warn('Video play exception:', playErr);
            setCameraState('LIVE');
          }
        };
      }
    } catch (err: unknown) {
      console.error('Camera MediaStream error:', err);
      setCameraState('ERROR');

      const errString = String(err);
      if (errString.includes('NotAllowedError') || errString.includes('Permission')) {
        setCameraError('Camera permission was denied by browser settings. Please allow camera access or upload a photo file.');
      } else if (errString.includes('NotFoundError') || errString.includes('DevicesNotFound')) {
        setCameraError('No camera device was found on your computer or mobile device.');
      } else if (errString.includes('NotReadableError') || errString.includes('TrackStartError')) {
        setCameraError('The camera appears to be in use by another application. Please close other video apps.');
      } else if (errString.includes('SecurityError') || errString.includes('HTTPS')) {
        setCameraError('SECURE CONNECTION REQUIRED: Your browser requires HTTPS to use the webcam here.');
      } else {
        setCameraError('Unable to open live webcam stream. Please select "Upload Photo" below.');
      }
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    startCamera();
  };

  // Real Frame Extraction via HTML5 Canvas (Section 4)
  const handleCapturePhoto = () => {
    soundEngine.playBeep();
    const video = videoRef.current;
    
    if (!video || video.readyState < 2) {
      console.warn('Cannot capture: video not ready.');
      return;
    }

    setCameraState('CAPTURING');

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      setPreviewUrl(dataUrl);
      setCameraState('CAPTURED');
      
      // Pause live stream during captured preview
      if (mpCameraRef.current) {
        try { mpCameraRef.current.stop(); } catch {}
      }
    }
  };

  const handleRetake = () => {
    soundEngine.playBeep();
    setPreviewUrl(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (previewUrl) {
      soundEngine.playBeep();
      stopCamera();
      onCapture(previewUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      soundEngine.playBeep();
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
          setCameraState('CAPTURED');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Header Info */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      </div>

      {/* Camera Guidance Callout */}
      {cameraState === 'LIVE' && (
        <div className="w-full max-w-md bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3.5 text-left flex items-start gap-3 text-xs text-blue-200 shadow-md">
          <div className="p-2 rounded-xl bg-blue-600 text-white font-bold shrink-0">
            GUIDE
          </div>
          <div className="space-y-0.5">
            <p className="font-extrabold uppercase tracking-wider text-cyan-400">POSITION YOUR HEAD INSIDE THE FRAME</p>
            <ul className="list-disc list-inside opacity-90 font-mono text-[11px] space-y-0.5">
              <li>Face the camera directly with adequate lighting</li>
              <li>Keep your head still and un-tilted</li>
              <li>Ensure hairline & forehead are fully visible</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Viewport Box */}
      <div className="relative w-full max-w-md aspect-[4/3] glass-card border-2 border-blue-500/30 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 text-center shadow-2xl shadow-blue-500/10">
        
        {cameraState === 'CAPTURED' && previewUrl ? (
          <div className="relative w-full h-full">
            <img src={previewUrl} alt="Captured evidence frame" className="w-full h-full object-cover rounded-2xl" />
            <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1">
              <Check size={14} /> PHOTO CAPTURED
            </div>
          </div>
        ) : (cameraState === 'LIVE' || cameraState === 'STARTING_CAMERA' || cameraState === 'CAPTURING') ? (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover rounded-2xl" 
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />

            {/* MediaPipe 3D FaceMesh Canvas Overlay */}
            <canvas 
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />

            {/* Live Indicator Status Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/30">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ● LIVE CAMERA
              </span>
              <span className="text-cyan-400 font-bold uppercase">{faceTrackedStatus}</span>
            </div>

          </div>
        ) : (
          <div className="space-y-4 p-2">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Camera size={32} />
            </div>
            
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">Provide Forehead Evidence</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real browser camera stream or photo file upload</p>
            </div>

            {cameraState === 'REQUESTING_PERMISSION' && (
              <p className="text-xs font-mono text-cyan-400 animate-pulse">
                Requesting camera permission from browser…
              </p>
            )}

            {cameraError && (
              <div className="text-xs text-red-400 font-mono bg-red-500/10 p-3.5 rounded-2xl border border-red-500/20 text-left space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-red-300">
                  <ShieldAlert size={16} /> CAMERA EXCEPTION
                </div>
                <p className="opacity-90">{cameraError}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> TRY AGAIN
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/10 text-white font-bold rounded-xl text-xs"
                  >
                    UPLOAD INSTEAD
                  </button>
                </div>
              </div>
            )}

            {cameraState !== 'REQUESTING_PERMISSION' && !cameraError && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={startCamera}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-transform hover:scale-102"
                >
                  <Camera size={16} /> START WEBCAM
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-6 py-3 border border-blue-500/30 hover:bg-blue-500/10 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload size={16} /> UPLOAD PHOTO
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* DEV MODE DIAGNOSTICS OVERLAY (Section 7) */}
      {devMode && (
        <div className="w-full max-w-md bg-slate-950/90 border border-amber-500/40 p-3 rounded-2xl text-left font-mono text-[11px] text-amber-300 space-y-1 shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 border-b border-amber-500/30 pb-1">
            <Terminal size={14} /> CAMERA DIAGNOSTICS OVERLAY
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1">
            <div>Camera State: <strong className="text-white">{cameraState}</strong></div>
            <div>Stream Active: <strong className="text-emerald-400">{streamRef.current?.active ? 'TRUE' : 'FALSE'}</strong></div>
            <div>Resolution: <strong className="text-white">{videoDimensions.width}x{videoDimensions.height}</strong></div>
            <div>Active Tracks: <strong className="text-white">{streamRef.current?.getVideoTracks().length || 0}</strong></div>
            <div>Facing Mode: <strong className="text-cyan-300">{facingMode}</strong></div>
            <div className="col-span-2 truncate">Device: <strong className="text-slate-300">{activeTrackName}</strong></div>
          </div>
        </div>
      )}

      {/* Camera Devices Dropdown Toolbar */}
      {cameraState === 'LIVE' && availableDevices.length > 1 && (
        <div className="w-full max-w-md flex items-center justify-between gap-2 text-xs font-mono bg-slate-900/80 p-2.5 rounded-2xl border border-blue-500/20 shadow-inner text-slate-300">
          <span className="opacity-60 text-[11px]">SELECT WEBCAM:</span>
          <select
            value={selectedDeviceId}
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
              startCamera();
            }}
            className="bg-slate-950 text-white px-2 py-1 rounded-lg border border-blue-500/30 text-xs focus:outline-none"
          >
            {availableDevices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>

          <button
            onClick={toggleFacingMode}
            className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg font-bold text-[10px] text-cyan-300 flex items-center gap-1"
          >
            <SwitchCamera size={12} /> FLIP
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Preset Reference Samples */}
      {cameraState !== 'CAPTURED' && cameraState !== 'LIVE' && (
        <div className="w-full max-w-md text-center space-y-2">
          <span className="text-xs opacity-50 uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">Or select reference sample photo:</span>
          <div className="grid grid-cols-2 gap-2">
            {presetSamples.map((sampleUrl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playBeep();
                  stopCamera();
                  setPreviewUrl(sampleUrl);
                  setCameraState('CAPTURED');
                }}
                className="p-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ImageIcon size={14} /> Sample Photo {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Captured Screen Controls (RETAKE or USE THIS PHOTO) */}
      {cameraState === 'CAPTURED' && previewUrl && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetake}
            className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-white/20 hover:bg-white/10 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>RETAKE PHOTO</span>
          </button>

          <button
            onClick={handleConfirm}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <span>USE THIS PHOTO</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Live Stream Shutter Button */}
      {cameraState === 'LIVE' && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleCapturePhoto}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Camera size={18} /> ● TAKE PHOTO NOW
          </button>

          <button
            onClick={stopCamera}
            className="px-4 py-3.5 border border-white/20 hover:bg-white/10 text-xs font-semibold rounded-2xl text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}

    </div>
  );
};
