import EmailSender from "../framework/EmailSender.js";
import { createHash, defaultValue, randomString } from "../framework/functions.js";
import Model from "./Model.js";
import TwoFactorModel from "./TwoFactorModel.js";
import { Role } from "./types.js";
class UserHandlerModel extends Model {
    twoFactorModel;
    constructor() {
        super('user', ['email', 'pass', 'confirmationCode', 'role', 'salt']);
        this.twoFactorModel = new TwoFactorModel();
    }
    async register(user) {
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
            const createdUser = await this.model.create({ data: user });
            // Megerősítő link összeállítása
            const confirmUrl = `${defaultValue(process.env.CBASEURL, "https://localhost:5173")}/confirm-registration?userID=${createdUser.userID}&code=${user.confirmationCode}`;
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
        }
        catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: err.message || "An error occurred during registration"
            };
        }
    }
    async confirmRegistration(userID, code) {
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
                throw {
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
        }
        catch (err) {
            console.log(err);
            throw {
                status: err.status || 500,
                message: err.message || "An error occurred during confirmation."
            };
        }
    }
    async login(email, password) {
        try {
            // 1️⃣ Felhasználó megkeresése email alapján
            const user = await this.model.findUnique({ where: { email } });
            if (!user) {
                throw { status: 401, message: "Invalid email or password." };
            }
            // 2️⃣ Hash ellenőrzése
            const hashedInput = createHash(password, user.salt);
            if (hashedInput !== user.pass) {
                throw { status: 401, message: "Invalid email or password." };
            }
            // 3️⃣ Ellenőrizzük, hogy a fiók megerősítve van-e
            if (!user.userConfirmed) {
                throw { status: 403, message: "Account not confirmed yet." };
            }
            // 4️⃣ Random kétfaktoros kulcs generálása
            const key = randomString(24);
            await this.twoFactorModel.createKey(user.userID, key);
            // 5️⃣ Email küldése a two-factor kóddal
            const html = `
                <h3>Kétlépcsős azonosítás</h3>
                <p>A bejelentkezés befejezéséhez add meg az alábbi kódot:</p>
                <h2>${key}</h2>
                <p>Ez a kód 5 percig érvényes.</p>
            `;
            await EmailSender.sendMail({
                from: defaultValue(process.env.SMTP_USER, "kovacs.oliver1989@gmail.com"),
                to: user.email,
                subject: "Two-Factor Authentication Code",
                html,
            });
            return {
                status: 200,
                message: "Login successful. Two-factor key has been sent to your email.",
            };
        }
        catch (err) {
            console.log(err);
            throw {
                status: err.status || 500,
                message: err.message || "An error occurred during login.",
            };
        }
    }
}
export default UserHandlerModel;
