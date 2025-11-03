import { fileURLToPath } from "url";
import * as path from "path";
import * as crypto from "crypto";

interface NodeModuleLike {
    filename: string;
}

export function undefinedOrNull(value: any): boolean {
    return value === undefined || value === null;
};

export function defaultValue(value: any, defValue: any) {
    return !undefinedOrNull(value) ? value : defValue;
};

export function getDirName(meta?: NodeModuleLike | URL): string {
    if (meta instanceof URL) {
        return path.dirname(fileURLToPath(meta));
    }

    if (meta && (meta as NodeModuleLike).filename) {
        return path.dirname((meta as NodeModuleLike).filename);
    }

    return process.cwd();
}

export function createHash(password: string, salt:string):string {
    const hash = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    return hash;
}

export function verifyHash(password: string, salt: string, hash: string): boolean {
    const hashToVerify = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    return hash === hashToVerify;
}

export function randomString(length: number): string {
    // Minden 1 byte -> 2 hex karakter, ezért osztjuk kettővel
    const bytes = Math.ceil(length / 2);
    return crypto.randomBytes(bytes).toString('hex').slice(0, length);
}