import { AnalysisRecord } from '../types/mottathala';

export async function downloadMottathalaCertificate(record: AnalysisRecord): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 850;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Load subject evidence photo
  const photoImg = new Image();
  photoImg.crossOrigin = 'anonymous';

  await new Promise<void>((resolve) => {
    photoImg.onload = () => resolve();
    photoImg.onerror = () => resolve();
    photoImg.src = record.frontPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  });

  // Background Gradient (Deep Midnight Royal Navy to Dark Slate)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0b132b');
  grad.addColorStop(0.5, '#1c2541');
  grad.addColorStop(1, '#0b132b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Outer Golden & Cyan Ornate Borders
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Watermark Seal Stamp (VERIFIED BY SCIENCE)
  ctx.save();
  ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
  ctx.font = 'bold 110px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED BY SCIENCE', width / 2, height / 2 + 30);
  ctx.restore();

  // Header Title
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'extrabold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MOTTATHALA FINDER™', width / 2 + 60, 95);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('OFFICIAL MOTTATHALA CERTIFICATE™', width / 2 + 60, 135);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('INTERNATIONAL INSTITUTE OF UNNECESSARY FOREHEAD RESEARCH', width / 2 + 60, 162);

  // Subject Photo Circle Frame on Left
  const photoSize = 145;
  const photoX = 80;
  const photoY = 75;

  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.clip();
  if (photoImg.complete && photoImg.naturalWidth > 0) {
    ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
  }
  ctx.restore();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Official Verified Seal (Right Top Corner)
  const sealX = width - 140;
  const sealY = 135;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED BY', sealX, sealY - 8);
  ctx.fillText('SCIENCE™', sealX, sealY + 6);
  ctx.font = '9px monospace';
  ctx.fillText('THE FOREHEAD KNOWS', sealX, sealY + 22);
  ctx.restore();

  // Divider Line
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 235);
  ctx.lineTo(width - 80, 235);
  ctx.stroke();

  // Certificate Body Text
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('This certifies that subject:', width / 2, 280);

  // Subject Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px sans-serif';
  ctx.fillText(record.user.name.toUpperCase(), width / 2, 338);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px sans-serif';
  ctx.fillText('has voluntarily submitted their forehead to a completely unnecessary scientific investigation:', width / 2, 385);

  // Classification Badge Box
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(width / 2 - 280, 410, 560, 75);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 280, 410, 560, 75);

  ctx.fillStyle = record.visibleBaldnessStatus === '🔴 VISIBLY BALD' ? '#ef4444' : record.visibleBaldnessStatus === '🟢 NOT VISIBLY BALD' ? '#10b981' : '#f59e0b';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(record.visibleBaldnessStatus || '🟢 NOT VISIBLY BALD', width / 2, 442);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(record.classification, width / 2, 472);

  // Metrics Info & Date
  const dateFormatted = new Date(record.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`MOTTATHALA INDEX™ SCORE: ${record.score} / 100`, width / 2, 532);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px monospace';
  ctx.fillText(`Scan ID: ${record.certificateId || record.id}  •  Date: ${dateFormatted}  •  Confidence: ${record.baldnessConfidence || 90}%`, width / 2, 568);

  // Satirical Commentary Box
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(100, 600, width - 200, 75);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(100, 600, width - 200, 75);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'italic 15px sans-serif';
  ctx.fillText(`"${record.roast}"`, width / 2, 645);

  // Footer Legal Disclaimer
  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.fillText('This document has absolutely no medical, legal, academic, governmental, financial, or practical value. Please keep it anyway.', width / 2, 748);
  ctx.fillText('Humanity solved electricity, space travel, artificial intelligence and the human genome. We measured your forehead. THE FOREHEAD KNOWS.', width / 2, 770);

  // Download PNG file
  const link = document.createElement('a');
  link.download = `Official_Mottathala_Certificate_${record.user.name.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
