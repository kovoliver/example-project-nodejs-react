// RegisterPage.jsx
import { useContext, useState } from "react";
import { fetchAPI, handleChange, validateForm } from "../app/functions";
import { sBaseUrl } from "../app/url";
import { regSchema } from "../app/schemas";
import Messages from "../components/Messages";
import { GlobalContext } from "../App";

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
    const gc = useContext(GlobalContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const errs = validateForm(formData, regSchema);

            if(!errs.passed) {
                setErrors(errs.messages);
                return;
            }

            const response = await fetchAPI(`${sBaseUrl}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            gc.setMessages(response.message, "success");
        } catch (err) {
            gc.setMessages(err.message||["Error during registration!"], "error");
        }
    };

    return (
        <div className="text-center maxw-500 margin-auto box-light radius-md">
            <h1>Register</h1>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <h4>Email</h4>
                    <label className="text-error p-sm d-block">{errors?.email ? errors.email : ""}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData, setErrors, regSchema)}
                        className="input-md input-primary wp-100"
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <h4>Password</h4>
                    <label className="text-error p-sm d-block">{errors?.pass ? errors.pass : ""}</label>

                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={(e) => handleChange(e, setFormData, setErrors, regSchema)}
                        className="input-md input-primary wp-100"
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <h4>Password</h4>
                    <label className="text-error p-sm d-block">{formData?.pass !== formData?.passAgain && formData.pass !== "" 
                    ? "A két jelszó nem egyezik" : ""}</label>

                    <input
                        type="password"
                        name="passAgain"
                        value={formData.passAgain}
                        onChange={(e) => handleChange(e, setFormData)}
                        className="input-md input-primary wp-100"
                    />
                </div>

                <button className="input-md btn-secondary">Register</button>
            </form>
        </div>
    );
}