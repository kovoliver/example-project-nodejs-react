import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';
import * as crypto from "crypto";
import fs from "fs/promises";

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
    const __filename: string = fileURLToPath(import.meta.url);
    const __dirname: string = dirname(__filename);
    const baseDir = resolve(__dirname, '..', '..');
    return baseDir;
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

export const numberWithZero = (n:number):string=>n.toString().padStart(2, "0");

export function getMySqlDate(d:Date):string {
    const y = numberWithZero(d.getFullYear());
    const m = numberWithZero(d.getMonth()+1);
    const day = numberWithZero(d.getDate());
    const h = numberWithZero(d.getHours());
    const min = numberWithZero(d.getMinutes());
    const s = numberWithZero(d.getSeconds());
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

export async function loggerFunc(msg:any, cls:string, method:string) {
    try {

        let msgStr = ``;

        if(typeof msg === 'object') {
            for(const keyValue of Object.entries(msg)) {
                msgStr += `${keyValue[0]}:${keyValue[1]}\n`;
            }
        } else {
            msgStr += msg;
        }

        msgStr += `date: ${getMySqlDate(new Date())}\n`;
        msgStr += "******************************************\n";
        await fs.appendFile(`./logs/${cls}.${method}.log`, msgStr);
    } catch(err) {
        console.log("logger: ", err);
    }
}

export const __dirname = getDirName();