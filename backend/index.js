import dotenv from 'dotenv';
dotenv.config();
import UserHandlerController from "./app/controllers/UserHandlerController.js";
import RouteManager from "./app/framework/RouteManager.js";
function main() {
    RouteManager.registerController(UserHandlerController);
}
main();
