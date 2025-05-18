// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // ✅ Allow cookies/auth headers (important for CORS & login sessions)
});

export default API;
