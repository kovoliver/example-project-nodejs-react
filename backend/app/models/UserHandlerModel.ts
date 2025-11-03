import { createHash, randomString } from "../framework/functions.js";
import Model from "./Model.js";
import { RegisterUser, Role } from "./types.js";
import { HTTPResponse } from "./types.js";

class UserHandlerModel extends Model<'user'> {
    constructor() {
        super('user', ['email', 'pass']);
    }

    async register(user: RegisterUser): Promise<HTTPResponse> {
        try {
            // Beállítjuk az alapértelmezett szerepet
            user.role = Role.USER;

            // Generálunk egy egyedi salt-ot és hash-eljük a jelszót
            user.salt = randomString(12);
            user.pass = createHash(user.pass, user.salt);

            // Ellenőrizzük, hogy csak a megengedett mezők kerülnek be a DB-be
            this.checkFriendlyFields(user);

            // Insert az adatbázisba
            await this.model.create({ data: user as any });

            return {
                status: 200,
                message: "User registered successfully"
            };
        } catch (err: any) {
            return {
                status: 500,
                message: err.message || "An error occurred during registration"
            };
        }
    }
}

export default UserHandlerModel;