import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { defaultValue, __dirname, userAgentParser } from "./functions.js";

class HTTP {
    public app: Express;
    private port: number;
    private apiPrefix = "/api";

    constructor() {
        this.app = express();

        // Ha nincs PORT a .env-ben, legyen default 3001
        this.port = Number(defaultValue(process.env.PORT, 3001));

        // Ha nincs CBASEURL, legyen default 'http://localhost:3000'
        const clientBaseUrl = defaultValue(process.env.CBASEURL, "http://localhost:5173");

        // CORS beállítás

        /*
            The HTTP Access-Control-Expose-Headers response header allows a server to indicate 
            which response headers should be made available to scripts running in the browser in 
            response to a cross-origin request.
            Only the CORS-safelisted response headers are exposed by default. For clients to be 
            able to access other headers, the server must list them using the Access-Control-Expose-Headers header.
        */
        this.app.use(cors({
            origin: clientBaseUrl,
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["Authorization"]
        }));

        // Cookie parser
        this.app.use(cookieParser());

        // Body parser
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(userAgentParser);

        this.app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

        this.listen();
    }

    private addRoute(
        method: "get" | "post" | "put" | "patch" | "delete" | "head",
        path: string,
        ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>
    ) {
        (this.app as any)[method](`${this.apiPrefix}${path}`, ...handlers);
    }

    public get(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("get", path, ...handlers);
    }

    public post(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("post", path, ...handlers);
    }

    public put(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("put", path, ...handlers);
    }

    public patch(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("patch", path, ...handlers);
    }

    public delete(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("delete", path, ...handlers);
    }

    public head(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => any>) {
        this.addRoute("head", path, ...handlers);
    }

    public listen() {
        if (process.env.NODE_ENV === "development") {
            const certPath = path.resolve(__dirname, "../certificates");
            const key = fs.readFileSync(path.join(certPath, "key.pem"));
            const cert = fs.readFileSync(path.join(certPath, "cert.pem"));

            https.createServer({ key, cert }, this.app)
                .listen(this.port, () => {
                    console.log(`🚀 Dev HTTPS server listening on port ${this.port}`);
                });
        } else {
            http.createServer(this.app)
                .listen(this.port, () => {
                    console.log(`🚀 HTTP server listening on port ${this.port}`);
                });
        }
    }
}

const httpServer = new HTTP();

export { HTTP, httpServer };