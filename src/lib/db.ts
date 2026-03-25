import { supabase } from './supabase';

// ============ BRANCHES ============
export async function getBranches() {
  const { data, error } = await supabase
    .from('branches_sarpras')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getBranchById(id: string) {
  const { data, error } = await supabase
    .from('branches_sarpras')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// ============ LOCATIONS ============
export async function getLocationsByBranch(branchId: string) {
  const { data, error } = await supabase
    .from('locations_sarpras')
    .select('*')
    .eq('branch_id', branchId)
    .order('name');
  
  if (error) throw error;
  return data;
}

// ============ INVENTORY ITEMS ============
export async function getInventoryItems(branchId?: string) {
  let query = supabase
    .from('inventory_items_sarpras')
    .select(`
      *,
      branch:branches_sarpras(id, name, code),
      location:locations_sarpras(id, name)
    `)
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getInventoryItemById(id: string) {
  const { data, error } = await supabase
    .from('inventory_items_sarpras')
    .select(`
      *,
      branch:branches_sarpras(id, name, code),
      location:locations_sarpras(id, name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createInventoryItem(item: {
  branch_id: string;
  location_id: string;
  name: string;
  description?: string;
  quantity: number;
  status: string;
  image_url?: string;
  created_by?: string;
}) {
  console.log('Creating inventory item with data:', item);
  
  const { data, error } = await supabase
    .from('inventory_items_sarpras')
    .insert([item])
    .select()
    .single();
  
  if (error) {
    console.error('Supabase error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      fullError: error
    });
    throw new Error(error.message || error.code || 'Failed to create inventory item');
  }
  return data;
}

export async function updateInventoryItem(id: string, updates: any) {
  const { data, error } = await supabase
    .from('inventory_items_sarpras')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase
    .from('inventory_items_sarpras')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ============ REPORTS ============
export async function getReports(branchId?: string) {
  let query = supabase
    .from('reports_sarpras')
    .select(`
      *,
      branch:branches_sarpras(id, name, code)
    `)
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getReportById(id: string) {
  const { data, error } = await supabase
    .from('reports_sarpras')
    .select(`
      *,
      branch:branches_sarpras(id, name, code)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createReport(report: {
  branch_id: string;
  title: string;
  description?: string;
  file_url?: string;
  created_by?: string;
}) {
  console.log('Creating report with data:', report);
  
  const { data, error } = await supabase
    .from('reports_sarpras')
    .insert([report])
    .select()
    .single();
  
  if (error) {
    console.error('Supabase error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      fullError: error
    });
    throw new Error(error.message || error.code || 'Failed to create report');
  }
  return data;
}

export async function updateReport(id: string, updates: any) {
  const { data, error } = await supabase
    .from('reports_sarpras')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteReport(id: string) {
  const { error } = await supabase
    .from('reports_sarpras')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
