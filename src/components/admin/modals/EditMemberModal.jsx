import React, { useState, useEffect, useRef } from 'react';

export default function EditMemberModal({ isOpen, onClose, member, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState('');
  const [days, setDays] = useState(0);
  const [isInside, setIsInside] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setPhone(member.phone || '');
      setPhoto(member.photo || '');
      setPlan(member.plan || 'Mensualidad Olimpo');
      setPrice(member.price || '$400');
      setDays(member.days !== undefined ? member.days : 30);
      setIsInside(!!member.isInside);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const minSide = Math.min(img.width || 300, img.height || 300);
        const sx = ((img.width || 300) - minSide) / 2;
        const sy = ((img.height || 300) - minSide) / 2;
        ctx.fillStyle = '#FAF9F5';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 300, 300);
        setPhoto(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: member.id,
      name: name.trim() || member.name,
      phone: phone.trim(),
      photo: photo || member.photo,
      plan: plan.trim() || member.plan,
      price: price.trim() || member.price,
      days: parseInt(days, 10) || 0,
      isInside
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 olympus-modal-backdrop z-[110] flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-hidden font-body text-slate-800">
      <div className="olympus-modal-frame rounded-3xl w-full max-w-lg relative my-auto max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Cabecera Fija */}
        <div className="p-4 sm:p-5 border-b-2 border-[#D4AF37] flex items-center justify-between shrink-0 bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#162A4A] to-[#0F1E36] border border-[#C5A059] flex items-center justify-center text-[#D4AF37] text-sm shadow-sm">
              <i className="fa-solid fa-user-pen text-[#FFD700]"></i>
            </div>
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-black text-white leading-tight">
                Editar Datos del Atleta
              </h3>
              <p className="text-[11px] text-slate-300">ID Oficial: #{member.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Cuerpo con Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          {/* SECCIÓN HERO: FOTO Y NOMBRE */}
          <div className="bg-white border border-[#C5A059] rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 shadow-sm">
            {/* Foto Avatar */}
            <div className="relative shrink-0 group">
              <img
                src={photo || member.photo}
                alt={name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#C5A059] bg-[#EAE7DC] shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                title="Cambiar Foto"
              >
                <i className="fa-solid fa-camera mb-0.5"></i>
                <span>Foto</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0F1E36] hover:bg-[#162A4A] text-[#F3E5AB] flex items-center justify-center text-[10px] border border-[#C5A059] shadow sm:hidden cursor-pointer"
                title="Cambiar Foto"
              >
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Nombre y Badge ID */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-[#0F1E36] block">
                  Nombre Completo
                </label>
                <span className="text-[9px] font-cinzel font-bold px-1.5 py-0.5 rounded bg-[#EAE7DC] text-[#0F1E36] border border-[#C5A059]/40">
                  ID: #{member.id}
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del atleta"
                className="w-full bg-[#FAF9F5] border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#0F1E36] font-cinzel font-black tracking-wide focus:outline-none transition-colors"
                required
              />
              <span className="text-[10px] text-slate-500 block truncate font-medium">
                Toca la foto para actualizar la captura sagrada
              </span>
            </div>
          </div>

          {/* Teléfono y Presencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 block mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 55 1234 5678"
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-bold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 block mb-1">
                Presencia Actual
              </label>
              <select
                value={isInside ? 'true' : 'false'}
                onChange={(e) => setIsInside(e.target.value === 'true')}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-bold focus:outline-none cursor-pointer"
              >
                <option value="true">Dentro del Olimpo (Entrenando)</option>
                <option value="false">Fuera del Santuario</option>
              </select>
            </div>
          </div>

          {/* Plan y Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 block mb-1">
                Decreto / Plan Activo
              </label>
              <input
                type="text"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-bold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 block mb-1">
                Tarifa Registrada
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-cinzel font-bold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Días Restantes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 block">
                Días Restantes de Acceso
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setDays((prev) => Math.max(0, parseInt(prev, 10) || 0) + 15)}
                  className="text-[10px] bg-white hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] px-2.5 py-0.5 rounded cursor-pointer font-bold font-cinzel shadow-sm"
                >
                  +15d
                </button>
                <button
                  type="button"
                  onClick={() => setDays((prev) => Math.max(0, parseInt(prev, 10) || 0) + 30)}
                  className="text-[10px] bg-white hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] px-2.5 py-0.5 rounded cursor-pointer font-bold font-cinzel shadow-sm"
                >
                  +30d
                </button>
              </div>
            </div>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-cinzel font-bold focus:outline-none transition-colors"
            />
          </div>

          {/* Barra de Acciones */}
          <div className="flex items-center gap-2 pt-3 border-t border-[#C5A059]/30">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(member.id);
                  onClose();
                }}
                className="bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 font-bold text-xs p-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                title="Dar de baja atleta permanentemente"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-[#F3EFE6] border border-[#C5A059] text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-gold-olympus font-cinzel font-black text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
