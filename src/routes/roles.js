import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import {
  createRole,
  getRoleById,
  getRoles,
  removeRole,
  updateRole,
} from "../controllers/roleController.js";

const router = Router();

router.use(requireAuth);

router.get("/", requireRoles("admin", "editor", "viewer"), asyncHandler(getRoles));
router.get("/:id", requireRoles("admin", "editor", "viewer"), asyncHandler(getRoleById));
router.post("/", requireRoles("admin"), asyncHandler(createRole));
router.patch("/:id", requireRoles("admin"), asyncHandler(updateRole));
router.delete("/:id", requireRoles("admin"), asyncHandler(removeRole));

export default router;
