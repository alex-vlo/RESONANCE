import { HttpError } from "../middleware/error.js";
import { requireFields } from "../utils/http.js";
import {
  createRoleRecord,
  deleteRoleRecord,
  findRoleById,
  findRoleByName,
  listRoles,
  updateRoleRecord,
} from "../services/userService.js";

export async function getRoles(req, res) {
  const roles = await listRoles();
  res.json({ success: true, data: roles });
}

export async function getRoleById(req, res) {
  const role = await findRoleById(req.params.id);
  if (!role) {
    throw new HttpError(404, "Rol no encontrado");
  }
  res.json({ success: true, data: role });
}

export async function createRole(req, res) {
  const missing = requireFields(req.body, ["name"]);
  if (missing.length) {
    throw new HttpError(400, "Falta el campo name");
  }

  const name = String(req.body.name).trim().toLowerCase();
  const existing = await findRoleByName(name);
  if (existing) {
    throw new HttpError(409, "Ya existe un rol con ese nombre");
  }

  const role = await createRoleRecord({
    name,
    description: req.body.description ? String(req.body.description).trim() : null,
  });

  res.status(201).json({ success: true, data: role });
}

export async function updateRole(req, res) {
  const current = await findRoleById(req.params.id);
  if (!current) {
    throw new HttpError(404, "Rol no encontrado");
  }

  const payload = {};
  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim().toLowerCase();
    if (!name) {
      throw new HttpError(400, "El nombre del rol no puede estar vacío");
    }
    const existing = await findRoleByName(name);
    if (existing && existing.id !== current.id) {
      throw new HttpError(409, "Ya existe un rol con ese nombre");
    }
    payload.name = name;
  }
  if (req.body.description !== undefined) {
    payload.description = req.body.description
      ? String(req.body.description).trim()
      : null;
  }

  if (Object.keys(payload).length === 0) {
    throw new HttpError(400, "No hay campos para actualizar");
  }

  const role = await updateRoleRecord(req.params.id, payload);
  res.json({ success: true, data: role });
}

export async function removeRole(req, res) {
  const current = await findRoleById(req.params.id);
  if (!current) {
    throw new HttpError(404, "Rol no encontrado");
  }
  if (["admin", "editor", "viewer"].includes(current.name)) {
    throw new HttpError(400, "No se pueden eliminar los roles del sistema");
  }

  await deleteRoleRecord(req.params.id);
  res.json({ success: true, data: { id: req.params.id } });
}
