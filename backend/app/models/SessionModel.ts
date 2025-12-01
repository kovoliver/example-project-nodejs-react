import Model from "./Model.js";
import { logger } from "../framework/functions.js";
import { HTTPResponse, Session, UserAgent } from "./types.js";

class SessionModel extends Model<"session"> {
    constructor() {
        super("session", [
            "userID",
            "tokenUUID",
            "tokenType",
            "valid",
            "ipAddress",
            "os",
            "browser",
            "device",
            "cpu",
            "expiresAt",
            "lastUsed"
        ]);
    }

    async createSession(data: Session): Promise<any> {
        try {
            this.checkFriendlyFields(data);

            const created = await this.model.create({
                data
            });

            if (!created) {
                throw {
                    status: 503,
                    message: "Service temporarily unavailable!"
                }
            }

            return true;
        } catch (err: any) {
            if (!err.status) {
                logger(err, "SessionModel", "createSession");
            }

            throw {
                status: 500,
                message: err.message || "Error while creating session."
            };
        }
    }

    async updateLastUsed(tokenUUID: string): Promise<void> {
        try {
            await this.model.update({
                where: { tokenUUID },
                data: { lastUsed: new Date() }
            });
        } catch (err: any) {
            if (!err.status) {
                logger(err, "SessionModel", "updateLastUsed");
            }

            throw {
                status: 500,
                message: err.message || "Error updating lastUsed field."
            };
        }
    }

    /**
     * Invalidate session
     */
    async invalidateSession(sessionID: number): Promise<void> {
        try {
            await this.model.update({
                where: { sessionID },
                data: { valid: false }
            });
        } catch (err: any) {
            if (!err.status) {
                logger(err, "SessionModel", "invalidateSession");
            }

            throw {
                status: 500,
                message: err.message || "Error invalidating session."
            };
        }
    }

    async invalidateSessionByUUID(tokenUUID: string): Promise<void> {
        try {
            await this.model.update({
                where: { tokenUUID },
                data: { valid: false }
            });
        } catch (err: any) {
            if (!err.status) {
                logger(err, "SessionModel", "invalidateSession");
            }

            throw {
                status: 500,
                message: err.message || "Error invalidating session."
            };
        }
    }

    async validateSession(tokenUUID: string, userAgent: UserAgent): Promise<HTTPResponse> {
        try {
            const session = await this.model.findUnique({
                where: { tokenUUID }
            });

            if (!session) {
                return {
                    status: 401,
                    message: "Session not found or token is invalid."
                }
            }

            // 1️⃣ Check if the session is still valid
            if (!session.valid) {
                return {
                    status: 403,
                    message: "This session has been invalidated."
                }
            }

            // 2️⃣ Check if the session has expired
            if (session.expiresAt.getTime() <= Date.now()) {
                await this.invalidateSession(session.sessionID);
                return {
                    status: 403,
                    message: "This session has expired."
                }
            }

            // 3️⃣ Check if userAgent fields match
            const uaFields: (keyof UserAgent)[] = ["os", "browser", "device", "cpu", "ipAddress"];
            const mismatch = uaFields.some(field => session[field] !== userAgent[field]);

            if (mismatch) {
                await this.invalidateSession(session.sessionID);
                return {
                    status: 403,
                    message: "Session invalid due to user agent mismatch."
                }
            }

            // 4️⃣ Update lastUsed if everything is fine
            await this.updateLastUsed(tokenUUID);

            return {
                status:200,
                message:"Session is valid."
            };
        } catch (err: any) {
            logger(err, "SessionModel", "validateSession");

            return {
                status: 500,
                message: "Error while validating session."
            };
        }
    }
}

export default SessionModel;