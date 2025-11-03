import Joi from "joi";
import { Role, Title, StreetType, ReportType } from "../models/types.js";

export const userSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Az email címnek szöveg típusúnak kell lennie!",
        "string.email": "Az email cím formátuma nem megfelelő!",
        "any.required": "Az email cím megadása kötelező!"
    }),
    pass: Joi.string().min(6).required().messages({
        "string.base": "A jelszónak szöveg típusúnak kell lennie!",
        "string.min": "A jelszónak legalább 6 karakter hosszúnak kell lennie!",
        "any.required": "A jelszó megadása kötelező!"
    })
});

export const profileSchema: Joi.ObjectSchema = Joi.object({
    userID: Joi.number().integer().required().messages({
        "number.base": "A felhasználói azonosítónak számnak kell lennie!",
        "any.required": "A felhasználói azonosító megadása kötelező!"
    }),
    title: Joi.string().valid(...Object.values(Title)).optional().messages({
        "string.base": "A titulusnak szöveg típusúnak kell lennie!",
        "any.only": "A titulus típusa érvénytelen!"
    }),
    firstName: Joi.string().required().messages({
        "string.base": "A keresztnévnek szöveg típusúnak kell lennie!"
    }),
    lastName: Joi.string().required().messages({
        "string.base": "A vezetéknévnek szöveg típusúnak kell lennie!"
    }),
    zip: Joi.string().length(4).required().messages({
        "string.base": "Az irányítószámnak szöveg típusúnak kell lennie!",
        "string.length": "Az irányítószám pontosan 4 karakter hosszú kell legyen!"
    }),
    settlement: Joi.string().required().messages({
        "string.base": "A település megnevezésének szöveg típusúnak kell lennie!"
    }),
    street: Joi.string().required().messages({
        "string.base": "Az utca nevének szöveg típusúnak kell lennie!"
    }),
    streetType: Joi.string().valid(...Object.values(StreetType)).required().messages({
        "string.base": "Az utca típusának szöveg típusúnak kell lennie!",
        "any.only": "Érvénytelen utca típust adott meg!"
    }),
    houseNumber: Joi.string().required().messages({
        "string.base": "A házszámnak szöveg típusúnak kell lennie!"
    }),
    floorNumber: Joi.string().optional().messages({
        "string.base": "Az emeletszámnak szöveg típusúnak kell lennie!"
    }),
    doorNumber: Joi.string().optional().messages({
        "string.base": "Az ajtószámnak szöveg típusúnak kell lennie!"
    })
});


export const carSchema: Joi.ObjectSchema = Joi.object({
    carID: Joi.number().integer().optional().messages({
        "number.base": "A carID mezőnek számnak kell lennie!",
        "number.integer": "A carID mező csak egész szám lehet!"
    }),
    userID: Joi.number().integer().required().messages({
        "any.required": "A userID mező megadása kötelező!",
        "number.base": "A userID mezőnek számnak kell lennie!",
        "number.integer": "A userID mező csak egész szám lehet!"
    }),
    title: Joi.string().required().messages({
        "string.base": "A címnek (title) szövegnek kell lennie!"
    }),
    make: Joi.string().required().messages({
        "any.required": "A gyártó (make) mező megadása kötelező!",
        "string.base": "A gyártónak (make) szövegnek kell lennie!"
    }),
    model: Joi.string().required().messages({
        "any.required": "A modell (model) mező megadása kötelező!",
        "string.base": "A modellnek (model) szövegnek kell lennie!"
    }),
    description: Joi.string().optional().messages({
        "string.base": "A leírás (description) szövegnek kell lennie!"
    })
});

export const carImageSchema: Joi.ObjectSchema = Joi.object({
    imageID: Joi.number().integer().optional().messages({
        "number.base": "Az imageID mezőnek számnak kell lennie!",
        "number.integer": "Az imageID mező csak egész szám lehet!"
    }),
    carID: Joi.number().integer().required().messages({
        "any.required": "A carID mező megadása kötelező!",
        "number.base": "A carID mezőnek számnak kell lennie!",
        "number.integer": "A carID mező csak egész szám lehet!"
    }),
    path: Joi.string().required().messages({
        "string.base": "Az útvonal (path) szövegnek kell lennie!"
    }),
    extension: Joi.string().required().messages({
        "string.base": "A fájlkiterjesztés (extension) szövegnek kell lennie!"
    })
});

