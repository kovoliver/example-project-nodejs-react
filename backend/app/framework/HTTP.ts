import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { defaultValue } from "./functions.js";

class HTTP {
    public app: Express;
    private port: number;
    private apiPrefix = "/api";

    constructor() {
        this.app = express();

        // Ha nincs PORT a .env-ben, legyen default 3001
        this.port = Number(defaultValue(process.env.PORT, 3001));

        // Ha nincs CBASEURL, legyen default 'http://localhost:3000'
        const clientBaseUrl = defaultValue(process.env.CBASEURL, "http://localhost:3000");

        // CORS beállítás
        this.app.use(cors({
            origin: clientBaseUrl,
            credentials: true,
        }));

        // Cookie parser
        this.app.use(cookieParser());

        // Body parser
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private addRoute(
        method: "get" | "post" | "put" | "patch" | "delete",
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

    public listen() {
        if (process.env.NODE_ENV === "development") {
            const certPath = path.resolve(__dirname, "../../certs");
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

export {HTTP, httpServer};