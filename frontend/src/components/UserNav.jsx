import { Link } from "react-router-dom";
import LogoutComp from "./Logout";

export default function UserNav() {
    return(
        <div className="box-primary vh-100 p-none">
            <ul>
                <li className="h-30 d-flex ai-center bg-secondary bg-secondary-lighter-hover cursor-pointer p-sm">
                    <Link className="text-white text-deco-none" to="/user/profile">Profile</Link>
                </li>
                <LogoutComp/>
            </ul>
        </div>
    );
}