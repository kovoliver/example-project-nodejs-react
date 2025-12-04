import { Link, useLocation } from "react-router-dom";
import { selectMenu } from "../app/functions";
import { GlobalContext } from "../App";
import { useContext, useEffect, useState } from "react";

export default function GuestNav() {
    const location = useLocation();
    const gc = useContext(GlobalContext);

    return(
        <nav className="h-80 bg-primary">
            <ul className="d-flex jc-center h-80">
                <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/")}>
                    <Link className="p-md text-white" to="/">Home</Link>
                </li>
                {!gc.loggedIn ?
                    <>
                        <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/register")}>
                            <Link className="p-md text-white" to="/register">Register</Link>
                        </li>
                        <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " + selectMenu(location.pathname, "/login")}>
                            <Link className="p-md text-white" to="/login">Login</Link>
                        </li>
                    </>

                    :
                    <li className={"h-80 d-flex ai-center bg-primary-lighter-hover "}>
                        <Link className="p-md text-white" to={gc.loginPath + "/profile"}>Profile</Link>
                    </li>
                }

                <li className={"h-80 d-flex ai-center bg-primary-lighter-hover " 
                    + selectMenu(location.pathname, "/search")}>
                    <Link className="p-md text-white" to="/search">Cars</Link>
                </li>
            </ul>
        </nav>
    );
}