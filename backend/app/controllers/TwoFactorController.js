var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Get, RouteController } from "../framework/decorators.js";
import TwoFactorModel from "../models/TwoFactorModel.js";
import Controller from "./Controller.js";
import { twoFactorKeySchema } from "./validation.js";
import { defaultValue } from "../framework/functions.js";
export let TwoFactorController = class TwoFactorController extends Controller {
    constructor() {
        super(new TwoFactorModel(), twoFactorKeySchema);
    }
    async twoFactorLogin(req, res) {
        if (this.schema === null) {
            return res.status(503).json({ message: "A szolgáltatás ideiglenesen nem érhető el!" });
        }
        try {
            const { error, value } = this.schema?.validate(req.params, { abortEarly: false });
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            // A twoFactorLogin a modelből visszaadja az access és refresh tokent
            const response = await this.model.twoFactorLogin(value.userID, value.key);
            const days = parseInt(defaultValue(process.env["REFRESH_TOKEN_DAYS"], 7));
            // Beállítjuk a refresh token-t cookie-ba
            res.cookie("refresh_token", response.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
                maxAge: days * 24 * 60 * 60 * 1000
            });
            // Az access token-t header-ben küldjük
            res.setHeader("Authorization", `Bearer ${response.accessToken}`);
            // Visszaadjuk a státuszt és egy üzenetet
            return res.status(200).json({
                status: 200,
                message: "You've logged in successfully!",
                data: { role: response.role }
            });
        }
        catch (err) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
};
__decorate([
    Get("/login/:userID/:key"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorController.prototype, "twoFactorLogin", null);
TwoFactorController = __decorate([
    RouteController("/two-factor"),
    __metadata("design:paramtypes", [])
], TwoFactorController);
