/*
 * CONFIGURATIE API
 * 
 * Aici definim URL-ul backend-ului.
 * In development folosim serverul local, in production folosim Render.
 */

// Verifica daca suntem in development sau production
const isDevelopment = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'

// URL-ul API-ului - schimba automat intre local si production
export const API_URL = isDevelopment
    ? 'http://localhost:8080'          // Pentru development local
    : 'https://aplicatie-web-backend.onrender.com'  // Pentru production

export default API_URL
