import 'reflect-metadata';
function createRouteDecorator(method) {
    return function (path, ...middlewares) {
        return (target, propertyKey) => {
            const routes = Reflect.getMetadata('routes', target.constructor) || [];
            routes.push({
                method,
                path,
                handler: propertyKey,
                middlewares,
            });
            Reflect.defineMetadata('routes', routes, target.constructor);
        };
    };
}
export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');
export function RouteController(basePath) {
    return (target) => {
        Reflect.defineMetadata('basePath', basePath, target);
    };
}
