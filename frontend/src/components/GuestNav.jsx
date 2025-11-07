import { Link, useLocation } from "react-router-dom";
import { selectMenu } from "../app/functions";

export default function GuestNav() {
    const location = useLocation();

    return(
        <nav className="h-80 bg-primary">
            <ul className="d-flex jc-center h-80">
                <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/")}>
                    <Link className="p-md text-white" to="/">Home</Link>
                </li>
                <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/register")}>
                    <Link className="p-md text-white" to="/register">Register</Link>
                </li>
                <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/login")}>
                    <Link className="p-md text-white" to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    );
}