import { Request, Response } from "express";
import { Get, RouteController } from "../framework/decorators.js";
import TwoFactorModel from "../models/TwoFactorModel.js";
import Controller from "./Controller.js";
import { twoFactorKeySchema } from "./validation.js";
import { defaultValue } from "../framework/functions.js";

@RouteController("/two-factor")
export class TwoFactorController extends Controller<TwoFactorModel> {

    constructor() {
        super(new TwoFactorModel(), twoFactorKeySchema);
    }

    @Get("/login/:userID/:key")
    public async twoFactorLogin(req: Request, res: Response) {
        if (this.schema === null) {
            return res.status(503).json({ message: "A szolgáltatás ideiglenesen nem érhető el!" });
        }

        try {
            const { error, value } = this.schema?.validate(req.params, { abortEarly: false });

            if (error) {
                return res.status(400).json({ message: error.details });
            }

            // A twoFactorLogin a modelből visszaadja az access és refresh tokent
            const response = await this.model.twoFactorLogin(value.userID, value.key);
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