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
import { profileSchema, newPassSchema, emailSchema } from "./validation.js";
import ProfileModel from "../models/ProfileModel.js";
import { Get, Patch, Post, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
import { sanitizeHTTP } from "../framework/functions.js";
import { validateSchema } from "../framework/functions.js";
import { uploadErrorHandler, multerErrorHandler, upload } from "../framework/FileHandler.js";
let ProfileController = class ProfileController extends Controller {
    constructor() {
        super(new ProfileModel());
    }
    async getProfile(req, res) {
        try {
            const response = await this.model.getProfile(req.user.userID);
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
        try {
            const profileData = req.body;
            const userID = req.user.userID;
            const response = await this.model.updateProfile(profileData, userID);
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
    async changePassword(req, res) {
        try {
            const userID = req.user.userID;
            const response = await this.model.changePassword(userID, req.body.pass, req.body.newPass);
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
    async changeEmail(req, res) {
        try {
            const userID = req.user.userID;
            const response = await this.model.changeEmail(userID, req.body.email, req.body.pass);
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
    async uploadProfileImage(req, res) {
        try {
            //console.log(req.files);
            return res.status(200).json({ message: "hey hey" });
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
    Patch("/update", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP, validateSchema(profileSchema, "body")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    Patch("/update-pass", tokenHandler.authenticate.bind(tokenHandler), validateSchema(newPassSchema, "body")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
__decorate([
    Patch("/update-email", tokenHandler.authenticate.bind(tokenHandler), validateSchema(emailSchema, "body")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changeEmail", null);
__decorate([
    Post("/profile-image", upload.array("profileImage", 10), multerErrorHandler, uploadErrorHandler),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadProfileImage", null);
ProfileController = __decorate([
    RouteController("/profile"),
    __metadata("design:paramtypes", [])
], ProfileController);
export default ProfileController;
