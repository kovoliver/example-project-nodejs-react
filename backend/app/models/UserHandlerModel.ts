import EmailSender from "../framework/EmailSender.js";
import { createHash, defaultValue, randomString } from "../framework/functions.js";
import Model from "./Model.js";
import { RegisterUser, Role } from "./types.js";
import { HTTPResponse } from "./types.js";

class UserHandlerModel extends Model<'user'> {
    constructor() {
        super('user', ['email', 'pass', 'confirmationCode', 'role', 'salt']);
    }

    async register(user: RegisterUser): Promise<HTTPResponse> {
        try {
            // Alapértelmezett szerep
            user.role = Role.USER;

            // Salt és confirmation code generálása, jelszó hash-elése
            user.salt = randomString(12);
            user.confirmationCode = randomString(12);
            user.pass = createHash(user.pass, user.salt);

            // Csak engedélyezett mezők kerüljön az adatbázisba
            this.checkFriendlyFields(user);

            // Insert + response-ból visszakapjuk a user ID-t
            const createdUser = await this.model.create({ data: user as any });

            // Megerősítő link összeállítása
            const confirmUrl =
                `${defaultValue(process.env.CBASEURL, "https://localhost:5173")}/confirm-registration?userID=${createdUser.userID}&code=${user.confirmationCode}`;

            // Email HTML tartalom
            const html = `
                <h3>Kedves Felhasználó!</h3>
                <p>Köszönjük a regisztrációdat! A fiókod megerősítéséhez kattints az alábbi linkre:</p>
                <p><a href="${confirmUrl}">Kattints ide a regisztráció megerősítéséhez</a></p>
                <p>Ha nem te regisztráltál, akkor ezt az üzenetet figyelmen kívül hagyhatod.</p>
            `;

            // Email küldés
            EmailSender.sendMail({
                from: defaultValue(process.env.SMTP_USER, "kovacs.oliver1989@gmail.com"),
                to: user.email,
                subject: 'Regisztráció megerősítése',
                html,
            });

            return {
                status: 200,
                message: "User registered successfully. Please check your email to confirm your registration."
            };
        } catch (err: any) {
            console.log(err);

            return {
                status: 500,
                message: err.message || "An error occurred during registration"
            };
        }
    }

    async confirmRegistration(userID: number, code: string): Promise<HTTPResponse> {
        try {
            // Megkeressük a felhasználót az ID és a confirmationCode alapján
            const user = await this.model.findUnique({
                where: {
                    userID: userID,
                    confirmationCode: code
                }
            });

            // Ha nincs ilyen felhasználó vagy már meg van erősítve
            if (!user) {
                return {
                    status: 400,
                    message: "Invalid confirmation link or user not found."
                };
            }

            if (user.userConfirmed === true) {
                return {
                    status: 400,
                    message: "This account has already been confirmed."
                };
            }

            //Frissítjük az adatbázist — confirmed = true
            await this.model.update({
                where: { userID: userID },
                data: {
                    userConfirmed: true,
                    confirmationCode: null
                }
            });

            return {
                status: 200,
                message: "Your registration has been successfully confirmed."
            };

        } catch (err: any) {
            console.log(err);

            return {
                status: 500,
                message: err.message || "An error occurred during confirmation."
            };
        }
    }
}

export default UserHandlerModel;