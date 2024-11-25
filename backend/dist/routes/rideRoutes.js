"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const router = (0, express_1.Router)();
router.post("/ride/estimate", rideController_1.estimateRide);
exports.default = router;
