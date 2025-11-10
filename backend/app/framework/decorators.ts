import 'reflect-metadata';
import { RouteDefinition } from '../models/types.js';

function createRouteDecorator(method: 'get' | 'post' | 'put' | 'delete') {
    return function (path: string, ...middlewares: Function[]): MethodDecorator {
        return (target, propertyKey) => {
            const routes: RouteDefinition[] = Reflect.getMetadata('routes', target.constructor) || [];
            routes.push({
                method,
                path,
                handler: propertyKey as string,
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

export function RouteController(basePath: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata('basePath', basePath, target);
    };
}