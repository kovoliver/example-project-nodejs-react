import Controller from "./Controller.js";
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
class UserHandlerController extends Controller {
    model;
    constructor() {
        super(userSchema);
        this.model = new UserHandlerModel();
        // Endpoint létrehozása a konstruktorban
        this.http.post("/user/register", this.register.bind(this));
    }
    async register(req, res) {
        try {
            const { error, value } = this.schema.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: error.details.map((d) => d.message)
                });
            }
            const response = await this.model.register(value);
            return res.status(response.status).json(response);
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error"
            });
        }
    }
}
export default UserHandlerController;
