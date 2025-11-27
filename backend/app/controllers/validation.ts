import Joi from "joi";
import { Role, Title, StreetType, ReportType } from "../models/types.js";

export const userSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().empty("").required().messages({
        "string.base": "The email must be a string.",
        "string.email": "The email format is invalid.",
        "any.required": "Email is required.",
        "any.empty": "The email field cannot be empty."
    }),
    pass: Joi.string().min(6).required().messages({
        "string.base": "The password must be a string.",
        "string.min": "The password must be at least 6 characters long.",
        "any.required": "Password is required."
    }),
    passAgain: Joi.string()
        .valid(Joi.ref("pass"))
        .required()
        .empty("")
        .messages({
            "any.only": "The two passwords do not match.",
            "string.empty": "Please repeat the password.",
            "any.required": "Please repeat the password.",
        })
});

export const profileSchema: Joi.ObjectSchema = Joi.object({
    title: Joi.string().valid(...Object.values(Title)).optional().messages({
        "string.base": "The title must be a string.",
        "any.only": "The title type is invalid."
    }),
    firstName: Joi.string().required().messages({
        "string.base": "The first name must be a string."
    }),
    lastName: Joi.string().required().messages({
        "string.base": "The last name must be a string."
    }),
    zip: Joi.string().length(4).required().messages({
        "string.base": "The zip code must be a string.",
        "string.length": "The zip code must be exactly 4 characters long."
    }),
    settlement: Joi.string().required().messages({
        "string.base": "The settlement name must be a string."
    }),
    street: Joi.string().required().messages({
        "string.base": "The street name must be a string."
    }),
    streetType: Joi.string().valid(...Object.values(StreetType)).required().messages({
        "string.base": "The street type must be a string.",
        "any.only": "Invalid street type provided."
    }),
    houseNumber: Joi.string().min(1).max(100000).required().messages({
        "string.base": "The house number must be a string."
    }),
    floorNumber: Joi.string().min(1).max(100000).optional().messages({
        "string.base": "The floor number must be a string."
    }),
    doorNumber: Joi.string().min(1).max(5).optional().messages({
        "string.base": "The door number must be a string."
    })
});

export const carSchema: Joi.ObjectSchema = Joi.object({
    carID: Joi.number().integer().optional().messages({
        "number.base": "The carID field must be a number.",
        "number.integer": "The carID field must be an integer."
    }),
    userID: Joi.number().integer().required().messages({
        "any.required": "The userID field is required.",
        "number.base": "The userID field must be a number.",
        "number.integer": "The userID field must be an integer."
    }),
    title: Joi.string().required().messages({
        "string.base": "The title must be a string."
    }),
    make: Joi.string().required().messages({
        "any.required": "The manufacturer (make) field is required.",
        "string.base": "The manufacturer (make) must be a string."
    }),
    model: Joi.string().required().messages({
        "any.required": "The model field is required.",
        "string.base": "The model must be a string."
    }),
    description: Joi.string().optional().messages({
        "string.base": "The description must be a string."
    })
});

export const carImageSchema: Joi.ObjectSchema = Joi.object({
    imageID: Joi.number().integer().optional().messages({
        "number.base": "The imageID field must be a number.",
        "number.integer": "The imageID field must be an integer."
    }),
    carID: Joi.number().integer().required().messages({
        "any.required": "The carID field is required.",
        "number.base": "The carID field must be a number.",
        "number.integer": "The carID field must be an integer."
    }),
    path: Joi.string().required().messages({
        "string.base": "The path must be a string."
    }),
    extension: Joi.string().required().messages({
        "string.base": "The file extension must be a string."
    })
});

export const userConversationSchema: Joi.ObjectSchema = Joi.object({
    conversationID: Joi.number().integer().optional().messages({
        "number.base": "The conversationID field must be a number.",
        "number.integer": "The conversationID field must be an integer."
    }),
    initiator: Joi.number().integer().required().messages({
        "any.required": "The initiator field is required.",
        "number.base": "The initiator field must be a number.",
        "number.integer": "The initiator field must be an integer."
    }),
    receiver: Joi.number().integer().required().messages({
        "any.required": "The receiver field is required.",
        "number.base": "The receiver field must be a number.",
        "number.integer": "The receiver field must be an integer."
    })
});

