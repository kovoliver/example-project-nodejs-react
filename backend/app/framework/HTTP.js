import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { defaultValue, __dirname } from "./functions.js";
import dotenv from 'dotenv';
console.log(__dirname);
dotenv.config();
class HTTP {
    app;
    port;
    apiPrefix = "/api";
    constructor() {
        this.app = express();
        // Ha nincs PORT a .env-ben, legyen default 3001
        this.port = Number(defaultValue(process.env.PORT, 3001));
        // Ha nincs CBASEURL, legyen default 'http://localhost:3000'
        const clientBaseUrl = defaultValue(process.env.CBASEURL, "http://localhost:5173");
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
        this.listen();
    }
    addRoute(method, path, ...handlers) {
        this.app[method](`${this.apiPrefix}${path}`, ...handlers);
    }
    get(path, ...handlers) {
        this.addRoute("get", path, ...handlers);
    }
    post(path, ...handlers) {
        this.addRoute("post", path, ...handlers);
    }
    put(path, ...handlers) {
        this.addRoute("put", path, ...handlers);
    }
    patch(path, ...handlers) {
        this.addRoute("patch", path, ...handlers);
    }
    delete(path, ...handlers) {
        this.addRoute("delete", path, ...handlers);
    }
    listen() {
        if (process.env.NODE_ENV === "development") {
            const certPath = path.resolve(__dirname, "../certificates");
            const key = fs.readFileSync(path.join(certPath, "key.pem"));
            const cert = fs.readFileSync(path.join(certPath, "cert.pem"));
            https.createServer({ key, cert }, this.app)
                .listen(this.port, () => {
                console.log(`🚀 Dev HTTPS server listening on port ${this.port}`);
            });
        }
        else {
            http.createServer(this.app)
                .listen(this.port, () => {
                console.log(`🚀 HTTP server listening on port ${this.port}`);
            });
        }
    }
}
const httpServer = new HTTP();
export { HTTP, httpServer };
