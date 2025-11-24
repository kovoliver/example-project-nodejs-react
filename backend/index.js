import dotenv from 'dotenv';
dotenv.config();
import UserHandlerController from "./app/controllers/UserHandlerController.js";
import RouteManager from "./app/framework/RouteManager.js";
import { TwoFactorController } from './app/controllers/TwoFactorController.js';
import ProfileController from './app/controllers/ProfileController.js';
function main() {
    RouteManager.registerController(UserHandlerController);
    RouteManager.registerController(TwoFactorController);
    RouteManager.registerController(ProfileController);
}
main();
