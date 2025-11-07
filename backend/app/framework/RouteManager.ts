import { httpServer } from "./HTTP.js";
import { EndPoint } from "../models/types.js";

export default class RouteManager {
    static registerEndpoint(endpoint: EndPoint, instance?: any): void {
        const { method, path, handler, middleware } = endpoint;

        // Ha a handler string, a controller példányból vegyük ki
        let boundHandler = handler;

        if (typeof handler === "string" && instance) {
            boundHandler = instance[handler].bind(instance);
        } else if (instance) {
            boundHandler = handler.bind(instance);
        }

        // Middleware lehet egy függvény vagy tömb, bind-oljuk ha kell
        const middlewares = [];

        if (middleware) {
            if (Array.isArray(middleware)) {
                for (const mw of middleware) {
                    middlewares.push(instance ? mw.bind(instance) : mw);
                }
            } else {
                middlewares.push(instance ? middleware.bind(instance) : middleware);
            }
        }

        (httpServer as any)[method](path, ...middlewares, boundHandler);

        console.log(`[RouteManager] Registered: ${method.toUpperCase()} ${path}`);
    }

    static registerController(instance: any): void {

    }

    /**
     * Több controller egyszerre regisztrálása.
     */
    static registerControllers(instances: any[]): void {

    }
}