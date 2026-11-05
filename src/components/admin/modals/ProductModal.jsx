import React, { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Suplementos');
  const [price, setPrice] = useState(30);
  const [stock, setStock] = useState(15);
  const [icon, setIcon] = useState('fa-bottle-water');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Suplementos');
      setPrice(product.price || 30);
      setStock(product.stock !== undefined ? product.stock : 10);
      setIcon(product.icon || 'fa-bottle-water');
      setColor(product.color || 'blue');
    } else {
      setName('');
      setCategory('Suplementos');
      setPrice(40);
      setStock(15);
      setIcon('fa-capsules');
      setColor('emerald');
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
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-500 hover:text-white text-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h4 className="font-gears text-lg font-black text-white mb-1">
          {product ? 'Editar Producto / Existencias' : 'Nuevo Producto Arsenal'}
        </h4>
        <p className="text-xs text-stone-400 mb-4">Administra precio, existencias e ícono del catálogo</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Barra de Proteína"
              className="w-full bg-[#111] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Precio ($ MXN)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#111] border border-stone-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-gears font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#111] border border-stone-800 rounded-xl px-2.5 py-2 text-xs text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Ícono</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-[#111] border border-stone-800 rounded-xl px-2 py-2 text-xs text-white"
              >
                <option value="fa-bottle-water">Botella</option>
                <option value="fa-bolt">Pre-Entreno</option>
                <option value="fa-jar">Proteína</option>
                <option value="fa-capsules">Cápsulas</option>
                <option value="fa-rug">Toalla</option>
                <option value="fa-lock">Candado</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#111] border border-stone-800 rounded-xl px-2 py-2 text-xs text-white font-bold"
              >
                <option value="blue">Azul</option>
                <option value="rose">Rojo/Rosa</option>
                <option value="amber">Ámbar</option>
                <option value="emerald">Verde</option>
                <option value="purple">Morado</option>
                <option value="stone">Gris</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
