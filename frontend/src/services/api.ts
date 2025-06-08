import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
  },
});

export default api;
