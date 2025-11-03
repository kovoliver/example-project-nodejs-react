import AdminNav from "../components/AdminNav";
import ProtectedRoute from "./ProtectedRoute";
import { GlobalContext } from "../App";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    const gc = useContext(GlobalContext);

    return (
        <ProtectedRoute isAllowed={gc.user.loggedIn && gc.user.isAdmin}>
            <div className="admin-layout">
                <AdminNav />
                <Outlet />
            </div>
        </ProtectedRoute>
    );
}