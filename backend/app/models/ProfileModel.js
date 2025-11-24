import Model from "./Model.js";
class ProfileModel extends Model {
    constructor() {
        super('user', [
            'email', 'pass', 'title',
            'firstName', 'lastName', 'zip',
            'settlement', 'street', 'streetType',
            'houseNumber', 'floorNumber', 'doorNumber'
        ]);
    }
    async updateProfile(profile) {
        try {
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
                return {
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
