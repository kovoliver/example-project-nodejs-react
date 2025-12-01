import { Link, useNavigate } from "react-router-dom";
import { fetchAPI } from "../app/functions";
import { sBaseUrl } from "../app/url";
import { GlobalContext } from "../App";
import { useContext } from "react";

export default function LogoutComp() {
    const gc = useContext(GlobalContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await fetchAPI(`${sBaseUrl}/session/logout`, {
                method: "GET",
                credentials: "include",
                headers:{"authorization": `Bearer ${gc.token}`}
            });

            localStorage.clear();
            navigate("/");
            gc.setMessages(response.message, "success");
        } catch (err) {
            gc.setMessages(err.message || "Please, try again later!", "error");
        }
    };

    return (
        <li onClick={logout} className="h-30 d-flex ai-center bg-secondary bg-secondary-lighter-hover cursor-pointer p-sm">
            <Link className="text-white text-deco-none">
                Logout
            </Link>
        </li>
    )
};