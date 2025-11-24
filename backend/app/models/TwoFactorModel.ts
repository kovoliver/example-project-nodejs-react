import Model from "./Model.js";
import { TokenPayload } from "./types.js";
import JWToken from "../framework/JWToken.js";
import { Role } from "@prisma/client";

class TwoFactorModel extends Model<"twoFactorKey"> {
    private tokenHandler: JWToken;

    constructor() {
        super("twoFactorKey", ["userID", "key"]);

        this.tokenHandler = new JWToken();
    }

    async createKey(userID: number, key: string): Promise<void> {
        try {
            const keyData = { userID, key };
            this.checkFriendlyFields(keyData);

            await this.model.create({
                data: keyData as any,
            });
        } catch (err: any) {
            console.log(err);

            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }

    async twoFactorLogin(userID: number, key: string): Promise<any> {
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

            const user: TokenPayload = {
                userID: userID,
                role: keyData.userData?.role as Role,
                firstName: keyData.userData?.firstName as string,
                lastName: keyData.userData?.lastName as string
            };

            const accessToken = this.tokenHandler.createToken(
                user, "ACCESS"
            );

            const refreshToken = this.tokenHandler.createToken(
                user, "REFRESH"
            );

            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role
            }
        } catch (err: any) {
            console.log(err);

            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }
}

export default TwoFactorModel;