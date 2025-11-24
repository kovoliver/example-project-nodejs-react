import { Request, Response } from "express";
import Controller from "./Controller.js";
import { profileSchema } from "./validation.js";
import ProfileModel from "../models/ProfileModel.js";

class ProfileController extends Controller<ProfileModel> {
    constructor() {
        super(new ProfileModel(), profileSchema);
    }

    public async updateProfile(req: Request, res: Response) {
        if (this.schema === null) {
            return res.status(503).json({ message: "A szolgáltatás ideiglenesen nem érhető el!" });
        }

        try {
            const { value, error } = this.schema?.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({ message: error.details });
            }

            const response = await this.model.updateProfile(value);

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