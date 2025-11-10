import { HTTP, httpServer } from "./HTTP.js";
import { RouteDefinition } from "../models/types.js";

export default class RouteManager {
    public static registerEndpoint(
        method: keyof typeof httpServer,
        path: string,
        ...handlers: Array<(req: any, res: any, next: any) => any>
    ) {
        // @ts-ignore - dinamikus metódushívás a HTTP osztályban
        httpServer[method](path, ...handlers);
        console.log(`[Route] ${method.toUpperCase()} ${path} registered.`);
    }

    public static registerController(ControllerClass: any) {
        const instance = new ControllerClass();
        const basePath: string = Reflect.getMetadata('basePath', ControllerClass) || '';
        const routes: RouteDefinition[] = Reflect.getMetadata('routes', ControllerClass) || [];

        routes.forEach(({ method, path, handler, middlewares }) => {
            const fullPath = basePath + path;
            const handlerFn = instance[handler].bind(instance);

            // Middleware-ek kezelése, ha vannak
            const allHandlers = middlewares && middlewares.length > 0 ? [...middlewares, handlerFn] : [handlerFn];

            this.registerEndpoint(method, fullPath, ...allHandlers);
        });
    }
}