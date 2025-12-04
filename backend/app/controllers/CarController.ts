import { Request, Response } from "express";
import Controller from "./Controller.js";
import CarModel from "../models/CarModel.js";
import { Car } from "../models/types.js";
import { Get, Post, Patch, Delete, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
import { sanitizeHTTP } from "../framework/functions.js";

@RouteController("/car")
class CarController extends Controller<CarModel> {
    constructor() {
        super(new CarModel());
    }

    // GET egy autó ID alapján
    @Get("/get/:carID", tokenHandler.authenticate.bind(tokenHandler))
    public async getCar(req: Request, res: Response) {
        try {
            const carID = parseInt(req.params.carID);
            const response = await this.model.getCar(
                carID, req.user.userID
            );

            return res.status(200).json({ data: response });
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    // GET az adott felhasználó autói
    @Get("/user", tokenHandler.authenticate.bind(tokenHandler))
    public async getCarsByUser(req: Request, res: Response) {
        try {
            const userID = req.user.userID;
            const response = await this.model.getCarsByUser(userID);

            return res.status(200).json({ data: response });
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    // CREATE új autó
    @Post("/create", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP)
    public async createCar(req: Request, res: Response) {
        try {
            const carData: Car = req.body;
            carData.userID = req.user.userID;

            const response = await this.model.createCar(carData);

            return res.status(response.status).json({insertID:response.insertID});
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    // UPDATE autó adatok
    @Patch("/update/:carID", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP)
    public async updateCar(req: Request, res: Response) {
        try {
            const carID = parseInt(req.params.carID);
            const carData: Partial<Car> = req.body;

            const response = await this.model.updateCar(carID, carData);

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    // DELETE autó
    @Delete("/delete/:carID", tokenHandler.authenticate.bind(tokenHandler))
    public async deleteCar(req: Request, res: Response) {
        try {
            const carID = parseInt(req.params.carID);
            const response = await this.model.deleteCar(carID);

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Post("/upload-images/:carID")
    public async uploadImages(req: Request, res: Response) {
        try {
            const carID = parseInt(req.params.carID);
            const response = await this.model.deleteCar(carID);

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Get("/makes-models")
    public async getAllMakesAndModels(req: Request, res: Response) {
        try {
            const makesAndModels = await this.model.getAllMakesAndModels();
            return res.status(200).json({ data: makesAndModels });
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    // 2. Endpoint autók keresésére make, model, és description keyword alapján
    @Get("/search")
    public async searchCars(req: Request, res: Response) {
        try {
            const { make, model, keyword } = req.query as any;

            const cars = await this.model.searchCars({
                make,
                model,
                keyword
            });

            return res.status(200).json({cars});
        } catch (err: any) {
            console.log(err);
            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}

export default CarController;