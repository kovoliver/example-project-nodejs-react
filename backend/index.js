import dotenv from 'dotenv';
import UserHandlerController from "./app/controllers/UserHandlerController.js";
import RouteManager from "./app/framework/RouteManager.js";
import { TwoFactorController } from './app/controllers/TwoFactorController.js';
import ProfileController from './app/controllers/ProfileController.js';
import SessionController from './app/controllers/SessionController.js';
import CarController from './app/controllers/CarController.js';
dotenv.config();
function main() {
    RouteManager.registerController(UserHandlerController);
    RouteManager.registerController(TwoFactorController);
    RouteManager.registerController(ProfileController);
    RouteManager.registerController(SessionController);
    RouteManager.registerController(CarController);
}
main();
