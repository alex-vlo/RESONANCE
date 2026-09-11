import { supabase } from "../config/supabase.js";

const USER_SELECT = `
  id,
  email,
  password_hash,
  full_name,
  role_id,
  is_active,
  created_at,
  updated_at,
  roles:role_id (
    id,
    name,
    description
  )
`;

export async function findRoleByName(name) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .eq("name", name)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function findRoleById(id) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createRole({ name, description }) {
  const { data, error } = await supabase
    .from("roles")
    .insert({ name, description: description ?? null })
    .select("id, name, description, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function updateRole(id, patch) {
  const { data, error } = await supabase
    .from("roles")
    .update(patch)
    .eq("id", id)
    .select("id, name, description, created_at")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteRole(id) {
  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) throw error;
}

export async function countUsers() {
  const { count, error } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createUser(payload) {
  const { data, error } = await supabase
    .from("users")
    .insert(payload)
    .select(USER_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id, patch) {
  const { data, error } = await supabase
    .from("users")
    .update(patch)
    .eq("id", id)
    .select(USER_SELECT)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
}
