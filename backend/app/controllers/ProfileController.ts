import { Request, Response } from "express";
import Controller from "./Controller.js";
import { profileSchema, newPassSchema } from "./validation.js";
import ProfileModel from "../models/ProfileModel.js";
import { Get, Patch, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
import { TokenPayload } from "../models/types.js";
import { sanitizeHTTP } from "../framework/functions.js";
import { validateSchema } from "../framework/functions.js";

@RouteController("/profile")
class ProfileController extends Controller<ProfileModel> {
    constructor() {
        super(new ProfileModel());
    }

    @Get("/get", tokenHandler.authenticate.bind(tokenHandler))
    public async getProfile(req: Request, res: Response) {
        try {
            const user = (req as any).user as TokenPayload;

            const response = await this.model.getProfile(user.userID);

            return res.status(200).json({data:response});
        } catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Patch("/update", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP, validateSchema(profileSchema))
    public async updateProfile(req: Request, res: Response) {
        try {
            const profileData = req.body;
            const userID = (req as any).user.userID;

            const response = await this.model.updateProfile(
                profileData, userID
            );

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Patch("/update-pass", tokenHandler.authenticate.bind(tokenHandler), validateSchema(newPassSchema))
    public async changePassword(req: Request, res: Response) {
        try {
            const userID = (req as any).user.userID;

            const response = await this.model.changePassword(
                userID, req.body.pass.trim(), req.body.newPass.trim()
            );

            return res.status(response.status).json(response);
        } catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}

export default ProfileController;