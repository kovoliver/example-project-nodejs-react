import { logger, verifyHash } from "../framework/functions.js";
import Model from "./Model.js";
import { createHash } from "../framework/functions.js";
class ProfileModel extends Model {
    constructor() {
        super('user', [
            'email', 'title', 'firstName', 'lastName',
            'zip', 'settlement', 'street', 'streetType',
            'houseNumber', 'floorNumber', 'doorNumber'
        ]);
    }
    async getProfile(userID) {
        try {
            const profile = await this.model.findUnique({
                where: { userID },
                select: this.friendlyFields.reduce((acc, field) => {
                    acc[field] = true;
                    return acc;
                }, {})
            });
            if (!profile) {
                throw {
                    status: 404,
                    message: "Profile not found."
                };
            }
            return profile;
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving profile."
            };
        }
    }
    async updateProfile(profile, userID) {
        try {
            this.checkFriendlyFields(profile);
            const updatedProfile = await this.model.update({
                where: { userID },
                data: {
                    title: profile.title ?? undefined,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    zip: profile.zip,
                    settlement: profile.settlement,
                    street: profile.street,
                    streetType: profile.streetType,
                    houseNumber: profile.houseNumber,
                    floorNumber: profile.floorNumber ?? undefined,
                    doorNumber: profile.doorNumber ?? undefined
                }
            });
            if (!updatedProfile) {
                throw {
                    status: 404,
                    message: "Profile not found."
                };
            }
            return {
                status: 200,
                message: "Profile updated successfully."
            };
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }
            throw {
                status: err.status || 500,
                message: err.message || "Error updating profile."
            };
        }
    }
    async checkPass(userID, pass) {
        const user = await this.model.findUnique({
            where: { userID },
            select: { pass: true, salt: true }
        });
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        const isMatch = verifyHash(pass, user.salt, user.pass);
        if (!isMatch) {
            throw { status: 401, message: "Current password is incorrect." };
        }
        return user;
    }
    async changePassword(userID, currentPass, newPass) {
        try {
            const user = await this.checkPass(userID, currentPass);
            const newHashed = createHash(newPass, user.salt);
            const response = await this.model.update({
                where: { userID },
                data: { pass: newHashed }
            });
            if (!response) {
                throw {
                    status: 503,
                    message: "Service temporarily unavailable!"
                };
            }
            return { status: 200, message: "Password changed successfully." };
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "changePassword");
            }
            throw {
                status: err.status || 500,
                message: err.message || "Error changing password."
            };
        }
    }
    async changeEmail(userID, email, pass) {
        try {
            await this.checkPass(userID, pass);
            const response = await this.model.update({
                where: { userID },
                data: { email }
            });
            if (!response) {
                throw {
                    status: 503,
                    message: "Service temporarily unavailable!"
                };
            }
            return {
                status: 200,
                message: "Updated successfully!"
            };
        }
        catch (err) {
            if (!err.status) {
                logger(err, "ProfileModel", "changePassword");
            }
            throw {
                status: err.status || 500,
                message: err.message || "Error changing password."
            };
        }
    }
}
;
export default ProfileModel;
