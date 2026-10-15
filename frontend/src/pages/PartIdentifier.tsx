import React, { useState, useRef } from 'react';
import { ApiService } from '../services/api';
import { PartIdentificationResult } from '../types';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Bookmark,
  CheckCircle,
  Cpu,
  Layers,
  Wrench,
  HelpCircle,
  RefreshCw,
  Video
} from 'lucide-react';

export const PartIdentifier: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PartIdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');
  const [langMode, setLangMode] = useState<'both' | 'gu' | 'en'>('both');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample quick test parts
  const sampleParts = [
    { name: 'Spur Gear', category: 'gears', label: 'Involute Spur Gear' },
    { name: 'Ball Bearing', category: 'bearings', label: 'Ball Bearing 6208' },
    { name: 'Drive Shaft', category: 'shafts', label: 'Stepped Shaft' },
    { name: 'V-Belt Pulley', category: 'pulleys', label: 'Cast Iron Pulley' },
    { name: 'Pump Impeller', category: 'pumps', label: 'Centrifugal Pump' },
    { name: 'Ball Valve', category: 'valves', label: 'Flanged Valve' },
    { name: 'Hex Bolt', category: 'fasteners', label: 'Grade 8.8 Fastener' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      stopCamera();
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      setError('Camera access denied or unavailable. Please use file upload instead.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(capturedFile);
            setPreviewUrl(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      setError('Please upload or capture an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: PartIdentificationResult;
      if (selectedFile) {
        data = await ApiService.identifyPart(selectedFile);
      } else {
        data = await ApiService.identifyPart(undefined, previewUrl || '');
      }
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze part image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectSample = (part: { name: string; category: string; label: string }) => {
    // Generate synthetic graphic sample preview
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#061224';
      ctx.fillRect(0, 0, 400, 400);

      // Draw mechanical blueprint motif
      ctx.strokeStyle = '#1E4B8B';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 400; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 400);
        ctx.moveTo(0, i); ctx.lineTo(400, i);
        ctx.stroke();
      }

      ctx.strokeStyle = '#4FC3FF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 200, 100, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = '#007BFF';
      ctx.font = 'bold 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`SAMPLE: ${part.name.toUpperCase()}`, 200, 195);
      ctx.fillStyle = '#E8F6FF';
      ctx.font = '12px Poppins, sans-serif';
      ctx.fillText(part.label, 200, 225);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${part.category}_sample.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        setResult(null);
        setError(null);
      }
    });
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    try {
      const raw = localStorage.getItem('mechnova_saved_history');
      const list: any[] = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: `part_${Date.now()}`,
        type: 'part',
        title: result.part_name,
        timestamp: new Date().toISOString(),
        data: result,
      });
      localStorage.setItem('mechnova_saved_history', JSON.stringify(list));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">AI Mechanical Part Identification</h1>
            <span className="text-[10px] font-bold bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
              Vision Heuristic
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Capture or upload images of gears, bearings, shafts, pulleys, pumps, valves, and fasteners for automated engineering classification.
          </p>
        </div>
      </div>

      {/* Main Analysis Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Camera Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Image Input</span>
              {previewUrl && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </h2>

            {/* Live Camera Viewfinder if active */}
            {isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black border border-cyan-accent/40 aspect-square flex items-center justify-center">
                <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl shadow-glow-primary flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-navy-800 text-slate-300 text-xs px-3 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              /* Image Preview Box */
              <div className="relative rounded-xl overflow-hidden bg-navy-950 border border-navy-700 aspect-square flex items-center justify-center group">
                <img src={previewUrl} alt="Part preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={handleClear}
                    className="bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Change
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Drag Drop Target */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-navy-700 hover:border-cyan-accent/60 bg-navy-950/60 hover:bg-navy-950 rounded-xl p-8 text-center cursor-pointer transition-all aspect-square flex flex-col items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-800 border border-navy-700 group-hover:border-cyan-accent/50 flex items-center justify-center text-cyan-accent mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Click to Upload Part Image</h3>
                <p className="text-[11px] text-slate-300 mb-4 max-w-[200px]">
                  Supports JPG, PNG, WEBP up to 15MB
                </p>
                <span className="text-[10px] bg-navy-800 border border-navy-700 text-slate-300 px-3 py-1 rounded-full font-mono">
                  DROP OR BROWSE
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Action Buttons: Camera & Submit */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                type="button"
                onClick={startCamera}
                disabled={loading || isCameraActive}
                className="flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-cyan-accent" />
                <span>Use Camera</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || (!selectedFile && !previewUrl)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-cyan-muted hover:from-primary-hover hover:to-primary text-white text-xs font-bold py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Part</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Test Samples */}
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Instant Test Samples</span>
              <span className="text-[10px] text-slate-300">Click to test</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleParts.map((p) => (
                <button
                  key={p.category}
                  onClick={() => selectSample(p)}
                  className="text-[11px] bg-navy-950 hover:bg-navy-800 border border-navy-800 hover:border-cyan-accent/50 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {error && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-300 text-xs mb-4">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-bold">Analysis Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              {/* Primary Identity Card */}
              <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-accent bg-cyan-accent/15 border border-cyan-accent/30 px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                      {result.category_gu && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {result.category_gu}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {result.part_name}
                    </h3>
                    {(result.part_name_gu || result.simple_explanation?.what_is_it_gu) && (
                      <p className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
                        {result.part_name_gu || result.simple_explanation?.what_is_it_gu}
                      </p>
                    )}
                  </div>

                  {/* Confidence Gauge */}
                  <div className="flex items-center gap-3 bg-navy-950/80 border border-navy-800 px-3.5 py-2 rounded-xl shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-300 uppercase font-mono">Confidence</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        {Math.round(result.confidence_score * 100)}%
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Dual-Language Preference Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-4 p-2 bg-navy-950 rounded-xl border border-navy-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 px-1">
                    <span className="text-sm">🌐</span>
                    <span>ભાષા પ્રદર્શન (Language):</span>
                  </div>
                  <div className="flex items-center gap-1 bg-navy-900 p-1 rounded-lg border border-navy-800">
                    <button
                      type="button"
                      onClick={() => setLangMode('both')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        langMode === 'both'
                          ? 'bg-cyan-accent text-navy-950 font-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🇬🇧 + 🇮🇳 Both (English & ગુજરાતી)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangMode('gu')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        langMode === 'gu'
                          ? 'bg-emerald-500 text-navy-950 font-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🇮🇳 ફક્ત ગુજરાતી</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangMode('en')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        langMode === 'en'
                          ? 'bg-primary text-white font-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🇬🇧 English</span>
                    </button>
                  </div>
                </div>

                {/* View Mode Switcher: Simple vs Technical */}
                <div className="flex items-center gap-2 mt-3 p-1 bg-navy-950 rounded-xl border border-navy-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('simple')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      viewMode === 'simple'
                        ? 'bg-emerald-500 text-navy-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🟢 Simple Ready Answer (સરળ તૈયાર જવાબ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('technical')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      viewMode === 'technical'
                        ? 'bg-primary text-white shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>⚙️ Detailed Technical Specs</span>
                  </button>
                </div>

                {viewMode === 'simple' ? (
                  /* SIMPLE EASY ANSWER VIEW (Dual Language: English & Gujarati) */
                  <div className="mt-4 space-y-3.5">
                    {/* What is it */}
                    <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                        <span className="text-base">🏷️</span>
                        <span>What is this part? / આ કયો પાર્ટ છે?</span>
                      </div>
                      <div className="space-y-1.5">
                        {(langMode === 'both' || langMode === 'en') && (
                          <div className="flex items-start gap-2 bg-navy-900/80 p-2.5 rounded-lg border border-navy-800">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/20 text-cyan-accent border border-cyan-accent/30 shrink-0 mt-0.5">
                              🇬🇧 EN
                            </span>
                            <p className="text-sm font-black text-white">
                              {result.simple_explanation?.what_is_it || result.part_name}
                            </p>
                          </div>
                        )}
                        {(langMode === 'both' || langMode === 'gu') && (
                          <div className="flex items-start gap-2 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 mt-0.5">
                              🇮🇳 GU
                            </span>
                            <p className="text-sm font-black text-emerald-300">
                              {result.simple_explanation?.what_is_it_gu || result.part_name_gu || result.part_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* What does it do */}
                    <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-accent uppercase tracking-wide">
                        <span className="text-base">⚙️</span>
                        <span>What does it do? / આનું કામ શું છે?</span>
                      </div>
                      <div className="space-y-1.5">
                        {(langMode === 'both' || langMode === 'en') && (
                          <div className="flex items-start gap-2 bg-navy-900/80 p-2.5 rounded-lg border border-navy-800">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/20 text-cyan-accent border border-cyan-accent/30 shrink-0 mt-0.5">
                              🇬🇧 EN
                            </span>
                            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                              {result.simple_explanation?.what_does_it_do || result.likely_function}
                            </p>
                          </div>
                        )}
                        {(langMode === 'both' || langMode === 'gu') && (
                          <div className="flex items-start gap-2 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-accent/30">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/40 shrink-0 mt-0.5">
                              🇮🇳 GU
                            </span>
                            <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-medium">
                              {result.simple_explanation?.what_does_it_do_gu || result.likely_function_gu || result.likely_function}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Where used & Materials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Where is it used */}
                      <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wide">
                          <span className="text-base">🚗</span>
                          <span>Where is it used? / ક્યાં વપરાય છે?</span>
                        </div>
                        <div className="space-y-1.5">
                          {(langMode === 'both' || langMode === 'en') && (
                            <div className="bg-navy-900/80 p-2 rounded-lg border border-navy-800 text-xs text-slate-200">
                              <span className="text-[9px] font-bold text-cyan-accent mr-1">🇬🇧 EN:</span>
                              {result.simple_explanation?.where_used_simple || result.common_applications.slice(0, 3).join(', ')}
                            </div>
                          )}
                          {(langMode === 'both' || langMode === 'gu') && (
                            <div className="bg-blue-950/30 p-2 rounded-lg border border-blue-500/30 text-xs text-blue-200 font-medium">
                              <span className="text-[9px] font-bold text-blue-300 mr-1">🇮🇳 GU:</span>
                              {result.simple_explanation?.where_used_simple_gu || 'વાહનો, મોટર્સ અને ફેક્ટરી મશીનરી.'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Material */}
                      <div className="bg-navy-950/90 p-4 rounded-xl border border-navy-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wide">
                          <span className="text-base">🧱</span>
                          <span>Material / શેનું બનેલું છે?</span>
                        </div>
                        <div className="space-y-1.5">
                          {(langMode === 'both' || langMode === 'en') && (
                            <div className="bg-navy-900/80 p-2 rounded-lg border border-navy-800 text-xs text-slate-200">
                              <span className="text-[9px] font-bold text-cyan-accent mr-1">🇬🇧 EN:</span>
                              {result.simple_explanation?.materials_simple || result.possible_materials.slice(0, 2).join(', ')}
                            </div>
                          )}
                          {(langMode === 'both' || langMode === 'gu') && (
                            <div className="bg-purple-950/30 p-2 rounded-lg border border-purple-500/30 text-xs text-purple-200 font-medium">
                              <span className="text-[9px] font-bold text-purple-300 mr-1">🇮🇳 GU:</span>
                              {result.simple_explanation?.materials_simple_gu || 'મજબૂત સ્ટીલ, કાસ્ટ આયર્ન અથવા એલોય.'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* How to take care */}
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide">
                        <span className="text-base">⚠️</span>
                        <span>What to watch out for / ધ્યાન રાખવા જેવી બાબત</span>
                      </div>
                      <div className="space-y-1.5">
                        {(langMode === 'both' || langMode === 'en') && (
                          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-navy-800 text-xs text-amber-100">
                            <span className="text-[9px] font-bold text-amber-300 mr-1">🇬🇧 EN:</span>
                            {result.simple_explanation?.care_and_warnings || result.failure_modes[0]}
                          </div>
                        )}
                        {(langMode === 'both' || langMode === 'gu') && (
                          <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30 text-xs text-amber-200 font-medium">
                            <span className="text-[9px] font-bold text-amber-300 mr-1">🇮🇳 GU:</span>
                            {result.simple_explanation?.care_and_warnings_gu || 'અવાજ કે ગરમી તપાસો, નિયમિત ઓઇલ/ગ્રીસ લગાવો.'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Safety Rule */}
                    <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wide">
                        <span className="text-base">🛡️</span>
                        <span>Safety Rule / સુરક્ષા નિયમ</span>
                      </div>
                      <div className="space-y-1.5">
                        {(langMode === 'both' || langMode === 'en') && (
                          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-navy-800 text-xs text-rose-100 font-semibold">
                            <span className="text-[9px] font-bold text-rose-300 mr-1">🇬🇧 EN:</span>
                            {result.simple_explanation?.safety_simple || result.safety_precautions[0]}
                          </div>
                        )}
                        {(langMode === 'both' || langMode === 'gu') && (
                          <div className="bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30 text-xs text-rose-200 font-semibold">
                            <span className="text-[9px] font-bold text-rose-300 mr-1">🇮🇳 GU:</span>
                            {result.simple_explanation?.safety_simple_gu || 'ફરતા પાર્ટ્સથી હાથ દૂર રાખો અને સેફ્ટી ગાર્ડ હંમેશા બંધ રાખવું.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TECHNICAL DETAILED VIEW */
                  <>
                    {/* Function Overview */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Likely Engineering Function / એન્જિનિયરિંગ કાર્ય
                      </h4>
                      <div className="space-y-2 bg-navy-950/50 p-3.5 rounded-xl border border-navy-800">
                        {(langMode === 'both' || langMode === 'en') && (
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            <span className="text-[10px] font-bold text-cyan-accent mr-1 font-mono">[EN]</span>
                            {result.likely_function}
                          </p>
                        )}
                        {(langMode === 'both' || langMode === 'gu') && (
                          <p className="text-xs sm:text-sm text-emerald-300 leading-relaxed">
                            <span className="text-[10px] font-bold text-emerald-400 mr-1 font-mono">[GU]</span>
                            {result.likely_function_gu || result.simple_explanation?.what_does_it_do_gu || result.likely_function}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Visible Features */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Visible Features Identified</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.visible_features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-navy-950/40 p-2 rounded-lg border border-navy-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent shrink-0 mt-1.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Materials & Applications Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-navy-800">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Likely Metallurgy / Materials</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {result.possible_materials.map((mat, idx) => (
                            <span key={idx} className="text-xs bg-navy-800 border border-navy-700 text-cyan-accent px-2.5 py-1 rounded-lg font-medium">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Common Machinery Applications</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {result.common_applications.map((app, idx) => (
                            <span key={idx} className="text-xs bg-navy-800 border border-navy-700 text-slate-200 px-2.5 py-1 rounded-lg font-medium">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Failure Modes & Safety */}
                    <div className="mt-4 pt-4 border-t border-navy-800 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Common Failure Modes & Wear
                        </h4>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                          {result.failure_modes.map((fm, idx) => (
                            <li key={idx}>{fm}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" /> Safety & Handling Precautions
                        </h4>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                          {result.safety_precautions.map((sp, idx) => (
                            <li key={idx}>{sp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Explicit Uncertainty Note */}
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Engineering Uncertainty Notice: </span>
                        {result.uncertainty_note}
                      </div>
                    </div>
                  </>
                )}

                {/* Footer Save Button */}
                <div className="mt-5 pt-4 border-t border-navy-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-mono">
                    MECHNOVA VISION ENGINE 1.0
                  </span>
                  <button
                    onClick={handleSaveToHistory}
                    className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-cyan-accent" />
                    <span>{savedSuccess ? 'Saved to History!' : 'Save to History'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center text-cyan-accent mb-4">
                <Cpu className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Awaiting Part Image</h3>
              <p className="text-xs text-slate-300 max-w-sm mb-6">
                Upload or capture a photo of any mechanical component, or choose one of the instant test samples on the left.
              </p>
              <div className="text-[11px] text-slate-300 bg-navy-950 px-3 py-1.5 rounded-lg border border-navy-800 font-mono">
                MODEL: HEURISTIC CONTRAST & CONTOUR CLASSIFIER
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
