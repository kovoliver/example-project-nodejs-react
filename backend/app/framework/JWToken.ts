import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../models/types.js";
import { defaultValue } from "./functions.js";

class JWToken {
    private accessKey: string;
    private refreshKey: string;
    private accessExpire: string;
    private refreshExpire: string;

    constructor() {
        if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("Missing ACCESS_TOKEN_SECRET in .env");
        if (!process.env.REFRESH_TOKEN_SECRET) throw new Error("Missing REFRESH_TOKEN_SECRET in .env");

        this.accessKey = process.env.ACCESS_TOKEN_SECRET;
        this.refreshKey = process.env.REFRESH_TOKEN_SECRET;

        const accessMins = defaultValue(process.env.ACCESS_TOKEN_MINS, "10");
        const refreshDays = defaultValue(process.env.REFRESH_TOKEN_DAYS, "7");

        this.accessExpire = `${accessMins}m`;
        this.refreshExpire = `${refreshDays}d`;
    }

    createToken(payload: TokenPayload, type: "ACCESS" | "REFRESH" = "ACCESS"): string {
        const key: Secret = type === "ACCESS" ? this.accessKey : this.refreshKey;
        const expiresIn = type === "ACCESS" ? this.accessExpire : this.refreshExpire;
        return jwt.sign(payload, key, { expiresIn } as jwt.SignOptions);
    }

    verifyToken(token: string, type: "ACCESS" | "REFRESH" = "ACCESS"): TokenPayload | null {
        const key = type === "ACCESS" ? this.accessKey : this.refreshKey;
        try {
            return jwt.verify(token, key) as TokenPayload;
        } catch {
            return null;
        }
    }

    // Express middleware
    authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(" ")[1] ?? null;

        if (!token && !req.cookies?.refreshToken) {
            return res.status(401).json({ message: 'A rendszer nem tudott azonosítani!' });
        }

        let decoded: TokenPayload | null = null;
        let newAccessToken: string | null = null;

        if (token) {
            decoded = this.verifyToken(token, "ACCESS");
        }

        if (!decoded && req.cookies?.refreshToken) {
            decoded = this.verifyToken(req.cookies.refreshToken, "REFRESH");
            if (decoded) {
                newAccessToken = this.createToken(decoded, "ACCESS");
            }
        }

        if (!decoded) {
            return res.status(401).json({ message: 'A rendszer nem tudott azonosítani!' });
        }

        // Új access token vissza a headerbe
        if (newAccessToken) {
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        }

        (req as any).user = decoded;

        next();
    }
}

export default JWToken;