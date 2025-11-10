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
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
import { Get, Post, RouteController } from "../framework/decorators.js";
let UserHandlerController = class UserHandlerController extends Controller {
    model;
    constructor() {
        super(userSchema);
        this.model = new UserHandlerModel();
    }
    async register(req, res) {
        try {
            const { error, value } = this.schema.validate(req.body, { abortEarly: false });
            let messages = [];
            delete value.passAgain;
            const exists = await this.model.checkExists("email", value.email);
            messages = error ? error.details.map((d) => d.message) : [];
            if (exists)
                messages.push("A megadott email cím már regisztrálva van egy másik felhasználóhoz!");
            if (messages.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: messages
                });
            }
            const response = await this.model.register(value);
            return res.status(response.status).json(response);
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error"
            });
        }
    }
    async confirmRegistration(req, res) {
        try {
            // A userID és a code jön a query paraméterekből (pl. /user/confirm-registration?userID=12&code=abcd123)
            const { userID, code } = req.params;
            if (!userID || !code) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing userID or confirmation code."
                });
            }
            // Meghívjuk a model metódusát
            const response = await this.model.confirmRegistration(parseInt(userID), code);
            return res.status(response.status).json(response);
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during confirmation."
            });
        }
    }
    async login(req, res) {
        try {
            const { email, pass } = req.body;
            if (!email || !pass) {
                return res.status(400).json({
                    status: 400,
                    message: "Email and password are required.",
                });
            }
            // Meghívjuk a Model.login metódust
            const response = await this.model.login(email, pass);
            return res.status(response.status).json(response);
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
    Post("/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandlerController.prototype, "register", null);
__decorate([
    Get("/confirm-registration/:userID/:code"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandlerController.prototype, "confirmRegistration", null);
__decorate([
    Get("/confirm-registration/:userID/:code"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandlerController.prototype, "login", null);
UserHandlerController = __decorate([
    RouteController("/user"),
    __metadata("design:paramtypes", [])
], UserHandlerController);
export default UserHandlerController;
