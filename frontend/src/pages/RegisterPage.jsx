// RegisterPage.jsx
import { useState } from "react";
import { fetchAPI, handleChange, validateForm } from "../app/functions";
import { sBaseUrl } from "../app/url";
import { regSchema } from "../app/schemas";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email:"",
        pass:"",
        passAgain:""
    }); 
    const [errors, setErrors] = useState({
        email:"",
        pass:"",
        passAgain:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetchAPI(`${sBaseUrl}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            //setMessage(data.message || "Unknown response");
        } catch (err) {
            //setMessage(err.message || "Error during registration");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <label>{errors.email ? errors.email : ""}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData, setErrors, regSchema)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label>
                    <label>{errors.pass ? errors.pass : ""}</label>

                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={(e) => handleChange(e, setFormData, setErrors, regSchema)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label>
                    <label>{formData.pass !== formData.passAgain ? "A két jelszó nem egyezik" : ""}</label>

                    <input
                        type="password"
                        name="passAgain"
                        value={formData.passAgain}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <button type="submit" style={{ width: "100%" }}>Register</button>
            </form>
            
        </div>
    );
}