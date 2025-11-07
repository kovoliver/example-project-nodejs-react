import UserHandlerController from "./app/controllers/UserHandlerController.js";
import RouteManager from "./app/framework/RouteManager.js";
function main() {
    const uhc = new UserHandlerController();
    RouteManager.registerEndpoint({
        method: "post",
        path: "/user/register",
        handler: uhc.register
    }, uhc);
}
main();
