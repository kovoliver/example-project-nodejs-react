import Joi from "joi";
import {httpServer, HTTP} from "../framework/HTTP.js";
import JWToken from "../framework/JWToken.js";

class Controller {
    protected http:HTTP;
    protected tokenHandler:JWToken;
    protected schema:Joi.ObjectSchema;

    constructor(schema:Joi.ObjectSchema) {
        this.http = httpServer;
        this.tokenHandler = new JWToken();
        this.schema = schema;
    }
}

export default Controller;