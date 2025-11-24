import Model from "./Model.js";
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
            console.log(err);
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving profile."
            };
        }
    }
    async updateProfile(profile) {
        try {
            this.checkFriendlyFields(profile);
            const updatedProfile = await this.model.update({
                where: { userID: profile.userID },
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
            console.log(err);
            throw {
                status: err.status || 500,
                message: err.message || "Error updating profile."
            };
        }
    }
}
;
export default ProfileModel;
