// RegisterPage.jsx
import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3001/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, pass }),
            });

            const data = await res.json();
            setMessage(data.message || "Unknown response");
        } catch (err) {
            setMessage(err.message || "Error during registration");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%" }}>Register</button>
            </form>
            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
}