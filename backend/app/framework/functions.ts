import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';
import he from 'he';
import * as crypto from "crypto";
import fs from "fs/promises";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

interface NodeModuleLike {
    filename: string;
}

export function isNumeric(value: any): boolean {
    return !isNaN(parseInt(value));
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

export function createHash(password: string, salt: string): string {
    const hash = crypto
        .createHmac("sha512", salt)
        .update(password)
        .digest("hex");

    return hash;
}

export function verifyHash(password: string, salt: string, hash: string): boolean {
    const hashToVerify = crypto
        .createHmac("sha512", salt)
        .update(password)
        .digest("hex");

    return hash === hashToVerify;
}

export function randomString(length: number): string {
    // Minden 1 byte -> 2 hex karakter, ezért osztjuk kettővel
    const bytes = Math.ceil(length / 2);
    return crypto.randomBytes(bytes).toString('hex').slice(0, length);
}

export const numberWithZero = (n: number): string => n.toString().padStart(2, "0");

export function getMySqlDate(d: Date): string {
    const y = numberWithZero(d.getFullYear());
    const m = numberWithZero(d.getMonth() + 1);
    const day = numberWithZero(d.getDate());
    const h = numberWithZero(d.getHours());
    const min = numberWithZero(d.getMinutes());
    const s = numberWithZero(d.getSeconds());
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

export async function logger(msg: any, cls: string, method: string) {
    try {

        let msgStr = ``;

        if (typeof msg === 'object') {
            for (const keyValue of Object.entries(msg)) {
                msgStr += `${keyValue[0]}:${keyValue[1]}\n`;
            }
        } else {
            msgStr += msg;
        }

        msgStr += `date: ${getMySqlDate(new Date())}\n`;
        msgStr += "******************************************\n";
        await fs.appendFile(`./logs/${cls}.${method}.log`, msgStr);
    } catch (err) {
        console.log("logger: ", err);
    }
}

export const __dirname = getDirName();

export function escapeInput(input: string | null | undefined): string {
    if (!input) return '';
    return he.escape(input);
}

export function sanitizeObj(obj: Record<string, any>): Record<string, any> {
    for (const keyValue of Object.entries(obj)) {
        if (typeof keyValue[1] === "string")
            obj[keyValue[0]] = he.escape(keyValue[1]);
    }

    return obj;
};

export function sanitizeHTTP(req: Request, res: Response, next: NextFunction) {
    if (!req.body) return next();

    for (const keyValue of Object.entries(req.body)) {
        if (typeof keyValue[1] === "string")
            req.body[keyValue[0]] = he.escape(keyValue[1]);
    }

    next();
};

export const validateSchema = (schema: Joi.ObjectSchema|null) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || !schema) return next();

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map(e => e.message) });
        }

        next();
    };
};