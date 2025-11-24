import Joi from "joi";
import Model from "../models/Model.js";

class Controller<Model> {
    protected schema: Joi.ObjectSchema | null;
    protected model: Model;

    constructor(model: Model, schema: Joi.ObjectSchema | null = null) {
        this.model = model;
        this.schema = schema;
    }
}

export default Controller;