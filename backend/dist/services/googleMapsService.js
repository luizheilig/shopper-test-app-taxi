"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRouteDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchRouteDetails = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
    try {
        const response = yield axios_1.default.get(url);
        const route = response.data.routes[0];
        const leg = route.legs[0];
        return {
            origin: {
                latitude: leg.start_location.lat,
                longitude: leg.start_location.lng,
            },
            destination: {
                latitude: leg.end_location.lat,
                longitude: leg.end_location.lng,
            },
            distance: leg.distance.value / 1000,
            duration: leg.duration.text,
            routeResponse: response.data, // Original response
        };
    }
    catch (error) {
        throw new Error("Error fetching route details from Google Maps API");
    }
});
exports.fetchRouteDetails = fetchRouteDetails;
