import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';
import he from 'he';
import * as crypto from "crypto";
import fs from "fs/promises";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

declare global {
    namespace Express {
        interface Request {
            userAgent?: {
                os: string|null,
                browser: string|null,
                device: string|null,
                cpu: string|null
                ipAddress: string|null;
            };
        }
    }
}

interface NodeModuleLike {
    filename: string;
}

function parseOS(ua: string): string | null {
    const win = ua.match(/Windows NT ([0-9.]+)/i);
    if (win) return `Windows ${win[1].trim()}`;

    const mac = ua.match(/Mac OS X ([0-9_]+)/i);
    if (mac) return `macOS ${mac[1].trim().replace(/_/g, '.')}`;

    const linux = ua.match(/Linux|X11/i);
    if (linux) return 'Linux';

    const android = ua.match(/Android ([0-9.]+)/i);
    if (android) return `Android ${android[1].trim()}`;

    const ios = ua.match(/(iPhone|iPad).*OS ([0-9_]+)/i);
    if (ios) return `iOS ${ios[2].trim().replace(/_/g, '.')}`;

    return null;
}

function parseBrowser(ua: string): string | null {
    const chrome = ua.match(/Chrome\/([0-9.]+)/i);
    if (chrome) return `Chrome ${chrome[1].trim()}`;

    const firefox = ua.match(/Firefox\/([0-9.]+)/i);
    if (firefox) return `Firefox ${firefox[1].trim()}`;

    const safari = ua.match(/Version\/([0-9.]+).*Safari/i);
    if (safari) return `Safari ${safari[1].trim()}`;

    const edge = ua.match(/Edg\/([0-9.]+)/i);
    if (edge) return `Edge ${edge[1].trim()}`;

    return null;
}

function parseDevice(ua: string): string {
    if (/Mobile/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
}

function parseCPU(ua: string): string | null {
    if (/x86_64|Win64|x64|amd64/i.test(ua)) return 'x64';
    if (/arm|aarch64/i.test(ua)) return 'ARM';
    return null;
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

export function trimObject(obj: Record<string, any>): Record<string, any> {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
            obj[key] = value.trim();
        }
    }

    return obj;
}

export const validateSchema = (schema: Joi.ObjectSchema | null, source: "query" | "params" | "body", trim: boolean = true) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!schema) return next();

        if (trim) {
            const trimmed = trimObject(req[source]);
            Object.assign(req[source], trimmed);
        }

        const { error } = schema.validate(req[source], { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map(e => e.message) });
        }

        next();
    };
};

function parseUserAgent(ua: string) {
    if (!ua || typeof ua !== "string") {
        return {
            os: null,
            browser: null,
            device: null,
            cpu: null
        };
    }

    return {
        os: parseOS(ua),
        browser: parseBrowser(ua),
        device: parseDevice(ua),
        cpu: parseCPU(ua)
    };
}

export function userAgentParser(req: Request, res: Response, next: NextFunction) {
    const device = req.headers['user-agent'] || 'unknown';
    let result = parseUserAgent(device);
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent: any = { ...result };
    userAgent.ipAddress = ip;

    req.userAgent = userAgent;
    next();
}

export function getTokenExpiration(tokenType: "ACCESS" | "REFRESH"): Date | null {
    const key = tokenType === "ACCESS" ? "ACCESS_TOKEN_MINS" : "REFRESH_TOKEN_DAYS";
    if (!process.env[key]) return null;

    const t = parseFloat(process.env[key]);
    
    const ms = tokenType === "ACCESS"
        ? t * 60 * 1000
        : t * 24 * 60 * 60 * 1000;

    return new Date(Date.now() + ms);
}