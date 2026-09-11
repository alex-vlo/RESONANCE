import { verifyToken } from "../utils/jwt.js";
import { HttpError } from "./error.js";
import { findUserById } from "../services/userService.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Se requiere un token Bearer");
    }

    const payload = verifyToken(token);
    const user = await findUserById(payload.sub);

    if (!user || !user.is_active) {
      throw new HttpError(401, "Usuario no autorizado");
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    const roleName = req.user?.roles?.name;
    if (!roleName || !roles.includes(roleName)) {
      return next(new HttpError(403, "No tienes permisos para esta acción"));
    }
    next();
  };
}
