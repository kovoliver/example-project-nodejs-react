import { fileURLToPath } from "url";
import * as path from "path";
import * as crypto from "crypto";
export function undefinedOrNull(value) {
    return value === undefined || value === null;
}
;
export function defaultValue(value, defValue) {
    return !undefinedOrNull(value) ? value : defValue;
}
;
export function getDirName(meta) {
    if (meta instanceof URL) {
        return path.dirname(fileURLToPath(meta));
    }
    if (meta && meta.filename) {
        return path.dirname(meta.filename);
    }
    return process.cwd();
}
export function createHash(password, salt) {
    const hash = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    return hash;
}
export function verifyHash(password, salt, hash) {
    const hashToVerify = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    return hash === hashToVerify;
}
export function randomString(length) {
    // Minden 1 byte -> 2 hex karakter, ezért osztjuk kettővel
    const bytes = Math.ceil(length / 2);
    return crypto.randomBytes(bytes).toString('hex').slice(0, length);
}
