import { Router } from "express";
import { getMenuQr } from "../controllers/qr.controller";

const router = Router();

router.get("/menu", getMenuQr);

export default router;














