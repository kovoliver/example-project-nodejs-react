import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sBaseUrl } from "../app/url";
import { fetchAPI } from "../app/functions";
import { GlobalContext } from "../App";

const TwoFactorLogin = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("Confirming your registration...");
    const {userID, key} = useParams();
    const gc = useContext(GlobalContext);

    const login = async () => {
        try {
            const response = await fetchAPI(
                `${sBaseUrl}/two-factor/login/${userID}/${key}`,
                {credentials:"include"}, gc
            );

            setStatus("success");
            setMessage(response?.message);
            const path = response.data.role === "USER" ? "/user" : "/admin";

            navigate(`${path}/profile`);
        } catch (err) {
            setStatus("error");
            setMessage(err?.message||"Please, try again later!");
        }
    };

    useEffect(() => {
        if (!userID || !key) {
            return;
        }

        login();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
            {status === "pending" && <h3>{message}</h3>}
            {status === "error" && (
                <>
                    <h2 style={{ color: "red" }}>❌ Confirmation failed</h2>
                    <p>{message}</p>
                </>
            )}
        </div>
    );
};

export default TwoFactorLogin;