import { jwtDecode } from 'jwt-decode';
import { cBaseUrl } from './url';

export const selectMenu = (path, menu) => {
    return path === menu ? "selected-menu" : "";
};

export function undefinedOrNull(value) {
    return value === undefined || value === null;
};

export function defaultValue(value, defValue) {
    return !undefinedOrNull(value) ? value : defValue;
};

function storeToken(token, gc = null) {
    try {
        const tokenInfo = jwtDecode(token);
        const sessionInfo = JSON.stringify(tokenInfo);
        localStorage.setItem("token", token);
        localStorage.setItem("sessionInfo", sessionInfo);
        
        if (gc !== null) {
            gc.setToken(token);
            gc.setSessionInfo(sessionInfo);
        }
        return tokenInfo;
    } catch (e) {
        console.error("Invalid token received:", e);
        return null;
    }
}

export const fetchAPI = async (path, settings = {}, gc = null) => {
    try {
        const response = await fetch(path, settings);

        // 🔍 Token ellenőrzése a header-ben
        const authHeader = response.headers.get("Authorization");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.replace("Bearer ", "");
            storeToken(token, gc);
        }

        // 📦 Response feldolgozása
        const json = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: json?.message || "Hiba történt a kérés teljesítése közben!"
            };
        }

        return {
            status: response.status,
            message: json?.message || true,
            data: json.data || null
        };
    } catch (err) {
        console.log(err);
        // if(err.status && [401,403].includes(parseInt(err.status))) {
        //     localStorage.clear();
        //     location.replace(cBaseUrl);
        // }
        throw err;
    }
};

export const validateField = (name, value, schema) => {
    const fieldSchema = schema.extract(name);
    const { error } = fieldSchema.validate(value);
    return error?.details[0]?.message || null;
};

export const validateForm = (formData, schema) => {
    const { error } = schema.validate(formData, { abortEarly: false });
    const keys = Object.keys(formData);
    const errors = {};

    for (const key of keys) {
        errors[key] = null;
    }

    if (!error) return { passed: true, messages: errors };

    error.details.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
    });

    return { passed: Object.values(errors).every(el => el === null), messages: errors };
};

export const handleChange = (e, setForm, setErrors = null, fieldSchema = null) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (setErrors && fieldSchema) {
        const errMsg = validateField(name, value, fieldSchema);
        setErrors(prev => ({ ...prev, [name]: errMsg }));
    }
};

export function setSingleInput(input, schema, setValue, setError) {
    const msg = validateField(input.name, input.value, schema);
    setValue(input.value);

    if(!msg) {
        setError(null);
    } else {
        setError(msg);
    }
};

export function isNumeric(value) {
    return !isNaN(parseInt(value));
}