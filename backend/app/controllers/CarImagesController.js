var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Delete, Get, Patch, Post, RouteController } from "../framework/decorators.js";
import { multerErrorHandler, upload, uploadErrorHandler } from "../framework/FileHandler.js";
import tokenHandler from "../framework/JWToken.js";
import CarImagesModel from "../models/CarImagesModel.js";
import Controller from "./Controller.js";
let CarImagesController = class CarImagesController extends Controller {
    constructor() {
        super(new CarImagesModel());
    }
    async uploadImages(req, res) {
        try {
            const carID = Number(req.params.carID || 0);
            const files = req.files;
            const response = await this.model.storeImages(carID, files);
            return res.status(200).json({ message: response.message, images: response.data });
        }
        catch (err) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
    async setMainImage(req, res) {
        try {
            const imageID = Number(req.params.imageID);
            const carID = Number(req.params.carID);
            const response = await this.model.updateMainImage(imageID, carID, req.user.userID);
            return res.status(200).json({ message: response.message, image: response.data });
        }
        catch (err) {
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
    async getImagesByCar(req, res) {
        try {
            const carID = Number(req.params.carID);
            const userID = req.user.userID;
            const response = await this.model.getImagesByCar(carID, userID);
            return res.status(200).json({ images: response.data });
        }
        catch (err) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
    async deleteImage(req, res) {
        try {
            const imageID = parseInt(req.params.imageID || "0");
            const response = await this.model.deleteImage(imageID, req.user.userID);
            res.status(response.status).json({ message: response.message });
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
    Post("/upload/:carID", tokenHandler.authenticate.bind(tokenHandler), upload.array("car_images", 10), multerErrorHandler, uploadErrorHandler),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarImagesController.prototype, "uploadImages", null);
__decorate([
    Patch("/set-main/:imageID/:carID", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarImagesController.prototype, "setMainImage", null);
__decorate([
    Get("/:carID", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarImagesController.prototype, "getImagesByCar", null);
__decorate([
    Delete("/delete/:imageID", tokenHandler.authenticate.bind(tokenHandler)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarImagesController.prototype, "deleteImage", null);
CarImagesController = __decorate([
    RouteController("/car_images"),
    __metadata("design:paramtypes", [])
], CarImagesController);
export default CarImagesController;
