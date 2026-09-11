import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { bootstrapAdmin, login, me, register } from "../controllers/authController.js";

const router = Router();

router.post("/bootstrap", asyncHandler(bootstrapAdmin));
router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
