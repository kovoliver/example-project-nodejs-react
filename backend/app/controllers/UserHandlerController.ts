import Controller from "./Controller.js";
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
import { HTTPResponse } from "../models/types.js";
import { Get, Post, RouteController } from "../framework/decorators.js";
import { sanitizeHTTP, validateSchema } from "../framework/functions.js";
import { Request, Response } from "express";

@RouteController("/user")
class UserHandlerController extends Controller<UserHandlerModel> {
    constructor() {
        super(new UserHandlerModel() as UserHandlerModel);
    }

    @Post("/register", sanitizeHTTP, validateSchema(userSchema, "body"))
    public async register(req: Request, res: Response) {
        try {
            const response: HTTPResponse = await this.model.register(req.body);

            return res.status(response.status).json(response);
        } catch (err: any) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Get("/confirm-registration/:userID/:code")
    public async confirmRegistration(req: Request, res: Response) {
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
            const response: HTTPResponse = await this.model.confirmRegistration(parseInt(userID), code);

            return res.status(response.status).json(response);
        } catch (err: any) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during confirmation."
            });
        }
    }

    @Post("/login")
    public async login(req: Request, res: Response) {
        try {
            const { email, pass } = req.body;

            if (!email || !pass) {
                return res.status(400).json({
                    status: 400,
                    message: "Email and password are required.",
                });
            }

            // Meghívjuk a Model.login metódust
            const response: HTTPResponse = await this.model.login(email, pass);

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during login.",
            });
        }
    }
}

export default UserHandlerController;