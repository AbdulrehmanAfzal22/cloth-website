import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://oapkgdvsnpakpackmgcs.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_J-xAECaiKT2anzSNNA3weA_u0Wq3YND',
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
);
export const imageUrl = path => path ? supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl : null;
export const categoryImageUrl = path => path ? supabase.storage.from('category-images').getPublicUrl(path).data.publicUrl : null;
export function unwrap({data,error}) { if(error) throw error; return data; }
export const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((cents||0)/100);
