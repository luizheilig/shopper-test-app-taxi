import { Router } from "express";
import { estimateRide } from "../controllers/rideController";

const router = Router();

router.post("/ride/estimate", estimateRide);

export default router;
