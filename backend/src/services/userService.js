import { supabase } from "../config/supabase.js";
import { HttpError } from "../middleware/error.js";

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

function handleSupabaseError(error, fallback = "Error de base de datos") {
  if (!error) return;
  throw new HttpError(400, error.message || fallback);
}

export async function countUsers() {
  const { count, error } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  handleSupabaseError(error, "No se pudo contar usuarios");
  return count ?? 0;
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("email", email)
    .maybeSingle();

  handleSupabaseError(error, "No se pudo buscar el usuario");
  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("id", id)
    .maybeSingle();

  handleSupabaseError(error, "No se pudo buscar el usuario");
  return data;
}

export async function listUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .order("created_at", { ascending: false });

  handleSupabaseError(error, "No se pudieron listar usuarios");
  return data ?? [];
}

export async function createUserRecord(payload) {
  const { data, error } = await supabase
    .from("users")
    .insert(payload)
    .select(USER_SELECT)
    .single();

  handleSupabaseError(error, "No se pudo crear el usuario");
  return data;
}

export async function updateUserRecord(id, payload) {
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", id)
    .select(USER_SELECT)
    .single();

  handleSupabaseError(error, "No se pudo actualizar el usuario");
  return data;
}

export async function deleteUserRecord(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  handleSupabaseError(error, "No se pudo eliminar el usuario");
}

export async function findRoleById(id) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .eq("id", id)
    .maybeSingle();

  handleSupabaseError(error, "No se pudo buscar el rol");
  return data;
}

export async function findRoleByName(name) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .eq("name", name)
    .maybeSingle();

  handleSupabaseError(error, "No se pudo buscar el rol");
  return data;
}

export async function listRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .order("name");

  handleSupabaseError(error, "No se pudieron listar roles");
  return data ?? [];
}

export async function createRoleRecord(payload) {
  const { data, error } = await supabase
    .from("roles")
    .insert(payload)
    .select("id, name, description, created_at")
    .single();

  handleSupabaseError(error, "No se pudo crear el rol");
  return data;
}

export async function updateRoleRecord(id, payload) {
  const { data, error } = await supabase
    .from("roles")
    .update(payload)
    .eq("id", id)
    .select("id, name, description, created_at")
    .single();

  handleSupabaseError(error, "No se pudo actualizar el rol");
  return data;
}

export async function deleteRoleRecord(id) {
  const { error } = await supabase.from("roles").delete().eq("id", id);
  handleSupabaseError(error, "No se pudo eliminar el rol");
}
