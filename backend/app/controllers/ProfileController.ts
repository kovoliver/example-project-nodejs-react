import { Request, Response } from "express";
import Controller from "./Controller.js";
import { profileSchema, newPassSchema, emailSchema } from "./validation.js";
import ProfileModel from "../models/ProfileModel.js";
import { Get, Patch, Post, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";
import { sanitizeHTTP } from "../framework/functions.js";
import { validateSchema } from "../framework/functions.js";
import { uploadErrorHandler, multerErrorHandler, upload } from "../framework/FileHandler.js";

@RouteController("/profile")
class ProfileController extends Controller<ProfileModel> {
    constructor() {
        super(new ProfileModel());
    }

    @Get("/get", tokenHandler.authenticate.bind(tokenHandler))
    public async getProfile(req: Request, res: Response) {
        try {
            const response = await this.model.getProfile(req.user.userID);

            return res.status(200).json({data:response});
        } catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }

    @Patch("/update", tokenHandler.authenticate.bind(tokenHandler), sanitizeHTTP, validateSchema(profileSchema, "body"))
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

    @Patch("/update-pass", tokenHandler.authenticate.bind(tokenHandler), validateSchema(newPassSchema, "body"))
    public async changePassword(req: Request, res: Response) {
        try {
            const userID = (req as any).user.userID;

            const response = await this.model.changePassword(
                userID, req.body.pass, req.body.newPass
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

    @Patch("/update-email", tokenHandler.authenticate.bind(tokenHandler), validateSchema(emailSchema, "body"))
    public async changeEmail(req: Request, res: Response) {
        try {
            const userID = (req as any).user.userID;

            const response = await this.model.changeEmail(
                userID, req.body.email, req.body.pass
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

    @Post("/profile-image", upload.array("profileImage", 10), multerErrorHandler, uploadErrorHandler)
    public async uploadProfileImage(req: Request, res: Response) {
        try {
            //console.log(req.files);
            
            return res.status(200).json({message:"hey hey"});
        }  catch (err: any) {
            console.log(err);

            return res.status(err.status || 500).json({
                status: err.status || 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}

export default ProfileController;