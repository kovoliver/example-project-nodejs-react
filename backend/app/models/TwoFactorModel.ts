// TwoFactorModel.ts
import Model from "./Model.js";
import { HTTPResponse } from "./types.js";

class TwoFactorModel extends Model<"twoFactorKey"> {
    constructor() {
        super("twoFactorKey", ["userID", "key"]);
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
}

export default TwoFactorModel;