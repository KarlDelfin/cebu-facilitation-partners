import { supabase } from '@/utils/supabaseClient';
import moment from 'moment';

/**
 * Fetch paginated services with optional search filter
 */
export async function fetchServices({ currentPage, elementsPerPage, searchQuery }) {
  const limit = elementsPerPage;
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('Service')
    .select('*', { count: 'exact' });

  if (searchQuery && searchQuery.trim() !== '') {
    query = query.ilike('name', `%${searchQuery.trim()}%`);
  }

  query = query.order('dateTimeCreated', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const formattedData = (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    dateTimeCreated: item.dateTimeCreated 
      ? moment(item.dateTimeCreated).format('MMMM DD, YYYY HH:mm:ss')
      : ''
  }));

  return {
    services: formattedData,
    totalElements: count || 0
  };
}

/**
 * Create a new service record
 */
export async function createService(serviceData) {
  const payload = {
    name: serviceData.name,
    description: serviceData.description,
    price: Number(serviceData.price),
  };

  const { data, error } = await supabase
    .from('Service')
    .insert(payload);

  if (error) throw error;
  return data;
}

/**
 * Update an existing service record
 */
export async function updateService(id, serviceData) {
  const payload = {
    name: serviceData.name,
    description: serviceData.description,
    price: Number(serviceData.price),
  };

  const { data, error } = await supabase
    .from('Service')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
  return data;
}

/**
 * Delete a service record by ID
 */
export async function deleteServiceById(id) {
  const { data, error } = await supabase
    .from('Service')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
}