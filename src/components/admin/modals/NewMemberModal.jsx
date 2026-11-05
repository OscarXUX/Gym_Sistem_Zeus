import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

export default function NewMemberModal({ isOpen, onClose, onRegister }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [customId, setCustomId] = useState('');
  const [planOption, setPlanOption] = useState('Mensualidad|$400|30');
  const [photoBase64, setPhotoBase64] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setCameraError('');
    }
    return () => stopCameraStream();
  }, [isOpen]);

  if (!isOpen) return null;

  const startCamera = async () => {
    setCameraError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC no disponible en este navegador');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err) {
      setCameraError('No se pudo abrir la cámara. Usa el botón "Subir Archivo".');
      setIsCameraActive(false);
    }
  };

  const compressSourceToBase64 = (sourceElement, srcWidth, srcHeight) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const minSide = Math.min(srcWidth, srcHeight);
    const sx = (srcWidth - minSide) / 2;
    const sy = (srcHeight - minSide) / 2;

    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, 300, 300);
    ctx.drawImage(sourceElement, sx, sy, minSide, minSide, 0, 0, 300, 300);

    return canvas.toDataURL('image/jpeg', 0.75);
  };

  const handleCaptureFromVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 300;
    const h = video.videoHeight || 300;
    const compressed = compressSourceToBase64(video, w, h);
    setPhotoBase64(compressed);
    stopCameraStream();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const compressed = compressSourceToBase64(img, img.width || 300, img.height || 300);
        setPhotoBase64(compressed);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Por favor escribe el nombre completo del atleta.');

    const [plan, priceStr, daysStr] = planOption.split('|');
    const numericPrice = parseInt(String(priceStr).replace(/\D/g, ''), 10) || 400;

    onRegister({
      id: customId.trim() || undefined,
      name: name.trim(),
      phone: phone.trim(),
      photo: photoBase64 || DEFAULT_AVATAR,
      plan,
      price: priceStr,
      rawPrice: numericPrice,
      days: parseInt(daysStr, 10) || 30
    });

    setName('');
    setPhone('');
    setCustomId('');
    setPhotoBase64('');
    stopCameraStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-hidden">
      <div className="bg-[#090e1a] border border-sky-500/30 rounded-3xl w-full max-w-lg shadow-2xl relative my-auto max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Cabecera Fija */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 text-sm shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <div>
              <h3 className="font-zeus text-sm sm:text-base font-black text-white leading-tight">
                Consagrar Nuevo Atleta
              </h3>
              <p className="text-[11px] text-slate-400">Alta en SQLite, foto y cobro en tesorería</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Canvas oculto para compresión 300x300 JPEG 0.75 */}
        <canvas ref={canvasRef} width="300" height="300" className="hidden" />

        {/* Formulario con Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          {/* VISTA PREVIA EN VIVO DE CÁMARA */}
          {isCameraActive && (
            <div className="bg-slate-950 border-2 border-sky-500/70 rounded-2xl p-3 flex flex-col items-center gap-2.5 shadow-lg shadow-sky-950/40">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-black shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={handleCaptureFromVideo}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <i className="fa-solid fa-camera"></i> Capturar Foto
                </button>
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* SECCIÓN HERO: FOTO Y NOMBRE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 backdrop-blur-md">
            {/* Foto Avatar con Opciones */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative">
                <img
                  src={photoBase64 || DEFAULT_AVATAR}
                  alt="Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sky-400/80 bg-slate-950 shadow-md"
                />
                {photoBase64 && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow">
                    OK
                  </span>
                )}
              </div>
              <div className="flex gap-1 mt-1">
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-white p-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                  title="Tomar Foto con Cámara"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                  title="Subir Archivo de Imagen"
                >
                  <i className="fa-solid fa-upload"></i>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Nombre Completo y PIN */}
            <div className="flex-1 min-w-0 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                Nombre Completo del Atleta *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Aquiles Morales"
                className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-zeus font-black tracking-wide focus:outline-none transition-colors"
                autoFocus
                required
              />
              <span className="text-[10px] text-slate-400 block truncate">
                Usa la cámara o sube archivo para el registro sagrado
              </span>
            </div>
          </div>

          {cameraError && (
            <p className="text-[11px] text-amber-300 text-center font-semibold bg-amber-950/30 border border-amber-800/40 py-1.5 px-2 rounded-xl">
              {cameraError}
            </p>
          )}

          {/* Teléfono y PIN/Folio Opcional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Teléfono (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 55 1234 5678"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                PIN / Folio (Opcional)
              </label>
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="Autogenerado (ej. 089)"
                maxLength={6}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-sky-400 placeholder-slate-600 font-zeus font-bold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Selector de Plan Oficial */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Decreto / Plan Oficial de Acceso
            </label>
            <select
              value={planOption}
              onChange={(e) => setPlanOption(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="Mensualidad|$400|30">Mensualidad Olimpo $400 MXN - 30 días</option>
              <option value="Promo Dúo|2x$700|30">Promo Dúo Olímpico 2 x $700 MXN - 30 días</option>
              <option value="Quincena|$250|15">Quincena Olimpo $250 MXN - 15 días</option>
            </select>
          </div>

          {/* Barra de Acciones Fija */}
          <div className="flex gap-2 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-sky-950/50 transition-all cursor-pointer text-center border border-sky-400/30"
            >
              Consagrar & Cobrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
