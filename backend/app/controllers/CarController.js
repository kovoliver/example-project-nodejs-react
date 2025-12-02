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
import CarModel from "../models/CarModel.js";
import { Get, Post, Patch, Delete, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
import { sanitizeHTTP } from "../framework/functions.js";
let CarController = class CarController extends Controller {
    constructor() {
        super(new CarModel());
    }
    // GET egy autó ID alapján
    async getCar(req, res) {
        try {
            const carID = parseInt(req.params.carID);
            const response = await this.model.getCar(carID, req.user.userID);
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
    // GET az adott felhasználó autói
    async getCarsByUser(req, res) {
        try {
            const userID = req.user.userID;
            const response = await this.model.getCarsByUser(userID);
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
    // CREATE új autó
    async createCar(req, res) {
        try {
            const carData = req.body;
            carData.userID = req.user.userID;
            const response = await this.model.createCar(carData);
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
    // UPDATE autó adatok
    async updateCar(req, res) {
        try {
            const carID = parseInt(req.params.carID);
            const carData = req.body;
            const response = await this.model.updateCar(carID, carData);
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
    // DELETE autó
    async deleteCar(req, res) {
        try {
            const carID = parseInt(req.params.carID);
            const response = await this.model.deleteCar(carID);
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
    Get("/get/:carID", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getCar", null);
__decorate([
    Get("/user", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getCarsByUser", null);
__decorate([
    Post("/create", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "createCar", null);
__decorate([
    Patch("/update/:carID", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "updateCar", null);
__decorate([
    Delete("/delete/:carID", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "deleteCar", null);
CarController = __decorate([
    RouteController("/car"),
    __metadata("design:paramtypes", [])
], CarController);
export default CarController;
