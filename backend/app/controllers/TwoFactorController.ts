import { Request, Response } from "express";
import { Get, RouteController } from "../framework/decorators.js";
import TwoFactorModel from "../models/TwoFactorModel.js";
import Controller from "./Controller.js";
import { twoFactorKeySchema } from "./validation.js";
import { defaultValue, validateSchema } from "../framework/functions.js";
import { UserAgent } from "../models/types.js";

@RouteController("/two-factor")
export class TwoFactorController extends Controller<TwoFactorModel> {

    constructor() {
        super(new TwoFactorModel());
    }

    @Get("/login/:userID/:key", validateSchema(twoFactorKeySchema, "params"))
    public async twoFactorLogin(req: Request, res: Response) {
        try {
            const {userID, key} = req.params;
            const response = await this.model.twoFactorLogin(
                parseInt(userID), key, req.userAgent as UserAgent
            );

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
                data:{role:response.role}
            });
        } catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}