import { Router } from "express";
import { signup, verifyOtp, signin, refreshTokenHandler, logout } from "./auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

export default router;
