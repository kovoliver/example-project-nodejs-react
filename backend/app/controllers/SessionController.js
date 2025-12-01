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
import tokenHandler from "../framework/JWToken.js";
let SessionController = class SessionController {
    async logout(req, res) {
        try {
            await tokenHandler.logout(req.user.uuID, req.cookies.refresh_token);
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
                path: "/"
            });
            res.json({ message: "You've successfully logged out!" });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during login.",
            });
        }
    }
};
__decorate([
    Get("/logout", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "logout", null);
SessionController = __decorate([
    RouteController("/session")
], SessionController);
export default SessionController;
