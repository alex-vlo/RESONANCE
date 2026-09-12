import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import {
  changePassword,
  createUser,
  getUserById,
  getUsers,
  removeUser,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

router.use(requireAuth);

router.get("/", requireRoles("admin", "editor", "viewer"), asyncHandler(getUsers));
router.get("/:id", requireRoles("admin", "editor", "viewer"), asyncHandler(getUserById));
router.post("/", requireRoles("admin"), asyncHandler(createUser));
router.patch("/:id", requireRoles("admin", "editor"), asyncHandler(updateUser));
router.patch("/:id/password", asyncHandler(changePassword));
router.delete("/:id", requireRoles("admin"), asyncHandler(removeUser));

export default router;
