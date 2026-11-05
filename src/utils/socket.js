// src/utils/socket.js
import { io } from 'socket.io-client';

const getBackendUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  const { protocol, hostname, port, origin } = window.location;
  // Si se ejecuta desde Vite en desarrollo (5173), redirigir al backend en el puerto 3000 de la misma IP/host
  if (port === '5173') {
    return `${protocol}//${hostname}:3000`;
  }
  // En producción servido desde Express (puerto 3000), usar el mismo origen
  return origin;
};

export const BACKEND_URL = getBackendUrl();

export const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});

export default socket;
