import Model from "./Model.js";
import tokenHandler from "../framework/JWToken.js";
import { getTokenExpiration, logger } from "../framework/functions.js";
import { v4 as uuidv4 } from 'uuid';
import SessionModel from "./SessionModel.js";
class TwoFactorModel extends Model {
    sessionModel;
    constructor() {
        super("twoFactorKey", ["userID", "key"]);
        this.sessionModel = new SessionModel();
    }
    async createKey(userID, key) {
        try {
            const keyData = { userID, key };
            this.checkFriendlyFields(keyData);
            await this.model.create({
                data: keyData,
            });
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }
            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }
    async twoFactorLogin(userID, key, userAgent) {
        try {
            const keyData = await this.model.findFirst({
                where: {
                    userID,
                    key,
                    expiredAt: {
                        gte: new Date().toISOString()
                    },
                    used: {
                        equals: false
                    },
                    userData: {
                        userConfirmed: true
                    }
                },
                include: {
                    userData: {
                        select: {
                            role: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            if (!keyData) {
                throw {
                    status: 401,
                    message: "The given key is incorrect or expired!"
                };
            }
            await this.model.updateMany({
                where: {
                    userID,
                    key
                },
                data: {
                    used: true
                }
            });
            const uuIDAccess = uuidv4();
            const uuIDRefresh = uuidv4();
            const user = {
                userID: userID,
                uuID: uuIDAccess,
                role: keyData.userData?.role,
                firstName: keyData.userData?.firstName,
                lastName: keyData.userData?.lastName
            };
            const accessToken = tokenHandler.createToken(user, "ACCESS");
            user.uuID = uuIDRefresh;
            const refreshToken = tokenHandler.createToken(user, "REFRESH");
            const expiresAccess = getTokenExpiration("ACCESS");
            const expiresRefresh = getTokenExpiration("REFRESH");
            const accessSession = {
                userID: user.userID,
                tokenUUID: uuIDAccess,
                tokenType: "ACCESS",
                ipAddress: userAgent.ipAddress,
                browser: userAgent.browser,
                os: userAgent.os,
                device: userAgent.device,
                cpu: userAgent.cpu,
                expiresAt: expiresAccess
            };
            const refreshSession = {
                userID: user.userID,
                tokenUUID: uuIDRefresh,
                tokenType: "REFRESH",
                ipAddress: userAgent.ipAddress,
                browser: userAgent.browser,
                os: userAgent.os,
                device: userAgent.device,
                cpu: userAgent.cpu,
                expiresAt: expiresRefresh
            };
            await this.sessionModel.createSession(accessSession);
            await this.sessionModel.createSession(refreshSession);
            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role
            };
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }
            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }
}
export default TwoFactorModel;
