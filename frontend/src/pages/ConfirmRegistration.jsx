import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sBaseUrl } from "../app/url";

const ConfirmRegistration = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("Confirming your registration...");
    const [countdown, setCountdown] = useState(5);
    const queryParams = new URLSearchParams(window.location.search);
    const userID = queryParams.get("userID");
    const code = queryParams.get("code");

    const confirm = async () => {
        try {
            const response = await fetch(
                `${sBaseUrl}/user/confirm-registration/${userID}/${code}`
            );

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message || "Your registration has been confirmed successfully!");
            } else {
                setStatus("error");
                setMessage(data.message || "Confirmation failed. Please try again.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("An error occurred while confirming your registration.");
        }
    };

    useEffect(() => {
        if (!userID || !code) {
            setStatus("error");
            setMessage("Invalid confirmation link.");
            return;
        }

        confirm();
    }, []);

    // 5 másodperces visszaszámlálás + redirect
    useEffect(() => {
        if (status === "pending") return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    navigate("/login");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [status, navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
            {status === "pending" && <h3>{message}</h3>}
            {status === "success" && (
                <>
                    <h2 style={{ color: "green" }}>✅ Registration confirmed!</h2>
                    <p>{message}</p>
                </>
            )}
            {status === "error" && (
                <>
                    <h2 style={{ color: "red" }}>❌ Confirmation failed</h2>
                    <p>{message}</p>
                </>
            )}
            {status !== "pending" && (
                <p>Redirecting to login in {countdown} seconds...</p>
            )}
        </div>
    );
};

export default ConfirmRegistration;