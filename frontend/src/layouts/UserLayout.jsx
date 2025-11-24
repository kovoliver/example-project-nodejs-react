import { useContext } from "react";
import UserNav from "../components/UserNav";
import ProtectedRoute from "./ProtectedRoute";
import { GlobalContext } from "../App";
import { Outlet } from "react-router-dom";
import Messages from "../components/Messages";

export default function UserLayout() {
    const gc = useContext(GlobalContext);

    return (
        <ProtectedRoute isAllowed={gc.sessionInfo !== null}>
            <div className="user-layout">
                <UserNav />
                <div>
                    <Messages/>
                    <Outlet />
                </div>
            </div>
        </ProtectedRoute>
    );
}