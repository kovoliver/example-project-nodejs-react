import Joi from "joi";
import Model from "../models/Model.js";

class Controller<Model> {
    protected model: Model;

    constructor(model: Model) {
        this.model = model;
    }
}

export default Controller;