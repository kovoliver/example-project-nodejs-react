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
        // this.http.post("/user/register", this.register.bind(this));
        // this.http.get("/user/confirm-registration/:userID/:code", this.confirmRegistration.bind(this));
        // this.http.post("/user/login", this.login.bind(this));
    }

    public async register(req: any, res: any) {

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

    public async confirmRegistration(req: any, res: any) {
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

    public async login(req: any, res: any) {
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