import { httpServer } from "./HTTP.js";
export default class RouteManager {
    static registerEndpoint(method, path, ...handlers) {
        // @ts-ignore - dinamikus metódushívás a HTTP osztályban
        httpServer[method](path, ...handlers);
        console.log(`[Route] ${method.toUpperCase()} ${path} registered.`);
    }
    static registerController(ControllerClass) {
        const instance = new ControllerClass();
        const basePath = Reflect.getMetadata('basePath', ControllerClass) || '';
        const routes = Reflect.getMetadata('routes', ControllerClass) || [];
        routes.forEach(({ method, path, handler, middlewares }) => {
            const fullPath = basePath + path;
            const handlerFn = instance[handler].bind(instance);
            // Middleware-ek kezelése, ha vannak
            const allHandlers = middlewares && middlewares.length > 0 ? [...middlewares, handlerFn] : [handlerFn];
            this.registerEndpoint(method, fullPath, ...allHandlers);
        });
    }
}
