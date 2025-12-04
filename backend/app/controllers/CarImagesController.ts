import { Delete, Get, Patch, Post, RouteController } from "../framework/decorators.js";
import { multerErrorHandler, upload, uploadErrorHandler } from "../framework/FileHandler.js";
import tokenHandler from "../framework/JWToken.js";
import CarImagesModel from "../models/CarImagesModel.js";
import Controller from "./Controller.js";
import { Request, Response } from "express";

@RouteController("/car_images")
class CarImagesController extends Controller<CarImagesModel> {
    constructor() {
        super(new CarImagesModel());
    }

    @Post("/upload/:carID", tokenHandler.authenticate.bind(tokenHandler), upload.array("car_images", 10), multerErrorHandler, uploadErrorHandler)
    public async uploadImages(req: Request, res: Response) {
        try {
            const carID = Number(req.params.carID||0);
            const files = req.files as Express.Multer.File[];

            const response = await this.model.storeImages(carID, files);

            return res.status(200).json({ message: response.message, images: response.data });
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    
    @Patch("/set-main/:imageID/:carID", tokenHandler.authenticate.bind(tokenHandler))
    public async setMainImage(req: Request, res: Response) {
        try {
            const imageID = Number(req.params.imageID);
            const carID = Number(req.params.carID);

            const response = await this.model.updateMainImage(
                imageID, carID, req.user.userID
            );

            return res.status(200).json({ message: response.message, image: response.data });
        } catch (err: any) {
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Get("/:carID", tokenHandler.authenticate.bind(tokenHandler))
    public async getImagesByCar(req: Request, res: Response) {
        try {
            const carID = Number(req.params.carID);
            const userID = (req as any).user.userID;

            const response = await this.model.getImagesByCar(carID, userID);

            return res.status(200).json({ images: response.data });
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Delete("/delete/:imageID", tokenHandler.authenticate.bind(tokenHandler))
    public async deleteImage(req: Request, res: Response) {
        try {
            const imageID = parseInt(req.params.imageID||"0");

            const response = await this.model.deleteImage(
                imageID, req.user.userID
            );

            res.status(response.status).json({message:response.message});
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}

export default CarImagesController;