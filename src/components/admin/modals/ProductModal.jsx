import React, { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Néctar & Suplementos');
  const [price, setPrice] = useState(30);
  const [stock, setStock] = useState(15);
  const [icon, setIcon] = useState('fa-bottle-water');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Néctar & Suplementos');
      setPrice(product.price || 30);
      setStock(product.stock !== undefined ? product.stock : 10);
      setIcon(product.icon || 'fa-bottle-water');
      setColor(product.color || 'blue');
    } else {
      setName('');
      setCategory('Néctar & Suplementos');
      setPrice(40);
      setStock(15);
      setIcon('fa-bolt-lightning');
      setColor('amber');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Escribe el nombre del producto.');
    onSave({
      id: product ? product.id : null,
      name: name.trim(),
      category: category.trim() || 'General',
      price: parseInt(price) || 20,
      stock: Math.max(0, parseInt(stock) || 0),
      icon,
      color
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn font-body text-slate-800">
      <div className="bg-[#FAF9F5] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#0F1E36] text-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h4 className="font-cinzel text-lg font-black text-[#0F1E36] mb-1">
          {product ? 'Editar Producto / Existencias' : 'Nuevo Néctar / Suplemento'}
        </h4>
        <p className="text-xs text-slate-600 mb-4">Administra precio, existencias e ícono del catálogo del Olimpo</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ambrosía Proteica o Rayo Pre-Entreno"
              className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-bold transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] transition-colors font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Precio ($ MXN)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3 py-2 text-xs text-[#0F1E36] font-cinzel font-black transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-2.5 py-2 text-xs text-[#0F1E36] font-bold transition-colors font-cinzel"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Ícono</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-2 py-2 text-xs text-[#0F1E36] cursor-pointer"
              >
                <option value="fa-bolt-lightning">Rayo Divino</option>
                <option value="fa-bottle-water">Agua Sagrada</option>
                <option value="fa-jar">Proteína / Ambrosía</option>
                <option value="fa-wine-bottle">Néctar / Botella</option>
                <option value="fa-capsules">Cápsulas</option>
                <option value="fa-rug">Toalla Oficial</option>
                <option value="fa-lock">Candado Olimpo</option>
                <option value="fa-shield-halved">Escudo Zeus</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 uppercase font-black font-cinzel block mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-2 py-2 text-xs text-[#0F1E36] font-bold cursor-pointer"
              >
                <option value="blue">Azul Celestial</option>
                <option value="amber">Ámbar Rayo</option>
                <option value="emerald">Esmeralda</option>
                <option value="purple">Morado Néctar</option>
                <option value="rose">Rosa / Carmesí</option>
                <option value="stone">Acero</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-[#F3EFE6] border border-[#C5A059] text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-gold-olympus font-cinzel font-black text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
