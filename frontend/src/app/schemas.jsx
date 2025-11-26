import Joi from "joi";

export const regSchema = Joi.object({
    email: Joi.string().email().empty("").required().messages({
        "string.email": "Az email cím formátuma nem megfelelő!",
        "string.empty": "Az email cím mezőt nem hagyhatja üresen!",
        "any.required": "Az email cím mezőt kötelező kitölteni",
    }),
    pass: Joi.string().min(6).required().messages({
        "string.min": "A jelszónak legalább 6 karakter hosszúnak kell lennie!",
        "string.empty": "A jelszó mezőt nem hagyhatja üresen!",
        "any.required": "A jelszó megadása kötelező!",
    }),
    passAgain: Joi.string()
        .valid(Joi.ref("pass"))
        .required()
        .messages({
            "any.only": "A két jelszó nem egyezik meg!",
            "string.empty": "Kérjük ismételje meg a jelszót.",
            "any.required": "Kérjük ismételje meg a jelszót.",
        }),
});

export const profileSchema = Joi.object({
    title: Joi.string().valid("Mr", "Ms", "Mrs", "Dr").optional().messages({
        "string.base": "A titulusnak szöveg típusúnak kell lennie!",
        "any.only": "A titulus értéke érvénytelen!"
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
    streetType: Joi.string().valid("street", "avenue", "road", "blvd").required().messages({
        "string.base": "Az utca típusának szöveg típusúnak kell lennie!",
        "any.only": "Érvénytelen utca típust adott meg!"
    }),
    houseNumber: Joi.string().min(1).max(100000).required().messages({
        "string.base": "A házszámnak szöveg típusúnak kell lennie!"
    }),
    floorNumber: Joi.string().min(1).max(100000).optional().messages({
        "string.base": "Az emeletszámnak szöveg típusúnak kell lennie!"
    }),
    doorNumber: Joi.string().min(1).max(5).optional().messages({
        "string.base": "Az ajtószámnak szöveg típusúnak kell lennie!"
    })
});

export const newPassSchema = Joi.object({
    pass: Joi.string().min(6).required().messages({
        "string.base": "A jelszónak szöveg típusúnak kell lennie!",
        "string.min": "A jelszónak legalább 6 karakter hosszúnak kell lennie!",
        "any.required": "A jelszó megadása kötelező!"
    }),
    newPass: Joi.string().min(6).required().messages({
        "string.base": "A jelszónak szöveg típusúnak kell lennie!",
        "string.min": "A jelszónak legalább 6 karakter hosszúnak kell lennie!",
        "any.required": "A jelszó megadása kötelező!"
    }),
    newPassAgain: Joi.string().valid(Joi.ref("newPass")).required().empty("")
    .messages({
        "any.only": "A két jelszó nem egyezik meg!",
        "string.empty": "Kérjük ismételje meg a jelszót.",
        "any.required": "Kérjük ismételje meg a jelszót.",
    })
});

export const emailSchema = Joi.object({
    email: Joi.string().email().empty("").required().messages({
        "string.email": "Az email cím formátuma nem megfelelő!",
        "string.empty": "Az email cím mezőt nem hagyhatja üresen!",
        "any.required": "Az email cím mezőt kötelező kitölteni",
    })
});