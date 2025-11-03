import { useContext } from "react";
import UserNav from "../components/UserNav";
import ProtectedRoute from "./ProtectedRoute";
import { GlobalContext } from "../App";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    const gc = useContext(GlobalContext);

    return (
        <ProtectedRoute isAllowed={gc.user.loggedIn}>
            <div className="user-layout">
                <UserNav />
                <Outlet />
            </div>
        </ProtectedRoute>
    );
}