export const userConversationSchema: Joi.ObjectSchema = Joi.object({
    conversationID: Joi.number().integer().optional().messages({
        "number.base": "A conversationID mezőnek számnak kell lennie!",
        "number.integer": "A conversationID mező csak egész szám lehet!"
    }),
    initiator: Joi.number().integer().required().messages({
        "any.required": "Az initiator mező megadása kötelező!",
        "number.base": "Az initiator mezőnek számnak kell lennie!",
        "number.integer": "Az initiator mező csak egész szám lehet!"
    }),
    receiver: Joi.number().integer().required().messages({
        "any.required": "A receiver mező megadása kötelező!",
        "number.base": "A receiver mezőnek számnak kell lennie!",
        "number.integer": "A receiver mező csak egész szám lehet!"
    })
});

export const userMessageSchema: Joi.ObjectSchema = Joi.object({
    messageID: Joi.number().integer().optional().messages({
        "number.base": "A messageID mezőnek számnak kell lennie!",
        "number.integer": "A messageID mező csak egész szám lehet!"
    }),
    conversationID: Joi.number().integer().required().messages({
        "any.required": "A conversationID mező megadása kötelező!",
        "number.base": "A conversationID mezőnek számnak kell lennie!",
        "number.integer": "A conversationID mező csak egész szám lehet!"
    }),
    senderID: Joi.number().integer().required().messages({
        "any.required": "A senderID mező megadása kötelező!",
        "number.base": "A senderID mezőnek számnak kell lennie!",
        "number.integer": "A senderID mező csak egész szám lehet!"
    }),
    carID: Joi.number().integer().required().messages({
        "number.base": "A carID mezőnek számnak kell lennie!",
        "number.integer": "A carID mező csak egész szám lehet!"
    }),
    message: Joi.string().required().messages({
        "string.base": "Az üzenet (message) szövegnek kell lennie!"
    }),
});

export const reportSchema: Joi.ObjectSchema = Joi.object({
    repoterID: Joi.number().integer().optional().messages({
        "number.base": "A repoterID mezőnek számnak kell lennie!",
        "number.integer": "A repoterID mező csak egész szám lehet!"
    }),
    carID: Joi.number().integer().required().messages({
        "any.required": "A carID mező megadása kötelező!",
        "number.base": "A carID mezőnek számnak kell lennie!",
        "number.integer": "A carID mező csak egész szám lehet!"
    }),
    reportType: Joi.string().valid(...Object.values(ReportType)).required().messages({
        "any.required": "A reportType mező megadása kötelező!",
        "any.only": `A reportType csak a következő értékek egyike lehet: ${Object.values(ReportType).join(", ")}`,
        "string.base": "A jelentés típusa (reportType) szövegnek kell lennie!"
    }),
    message: Joi.string().required().messages({
        "string.base": "A jelentés szövege (message) szövegnek kell lennie!"
    }),
});

export const tokenPayloadSchema: Joi.ObjectSchema = Joi.object({
    userID: Joi.number().integer().required().messages({
        "any.required": "A userID mező megadása kötelező!",
        "number.base": "A userID mezőnek számnak kell lennie!",
        "number.integer": "A userID mező csak egész szám lehet!"
    }),
    role: Joi.string().valid(...Object.values(Role)).required().messages({
        "any.required": "A role mező megadása kötelező!",
        "any.only": `A role csak a következő értékek egyike lehet: ${Object.values(Role).join(", ")}`,
        "string.base": "A szerepkör (role) szövegnek kell lennie!"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Az email mező megadása kötelező!",
        "string.email": "Az email cím formátuma nem megfelelő!",
        "string.base": "Az email mezőnek szövegnek kell lennie!"
    }),
});