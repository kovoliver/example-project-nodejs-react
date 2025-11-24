class Controller {
    schema;
    model;
    constructor(model, schema = null) {
        this.model = model;
        this.schema = schema;
    }
}
export default Controller;
