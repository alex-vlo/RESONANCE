import bcrypt from "bcrypt";
import { HttpError } from "../middleware/error.js";
import { isValidEmail, requireFields, sanitizeUser } from "../utils/http.js";
import {
  createUserRecord,
  deleteUserRecord,
  findRoleById,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUserRecord,
} from "../services/userService.js";

const SALT_ROUNDS = 12;

export async function getUsers(req, res) {
  const users = await listUsers();
  res.json({
    success: true,
    data: users.map(sanitizeUser),
  });
}

export async function getUserById(req, res) {
  const user = await findUserById(req.params.id);
  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }
  res.json({ success: true, data: sanitizeUser(user) });
}

export async function createUser(req, res) {
  const missing = requireFields(req.body, ["email", "password", "full_name", "role_id"]);
  if (missing.length) {
    throw new HttpError(400, `Faltan campos: ${missing.join(", ")}`);
  }

  const email = req.body.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new HttpError(400, "Email inválido");
  }
  if (String(req.body.password).length < 8) {
    throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, "Ya existe un usuario con ese email");
  }

  const role = await findRoleById(req.body.role_id);
  if (!role) {
    throw new HttpError(400, "El rol indicado no existe");
  }

  const password_hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = await createUserRecord({
    email,
    password_hash,
    full_name: req.body.full_name.trim(),
    role_id: role.id,
    is_active: req.body.is_active !== false,
  });

  res.status(201).json({ success: true, data: sanitizeUser(user) });
}

export async function updateUser(req, res) {
  const current = await findUserById(req.params.id);
  if (!current) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  const payload = {};

  if (req.body.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new HttpError(400, "Email inválido");
    }
    const existing = await findUserByEmail(email);
    if (existing && existing.id !== current.id) {
      throw new HttpError(409, "Ya existe un usuario con ese email");
    }
    payload.email = email;
  }

  if (req.body.full_name !== undefined) {
    if (!String(req.body.full_name).trim()) {
      throw new HttpError(400, "El nombre no puede estar vacío");
    }
    payload.full_name = String(req.body.full_name).trim();
  }

  if (req.body.role_id !== undefined) {
    const role = await findRoleById(req.body.role_id);
    if (!role) {
      throw new HttpError(400, "El rol indicado no existe");
    }
    payload.role_id = role.id;
  }

  if (req.body.is_active !== undefined) {
    payload.is_active = Boolean(req.body.is_active);
  }

  if (Object.keys(payload).length === 0) {
    throw new HttpError(400, "No hay campos para actualizar");
  }

  const user = await updateUserRecord(req.params.id, payload);
  res.json({ success: true, data: sanitizeUser(user) });
}

export async function changePassword(req, res) {
  const missing = requireFields(req.body, ["password"]);
  if (missing.length) {
    throw new HttpError(400, "Falta el campo password");
  }
  if (String(req.body.password).length < 8) {
    throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres");
  }

  const current = await findUserById(req.params.id);
  if (!current) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  const isSelf = req.user.id === current.id;
  const isAdmin = req.user.roles?.name === "admin";
  if (!isSelf && !isAdmin) {
    throw new HttpError(403, "No puedes cambiar la contraseña de otro usuario");
  }

  const password_hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = await updateUserRecord(req.params.id, { password_hash });
  res.json({ success: true, data: sanitizeUser(user) });
}

export async function removeUser(req, res) {
  const current = await findUserById(req.params.id);
  if (!current) {
    throw new HttpError(404, "Usuario no encontrado");
  }
  if (req.user.id === current.id) {
    throw new HttpError(400, "No puedes eliminar tu propia cuenta");
  }

  await deleteUserRecord(req.params.id);
  res.json({ success: true, data: { id: req.params.id } });
}
