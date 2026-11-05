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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#090e1a] border border-sky-500/30 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h4 className="font-zeus text-lg font-black text-white mb-1">
          {product ? 'Editar Producto / Existencias' : 'Nuevo Néctar / Suplemento'}
        </h4>
        <p className="text-xs text-slate-400 mb-4">Administra precio, existencias e ícono del catálogo del Olimpo</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ambrosía Proteica o Rayo Pre-Entreno"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white font-bold transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Precio ($ MXN)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-emerald-400 font-zeus font-bold transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-2.5 py-2 text-xs text-white font-bold transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Ícono</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-2 py-2 text-xs text-white cursor-pointer"
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
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl px-2 py-2 text-xs text-white font-bold cursor-pointer"
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
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-950/50 border border-sky-400/30"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
