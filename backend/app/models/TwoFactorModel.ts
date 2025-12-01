import Model from "./Model.js";
import { TokenPayload, UserAgent, Session } from "./types.js";
import tokenHandler from "../framework/JWToken.js";
import { Role } from "@prisma/client";
import { getTokenExpiration, logger } from "../framework/functions.js";
import { v4 as uuidv4 } from 'uuid';
import SessionModel from "./SessionModel.js";

class TwoFactorModel extends Model<"twoFactorKey"> {
    private sessionModel:SessionModel;

    constructor() {
        super("twoFactorKey", ["userID", "key"]);
        this.sessionModel = new SessionModel();
    }

    async createKey(userID: number, key: string): Promise<void> {
        try {
            const keyData = { userID, key };
            this.checkFriendlyFields(keyData);

            await this.model.create({
                data: keyData as any,
            });
        } catch (err: any) {
            if(!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }

            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }

    async twoFactorLogin(userID: number, key: string, userAgent:UserAgent): Promise<any> {
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
                }
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

            const user: TokenPayload = {
                userID: userID,
                uuID:uuIDAccess,
                role: keyData.userData?.role as Role,
                firstName: keyData.userData?.firstName as string,
                lastName: keyData.userData?.lastName as string
            };

            const accessToken = tokenHandler.createToken(
                user, "ACCESS"
            );

            user.uuID = uuIDRefresh;

            const refreshToken = tokenHandler.createToken(
                user, "REFRESH"
            );

            const expiresAccess = getTokenExpiration("ACCESS");
            const expiresRefresh = getTokenExpiration("REFRESH");

            const accessSession:Session = {
                userID:user.userID,
                tokenUUID:uuIDAccess,
                tokenType:"ACCESS",
                ipAddress:userAgent.ipAddress,
                browser:userAgent.browser,
                os:userAgent.os,
                device:userAgent.device,
                cpu:userAgent.cpu,
                expiresAt:expiresAccess as Date
            };

            const refreshSession:Session = {
                userID:user.userID,
                tokenUUID:uuIDRefresh,
                tokenType:"REFRESH",
                ipAddress:userAgent.ipAddress,
                browser:userAgent.browser,
                os:userAgent.os,
                device:userAgent.device,
                cpu:userAgent.cpu,
                expiresAt:expiresRefresh as Date
            };

            await this.sessionModel.createSession(accessSession);
            await this.sessionModel.createSession(refreshSession);

            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role
            }
        } catch (err: any) {
            if(!err.status) {
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