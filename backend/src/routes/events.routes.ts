import { Router } from "express";
import { listPublicEvents } from "../controllers/event.controller";

const router = Router();

router.get("/public", listPublicEvents);

export default router;
















