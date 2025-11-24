import Model from "./Model.js";
import tokenHandler from "../framework/JWToken.js";
class TwoFactorModel extends Model {
    constructor() {
        super("twoFactorKey", ["userID", "key"]);
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
            console.log(err);
            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }
    async twoFactorLogin(userID, key) {
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
            const user = {
                userID: userID,
                role: keyData.userData?.role,
                firstName: keyData.userData?.firstName,
                lastName: keyData.userData?.lastName
            };
            const accessToken = tokenHandler.createToken(user, "ACCESS");
            const refreshToken = tokenHandler.createToken(user, "REFRESH");
            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role
            };
        }
        catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: err.message || "Error while creating two-factor key.",
            };
        }
    }
}
export default TwoFactorModel;
