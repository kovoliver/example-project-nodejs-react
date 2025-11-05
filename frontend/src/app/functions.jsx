import { jwtDecode } from 'jwt-decode';

export const selectMenu = (path, menu) => {
    return path === menu ? "selected-menu" : "";
};

export function undefinedOrNull(value) {
    return value === undefined || value === null;
};

export function defaultValue(value, defValue) {
    return !undefinedOrNull(value) ? value : defValue;
};

function storeToken(token) {
    try {
        const tokenInfo = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("sessionInfo", JSON.stringify(tokenInfo));
        return tokenInfo;
    } catch (e) {
        console.error("Invalid token received:", e);
        return null;
    }
}

export const fetchAPI = async (path, settings = {}) => {
    try {
        const response = await fetch(path, settings);

        // 🔍 Token ellenőrzése a header-ben
        const authHeader = response.headers.get("Authorization");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.replace("Bearer ", "");
            storeToken(token);
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
        if (err.status === 401) {
            console.warn("Unauthorized, token might be expired.");
            localStorage.removeItem("token");
            localStorage.removeItem("sessionInfo");
        }

        throw err;
    }
};

const validateField = (name, value, fieldSchema) => {
    const { error } = fieldSchema[name].validate(value);
    return error?.details[0]?.message || null;
};

export const validateForm = (formData, schema) => {
    const { error } = schema.validate(formData, { abortEarly: false });

    if (!error) return null;

    const errors = {};

    error.details.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
    });
    
    return errors;
};

export const handleChange = (e, setForm, setErrors, fieldSchema) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    const errMsg = validateField(name, value, fieldSchema);
    setErrors(prev => ({ ...prev, [name]: errMsg }));
};