export const userMessageSchema: Joi.ObjectSchema = Joi.object({
    messageID: Joi.number().integer().optional().messages({
        "number.base": "The messageID field must be a number.",
        "number.integer": "The messageID field must be an integer."
    }),
    conversationID: Joi.number().integer().required().messages({
        "any.required": "The conversationID field is required.",
        "number.base": "The conversationID field must be a number.",
        "number.integer": "The conversationID field must be an integer."
    }),
    senderID: Joi.number().integer().required().messages({
        "any.required": "The senderID field is required.",
        "number.base": "The senderID field must be a number.",
        "number.integer": "The senderID field must be an integer."
    }),
    carID: Joi.number().integer().required().messages({
        "number.base": "The carID field must be a number.",
        "number.integer": "The carID field must be an integer."
    }),
    message: Joi.string().required().messages({
        "string.base": "The message must be a string."
    }),
});

export const reportSchema: Joi.ObjectSchema = Joi.object({
    repoterID: Joi.number().integer().optional().messages({
        "number.base": "The reporterID field must be a number.",
        "number.integer": "The reporterID field must be an integer."
    }),
    carID: Joi.number().integer().required().messages({
        "any.required": "The carID field is required.",
        "number.base": "The carID field must be a number.",
        "number.integer": "The carID field must be an integer."
    }),
    reportType: Joi.string().valid(...Object.values(ReportType)).required().messages({
        "any.required": "The reportType field is required.",
        "any.only": `The reportType can only be one of the following values: ${Object.values(ReportType).join(", ")}`,
        "string.base": "The report type must be a string."
    }),
    message: Joi.string().required().messages({
        "string.base": "The report message must be a string."
    }),
});

export const tokenPayloadSchema: Joi.ObjectSchema = Joi.object({
    userID: Joi.number().integer().required().messages({
        "any.required": "The userID field is required.",
        "number.base": "The userID field must be a number.",
        "number.integer": "The userID field must be an integer."
    }),
    role: Joi.string().valid(...Object.values(Role)).required().messages({
        "any.required": "The role field is required.",
        "any.only": `The role can only be one of the following values: ${Object.values(Role).join(", ")}`,
        "string.base": "The role must be a string."
    }),
    email: Joi.string().email().required().messages({
        "any.required": "The email field is required.",
        "string.email": "The email format is invalid.",
        "string.base": "The email field must be a string."
    }),
});

export const twoFactorKeySchema:Joi.ObjectSchema = Joi.object({
    userID:Joi.number().integer().required().messages({
        "any.required":"The user ID value is missing.",
        "number.base":"The user ID must be a number.",
        "number.integer":"The user ID must be an integer."
    }),
    key:Joi.string().required().messages({
        "any.required":"The key field is missing.",
        "any.base":"The key field must be a string."
    })
});

export const newPassSchema:Joi.ObjectSchema = Joi.object({
    pass: Joi.string().min(6).required().messages({
        "string.base": "The password must be a string.",
        "string.min": "The password must be at least 6 characters long.",
        "any.required": "Password is required."
    }),
    newPass: Joi.string().min(6).required().messages({
        "string.base": "The new password must be a string.",
        "string.min": "The new password must be at least 6 characters long.",
        "any.required": "New password is required."
    }),
    newPassAgain: Joi.string().valid(Joi.ref("newPass")).required().empty("")
    .messages({
        "any.only": "The two passwords do not match.",
        "string.empty": "Please repeat the new password.",
        "any.required": "Please repeat the new password.",
    })
});

export const emailSchema:Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().empty("").required().messages({
        "string.email": "The email format is invalid.",
        "string.empty": "The email field cannot be left empty.",
        "any.required": "The email field is required.",
    }),
    pass: Joi.string().empty("").required().messages({
        "string.base": "The password must be a string.",
        "any.required": "Password is required."
    }),
});