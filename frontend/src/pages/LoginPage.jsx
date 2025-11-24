// LoginPage.jsx
import { useContext, useState } from "react";
import { fetchAPI, handleChange } from "../app/functions";
import { sBaseUrl } from "../app/url";
import { GlobalContext } from "../App";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        pass: ""
    });
    const gc = useContext(GlobalContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetchAPI(`${sBaseUrl}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            gc.setMessages(res.message, "success");

            setFormData({
                email: "",
                pass: ""
            });
        } catch (err) {
            gc.setMessages(res.message, "error");
        }
    };

    return (
        <div className="text-center maxw-500 margin-auto box-light radius-md">
            <h1>Login</h1>

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