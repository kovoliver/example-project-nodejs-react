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