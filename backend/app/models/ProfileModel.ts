import { logger, verifyHash } from "../framework/functions.js";
import Model from "./Model.js";
import { HTTPResponse } from "./types.js";
import { Profile } from "./types.js";
import { createHash } from "../framework/functions.js";

class ProfileModel extends Model<'user'> {
    constructor() {
        super('user', [
            'email', 'title', 'firstName', 'lastName', 
            'zip', 'settlement', 'street', 'streetType',
            'houseNumber', 'floorNumber', 'doorNumber'
        ]);
    }

    async getProfile(userID: number): Promise<Profile> {
        try {
            const profile = await this.model.findUnique({
                where: { userID },
                select: this.friendlyFields.reduce((acc, field) => {
                    acc[field] = true;
                    return acc;
                }, {} as Record<string, boolean>)
            });

            if (!profile) {
                throw {
                    status: 404,
                    message: "Profile not found."
                };
            }

            return profile as unknown as Profile;
        } catch (err: any) {
            if(!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }
            
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving profile."
            };
        }
    }


    async updateProfile(profile: Profile, userID:number): Promise<HTTPResponse> {
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
        } catch (err: any) {
            if(!err.status) {
                logger(err, "ProfileModel", "updateProfile");
            }

            throw {
                status: err.status || 500,
                message: err.message || "Error updating profile."
            };
        }
    }

    async changePassword(userID: number, currentPass: string, newPass: string): Promise<HTTPResponse> {
        try {
            const user = await this.model.findUnique({
                where: { userID },
                select: { pass: true, salt:true }
            });

            if (!user) {
                throw { status: 404, message: "User not found." };
            }

            const isMatch = verifyHash(currentPass, user.salt as string, user.pass);

            if (!isMatch) {
                throw { status: 401, message: "Current password is incorrect." };
            }

            const newHashed = createHash(newPass, user.salt as string);

            await this.model.update({
                where: { userID },
                data: { pass: newHashed }
            });

            return { status: 200, message: "Password changed successfully." };
        } catch (err: any) {
            if(!err.status) {
                logger(err, "ProfileModel", "changePassword");
            }

            throw {
                status: err.status || 500,
                message: err.message || "Error changing password."
            };
        }
    }
};

export default ProfileModel;