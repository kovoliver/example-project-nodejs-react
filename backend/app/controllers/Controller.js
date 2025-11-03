import { httpServer } from "../framework/HTTP.js";
import JWToken from "../framework/JWToken.js";
class Controller {
    http;
    tokenHandler;
    schema;
    constructor(schema) {
        this.http = httpServer;
        this.tokenHandler = new JWToken();
        this.schema = schema;
    }
}
export default Controller;
