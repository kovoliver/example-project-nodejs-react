import { createHash, randomString } from "../framework/functions.js";
import Model from "./Model.js";
import { Role } from "./types.js";
class UserHandlerModel extends Model {
    constructor() {
        super('user', ['email', 'pass']);
    }
    async register(user) {
        try {
            // Beállítjuk az alapértelmezett szerepet
            user.role = Role.USER;
            // Generálunk egy egyedi salt-ot és hash-eljük a jelszót
            user.salt = randomString(12);
            user.pass = createHash(user.pass, user.salt);
            // Ellenőrizzük, hogy csak a megengedett mezők kerülnek be a DB-be
            this.checkFriendlyFields(user);
            // Insert az adatbázisba
            await this.model.create({ data: user });
            return {
                status: 200,
                message: "User registered successfully"
            };
        }
        catch (err) {
            return {
                status: 500,
                message: err.message || "An error occurred during registration"
            };
        }
    }
}
export default UserHandlerModel;
