// LoginPage.jsx
import { useState } from "react";
import { fetchAPI, handleChange } from "../app/functions";
import { sBaseUrl } from "../app/url";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        pass: ""
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const res = await fetchAPI(`${sBaseUrl}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Login successful");
                // ide jöhet pl. redirect vagy token tárolás
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError(err.message || "Error during login");
        }
    };

    return (
        <div className="text-center maxw-500 margin-auto box-light radius-md">
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <h4>Email</h4>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                        className="input-md input-primary wp-100"
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <h4>Password</h4>
                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={(e) => handleChange(e, setFormData)}
                        required
                        className="input-md input-primary wp-100"
                    />
                </div>

                <button className="input-md btn-secondary">Login</button>
            </form>
        </div>
    );
}