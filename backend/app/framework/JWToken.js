import jwt from "jsonwebtoken";
import { defaultValue } from "./functions.js";
import SessionModel from "../models/SessionModel.js";
class JWToken {
    accessKey;
    refreshKey;
    accessExpire;
    refreshExpire;
    sessionModel;
    constructor() {
        if (!process.env.ACCESS_TOKEN_SECRET)
            throw new Error("Missing ACCESS_TOKEN_SECRET in .env");
        if (!process.env.REFRESH_TOKEN_SECRET)
            throw new Error("Missing REFRESH_TOKEN_SECRET in .env");
        this.accessKey = process.env.ACCESS_TOKEN_SECRET;
        this.refreshKey = process.env.REFRESH_TOKEN_SECRET;
        const accessMins = defaultValue(process.env.ACCESS_TOKEN_MINS, "10");
        const refreshDays = defaultValue(process.env.REFRESH_TOKEN_DAYS, "7");
        this.accessExpire = `${accessMins}m`;
        this.refreshExpire = `${refreshDays}d`;
        this.sessionModel = new SessionModel();
    }
    createToken(payload, type = "ACCESS") {
        const key = type === "ACCESS" ? this.accessKey : this.refreshKey;
        const expiresIn = type === "ACCESS" ? this.accessExpire : this.refreshExpire;
        return jwt.sign(payload, key, { expiresIn });
    }
    verifyToken(token, type = "ACCESS") {
        const key = type === "ACCESS" ? this.accessKey : this.refreshKey;
        try {
            return jwt.verify(token, key);
        }
        catch {
            return null;
        }
    }
    async authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(" ")[1] ?? null;
        if (!token && !req.cookies?.refresh_token) {
            return res.status(401).json({ message: 'A rendszer nem tudott azonosítani!' });
        }
        let decoded = null;
        let newAccessToken = null;
        if (token) {
            decoded = this.verifyToken(token, "ACCESS");
            req.user = decoded;
            return next();
        }
        if (!decoded && req.cookies?.refresh_token) {
            decoded = this.verifyToken(req.cookies.refresh_token, "REFRESH");
            const user = {
                userID: decoded?.userID,
                uuID: decoded?.uuID,
                role: decoded?.role,
                firstName: decoded?.firstName,
                lastName: decoded?.lastName
            };
            if (decoded) {
                newAccessToken = this.createToken(user, "ACCESS");
            }
        }
        if (!decoded) {
            return res.status(401).json({ message: 'A rendszer nem tudott azonosítani!' });
        }
        const response = await this.sessionModel.validateSession(decoded.uuID, req.userAgent);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: response.message });
        }
        // Új access token vissza a headerbe
        if (newAccessToken) {
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        }
        req.user = decoded;
        next();
    }
    async logout(tokenUUID, refreshToken) {
        if (!tokenUUID || !refreshToken) {
            throw {
                status: 401,
                message: "The system cannot find your session!"
            };
        }
        await this.sessionModel.invalidateSessionByUUID(tokenUUID);
        const decoded = this.verifyToken(refreshToken, "REFRESH");
        if (decoded) {
            await this.sessionModel.invalidateSessionByUUID(decoded.uuID);
        }
        else {
            throw {
                status: 401,
                message: "You've probably already logged out earlier!"
            };
        }
    }
}
const tokenHandler = new JWToken();
export { JWToken };
export default tokenHandler;
