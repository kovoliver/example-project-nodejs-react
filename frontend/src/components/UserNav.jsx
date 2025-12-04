import { Link, useLocation } from "react-router-dom";
import LogoutComp from "./Logout";
import { selectMenu } from "../app/functions";

export default function UserNav() {
    const location = useLocation();
    
    return(
        <div className="box-primary vh-100 p-none">
            <ul>
                <li className="h-30 d-flex ai-center bg-secondary bg-secondary-lighter-hover cursor-pointer p-sm ">
                    <Link className="text-white text-deco-none" to="/">Home</Link>
                </li>
                <li className={
                    "h-30 d-flex ai-center bg-secondary bg-secondary-lighter-hover cursor-pointer p-sm " 
                    + selectMenu(location.pathname, "/user/profile")
                }>
                    <Link className="text-white text-deco-none" to="/user/profile">Profile</Link>
                </li>
                <li className={
                    "h-30 d-flex ai-center bg-secondary bg-secondary-lighter-hover cursor-pointer p-sm " 
                    + selectMenu(location.pathname, "/user/cars")
                }>
                    <Link className="text-white text-deco-none" to="/user/cars">My cars</Link>
                </li>
                <LogoutComp/>
            </ul>
        </div>
    );
}