import Controller from "./Controller.js";
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
import { HTTPResponse } from "../models/types.js";

class UserHandlerController extends Controller {
    private model: UserHandlerModel;

    constructor() {
        super(userSchema);
        this.model = new UserHandlerModel();

        // Endpoint létrehozása a konstruktorban
        this.http.post("/user/register", this.register.bind(this));
    }

    private async register(req: any, res: any) {
        try {
            const { error, value } = this.schema.validate(req.body, { abortEarly: false });

            delete value.passAgain;
            
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: error.details.map((d: any) => d.message)
                });
            }

            const response: HTTPResponse = await this.model.register(value);

            return res.status(response.status).json(response);
        } catch (err: any) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}

export default UserHandlerController;