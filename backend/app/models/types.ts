// models/types.ts

// -----------------------------
// Enums
// -----------------------------
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

export enum Title {
    MR = "Mr",
    MS = "Ms",
    MRS = "Mrs",
    DR = "Dr",
}

export enum StreetType {
    STREET = "street",
    AVENUE = "avenue",
    ROAD = "road",
    BLVD = "blvd",
}

export enum ReportType {
    USER = "USER",
    CAR = "CAR",
}

export type RegisterUser = {
    role: Role;
    email: string;
    pass: string;
    salt: string;
    confirmationCode: string;
};

export type User = {
    userID?: number;
    role: Role;
    email: string;
    pass: string;
    title?: Title;
    firstName?: string;
    lastName?: string;
    zip?: string;
    settlement?: string;
    street?: string;
    streetType?: StreetType;
    houseNumber?: string;
    floorNumber?: string;
    doorNumber?: string;
    salt?: string;
    created?: Date;
    updated?: Date;
};

export type Profile = {
    userID: number;
    email?: string;
    title?: Title;
    firstName: string;
    lastName: string;
    zip: string;
    settlement: string;
    street: string;
    streetType: StreetType;
    houseNumber: string;
    floorNumber?: string;
    doorNumber?: string;
};

export type Car = {
    carID?: number;
    userID: number;
    title?: string;
    make: string;
    model: string;
    description?: string;
    created?: Date;
    updated?: Date;
};

export type CarImage = {
    imageID?: number;
    carID: number;
    path?: string;
    extension?: string;
    created?: Date;
};

export type UserConversation = {
    conversationID?: number;
    initiator: number;
    receiver: number;
    created?: Date;
};

export type UserMessage = {
    messageID?: number;
    conversationID: number;
    senderID: number;
    carID?: number;
    message: string;
    created?: Date;
    updated?: Date;
};

export type Report = {
    reportID?: number;
    repoterID?: number;
    carID: number;
    reportType: ReportType;
    message: string;
    created?: Date;
    updated?: Date;
};

export type HTTPResponse = {
    status: number;
    message: string | string[];
    insertID?: number;
};

export type TokenPayload = {
    userID: number;
    uuID:string;
    role: "USER" | "ADMIN";
    firstName: string;
    lastName: string;
};

export type MailOptions = {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export type HTTPMethod = "get" | "post" | "put" | "patch" | "delete" | "head";

export type RouteDefinition = {
    method: HTTPMethod;
    path: string;
    handler: string,
    middlewares?: Function[]
}

export type Session = {
    sessionID: number;
    userID: number;
    token: string;
    valid: boolean;
    ipAddress?: string | null;
    device?: string | null;
    createdAt: Date;
    expiresAt: Date;
    lastUsed?: Date | null;
};