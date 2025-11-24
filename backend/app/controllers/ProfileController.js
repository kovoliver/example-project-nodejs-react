var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Controller from "./Controller.js";
import { profileSchema } from "./validation.js";
import ProfileModel from "../models/ProfileModel.js";
import { Get, Patch, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
let ProfileController = class ProfileController extends Controller {
    constructor() {
        super(new ProfileModel(), profileSchema);
    }
    async getProfile(req, res) {
        try {
            const user = req.user;
            const response = await this.model.getProfile(user.userID);
            return res.status(200).json({ data: response });
        }
        catch (err) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
    async updateProfile(req, res) {
        if (this.schema === null) {
            return res.status(503).json({ message: "A szolgáltatás ideiglenesen nem érhető el!" });
        }
        try {
            const { value, error } = this.schema?.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            const response = await this.model.updateProfile(value);
            return res.status(response.status).json(response);
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
    Get("/get", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    Patch("/update", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
ProfileController = __decorate([
    RouteController("/profile"),
    __metadata("design:paramtypes", [])
], ProfileController);
export default ProfileController;
