// TwoFactorModel.ts
import Model from "./Model.js";
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
}
export default TwoFactorModel;
