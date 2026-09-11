import bcrypt from "bcrypt";
import { HttpError } from "../middleware/error.js";
import { signToken } from "../utils/jwt.js";
import { isValidEmail, requireFields, sanitizeUser } from "../utils/http.js";
import {
  countUsers,
  createUserRecord,
  findRoleByName,
  findUserByEmail,
} from "../services/userService.js";

const SALT_ROUNDS = 12;

export async function bootstrapAdmin(req, res) {
  const missing = requireFields(req.body, ["email", "password", "full_name"]);
  if (missing.length) {
    throw new HttpError(400, `Faltan campos: ${missing.join(", ")}`);
  }

  const total = await countUsers();
  if (total > 0) {
    throw new HttpError(409, "El sistema ya tiene usuarios. Usa /api/auth/login");
  }

  const email = req.body.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new HttpError(400, "Email inválido");
  }
  if (String(req.body.password).length < 8) {
    throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres");
  }

  const adminRole = await findRoleByName("admin");
  if (!adminRole) {
    throw new HttpError(500, "No existe el rol admin. Ejecuta sql/schema.sql en Supabase");
  }

  const password_hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = await createUserRecord({
    email,
    password_hash,
    full_name: req.body.full_name.trim(),
    role_id: adminRole.id,
    is_active: true,
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.roles?.name,
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
}

export async function login(req, res) {
  const missing = requireFields(req.body, ["email", "password"]);
  if (missing.length) {
    throw new HttpError(400, `Faltan campos: ${missing.join(", ")}`);
  }

  const email = req.body.email.trim().toLowerCase();
  const user = await findUserByEmail(email);

  if (!user) {
    throw new HttpError(401, "Credenciales inválidas");
  }

  const matches = await bcrypt.compare(req.body.password, user.password_hash);
  if (!matches) {
    throw new HttpError(401, "Credenciales inválidas");
  }

  if (!user.is_active) {
    throw new HttpError(403, "La cuenta está desactivada");
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.roles?.name,
  });

  res.json({
    success: true,
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
}

export async function register(req, res) {
  const missing = requireFields(req.body, ["email", "password", "full_name"]);
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

  const viewerRole = await findRoleByName("viewer");
  if (!viewerRole) {
    throw new HttpError(500, "No existe el rol viewer. Ejecuta sql/schema.sql en Supabase");
  }

  const password_hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = await createUserRecord({
    email,
    password_hash,
    full_name: req.body.full_name.trim(),
    role_id: viewerRole.id,
    is_active: true,
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.roles?.name,
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
}

export async function me(req, res) {
  res.json({
    success: true,
    data: sanitizeUser(req.user),
  });
}
