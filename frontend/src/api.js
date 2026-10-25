// api.js — Central API configuration for AgriGrow AI
// 
// How this works:
//   - During LOCAL development:  uses http://localhost:8000
//   - When DEPLOYED on Vercel:   uses the cloud backend URL from .env file
//   - 'import.meta.env.VITE_API_URL' reads the environment variable we set in Vercel dashboard
//
// To run locally, create a file called .env.local in the frontend/ folder:
//   VITE_API_URL=http://localhost:8000
//
// In production (Vercel), set this environment variable in the Vercel dashboard:
//   VITE_API_URL=https://agrigrow-api.onrender.com

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_BASE;
