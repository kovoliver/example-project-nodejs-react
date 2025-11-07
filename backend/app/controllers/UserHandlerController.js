import Controller from "./Controller.js";
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
class UserHandlerController extends Controller {
    model;
    constructor() {
        super(userSchema);
        this.model = new UserHandlerModel();
        // Endpoint létrehozása a konstruktorban
        // this.http.post("/user/register", this.register.bind(this));
        // this.http.get("/user/confirm-registration/:userID/:code", this.confirmRegistration.bind(this));
        // this.http.post("/user/login", this.login.bind(this));
    }
    async register(req, res) {
        try {
            const { error, value } = this.schema.validate(req.body, { abortEarly: false });
            delete value.passAgain;
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
    async confirmRegistration(req, res) {
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
            const response = await this.model.confirmRegistration(parseInt(userID), code);
            return res.status(response.status).json(response);
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during confirmation."
            });
        }
    }
    async login(req, res) {
        try {
            const { email, pass } = req.body;
            if (!email || !pass) {
                return res.status(400).json({
                    status: 400,
                    message: "Email and password are required.",
                });
            }
            // Meghívjuk a Model.login metódust
            const response = await this.model.login(email, pass);
            return res.status(response.status).json(response);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during login.",
            });
        }
    }
}
export default UserHandlerController;
