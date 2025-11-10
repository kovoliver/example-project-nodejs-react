import Joi from "joi";
import {httpServer, HTTP} from "../framework/HTTP.js";
import JWToken from "../framework/JWToken.js";

class Controller {
    protected schema:Joi.ObjectSchema;

    constructor(schema:Joi.ObjectSchema) {
        this.schema = schema;
    }
}

export default Controller;