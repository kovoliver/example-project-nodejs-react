import Controller from "./Controller.js";
import { userSchema } from "./validation.js";
import UserHandlerModel from "../models/UserHandlerModel.js";
import { HTTPResponse } from "../models/types.js";
import { Get, Post, RouteController } from "../framework/decorators.js";

@RouteController("/user")
class UserHandlerController extends Controller {
    private model: UserHandlerModel;

    constructor() {
        super(userSchema);
        this.model = new UserHandlerModel();
    }

    @Post("/register")
    public async register(req: any, res: any) {

        try {
            const { error, value } = this.schema.validate(req.body, { abortEarly: false });
            let messages = [];

            delete value.passAgain;
            const exists = await this.model.checkExists("email", value.email);

            messages = error ? error.details.map((d: any) => d.message) : [];

            if(exists) messages.push("A megadott email cím már regisztrálva van egy másik felhasználóhoz!");

            if (messages.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: messages
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

    @Get("/confirm-registration/:userID/:code")
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

    @Get("/confirm-registration/:userID/:code")
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